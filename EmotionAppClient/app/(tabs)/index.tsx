import { Image, StyleSheet, Platform, TouchableOpacity, Dimensions, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'

import { HelloWave } from "@/components/HelloWave"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "../../components/ThemedView"
import { SafeAreaView } from "react-native"
import { useTheme } from "../../utils/ThemeContext"

// Import the EmotionTrendChart component
import EmotionTrendChart from "../../components/EmotionTrendChart"
import type { EmotionChartItem } from "../../utils/apiService"
import { getEmotionChart } from "../../utils/apiService"

import { useAuth } from "@/utils/AuthContext"

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  // Use the global theme context instead of local state
  const { theme, toggleTheme } = useTheme()
  
  const [chartData, setChartData] = useState<{
    year: { x: string; y: number }[];
    month: { x: string; y: number }[];
    week: { x: string; y: number }[];
  }>({
    year: [],
    month: [],
    week: []
  })

  const { user } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // Animation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start()

      return () => {
        fadeAnim.setValue(0)
        slideAnim.setValue(20)
      }
    }, [fadeAnim, slideAnim])
  )

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (!user) {
          console.error("用户信息未找到")
          return
        }

        console.log("Fetching chart data for user:", user)
        
        const [yearRes, monthRes, weekRes] = await Promise.all([
          getEmotionChart('year', user.userId),
          getEmotionChart('month', user.userId),
          getEmotionChart('week', user.userId),
        ])

        // 将后端返回的数据格式转换为 { x, y } 结构
        const convert = (list: EmotionChartItem[]) =>
          list.map(item => ({
            x: item.date,
            y: item.intensity
          }))

        setChartData({
          year: convert(yearRes),
          month: convert(monthRes),
          week: convert(weekRes),
        })
      } catch (error) {
        console.error("获取情绪图表数据失败：", error)
      }
    }

    fetchChartData()
  }, [user])

  // 获取当前日期和时间
  const getCurrentGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "早上好"
    if (hour < 18) return "下午好"
    return "晚上好"
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#C2D2EC", dark: "#DBE2F5"}}
      headerImage={
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.greeting}>
            {getCurrentGreeting()}!
          </ThemedText>
          <HelloWave />
        </ThemedView>
        
        <TouchableOpacity 
          style={[
            styles.themeToggle,
            { backgroundColor: theme === 'light' ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" }
          ]}
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
      
      <Animated.View style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        <ThemedView style={styles.card}>
          <ThemedView style={styles.cardHeader}>
            <ThemedText type="title" style={styles.cardTitle}>情绪趋势</ThemedText>
            <Ionicons 
              name="analytics-outline" 
              size={20} 
              color={theme === 'light' ? "#666" : "#BBB"} 
            />
          </ThemedView>
          
          <ThemedView style={styles.divider} />
          
          <SafeAreaView style={styles.chartContainer}>
            <EmotionTrendChart data={chartData} />
          </SafeAreaView>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedView style={styles.cardHeader}>
            <ThemedText type="title" style={styles.cardTitle}>今日提示</ThemedText>
            <Ionicons 
              name="bulb-outline" 
              size={20} 
              color={theme === 'light' ? "#666" : "#BBB"} 
            />
          </ThemedView>
          
          <ThemedView style={styles.divider} />
          
          <ThemedText style={styles.tipText}>
            定期记录你的情绪可以帮助你更好地了解自己的情绪模式，从而做出积极的改变。
          </ThemedText>
          
          <TouchableOpacity style={styles.createButton}>
            <ThemedText style={styles.createButtonText}>创建新日记</ThemedText>
            <Ionicons 
              name="add-circle-outline" 
              size={16} 
              color={theme === 'light' ? "#007AFF" : "#5AC8FA"} 
            />
          </TouchableOpacity>
        </ThemedView>
      </Animated.View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
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
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: 10,
  },
  chartContainer: {
    flex: 1,
  },
  tipText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    marginTop: 8,
    gap: 8,
  },
  createButtonText: {
    fontWeight: "500",
    color: "#007AFF",
  },
})
