import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/utils/AuthContext';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/utils/ThemeContext';
import { Button, ButtonText } from '@/components/ui/button';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleRegister = async () => {
    // Validation
    if (!username || !email || !password) {
      Alert.alert('错误', '请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不匹配');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('错误', '请输入有效的电子邮件地址');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(username, email, password);
      if (success) {
        Alert.alert('成功', '注册成功，请登录', [
          {
            text: '确定',
            onPress: () => router.replace('/login')
          }
        ]);
      } else {
        Alert.alert('错误', '注册失败，请稍后再试');
      }
    } catch (error) {
      Alert.alert('错误', '注册时出错');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
      ]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={isDark ? Colors.dark.text : Colors.light.text} 
              />
              <Text style={[
                styles.backText,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>返回</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={[
                styles.headerTitle,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>创建账户</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                用户名
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: isDark ? '#333' : '#f5f5f5',
                  borderColor: isDark ? '#555' : '#e0e0e0' 
                }
              ]}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? Colors.dark.icon : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text }
                  ]}
                  placeholder="请输入用户名"
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                邮箱
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: isDark ? '#333' : '#f5f5f5',
                  borderColor: isDark ? '#555' : '#e0e0e0' 
                }
              ]}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={isDark ? Colors.dark.icon : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text }
                  ]}
                  placeholder="请输入邮箱"
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                密码
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: isDark ? '#333' : '#f5f5f5',
                  borderColor: isDark ? '#555' : '#e0e0e0' 
                }
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isDark ? Colors.dark.icon : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text }
                  ]}
                  placeholder="请输入密码"
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={isDark ? Colors.dark.icon : Colors.light.icon} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.label,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                确认密码
              </Text>
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: isDark ? '#333' : '#f5f5f5',
                  borderColor: isDark ? '#555' : '#e0e0e0' 
                }
              ]}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isDark ? Colors.dark.icon : Colors.light.icon} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text }
                  ]}
                  placeholder="请再次输入密码"
                  placeholderTextColor={isDark ? '#888' : '#999'}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <Button
              onPress={handleRegister}
              isDisabled={isLoading}
              style={styles.registerButton}
            >
              <ButtonText>{isLoading ? '注册中...' : '注册'}</ButtonText>
            </Button>

            <View style={styles.loginContainer}>
              <Text style={[
                styles.loginText,
                { color: isDark ? Colors.dark.text : Colors.light.text }
              ]}>
                已有账号？
              </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={[
                  styles.loginLink,
                  { color: isDark ? Colors.dark.tint : Colors.light.tint }
                ]}>
                  立即登录
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // To offset the back button and center the title
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
  },
  registerButton: {
    height: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
    marginRight: 5,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});