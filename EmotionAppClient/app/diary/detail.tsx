import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Share
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '@/utils/apiService';

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

// Emotion colors mapping
const emotionColors: Record<string, { light: string, dark: string }> = {
  'happy': { light: '#047857', dark: '#34d399' },
  'sad': { light: '#1d4ed8', dark: '#93c5fd' },
  'angry': { light: '#b91c1c', dark: '#fca5a5' },
  'fear': { light: '#6d28d9', dark: '#c4b5fd' },
  'love': { light: '#be185d', dark: '#f9a8d4' },
  'surprised': { light: '#92400e', dark: '#fcd34d' },
  'neutral': { light: '#4b5563', dark: '#9ca3af' },
  'anxiety': { light: '#7c3aed', dark: '#c4b5fd' },
  'relaxed': { light: '#047857', dark: '#34d399' },
};

// Emotion tag component
const EmotionTag = ({ tag, isDark }: { tag: string, isDark: boolean }) => {
  // Map emotion tags to colors
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

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function DiaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [diary, setDiary] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Fetch diary details
  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await apiClient.get<DiaryEntry>(`/diary/detail/${id}`);
          setDiary(response.data);
        }
      } catch (error) {
        console.error('Error fetching diary details:', error);
        // If API fails, use sample data matching the ID
        const sampleDiary = sampleDiaries.find(d => d.id === Number(id));
        if (sampleDiary) {
          setDiary(sampleDiary);
        } else {
          // Navigate back if diary not found
          router.back();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryDetail();
  }, [id]);

  // Navigate to analyze page
  const handleAnalyze = () => {
    if (diary) {
      router.push({
        pathname: '/diary/analysis',
        params: { id: diary.id.toString() }
      });
    }
  };

  // Share diary
  const handleShare = async () => {
    if (diary) {
      try {
        await Share.share({
          title: diary.title,
          message: `${diary.title}\n\n${diary.content}\n\n情绪: ${diary.emotion} (${Math.round(diary.intensity * 100)}%)\n\n#EmotionApp`
        });
      } catch (error) {
        console.error('Error sharing diary:', error);
      }
    }
  };

  // Go back to diary list
  const handleGoBack = () => {
    router.back();
  };

  // Edit diary
  const handleEdit = () => {
    if (diary) {
      router.push({
        pathname: '/diary/create',
        params: { id: diary.id.toString() }
      });
    }
  };

  // Get emotion color based on current theme
  const getEmotionColor = (emotion: string) => {
    const defaultColor = isDark ? Colors.dark.text : Colors.light.text;
    if (!emotion) return defaultColor;
    
    const emotionKey = emotion.toLowerCase();
    if (emotionColors[emotionKey]) {
      return isDark ? emotionColors[emotionKey].dark : emotionColors[emotionKey].light;
    }
    return defaultColor;
  };

  if (loading) {
    return (
      <SafeAreaView 
        style={[
          styles.container,
          { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[isDark ? 'dark' : 'light'].tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (!diary) {
    return (
      <SafeAreaView 
        style={[
          styles.container,
          { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
          >
            <IconSymbol 
              size={24} 
              name="chevron.left" 
              color={isDark ? Colors.dark.text : Colors.light.text} 
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>日记详情</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <ThemedText style={styles.notFoundText}>日记不存在或已被删除</ThemedText>
          <TouchableOpacity 
            style={[
              styles.button,
              { backgroundColor: Colors[isDark ? 'dark' : 'light'].tint }
            ]} 
            onPress={handleGoBack}
          >
            <ThemedText style={styles.buttonText}>返回列表</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <IconSymbol 
            size={24} 
            name="chevron.left" 
            color={isDark ? Colors.dark.text : Colors.light.text} 
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>日记详情</ThemedText>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
        >
          <IconSymbol 
            size={20} 
            name="square.and.arrow.up" 
            color={isDark ? Colors.dark.text : Colors.light.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Diary header */}
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{diary.title}</ThemedText>
            <ThemedText style={styles.date}>{formatDate(diary.createdAt)}</ThemedText>
          </View>

          {/* Emotion indicator */}
          <View style={styles.emotionContainer}>
            <View style={styles.emotionBadge}>
              <IconSymbol 
                size={20} 
                name="heart.fill" 
                color={getEmotionColor(diary.emotion)} 
              />
              <ThemedText 
                style={[
                  styles.emotionText, 
                  { color: getEmotionColor(diary.emotion) }
                ]}
              >
                {diary.emotion}
              </ThemedText>
              <View
                style={[
                  styles.intensityBadge,
                  { backgroundColor: getEmotionColor(diary.emotion) }
                ]}
              >
                <ThemedText style={styles.intensityText}>
                  {Math.round(diary.intensity * 100)}%
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {diary.tags && diary.tags.map((tag, index) => (
              <EmotionTag key={index} tag={tag} isDark={isDark} />
            ))}
          </View>

          {/* Content */}
          <ThemedView style={styles.contentCard}>
            <ThemedText style={styles.content}>{diary.content}</ThemedText>
          </ThemedView>

          {/* Action buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[
                styles.actionButtonLarge,
                { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                }
              ]} 
              onPress={handleEdit}
            >
              <IconSymbol 
                size={20} 
                name="pencil" 
                color={isDark ? Colors.dark.text : Colors.light.text} 
              />
              <ThemedText style={styles.actionButtonText}>编辑</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButtonLarge,
                { 
                  backgroundColor: Colors[isDark ? 'dark' : 'light'].tint,
                }
              ]} 
              onPress={handleAnalyze}
            >
              <IconSymbol 
                size={20} 
                name="chart.bar.fill" 
                color="white" 
              />
              <ThemedText style={[styles.actionButtonText, { color: 'white' }]}>
                情绪分析
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sample diaries for fallback when API fails
const sampleDiaries: DiaryEntry[] = [
  {
    id: 1,
    title: '今天是个好日子',
    content: '今天天气很好，心情也不错。早上去了公园跑步，遇到了很多同样热爱运动的人。中午和朋友一起吃饭，聊了很多有趣的事情。下午工作效率很高，完成了很多任务。\n\n我感觉自己的能量非常充足，希望这种状态能够持续下去。明天也要保持积极的心态，努力工作和生活。',
    emotion: 'happy',
    intensity: 0.85,
    tags: ['运动', '朋友'],
    createdAt: '2023-05-10T08:30:00Z',
  },
  {
    id: 2,
    title: '工作压力很大',
    content: '这周工作任务太多，感觉有点喘不过气。项目截止日期临近，还有很多细节需要处理。希望能尽快调整好状态，高效完成工作。\n\n今天开了三个会议，处理了二十多封邮件，还要准备明天的演示文稿。感觉时间不够用，还有很多任务没完成。需要调整一下工作计划，合理安排时间，避免过度疲劳。',
    emotion: 'anxiety',
    intensity: 0.7,
    tags: ['工作', '压力'],
    createdAt: '2023-05-08T18:15:00Z',
  },
  {
    id: 3,
    title: '与家人的争执',
    content: '今天和家人因为一些小事发生了争执，感到很沮丧。或许我们都太疲惫了，没能好好沟通。明天要记得道歉，好好谈一谈。\n\n回想起来，我说话的语气可能有些不耐烦，这让家人感到不被尊重。我应该学会控制自己的情绪，即使在疲惫的时候也要保持耐心。家人是最重要的，不应该让工作压力影响家庭和谐。',
    emotion: 'sad',
    intensity: 0.6,
    tags: ['家庭', '沟通'],
    createdAt: '2023-05-05T21:45:00Z',
  },
  {
    id: 4,
    title: '假日放松时光',
    content: '周末在家看了很久想看的电影，做了美食，还打扫了房间。这种自己安排时间的感觉真好，期待下个假期再做一些有意义的事情。\n\n做了肉酱意面和沙拉，味道比预期的要好。下午看了两部电影，一部喜剧一部纪录片，都很有启发。晚上打了视频电话给远方的朋友，聊了近况。这样平静而充实的一天真是太棒了。',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholder: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  emotionContainer: {
    marginBottom: 16,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  emotionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  intensityBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});