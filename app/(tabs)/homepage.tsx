import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { logout } from '../../services/api';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const data = [
    {
      id: '1',
      username: 'john_doe',
      userAvatar: null,
      postImage: 'https://picsum.photos/400/500?random=1',
      likes: 1234,
      caption: 'Beautiful sunset at the beach 🌅',
      timeAgo: '2h ago',
    },
    {
      id: '2',
      username: 'jane_smith',
      userAvatar: null,
      postImage: 'https://picsum.photos/400/500?random=2',
      likes: 856,
      caption: 'Coffee and coding ☕💻',
      timeAgo: '5h ago',
    },
    {
      id: '3',
      username: 'travel_enthusiast',
      userAvatar: null,
      postImage: 'https://picsum.photos/400/500?random=3',
      likes: 432,
      caption: 'Exploring the mountains 🏔️',
      timeAgo: '1d ago',
    },
  ];

  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postUserInfo}>
          <View style={styles.postAvatar}>
            <Text style={styles.postAvatarText}>
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.postUsername}>{item.username}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.postImage }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.actionIcon}>🔖</Text>
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likes}>{item.likes.toLocaleString()} likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{item.username}</Text> {item.caption}
        </Text>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>
    </View>
  );

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
      router.replace('/signup'); // Navigate to the signup (login) page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>PixelFeed</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Text style={styles.icon}>🚪</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Posts */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    fontSize: 24,
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  storiesContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  storyAvatarBorder: {
    padding: 2,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E1306C',
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  addStoryAvatar: {
    backgroundColor: '#3B82F6',
  },
  addStoryIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  storyAvatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  storyUsername: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  moreIcon: {
    fontSize: 24,
    color: '#6B7280',
  },
  postImage: {
    width: width,
    height: width * 1.25,
    backgroundColor: '#E5E7EB',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  postInfo: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likes: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: '600',
    color: '#111827',
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;
