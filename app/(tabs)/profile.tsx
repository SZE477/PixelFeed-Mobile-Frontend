import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCurrentUserProfile } from '../../services/api';

const { width } = Dimensions.get('window');
const imageSize = (width - 3) / 3;

interface UserProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string | null;
  bio: string;
  website: string;
  location: string;
  birth_date: string;
  age: number;
  is_private: boolean;
  is_verified: boolean;
  is_email_verified: boolean;
  profile_visibility: string;
  follower_count: number;
  following_count: number;
  posts_count: number;
  mutual_followers_count: number;
  last_seen: string;
  date_joined: string;
  show_online_status: boolean;
  allow_messages_from: string;
  allow_tag: boolean;
}

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');

  // Mock posts for grid
  const mockPosts = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    uri: `https://picsum.photos/400/400?random=${i + 50}`,
  }));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Failed to Load Profile</Text>
        <Text style={styles.errorText}>{error || 'Unknown error'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.lockIcon}>{profile.is_private ? '🔒' : ''}</Text>
        </TouchableOpacity>
        <Text style={styles.username}>
          {profile.username}
          {profile.is_verified && <Text style={styles.verified}> ✓</Text>}
        </Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          {/* Avatar and Stats */}
          <View style={styles.topSection}>
            <View style={styles.avatarContainer}>
              {profile.profile_picture ? (
                <Image
                  source={{ uri: profile.profile_picture }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>
                    {profile.full_name?.charAt(0).toUpperCase() ||
                      profile.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts_count}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {profile.follower_count}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {profile.following_count}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.fullName}>{profile.full_name}</Text>
            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            {profile.location && (
              <Text style={styles.location}>📍 {profile.location}</Text>
            )}
            {profile.website && (
              <TouchableOpacity>
                <Text style={styles.website}>🔗 {profile.website}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.joinDate}>
              Joined {formatDate(profile.date_joined)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Story Highlights Placeholder */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.highlightsContainer}
            contentContainerStyle={styles.highlightsContent}
          >
            <TouchableOpacity style={styles.addHighlight}>
              <View style={styles.highlightCircle}>
                <Text style={styles.addIcon}>+</Text>
              </View>
              <Text style={styles.highlightLabel}>New</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={styles.tabIcon}>▦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reels' && styles.activeTab]}
            onPress={() => setActiveTab('reels')}
          >
            <Text style={styles.tabIcon}>🎬</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tagged' && styles.activeTab]}
            onPress={() => setActiveTab('tagged')}
          >
            <Text style={styles.tabIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        {profile.posts_count === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyText}>
              Share your first photo or video
            </Text>
          </View>
        ) : (
          <View style={styles.postsGrid}>
            {mockPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.gridItem}>
                <Image source={{ uri: post.uri }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lockIcon: {
    fontSize: 20,
    width: 24,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  verified: {
    color: '#3B82F6',
    fontSize: 18,
  },
  menuIcon: {
    fontSize: 24,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 16,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  website: {
    fontSize: 13,
    color: '#3B82F6',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  highlightsContainer: {
    marginBottom: 16,
  },
  highlightsContent: {
    paddingVertical: 8,
  },
  addHighlight: {
    alignItems: 'center',
    marginRight: 16,
  },
  highlightCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addIcon: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  highlightLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#111827',
  },
  tabIcon: {
    fontSize: 24,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  emptyState: {
    alignItems: 'center',
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
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ProfileScreen;
