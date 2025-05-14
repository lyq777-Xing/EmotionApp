import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/utils/AuthContext';
import { apiClient } from '@/utils/apiService';

const { width } = Dimensions.get('window');
const ANIMATION_DURATION = 300;

// Diary entry interface
interface DiaryEntry {
  diaryID: number;
  title: string;
  content: string;
  sentiment: string | null;
  sentimentScore: number | null;
  tag: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
  categoryID: number;
  category: { id: number; name: string }[] | null; // Replace with the actual structure of the category object
  userID: number;
  user: string | null;
  permission: number;
}

// Emotion tag component
const EmotionTag = ({ tag, isDark }: { tag: string, isDark: boolean }) => {
  const getTagColor = (tag: string) => {
    const tagColors: Record<string, { bg: string, text: string }> = {
      'happy': { bg: isDark ? '#065f46' : '#d1fae5', text: isDark ? '#34d399' : '#047857' },
      'sad': { bg: isDark ? '#1e3a8a' : '#dbeafe', text: isDark ? '#93c5fd' : '#1d4ed8' },
      'angry': { bg: isDark ? '#7f1d1d' : '#fee2e2', text: isDark ? '#fca5a5' : '#b91c1c' },
      'fear': { bg: isDark ? '#4c1d95' : '#ede9fe', text: isDark ? '#c4b5fd' : '#6d28d9' },
      'love': { bg: isDark ? '#9f1239' : '#fce7f3', text: isDark ? '#f9a8d4' : '#be185d' },
      'surprised': { bg: isDark ? '#78350f' : '#fef3c7', text: isDark ? '#fcd34d' : '#92400e' },
      'neutral': { bg: isDark ? '#1f2937' : '#f3f4f6', text: isDark ? '#9ca3af' : '#4b5563' },
      'anxiety': { bg: isDark ? '#5b21b6' : '#ede9fe', text: isDark ? '#c4b5fd' : '#7c3aed' },
      'excited': { bg: isDark ? '#065f46' : '#d1fae5', text: isDark ? '#34d399' : '#047857' },
      'relaxed': { bg: isDark ? '#065f46' : '#d1fae5', text: isDark ? '#34d399' : '#047857' },
    };
    return tagColors[tag.toLowerCase()] || { bg: isDark ? '#1f2937' : '#f3f4f6', text: isDark ? '#9ca3af' : '#4b5563' };
  };

  const colors = getTagColor(tag);
  
  return (
    <View style={[styles.tag, { backgroundColor: colors.bg }]}>
      <ThemedText style={[styles.tagText, { color: colors.text }]}>
        {tag}
      </ThemedText>
    </View>
  );
};

// Date formatter 
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function DiaryListScreen() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(50))[0];

  // 创建预渲染的动画值集合
  const animatedValues = useRef<{[key: string]: {fade: Animated.Value, translate: Animated.Value}}>({}).current;
  
  // 初始化或获取动画值
  const getAnimatedValues = (id: number | undefined, index: number) => {
    // 添加安全检查，确保id有值
    const key = id !== undefined ? id.toString() : `item-${index}-${Math.random()}`;
    
    if (!animatedValues[key]) {
      animatedValues[key] = {
        fade: new Animated.Value(0),
        translate: new Animated.Value(20)
      };
      
      // 添加延迟动画
      const delay = index * 100;
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(animatedValues[key].fade, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            delay,
            useNativeDriver: true
          }),
          Animated.timing(animatedValues[key].translate, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            delay,
            useNativeDriver: true
          })
        ]).start();
      }, 0);
    }
    
    return animatedValues[key];
  };

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<DiaryEntry[]>(
        user ? `/diary/list?userId=${user.userId}` : '/diary/list'
      );
      // 处理数据
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      // setDiaries();
    } finally {
      setLoading(false);
      setRefreshing(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    translateY.setValue(0);
    
    // 重置所有动画值
    for (const key of Object.keys(animatedValues)) {
      animatedValues[key].fade.setValue(0);
      animatedValues[key].translate.setValue(20);
    }
    
    fetchDiaries();
  };

  const handleDiaryPress = (diary: DiaryEntry) => {
    router.push({
      pathname: '/diary/detail',
      params: { id: diary.diaryID }
    });
  };

  const handleCreateDiary = () => {
    router.push('/(tabs)/diary');
  };

  const renderDiaryItem = ({ item, index }: { item: DiaryEntry, index: number }) => {
    const { fade, translate } = getAnimatedValues(item.diaryID, index);
    
    // 解析标签字符串为数组
    const tags = item.tag ? item.tag.split(',') : [];
    // 获取情感类型（如果sentiment为null，使用标签中的第一个作为情绪类型）
    const emotion = item.sentiment || (tags.length > 0 ? tags[0] : '');
    // 获取情感强度（如果sentimentScore为null，使用默认值0.5）
    const intensity = item.sentimentScore !== null ? item.sentimentScore : 0.5;

    return (
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: translate }]
        }}
      >
        <TouchableOpacity
          style={[
            styles.diaryItem,
            {
              backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
              borderLeftColor: emotion === 'happy' || emotion === 'excited' ? '#34d399' :
                              emotion === 'sad' ? '#93c5fd' :
                              emotion === 'angry' ? '#f87171' :
                              emotion === 'anxiety' ? '#c4b5fd' :
                              emotion === 'relaxed' || emotion === 'sunny' ? '#34d399' :
                              isDark ? Colors.dark.tint : Colors.light.tint,
            }
          ]}
          onPress={() => handleDiaryPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.dateBadge}>
            <ThemedText style={styles.dateDay}>
              {new Date(item.createdAt).getDate()}
            </ThemedText>
            <ThemedText style={styles.dateMonth}>
              {new Date(item.createdAt).toLocaleString('zh-CN', { month: 'short' })}
            </ThemedText>
          </View>
          
          <View style={styles.diaryContent}>
            <View style={styles.diaryHeader}>
              <ThemedText style={styles.diaryTitle}>{item.title}</ThemedText>
              <View style={styles.emotionIndicator}>
                <IconSymbol 
                  size={16} 
                  name={intensity > 0.6 ? "heart.fill" : "heart"} 
                  color={
                    emotion === 'happy' || emotion === 'excited' ? '#34d399' :
                    emotion === 'sad' ? '#93c5fd' :
                    emotion === 'angry' ? '#f87171' : 
                    isDark ? Colors.dark.text : Colors.light.text
                  } 
                />
                <ThemedText style={styles.intensityText}>
                  {Math.round(intensity * 100)}%
                </ThemedText>
              </View>
            </View>
            
            <ThemedText 
              style={styles.diaryPreview} 
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.content}
            </ThemedText>
            
            <View style={styles.tagsContainer}>
              {emotion && (
                <EmotionTag tag={emotion} isDark={isDark} />
              )}
              {tags.filter(tag => tag !== emotion).map((tag, index) => (
                <EmotionTag key={tag} tag={tag} isDark={isDark} />
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyComponent = () => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }]
        }
      ]}
    >
      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.emptyImage} 
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>没有记录的日记</ThemedText>
      <ThemedText style={styles.emptyText}>
        记录你的情绪和想法，开始你的情绪之旅
      </ThemedText>
      <TouchableOpacity 
        style={[
          styles.createButton,
          { backgroundColor: Colors[isDark ? 'dark' : 'light'].tint }
        ]} 
        onPress={handleCreateDiary}
      >
        <IconSymbol 
          size={20} 
          name="plus" 
          color="white" 
          style={styles.createButtonIcon}
        />
        <ThemedText style={styles.createButtonText}>
          创建第一篇日记
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[
              styles.navButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]} 
            onPress={() => router.push('/(tabs)/user')}
          >
            <IconSymbol 
              size={20} 
              name="person" 
              color={isDark ? Colors.dark.tint : Colors.light.tint} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.navButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]} 
            onPress={() => router.push('/(tabs)/donut')}
          >
            <IconSymbol 
              size={20} 
              name="chart.bar" 
              color={isDark ? Colors.dark.tint : Colors.light.tint} 
            />
          </TouchableOpacity>
        </View>
        
        <ThemedText style={styles.headerTitle}>情绪日记</ThemedText>

        <TouchableOpacity 
            style={[
              styles.navButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]} 
            onPress={() => router.push('/(tabs)/diary')}
          >
            <IconSymbol 
              size={20} 
              name="plus" 
              color={isDark ? Colors.dark.tint : Colors.light.tint} 
            />
          </TouchableOpacity>
        {/* <TouchableOpacity 
          style={[
            styles.addButton,
            { backgroundColor: Colors[isDark ? 'dark' : 'light'].tint }
          ]} 
          onPress={handleCreateDiary}
        >
          <IconSymbol 
            size={22} 
            name="plus" 
            color="white" 
          />
        </TouchableOpacity> */}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[isDark ? 'dark' : 'light'].tint} />
        </View>
      ) : (
        <Animated.View style={{ 
          flex: 1, 
          opacity: fadeAnim,
        }}>
          <FlatList
            data={diaries}
            renderItem={renderDiaryItem}
            keyExtractor={(item) => item.diaryID.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.light.tint]}
                tintColor={Colors[isDark ? 'dark' : 'light'].tint}
              />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  diaryItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  dateBadge: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  dateMonth: {
    fontSize: 13,
    opacity: 0.8,
  },
  diaryContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 10,
  },
  diaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  diaryPreview: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emotionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  intensityText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});