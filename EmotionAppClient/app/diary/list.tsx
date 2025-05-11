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
  id: number;
  title: string;
  content: string;
  emotion: string;
  intensity: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
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
  const getAnimatedValues = (id: number, index: number) => {
    const key = id.toString();
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
      setDiaries(response.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setDiaries(sampleDiaries);
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
    Object.keys(animatedValues).forEach(key => {
      animatedValues[key].fade.setValue(0);
      animatedValues[key].translate.setValue(20);
    });
    
    fetchDiaries();
  };

  const handleDiaryPress = (diary: DiaryEntry) => {
    router.push({
      pathname: '/diary/detail',
      params: { id: diary.id }
    });
  };

  const handleCreateDiary = () => {
    router.push('/diary/create');
  };

  const renderDiaryItem = ({ item, index }: { item: DiaryEntry, index: number }) => {
    const { fade, translate } = getAnimatedValues(item.id, index);

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
              backgroundColor: isDark ? Colors.dark.cardBackground : Colors.light.cardBackground,
              borderLeftColor: item.emotion === 'happy' ? '#34d399' :
                              item.emotion === 'sad' ? '#93c5fd' :
                              item.emotion === 'angry' ? '#f87171' :
                              item.emotion === 'anxiety' ? '#c4b5fd' :
                              item.emotion === 'relaxed' ? '#34d399' :
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
                  name={item.intensity > 0.6 ? "heart.fill" : "heart"} 
                  color={
                    item.emotion === 'happy' ? '#34d399' :
                    item.emotion === 'sad' ? '#93c5fd' :
                    item.emotion === 'angry' ? '#f87171' : 
                    isDark ? Colors.dark.text : Colors.light.text
                  } 
                />
                <ThemedText style={styles.intensityText}>
                  {Math.round(item.intensity * 100)}%
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
              {item.emotion && (
                <EmotionTag tag={item.emotion} isDark={isDark} />
              )}
              {item.tags && item.tags.map((tag, index) => (
                <EmotionTag key={index} tag={tag} isDark={isDark} />
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
            keyExtractor={(item) => item.id.toString()}
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

const sampleDiaries: DiaryEntry[] = [
  {
    id: 1,
    title: '今天是个好日子',
    content: '今天天气很好，心情也不错。早上去了公园跑步，遇到了很多同样热爱运动的人。中午和朋友一起吃饭，聊了很多有趣的事情。下午工作效率很高，完成了很多任务。',
    emotion: 'happy',
    intensity: 0.85,
    tags: ['运动', '朋友'],
    createdAt: '2023-05-10T08:30:00Z',
  },
  {
    id: 2,
    title: '工作压力很大',
    content: '这周工作任务太多，感觉有点喘不过气。项目截止日期临近，还有很多细节需要处理。希望能尽快调整好状态，高效完成工作。',
    emotion: 'anxiety',
    intensity: 0.7,
    tags: ['工作', '压力'],
    createdAt: '2023-05-08T18:15:00Z',
  },
  {
    id: 3,
    title: '与家人的争执',
    content: '今天和家人因为一些小事发生了争执，感到很沮丧。或许我们都太疲惫了，没能好好沟通。明天要记得道歉，好好谈一谈。',
    emotion: 'sad',
    intensity: 0.6,
    tags: ['家庭', '沟通'],
    createdAt: '2023-05-05T21:45:00Z',
  },
  {
    id: 4,
    title: '假日放松时光',
    content: '周末在家看了很久想看的电影，做了美食，还打扫了房间。这种自己安排时间的感觉真好，期待下个假期再做一些有意义的事情。',
    emotion: 'relaxed',
    intensity: 0.9,
    tags: ['休闲', '电影'],
    createdAt: '2023-05-01T14:20:00Z',
  },
];

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