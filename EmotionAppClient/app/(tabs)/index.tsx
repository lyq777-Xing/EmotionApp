import { Image, StyleSheet, Platform } from "react-native"

import { HelloWave } from "@/components/HelloWave"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "../../components/ThemedView"
import { SafeAreaView } from "react-native"


import axios from 'axios';
import { useEffect, useState } from 'react';
import EmotionTrendChart from "../../components/EmotionTrendChart";

export default function HomeScreen() {
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
        const userId = 1978; // 或从用户状态中获取
        const [yearRes, monthRes, weekRes] = await Promise.all([
          axios.get(`http://localhost:5081/api/analysis/chart/year?userId=${userId}`),
          axios.get(`http://localhost:5081/api/analysis/chart/month?userId=${userId}`),
          axios.get(`http://localhost:5081/api/analysis/chart/week?userId=${userId}`)
        ]);

        // 将后端返回的数据格式转换为 { x, y } 结构
        const convert = (list: { date: string, intensity: number }[]) =>
          list.map(item => ({
            x: item.date,
            y: item.intensity
          }));

        setChartData({
          year: convert(yearRes.data),
          month: convert(monthRes.data),
          week: convert(weekRes.data),
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
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getMonth() + 1}月`; // 只显示月份
  };



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
})
