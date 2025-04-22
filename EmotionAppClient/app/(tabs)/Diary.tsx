import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { useTheme } from "@/utils/ThemeContext";
import { Colors } from "@/constants/Colors";

type DiaryStep = "weather" | "mood" | "activities" | "create";

// 定义天气选项（图标和标签）
const weatherOptions = [
  { id: "sunny", label: "晴朗", icon: "sunny-outline" },
  { id: "partly-cloudy", label: "多云", icon: "partly-sunny-outline" },
  { id: "cloudy", label: "阴天", icon: "cloud-outline" },
  { id: "rainy", label: "下雨", icon: "rainy-outline" },
  { id: "stormy", label: "雷雨", icon: "thunderstorm-outline" },
  { id: "snowy", label: "下雪", icon: "snow-outline" },
];

// 定义心情选项（表情和标签）
const moodOptions = [
  { id: "happy", label: "开心", emoji: "😊" },
  { id: "excited", label: "兴奋", emoji: "🤩" },
  { id: "calm", label: "平静", emoji: "😌" },
  { id: "tired", label: "疲惫", emoji: "😴" },
  { id: "sad", label: "难过", emoji: "😢" },
  { id: "angry", label: "生气", emoji: "😡" },
];

// 定义活动选项（图标和标签）
const activityOptions = [
  { id: "work", label: "工作", icon: "briefcase-outline" },
  { id: "study", label: "学习", icon: "book-outline" },
  { id: "exercise", label: "运动", icon: "fitness-outline" },
  { id: "social", label: "社交", icon: "people-outline" },
  { id: "entertainment", label: "娱乐", icon: "game-controller-outline" },
  { id: "rest", label: "休息", icon: "bed-outline" },
];

export default function DiaryScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentStep, setCurrentStep] = useState<DiaryStep>("weather");
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // 根据当前步骤计算进度值
  const getProgressValue = () => {
    switch (currentStep) {
      case "weather":
        return 0.33;
      case "mood":
        return 0.66;
      case "activities":
        return 1;
      default:
        return 0;
    }
  };

  // 处理活动选择（可多选）
  const toggleActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId)
      );
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  // 处理下一步导航
  const handleNext = () => {
    switch (currentStep) {
      case "weather":
        setCurrentStep("mood");
        break;
      case "mood":
        setCurrentStep("activities");
        break;
      case "activities":
        navigateToCreateDiary();
        break;
    }
  };

  // 跳过直接到创建日记
  const navigateToCreateDiary = () => {
    // 收集所有步骤的数据
    const diaryData = {
      weather: selectedWeather,
      mood: selectedMood,
      activities: selectedActivities,
    };

    // 在实际应用中，将这些数据传递给日记创建页面
    console.log("日记预设数据:", diaryData);

    // 导航到日记创建页面，并传递参数
    router.push({
      pathname: "/diary/create",
      params: {
        weather: selectedWeather || "",
        mood: selectedMood || "",
        activities: JSON.stringify(selectedActivities || []),
      },
    });
  };

  // 渲染进度条
  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${getProgressValue() * 100}%`,
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.progressText,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          {Math.round(getProgressValue() * 3)}/3
        </Text>
      </View>
    );
  };

  // 渲染天气选择页面
  const renderWeatherStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text
          style={[
            styles.questionText,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          今天天气如何？
        </Text>
        <View style={styles.optionsGrid}>
          {weatherOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selectedWeather === option.id && styles.selectedOption,
                selectedWeather === option.id && {
                  borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(10,126,164,0.1)",
                },
              ]}
              onPress={() => setSelectedWeather(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={
                  selectedWeather === option.id
                    ? isDark
                      ? Colors.dark.tint
                      : Colors.light.tint
                    : isDark
                    ? Colors.dark.icon
                    : Colors.light.icon
                }
              />
              <Text
                style={[
                  styles.optionText,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                  selectedWeather === option.id && {
                    color: isDark ? Colors.dark.tint : Colors.light.tint,
                    fontWeight: "bold",
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 渲染心情选择页面
  const renderMoodStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text
          style={[
            styles.questionText,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          今天的心情如何？
        </Text>
        <View style={styles.optionsGrid}>
          {moodOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selectedMood === option.id && styles.selectedOption,
                selectedMood === option.id && {
                  borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(10,126,164,0.1)",
                },
              ]}
              onPress={() => setSelectedMood(option.id)}
            >
              <Text style={styles.emojiText}>{option.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                  selectedMood === option.id && {
                    color: isDark ? Colors.dark.tint : Colors.light.tint,
                    fontWeight: "bold",
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 渲染活动选择页面
  const renderActivitiesStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text
          style={[
            styles.questionText,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          今天做了什么？
        </Text>
        <Text
          style={[
            styles.subText,
            { color: isDark ? Colors.dark.icon : Colors.light.icon },
          ]}
        >
          (可多选)
        </Text>
        <View style={styles.optionsGrid}>
          {activityOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                selectedActivities.includes(option.id) && styles.selectedOption,
                selectedActivities.includes(option.id) && {
                  borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(10,126,164,0.1)",
                },
              ]}
              onPress={() => toggleActivity(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={
                  selectedActivities.includes(option.id)
                    ? isDark
                      ? Colors.dark.tint
                      : Colors.light.tint
                    : isDark
                    ? Colors.dark.icon
                    : Colors.light.icon
                }
              />
              <Text
                style={[
                  styles.optionText,
                  { color: isDark ? Colors.dark.text : Colors.light.text },
                  selectedActivities.includes(option.id) && {
                    color: isDark ? Colors.dark.tint : Colors.light.tint,
                    fontWeight: "bold",
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 渲染底部按钮区域
  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <Button
          variant="outline"
          onPress={navigateToCreateDiary}
          style={styles.skipButton}
        >
          <ButtonText
            style={{ color: isDark ? Colors.dark.icon : Colors.light.icon }}
          >
            跳过
          </ButtonText>
        </Button>

        <Button
          onPress={handleNext}
          style={styles.nextButton}
          disabled={
            (currentStep === "weather" && selectedWeather === null) ||
            (currentStep === "mood" && selectedMood === null) ||
            (currentStep === "activities" && selectedActivities.length === 0)
          }
        >
          <ButtonText>
            {currentStep === "activities" ? "完成" : "下一步"}
          </ButtonText>
        </Button>
      </View>
    );
  };

  // 根据当前步骤渲染不同内容
  const renderStepContent = () => {
    switch (currentStep) {
      case "weather":
        return renderWeatherStep();
      case "mood":
        return renderMoodStep();
      case "activities":
        return renderActivitiesStep();
      default:
        return null;
    }
  };

  return (
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? Colors.dark.text : Colors.light.text },
            ]}
          >
            创建日记
          </Text>
          {renderProgressBar()}
        </View>

        {renderStepContent()}
      </ScrollView>

      {renderFooter()}
    </SafeAreaView>
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  optionItem: {
    width: 90,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    borderWidth: 2,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  emojiText: {
    fontSize: 32,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  skipButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 2,
  },
});
