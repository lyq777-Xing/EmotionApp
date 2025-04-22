// EmotionTrendChart.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Platform } from 'react-native';
const {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
} = Platform.OS === 'web' ? require('victory') : require('victory-native');

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
  web: require('victory').VictoryTheme.material,
  default: undefined,
});

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState<'year' | 'month' | 'week'>('month');


  return (
    <View style={{ padding: 20 }}>
      {/* <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        情绪趋势图（按{timeFrame === 'year' ? '年' : timeFrame === 'month' ? '月' : '周'}）
      </Text> */}

      <VictoryChart domain={{ y: [0, 1] }}>
        {/* X轴 */}
        <VictoryAxis
          tickFormat={(x: string, index: number, ticks: string[]) => {
            const date = new Date(x);
            if (isNaN(date.getTime())) return x;

            if (timeFrame === 'month' || timeFrame === 'year') {
              const currentMonth = date.getMonth() + 1;
              const currentYear = date.getFullYear();

              // 找这个点是否是这个月第一次出现
              const isFirstOfMonth = index === 0 || (() => {
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

              return isFirstOfMonth ? `${currentMonth}月` : '';
            }

            // 按周显示：显示 "MM/DD"
            if (timeFrame === 'week') {
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }

            return x;
          }}
          style={{
            tickLabels: { angle: -30, fontSize: 10 },
            tickSize: 0, // 这里移除刻度线
            // grid: { stroke: "#dcdcdc", strokeDasharray: "5,5" }, // X轴的虚线
          }}
          // tickValues={getTickValues(data[timeFrame])} // 使用动态生成的刻度位置
          grid={false} // 禁用网格线
        />
        {/* Y轴 */}
        <VictoryAxis dependentAxis grid={false} />

        {/* 折线 */}
        <VictoryLine
          data={data[timeFrame]}
          grid={false}
          style={{ data: { stroke: "#4f8ef7" } }}
        />
      </VictoryChart>


      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
        <Button title="按年" onPress={() => setTimeFrame('year')} />
        <Button title="按月" onPress={() => setTimeFrame('month')} />
        <Button title="按周" onPress={() => setTimeFrame('week')} />
      </View>
    </View>
  );
};

export default EmotionTrendChart;
