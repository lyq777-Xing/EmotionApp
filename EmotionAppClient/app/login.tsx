import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/utils/AuthContext";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/utils/ThemeContext";
import { Button, ButtonText } from "@/components/ui/button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("错误", "请输入电子邮件和密码");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        console.log("Login success:", success);
        router.replace('/(tabs)');
      } else {
        Alert.alert("错误", "登录失败，请检查您的凭据");
      }
    } catch (error) {
      Alert.alert("错误", "登录时出错");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? Colors.dark.background
              : Colors.light.background,
          },
        ]}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.title,
                { color: isDark ? Colors.dark.text : Colors.light.text },
              ]}
            >
              EmotionAPP
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? Colors.dark.icon : Colors.light.icon },
              ]}
            >
              记录与分析您的心情
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                ]}
              >
                邮箱
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? "#333" : "#f5f5f5",
                    borderColor: isDark ? "#555" : "#e0e0e0",
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? Colors.dark.icon : Colors.light.icon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text },
                  ]}
                  placeholder="请输入您的邮箱"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                ]}
              >
                密码
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? "#333" : "#f5f5f5",
                    borderColor: isDark ? "#555" : "#e0e0e0",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={isDark ? Colors.dark.icon : Colors.light.icon}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? Colors.dark.text : Colors.light.text },
                  ]}
                  placeholder="请输入您的密码"
                  placeholderTextColor={isDark ? "#888" : "#999"}
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

            <Button
              onPress={handleLogin}
              isDisabled={isLoading}
              style={styles.loginButton}
            >
              <ButtonText>{isLoading ? "登录中..." : "登录"}</ButtonText>
            </Button>

            <View style={styles.registerContainer}>
              <Text
                style={[
                  styles.registerText,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                ]}
              >
                还没有账号？
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text
                  style={[
                    styles.registerLink,
                    { color: isDark ? Colors.dark.tint : Colors.light.tint },
                  ]}
                >
                  立即注册
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
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    height: "100%",
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
  },
  loginButton: {
    height: 50,
    marginTop: 10,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontSize: 15,
    marginRight: 5,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
