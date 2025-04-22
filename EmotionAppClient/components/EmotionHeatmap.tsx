// 热力图组件
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';

type HeatmapEntry = {
  date: string;
  value: number;
};

type Props = {
  data: HeatmapEntry[];
  getColor?: (value: number) => string;
  valueLabel?: string;
};

const CalendarHeatmap: React.FC<Props> = ({ data, getColor, valueLabel }) => {
  const { theme } = useTheme();
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const iso = d.toISOString().split('T')[0];
    const match = data.find(item => item.date === iso);
    return {
      date: iso,
      value: match ? match.value : 0,
    };
  });

  // 默认颜色方案（适用于 count 或强度 0~10）
  const defaultGetColor = (val: number) => {
    if (val === 0) return '#eee';
    if (val < 2) return '#c6e48b';
    if (val < 4) return '#7bc96f';
    if (val < 6) return '#239a3b';
    return '#196127';
  };

  const renderColor = getColor || defaultGetColor;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {last30Days.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              { backgroundColor: renderColor(item.value) },
            ]}
          />
        ))}
      </View>
      {valueLabel && (
        <Text style={[
          styles.labelHint,
          { color: theme === 'dark' ? Colors.dark.icon : Colors.light.icon }
        ]}>
          单位：{valueLabel}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 210,
  },
  cell: {
    width: 20,
    height: 20,
    margin: 2,
    borderRadius: 4,
  },
  labelHint: {
    marginTop: 6,
    fontSize: 12,
  },
});

export default CalendarHeatmap;
