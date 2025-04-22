import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';

import { useLocalSearchParams } from 'expo-router';

export default function DiaryCreateScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Add refs to focus inputs
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // 获取路由参数
  const params = useLocalSearchParams();
  const weather = params.weather as string;
  const mood = params.mood as string;
  const activities = params.activities ? JSON.parse(params.activities as string) : [];
  
  const handleSave = () => {
    // 这里添加保存日记的逻辑
    console.log('保存日记:', { title, content });
    
    // 保存成功后返回情绪分析折线图页面
    router.push('/(tabs)');
  };

  // 返回情绪分析折线图页面
  const handleBack = () => {
    router.push('/(tabs)');
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
});