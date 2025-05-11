import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { HelloWave } from "@/components/HelloWave"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "../../components/ThemedView"
import { SafeAreaView } from "react-native"
import { useTheme } from "../../utils/ThemeContext"

import axios from 'axios';
import { useEffect, useState } from 'react';
import EmotionTrendChart from "../../components/EmotionTrendChart";

// Import the EmotionTrendChart component
import type { EmotionChartItem } from "../../utils/apiService";
import { getEmotionChart } from "../../utils/apiService";

export default function HomeScreen() {
  // Use the global theme context instead of local state
  const { theme, toggleTheme } = useTheme();
  
  const [chartData, setChartData] = useState<{
    year: { x: string; y: number }[];
    month: { x: string; y: number }[];
    week: { x: string; y: number }[];
  }>({
    year: [],
    month: [],
    week: []
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [yearRes, monthRes, weekRes] = await Promise.all([
          getEmotionChart('year'),
          getEmotionChart('month'),
          getEmotionChart('week'),
        ]);

        // 将后端返回的数据格式转换为 { x, y } 结构
        const convert = (list: EmotionChartItem[]) =>
          list.map(item => ({
            x: item.date,
            y: item.intensity
          }));

        setChartData({
          year: convert(yearRes),
          month: convert(monthRes),
          week: convert(weekRes),
        });
      } catch (error) {
        console.error("获取情绪图表数据失败：", error);
      }
    };

    fetchChartData();
  }, []);

  // 日期字符串 -> 图表展示用 label
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return `${date.getMonth() + 1}月`; // 只显示月份
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#DF49" }}
      headerImage={
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme"
        >
          <Ionicons 
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'} 
            size={24} 
            color={theme === 'light' ? "#000" : "#FFF"} 
          />
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="title">情绪趋势图</ThemedText>
        <SafeAreaView style={{ flex: 1 }}>
          {/* ✅ 传入 chartData */}
          <EmotionTrendChart data={chartData} />
        </SafeAreaView>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    marginTop: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
})
