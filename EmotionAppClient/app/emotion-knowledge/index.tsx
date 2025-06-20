import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import type { EmotionKnowledge } from '@/utils/apiService';
import { getEmotionKnowledgeList } from '@/utils/apiService';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/utils/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function EmotionKnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState<EmotionKnowledge[]>([]);
  const [filteredList, setFilteredList] = useState<EmotionKnowledge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | null>(null); // null = all, 0 = negative, 1 = positive
  const { theme } = useTheme();

  // Fetch knowledge data on component mount
  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  // Apply filter whenever filter state or knowledge list changes
  useEffect(() => {
    if (filter === null) {
      setFilteredList(knowledgeList);
    } else {
      setFilteredList(knowledgeList.filter(item => item.emotionCategory === filter));
    }
  }, [filter, knowledgeList]);

  // Fetch emotion knowledge data from API
  const fetchKnowledgeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmotionKnowledgeList();
      setKnowledgeList(data);
      setFilteredList(data);
    } catch (err) {
      console.error('Failed to fetch emotion knowledge:', err);
      setError('获取情绪知识数据失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening external content URLs
  const handleOpenURL = (url: string | null) => {
    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Failed to open URL:', err);
        setError('无法打开链接');
      });
    }
  };

  // Get intensity level label
  const getIntensityLabel = (intensity: number): string => {
    if (intensity < 0.3) return '轻微';
    if (intensity < 0.6) return '中等';
    return '强烈';
  };
  // Get color based on emotion category and intensity
  const getEmotionColor = (category: number, intensity: number): string => {
    if (category === 1) { // Positive
      // Green shades
      if (intensity < 0.4) return '#8BC34A';
      if (intensity < 0.7) return '#4CAF50';
      return '#009688';
    }
    
    // Negative (category === 0 or any other value)
    // Red/orange shades
    if (intensity < 0.4) return '#FFCC80';
    if (intensity < 0.7) return '#FF9800';
    return '#F44336';
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case '文字':
        return 'text-fields';
      case '视频':
        return 'videocam';
      case '音频':
        return 'headset';
      default:
        return 'info';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme === 'dark' ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>
          情绪知识库
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === null && styles.activeFilterTab,
            { borderColor: filter === null ? '#6200EE' : theme === 'dark' ? '#555555' : '#dddddd' }
          ]}
          onPress={() => setFilter(null)}
        >
          <Text style={[
            styles.filterText, 
            filter === null && styles.activeFilterText,
            { color: filter === null ? '#6200EE' : theme === 'dark' ? '#dddddd' : '#666666' }
          ]}>
            全部
          </Text>
        </TouchableOpacity>
          <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === 1 && styles.activeFilterTab,
            { borderColor: filter === 1 ? '#4CAF50' : theme === 'dark' ? '#555555' : '#dddddd' }
          ]}
          onPress={() => setFilter(1)}
        >
          <Text style={[
            styles.filterText, 
            filter === 1 && styles.activeFilterText,
            { color: filter === 1 ? '#4CAF50' : theme === 'dark' ? '#dddddd' : '#666666' }
          ]}>
            积极情绪
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            filter === 0 && styles.activeFilterTab,
            { borderColor: filter === 0 ? '#F44336' : theme === 'dark' ? '#555555' : '#dddddd' }
          ]}
          onPress={() => setFilter(0)}
        >
          <Text style={[
            styles.filterText, 
            filter === 0 && styles.activeFilterText,
            { color: filter === 0 ? '#F44336' : theme === 'dark' ? '#dddddd' : '#666666' }
          ]}>
            消极情绪
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={[styles.loadingText, { color: theme === 'dark' ? '#dddddd' : '#666666' }]}>
            加载中...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchKnowledgeData}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="sentiment-neutral" size={48} color={theme === 'dark' ? '#555555' : '#999999'} />
              <Text style={[styles.emptyText, { color: theme === 'dark' ? '#dddddd' : '#666666' }]}>
                没有找到匹配的情绪知识
              </Text>
            </View>
          ) : (
            filteredList.map((item) => (
              <ThemedView 
                key={item.id} 
                style={styles.card}
                lightColor='#ffffff'
                darkColor='#222222'
              >
                <View style={[styles.emotionCategoryBadge, { 
                  backgroundColor: getEmotionColor(item.emotionCategory, item.emotionIntensity) 
                }]}>                  <Text style={styles.emotionCategoryText}>
                    {item.emotionCategory === 1 ? "积极" : "消极"}
                    {" · "}
                    {getIntensityLabel(item.emotionIntensity)}
                  </Text>
                </View>
                
                <View style={styles.cardHeader}>
                  <MaterialIcons 
                    name={getContentTypeIcon(item.contentType)} 
                    size={20} 
                    color={theme === 'dark' ? '#bbbbbb' : '#666666'} 
                  />
                  <Text style={[styles.contentType, { color: theme === 'dark' ? '#bbbbbb' : '#666666' }]}>
                    {item.contentType}
                  </Text>
                </View>
                
                <Text style={[styles.recommendedAction, { color: theme === 'dark' ? '#ffffff' : '#000000' }]}>
                  {item.recommendedAction}
                </Text>
                
                <Text style={[styles.description, { color: theme === 'dark' ? '#cccccc' : '#444444' }]}>
                  {item.description}
                </Text>
                
                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Text style={[styles.footerLabel, { color: theme === 'dark' ? '#999999' : '#888888' }]}>
                      心理基础:
                    </Text>
                    <Text style={[styles.footerValue, { color: theme === 'dark' ? '#dddddd' : '#555555' }]}>
                      {item.psychologicalBasis}
                    </Text>
                  </View>
                  
                  <View style={styles.footerItem}>
                    <Text style={[styles.footerLabel, { color: theme === 'dark' ? '#999999' : '#888888' }]}>
                      目标需求:
                    </Text>
                    <Text style={[styles.footerValue, { color: theme === 'dark' ? '#dddddd' : '#555555' }]}>
                      {item.targetNeeds}
                    </Text>
                  </View>
                </View>
                
                {item.contentUrl && (
                  <TouchableOpacity 
                    style={styles.contentButton}
                    onPress={() => handleOpenURL(item.contentUrl)}
                  >
                    <Text style={styles.contentButtonText}>查看资源</Text>
                    <MaterialIcons name="open-in-new" size={16} color="#ffffff" />
                  </TouchableOpacity>
                )}
              </ThemedView>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeFilterTab: {
    borderWidth: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6200EE',
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  emotionCategoryBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 12,
  },
  emotionCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 6,
  },
  contentType: {
    marginLeft: 8,
    fontSize: 13,
  },
  recommendedAction: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    borderTopWidth: 0.5,
    borderTopColor: '#dddddd',
    paddingTop: 12,
    marginTop: 4,
  },
  footerItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  footerLabel: {
    fontSize: 13,
    marginRight: 4,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentButton: {
    marginTop: 12,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  contentButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 14,
  },
});