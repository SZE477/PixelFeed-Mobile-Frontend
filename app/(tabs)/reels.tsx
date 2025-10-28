import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ReelsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Mock Reel Background */}
      <Image
        source={{ uri: 'https://picsum.photos/400/800?random=100' }}
        style={styles.reelBackground}
        blurRadius={2}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.reelsTitle}>Reels</Text>
          <TouchableOpacity>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionCount}>12.5K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>856</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>⋯</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton}>
            <Text style={styles.musicIcon}>🎵</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>J</Text>
            </View>
            <Text style={styles.username}>@john_creator</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.caption}>
            Amazing sunset timelapse 🌅 #nature #sunset
          </Text>
          <View style={styles.musicBar}>
            <Text style={styles.musicText}>🎵 Original Audio</Text>
          </View>
        </View>

        {/* Placeholder Overlay */}
        <View style={styles.placeholderOverlay}>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderIcon}>🎬</Text>
            <Text style={styles.placeholderTitle}>Reels Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Swipe through short, entertaining videos from creators you love.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reelBackground: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  reelsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraIcon: {
    fontSize: 28,
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 200,
    alignItems: 'center',
    gap: 24,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  musicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  musicIcon: {
    fontSize: 20,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  musicBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  placeholderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  placeholderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 300,
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

export default ReelsScreen;
