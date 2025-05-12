// EmotionTrendChart.tsx
import type React from "react";
import { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { Platform } from "react-native";
import { useTheme } from "@/utils/ThemeContext";
import { Colors } from "@/constants/Colors";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";

const { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } =
  Platform.OS === "web" ? require("victory") : require("victory-native");

// 获取屏幕宽度用于自适应
const { width: screenWidth } = Dimensions.get("window");

// 定义 props 类型
type EmotionTrendChartProps = {
  data: {
    year: { x: string; y: number }[];
    month: { x: string; y: number }[];
    week: { x: string; y: number }[];
  };
};

// web端与手机端不同的主题
// web端使用 material 主题，手机端使用默认主题
const theme = Platform.select({
  web: require("victory").VictoryTheme.material,
  default: undefined,
});

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState<"year" | "month" | "week">(
    "month"
  );
  const { theme: appTheme } = useTheme();
  const lineColor = appTheme === "dark" ? Colors.dark.tint : Colors.light.tint;

  return (
    <View style={{ padding: 10 }}>
      <VictoryChart 
        domain={{ y: [0, 1] }}
        height={280} 
        width={screenWidth - 60}
        padding={{ top: 20, bottom: 50, left: 45, right: 20 }}
        style={{
          parent: {
            marginBottom: 10,
          }
        }}
      >
        {/* X轴 */}
        <VictoryAxis
          tickFormat={(x: string, index: number, ticks: string[]) => {
            const date = new Date(x);
            if (Number.isNaN(date.getTime())) return x;

            if (timeFrame === "month" || timeFrame === "year") {
              const currentMonth = date.getMonth() + 1;
              const currentYear = date.getFullYear();

              // 找这个点是否是这个月第一次出现
              const isFirstOfMonth =
                index === 0 ||
                (() => {
                  for (let i = 0; i < index; i++) {
                    const prevDate = new Date(ticks[i]);
                    if (
                      prevDate.getFullYear() === currentYear &&
                      prevDate.getMonth() + 1 === currentMonth
                    ) {
                      return false;
                    }
                  }
                  return true;
                })();

              return isFirstOfMonth ? `${currentMonth}月` : "";
            }

            // 按周显示：显示 "MM/DD"
            if (timeFrame === "week") {
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }

            return x;
          }}
          style={{
            tickLabels: {
              angle: -30,
              fontSize: 11,
              fill: appTheme === "dark" ? Colors.dark.text : Colors.light.text,
              padding: 5,
            },
            tickSize: 0, // 这里移除刻度线
            axis: {
              stroke:
                appTheme === "dark" ? Colors.dark.icon : Colors.light.icon,
              strokeWidth: 1.5,
            },
          }}
          grid={false} // 禁用网格线
        />
        {/* Y轴 */}
        <VictoryAxis
          dependentAxis
          grid={false}
          style={{
            tickLabels: {
              fontSize: 11,
              padding: 5,
              fill: appTheme === "dark" ? Colors.dark.text : Colors.light.text,
            },
            axis: {
              stroke:
                appTheme === "dark" ? Colors.dark.icon : Colors.light.icon,
              strokeWidth: 1.5,
            },
          }}
        />

        {/* 折线 */}
        <VictoryLine
          data={data[timeFrame]}
          grid={false}
          style={{ 
            data: { 
              stroke: lineColor,
              strokeWidth: 2.5,  // 增加线条粗细
            } 
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 5,
          marginBottom: 10,
        }}
      >
        <Button 
          onPress={() => setTimeFrame("year")} 
          action="secondary"
          style={{
            backgroundColor: timeFrame === "year" 
              ? (appTheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)") 
              : undefined
          }}
        >
          <ButtonText>按年</ButtonText>
        </Button>
        <Button 
          onPress={() => setTimeFrame("month")} 
          action="secondary"
          style={{
            backgroundColor: timeFrame === "month" 
              ? (appTheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)") 
              : undefined
          }}
        >
          <ButtonText>按月</ButtonText>
        </Button>
        <Button 
          onPress={() => setTimeFrame("week")} 
          action="secondary"
          style={{
            backgroundColor: timeFrame === "week" 
              ? (appTheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)") 
              : undefined
          }}
        >
          <ButtonText>按周</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default EmotionTrendChart;
