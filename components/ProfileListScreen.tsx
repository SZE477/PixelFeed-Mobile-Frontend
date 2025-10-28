import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  getProfiles,
  ProfileSearchParams,
  UserProfile,
  PaginatedResponse,
} from '../services/api';

const { width } = Dimensions.get('window');

const ProfileListScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search - Wait 500ms after user stops typing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [search]);

  // Fetch profiles function
  const fetchProfiles = useCallback(
    async (pageNum: number, searchTerm: string, isRefresh = false) => {
      if (loading && !isRefresh) return;

      try {
        if (pageNum === 1 && !isRefresh) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data: PaginatedResponse<UserProfile> = await getProfiles({
          search: searchTerm.trim() || undefined,
          page: pageNum,
        });

        if (pageNum === 1 || isRefresh) {
          setProfiles(data.results);
        } else {
          setProfiles((prev) => [...prev, ...data.results]);
        }

        setTotalCount(data.count);
        setHasNext(!!data.next);
        setPage(pageNum);
      } catch (err: any) {
        console.error('Error fetching profiles:', err);
        setError(err.message || 'Failed to load profiles');
        
        if (pageNum === 1) {
          setProfiles([]);
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  // Initial load
  useEffect(() => {
    fetchProfiles(1, '', false);
  }, []);

  // Handle debounced search changes
  useEffect(() => {
    setPage(1);
    setHasNext(true);
    fetchProfiles(1, debouncedSearch, false);
  }, [debouncedSearch]);

  // Load more profiles
  const handleLoadMore = useCallback(() => {
    if (hasNext && !loading && !initialLoading) {
      fetchProfiles(page + 1, debouncedSearch, false);
    }
  }, [hasNext, loading, initialLoading, page, debouncedSearch, fetchProfiles]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasNext(true);
    fetchProfiles(1, debouncedSearch, true);
  }, [debouncedSearch, fetchProfiles]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
  }, []);

  // Navigate to profile
  const handleProfilePress = useCallback(
    (username: string) => {
      router.push(`/profile/${username}`);
    },
    [router]
  );

  // Render profile item (optimized with React.memo)
  const renderProfile = useCallback(
    ({ item }: { item: UserProfile }) => (
      <ProfileCard item={item} onPress={handleProfilePress} />
    ),
    [handleProfilePress]
  );

  // Get item layout for performance optimization
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 104, // Approximate height of profile card
      offset: 104 * index,
      index,
    }),
    []
  );

  // Key extractor
  const keyExtractor = useCallback((item: UserProfile) => item.username, []);

  // Render footer loader
  const renderFooter = useCallback(() => {
    if (!loading || initialLoading) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  }, [loading, initialLoading]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (initialLoading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Oops! Something went wrong</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchProfiles(1, debouncedSearch, true)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>
          {search ? '🔍' : '👥'}
        </Text>
        <Text style={styles.emptyTitle}>
          {search ? 'No users found' : 'No profiles yet'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {search
            ? `No results for "${search}". Try a different search term.`
            : 'Start searching to discover users on PixelFeed!'}
        </Text>
      </View>
    );
  }, [initialLoading, error, search, debouncedSearch, fetchProfiles]);

  // Render header
  const renderHeader = useCallback(() => {
    if (profiles.length === 0) return null;

    return (
      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {totalCount} {totalCount === 1 ? 'user' : 'users'} found
        </Text>
      </View>
    );
  }, [profiles.length, totalCount]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find people on PixelFeed</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {search !== debouncedSearch && (
          <View style={styles.searchingIndicator}>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}
      </View>

      {/* Profile List */}
      {initialLoading ? (
        <View style={styles.initialLoader}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profiles...</Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={keyExtractor}
          renderItem={renderProfile}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
              title="Pull to refresh"
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </View>
  );
};

// Memoized Profile Card Component for better performance
const ProfileCard = React.memo<{
  item: UserProfile;
  onPress: (username: string) => void;
}>(({ item, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.profileContent}
        onPress={() => onPress(item.username)}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {item.profile_picture ? (
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.avatar}
              defaultSource={require('../assets/placeholder.png')} // Add placeholder
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {item.full_name?.charAt(0).toUpperCase() ||
                  item.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {item.is_private && (
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeIcon}>🔒</Text>
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.fullName} numberOfLines={1}>
              {item.full_name || item.username}
            </Text>
            {item.is_verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.username} numberOfLines={1}>
            @{item.username}
          </Text>
          {item.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {item.bio}
            </Text>
          )}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.follower_count}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item.following_count}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

ProfileCard.displayName = 'ProfileCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  searchingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  privateBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  privateBadgeIcon: {
    fontSize: 11,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginRight: 6,
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
  },
  username: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 12,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  arrowIcon: {
    fontSize: 28,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  initialLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileListScreen;
