import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';

const { width } = Dimensions.get('window');
const imageSize = (width - 3) / 3; // 3 columns with 1px gaps

const ExploreScreen: React.FC = () => {
  // Mock explore grid data
  const exploreImages = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    uri: `https://picsum.photos/400/400?random=${i + 10}`,
    isVideo: i % 5 === 0,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, users..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Explore Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {exploreImages.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem}>
              <Image source={{ uri: item.uri }} style={styles.gridImage} />
              {item.isVideo && (
                <View style={styles.videoIndicator}>
                  <Text style={styles.videoIcon}>▶️</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Placeholder */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderIcon}>🔍</Text>
          <Text style={styles.placeholderTitle}>Explore Content</Text>
          <Text style={styles.placeholderText}>
            Discover trending posts, reels, and creators on PixelFeed. Content
            will be personalized based on your interests.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
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
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    padding: 4,
  },
  videoIcon: {
    fontSize: 12,
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
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

export default ExploreScreen;
