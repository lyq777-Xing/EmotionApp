import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';

import { useLocalSearchParams } from 'expo-router';

import { useAuth } from "@/utils/AuthContext"


export default function DiaryCreateScreen() {

  // 获取用户信息
  const { user } = useAuth()

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // 添加对话框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [emotionResult, setEmotionResult] = useState<{ emotion: string; intensity: number; content: string } | null>(null);
  
  // Add refs to focus inputs
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // 获取路由参数
  const params = useLocalSearchParams();
  const weather = params.weather as string;
  const mood = params.mood as string;
  const activities = params.activities ? JSON.parse(params.activities as string) : [];
  
  // 根据心情选择返回对应的表情
  const getEmotionEmoji = () => {
    if (!mood) return '😶';
    
    const moodMap: {[key: string]: string} = {
      'happy': '😊',
      'excited': '🤩',
      'calm': '😌',
      'tired': '😴',
      'sad': '😢',
      'angry': '😡'
    };
    
    return moodMap[mood] || '😶';
  };
  
  // 分析并显示心情文字描述
  const getEmotionText = () => {
    if (!mood) return '心情未知';
    
    const moodMap: {[key: string]: string} = {
      'happy': '开心',
      'excited': '兴奋',
      'calm': '平静',
      'tired': '疲惫',
      'sad': '难过',
      'angry': '生气'
    };
    
    return moodMap[mood] || '心情未知';
  };

  // 获取天气选项的标签文本
  const getWeatherLabel = (weatherId: string) => {
    const weatherMap: {[key: string]: {label: string, icon: string}} = {
      'sunny': {label: '晴朗', icon: 'sunny-outline'},
      'partly-cloudy': {label: '多云', icon: 'partly-sunny-outline'},
      'cloudy': {label: '阴天', icon: 'cloud-outline'},
      'rainy': {label: '下雨', icon: 'rainy-outline'},
      'stormy': {label: '雷雨', icon: 'thunderstorm-outline'},
      'snowy': {label: '下雪', icon: 'snow-outline'}
    };
    
    return weatherId && weatherMap[weatherId] ? 
      { label: weatherMap[weatherId].label, icon: weatherMap[weatherId].icon } : 
      null;
  };
  
  // 获取心情选项的标签文本
  const getMoodLabel = (moodId: string) => {
    const moodMap: {[key: string]: {label: string, emoji: string}} = {
      'happy': {label: '开心', emoji: '😊'},
      'excited': {label: '兴奋', emoji: '🤩'},
      'calm': {label: '平静', emoji: '😌'},
      'tired': {label: '疲惫', emoji: '😴'},
      'sad': {label: '难过', emoji: '😢'},
      'angry': {label: '生气', emoji: '😡'}
    };
    
    return moodId && moodMap[moodId] ? 
      { label: moodMap[moodId].label, emoji: moodMap[moodId].emoji } : 
      null;
  };
  
  // 获取活动选项的标签文本
  const getActivityLabels = (activityIds: string[]) => {
    const activityMap: {[key: string]: {label: string, icon: string}} = {
      'work': {label: '工作', icon: 'briefcase-outline'},
      'study': {label: '学习', icon: 'book-outline'},
      'exercise': {label: '运动', icon: 'fitness-outline'},
      'social': {label: '社交', icon: 'people-outline'},
      'entertainment': {label: '娱乐', icon: 'game-controller-outline'},
      'rest': {label: '休息', icon: 'bed-outline'}
    };
    
    return activityIds.map(id => 
      activityMap[id] ? { id, ...activityMap[id] } : null
    ).filter(Boolean);
  };
  
  const weatherInfo = getWeatherLabel(weather);
  const moodInfo = getMoodLabel(mood);
  const activityInfoList = getActivityLabels(activities);
  
  // 处理日记保存
  const handleSave = async () => {
    // 构建标签字符串（天气、心情、活动）
    const tagParts = [];
    if (weather) tagParts.push(weather);
    if (mood) tagParts.push(mood);
    if (activities && activities.length > 0) {
      tagParts.push(...activities);
    }
    const tag = tagParts.join(',');
    
    // 构建发送到后端的数据对象
    const diaryData = {
      categoryId: 666,  // 默认值
      userId: user?.userId ?? -1, // 默认值
      tag,
      title,
      content,
      permission: 0, // 默认值
    };
    
    console.log('保存日记:', diaryData);
    
    try {
      // 这里添加API调用逻辑，向后端发送日记数据
      const response = await fetch('http://localhost:5081/api/diary/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diaryData),
      });
      
      // 显示对话框，询问是否需要进行情绪分析
      setModalVisible(true);
      
    } catch (error) {
      console.error('保存日记时出错:', error);
      // 可以添加错误处理UI，如显示一个错误提示
    }
  };

  // 返回情绪分析折线图页面
  const handleBack = () => {
    router.push('/(tabs)');
  };

  // 处理情绪分析
  const handleEmotionAnalysis = async () => {
    try {      
      // 这里添加情绪分析的API调用
      const response = await fetch('http://123.60.174.147:5000/emotion/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });
      
      const result = await response.json();
      setEmotionResult(result);

      // 关闭当前对话框，显示情绪分析结果
      setModalVisible(false);
      
      // 正确传递参数到分析页面
      router.push({
        pathname: '/diary/analysis',
        params: {
          emotion: result.emotion,     // 直接传递 emotion 值
          intensity: result.intensity, // 直接传递 intensity 值
          content: content,         // 传递日记内容用于进一步分析
          title: title              // 传递标题
        }
      });
    } catch (error) {
      console.error('情绪分析出错:', error);
      setModalVisible(false);
    }
  };

  // Helper to dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}>
        <View style={styles.header}>
          <Button
            variant="link"
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? Colors.dark.text : Colors.light.text} 
            />
            <ButtonText style={{ color: isDark ? Colors.dark.text : Colors.light.text }}>
              返回
            </ButtonText>
          </Button>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? Colors.dark.text : Colors.light.text }
          ]}>
            写日记
          </Text>
          <Button
            variant="link"
            onPress={handleSave}
            style={styles.saveButton}
          >
            <ButtonText style={{ color: isDark ? Colors.dark.tint : Colors.light.tint }}>
              保存
            </ButtonText>
          </Button>
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 添加标签显示区域 */}
          {(weatherInfo || moodInfo || activityInfoList.length > 0) && (
            <View style={[
              styles.tagsContainer,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}>
              <Text style={[
                styles.tagsTitle,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                今日标签:
              </Text>
              
              <View style={styles.tagsList}>
                {weatherInfo && (
                  <View style={[
                    styles.tagItem,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(10,126,164,0.1)' }
                  ]}>
                    <Ionicons 
                      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                      name={weatherInfo.icon as any} 
                      size={16} 
                      color={isDark ? Colors.dark.tint : Colors.light.tint}
                      style={styles.tagIcon} 
                    />
                    <Text style={[
                      styles.tagText,
                      { color: isDark ? Colors.dark.text : Colors.light.text }
                    ]}>
                      {weatherInfo.label}
                    </Text>
                  </View>
                )}
                
                {moodInfo && (
                  <View style={[
                    styles.tagItem,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(10,126,164,0.1)' }
                  ]}>
                    <Text style={styles.tagEmoji}>{moodInfo.emoji}</Text>
                    <Text style={[
                      styles.tagText,
                      { color: isDark ? Colors.dark.text : Colors.light.text }
                    ]}>
                      {moodInfo.label}
                    </Text>
                  </View>
                )}
                
                {activityInfoList.map((activity, index) => (
                  activity && (
                    <View 
                      key={`activity-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
index}`}
                      style={[
                        styles.tagItem,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(10,126,164,0.1)' }
                      ]}
                    >
                      <Ionicons 
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        name={activity.icon as any} 
                        size={16} 
                        color={isDark ? Colors.dark.tint : Colors.light.tint}
                        style={styles.tagIcon} 
                      />
                      <Text style={[
                        styles.tagText,
                        { color: isDark ? Colors.dark.text : Colors.light.text }
                      ]}>
                        {activity.label}
                      </Text>
                    </View>
                  )
                ))}
              </View>
            </View>
          )}
          
          <TouchableWithoutFeedback onPress={() => titleInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={titleInputRef}
                style={[
                  styles.titleInput,
                  { 
                    color: isDark ? Colors.dark.text : Colors.light.text,
                    borderColor: isDark ? '#444' : '#e0e0e0'
                  }
                ]}
                placeholder="日记标题"
                placeholderTextColor={isDark ? Colors.dark.icon : Colors.light.icon}
                value={title}
                onChangeText={setTitle}
                enterKeyHint="next"
                returnKeyType="next"
                onSubmitEditing={() => contentInputRef.current?.focus()}
                // Web specific props to help with focus issues
                {...(Platform.OS === 'web' && { 
                  inputMode: 'text',
                  autoComplete: 'off',
                })}
              />
            </View>
          </TouchableWithoutFeedback>
          
          <TouchableWithoutFeedback onPress={() => contentInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={contentInputRef}
                style={[
                  styles.contentInput,
                  { 
                    color: isDark ? Colors.dark.text : Colors.light.text,
                    backgroundColor: isDark ? '#222' : '#f5f5f5'
                  }
                ]}
                placeholder="今天发生了什么..."
                placeholderTextColor={isDark ? Colors.dark.icon : Colors.light.icon}
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                // Web specific props to help with focus issues
                {...(Platform.OS === 'web' && { 
                  inputMode: 'text',
                  autoComplete: 'off',
                })}
              />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        
        {/* 情绪分析对话框 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#333' : '#fff' }
            ]}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{getEmotionEmoji()}</Text>
              </View>
              
              <Text style={[
                styles.modalTitle,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                今日心情: {getEmotionText()}
              </Text>
              
              <Text style={[
                styles.modalText,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                是否需要进行情绪分析？
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: isDark ? '#555' : '#eee' }
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/(tabs)');
                  }}
                >
                  <Text style={{ color: isDark ? '#fff' : '#333' }}>不需要</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint }
                  ]}
                  onPress={handleEmotionAnalysis}
                >
                  <Text style={{ color: '#fff' }}>分析心情</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  contentInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 8,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  // 对话框样式
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  emojiContainer: {
    marginBottom: 15,
  },
  emoji: {
    fontSize: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  // 标签区域样式
  tagsContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
  },
  tagEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
});