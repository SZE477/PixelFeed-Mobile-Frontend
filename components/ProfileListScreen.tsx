import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getProfiles, ProfileSearchParams, UserProfile, PaginatedResponse } from '../services/api';

const ProfileListScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfiles = async (params: ProfileSearchParams = {}) => {
    setLoading(true);
    try {
      const data: PaginatedResponse<UserProfile> = await getProfiles({
        search: params.search ?? search,
        page: params.page ?? page,
      });
      if (params.page && params.page > 1) {
        setProfiles((prev) => [...prev, ...data.results]);
      } else {
        setProfiles(data.results);
      }
      setHasNext(!!data.next);
    } catch (error) {
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles({ page: 1, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleLoadMore = () => {
    if (hasNext && !loading) {
      setPage((prev) => prev + 1);
      fetchProfiles({ page: page + 1, search });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchProfiles({ page: 1, search });
  };

  const renderProfile = ({ item }: { item: UserProfile }) => (
    <View style={styles.profileCard}>
      <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.username}>{item.username}</Text>
          {item.is_verified && <Text style={styles.verified}>✔️</Text>}
        </View>
        <Text style={styles.fullName}>{item.full_name}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>{item.follower_count} Followers</Text>
          <Text style={styles.stat}>{item.following_count} Following</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      {loading && profiles.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.username}
          renderItem={renderProfile}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={<Text style={styles.empty}>No profiles found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  verified: {
    color: '#3b82f6',
    fontSize: 16,
  },
  fullName: {
    color: '#222',
    fontSize: 15,
    marginBottom: 2,
  },
  bio: {
    color: '#555',
    fontSize: 13,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    color: '#888',
    fontSize: 12,
    marginRight: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});

export default ProfileListScreen;
