// 情绪分析饼状图
// EmotionDonutChart.tsx
import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, Animated } from "react-native";
import { Svg } from "react-native-svg";
import { useTheme } from "@/utils/ThemeContext";
import { Colors } from "@/constants/Colors";

const { VictoryPie } =
  Platform.OS === "web" ? require("victory") : require("victory-native");

type EmotionData = {
  [key: string]: string | number;
};

type DonutChartProps = {
  data: EmotionData;
  width?: number;
  height?: number;
  innerRadius?: number;
};

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 80,
}) => {
  const { theme } = useTheme();
  const chartData = Object.entries(data).map(([key, value]) => ({
    x: key,
    y: typeof value === "string" ? parseFloat(value) : value,
  }));

  const total = chartData.reduce((sum, item) => sum + item.y, 0);

  // 添加 Animated 中心数字动画
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: total,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [total]);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.round(value));
    });
    return () => animatedValue.removeListener(listener);
  }, [animatedValue]);

  return (
    <View
      style={{ width, height, justifyContent: "center", alignItems: "center" }}
    >
      <Svg width={width} height={height}>
        <VictoryPie
          standalone={false}
          animate={{ duration: 1200, easing: "exp" }}
          data={chartData}
          width={width}
          height={height}
          innerRadius={innerRadius}
          labels={({ datum }: { datum: { x: string; y: number } }) =>
            `${datum.x}\n${datum.y}`
          }
          style={{
            labels: {
              fontSize: 12,
              fill: theme === "dark" ? Colors.dark.tint : Colors.light.tint,
              textAlign: "center",
            },
          }}
          colorScale={["#FFD700", "#87CEFA", "#FF6347", "#98FB98", "#DDA0DD"]}
        />
      </Svg>
      <View style={styles.centerTextContainer}>
        <Text
          style={[
            styles.centerText,
            { color: theme === "dark" ? Colors.dark.tint : Colors.light.tint },
          ]}
        >
          {displayValue}
        </Text>
        <Text style={styles.centerLabel}>总记录情绪次数</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  centerLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});

export default DonutChart;
