import React from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Text,
} from "react-native";
import { useAuth } from "@/utils/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/utils/ThemeContext";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const DEFAULT_AVATAR =
  "https://image-1310707740.cos.ap-shanghai.myqcloud.com/emotion_app%2FR.jpg";
const { width } = Dimensions.get("window");

// Menu item component with improved styling
const MenuItem = ({
  icon,
  title,
  onPress,
  isDark,
  isLast = false,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  isDark: boolean;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.menuItem,
      {
        borderBottomColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.05)",
        borderBottomWidth: isLast ? 0 : 1,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <IconSymbol
          size={20}
          name={icon}
          color={isDark ? Colors.dark.tint : Colors.light.tint}
        />
      </View>
      <ThemedText style={styles.menuItemText}>{title}</ThemedText>
    </View>
    <IconSymbol
      size={16}
      name="chevron.right"
      color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)"}
    />
  </TouchableOpacity>
);

// Divider component for visual separation
const Divider = ({ isDark }: { isDark: boolean }) => (
  <View
    style={[
      styles.divider,
      {
        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      },
    ]}
  />
);

export default function UserScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const menuItems = [
    {
      id: "profile",
      title: "个人信息",
      icon: "person.fill",
      onPress: () => router.push("/profile/edit"),
    },
    {
      id: "emotion-knowledge",
      title: "情绪知识库",
      icon: "book.fill",
      onPress: () => router.push("/emotion-knowledge"),
    },
    {
      id: "emotion-square",
      title: "情绪广场",
      icon: "person.3.fill",
      onPress: () => router.push("/emotion-square"),
    },
    {
      id: "diary-list",
      title: "查看日记",
      icon: "book.fill",
      onPress: () => router.push("/diary/list"),
    },
    {
      id: "ai-assistant",
      title: "智能客服",
      icon: "bubble.left.fill",
      onPress: () => router.push("/ai-assistant"),
    },
    {
      id: "emotion-goals",
      title: "情绪目标",
      icon: "target",
      onPress: () => router.push("/emotion-goals"),
    },
    {
      id: "settings",
      title: "设置",
      icon: "gear",
      onPress: () => router.push("/settings"),
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
      edges={["top"]}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Gradient Header Background */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={isDark ? ["#9E74BD", "#CCC3DB"] : ["#8F8FFF", "#DAEDF4"]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: user?.img || DEFAULT_AVATAR }}
                  style={styles.avatar}
                />
                <View style={styles.avatarBadge} />
              </View>              <View style={styles.userInfo}>
                <Text style={[
                  styles.username,
                  { color: isDark ? "rgba(255,255,255,0.9)" : "rgba(21, 21, 21, 0.7)" }
                ]}>
                  {user?.username || "用户"}
                </Text>
                <View style={styles.emailContainer}>
                  <IconSymbol
                    size={12}
                    name="envelope.fill"
                    color={isDark ? "rgba(255,255,255,0.9)" : "rgba(27, 26, 26, 0.7)"}
                  />
                  <Text style={[
                    styles.email,
                    { color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)" }
                  ]}>
                    {user?.email || "user@example.com"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          <ThemedView style={styles.menuSection}>
            <ThemedText style={styles.sectionTitle}>账户与服务</ThemedText>

            {menuItems.slice(0, 4).map((item, index) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                onPress={item.onPress}
                isDark={isDark}
                isLast={index === 3}
              />
            ))}
          </ThemedView>

          {/* <Divider isDark={isDark} /> */}

          <ThemedView style={styles.menuSection}>
            <ThemedText style={styles.sectionTitle}>帮助与功能</ThemedText>

            {menuItems.slice(4).map((item, index) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                onPress={item.onPress}
                isDark={isDark}
                isLast={index === 2}
              />
            ))}
          </ThemedView>

          <ThemedView style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.logoutContent}>
                <IconSymbol
                  size={18}
                  name="rectangle.portrait.and.arrow.right"
                  color={isDark ? "#f87171" : "#ef4444"}
                />
                <ThemedText style={styles.logoutText}>退出登录</ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>EmotionAPP v1.0.0</ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
  },
  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4ade80",
    borderWidth: 2,
    borderColor: "white",
  },
  userInfo: {
    flex: 1,
  },  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    fontSize: 14,
    marginLeft: 6,
  },
  menuContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
  },
  menuSection: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  divider: {
    height: 8,
    marginVertical: 8,
    width: width - 32,
    borderRadius: 4,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutSection: {
    borderRadius: 16,
    marginVertical: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
