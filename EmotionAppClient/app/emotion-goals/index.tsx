import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Button, ButtonText } from '@/components/ui/button';

type GoalPeriod = 'week' | 'month' | 'year';

type Goal = {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
};

export default function EmotionGoalsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activePeriod, setActivePeriod] = useState<GoalPeriod>('week');
  const [newGoal, setNewGoal] = useState('');
  
  // Goals for different time periods
  const [weeklyGoals, setWeeklyGoals] = useState<Goal[]>([
    { id: '1', text: '每天记录心情日记', completed: false, date: new Date() },
    { id: '2', text: '每周进行2次情绪分析', completed: false, date: new Date() },
  ]);
  
  const [monthlyGoals, setMonthlyGoals] = useState<Goal[]>([
    { id: '3', text: '保持积极情绪占比>60%', completed: false, date: new Date() },
    { id: '4', text: '尝试3种新的情绪调节方法', completed: false, date: new Date() },
  ]);
  
  const [yearlyGoals, setYearlyGoals] = useState<Goal[]>([
    { id: '5', text: '情绪稳定度提高20%', completed: false, date: new Date() },
    { id: '6', text: '掌握5种高效的情绪管理技巧', completed: false, date: new Date() },
  ]);

  // 根据当前选择的时间段返回对应的目标列表
  const currentGoals = () => {
    switch(activePeriod) {
      case 'week': return weeklyGoals;
      case 'month': return monthlyGoals;
      case 'year': return yearlyGoals;
      default: return weeklyGoals;
    }
  };

  // 添加新目标
  const addGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoal,
      completed: false,
      date: new Date()
    };
    
    switch(activePeriod) {
      case 'week': 
        setWeeklyGoals([...weeklyGoals, goal]);
        break;
      case 'month':
        setMonthlyGoals([...monthlyGoals, goal]);
        break;
      case 'year':
        setYearlyGoals([...yearlyGoals, goal]);
        break;
    }
    
    setNewGoal('');
  };

  // 切换目标完成状态
  const toggleGoal = (id: string) => {
    switch(activePeriod) {
      case 'week': 
        setWeeklyGoals(weeklyGoals.map(goal => 
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
        break;
      case 'month':
        setMonthlyGoals(monthlyGoals.map(goal => 
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
        break;
      case 'year':
        setYearlyGoals(yearlyGoals.map(goal => 
          goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
        break;
    }
  };

  // 删除目标
  const deleteGoal = (id: string) => {
    switch(activePeriod) {
      case 'week': 
        setWeeklyGoals(weeklyGoals.filter(goal => goal.id !== id));
        break;
      case 'month':
        setMonthlyGoals(monthlyGoals.filter(goal => goal.id !== id));
        break;
      case 'year':
        setYearlyGoals(yearlyGoals.filter(goal => goal.id !== id));
        break;
    }
  };

  // 计算目标完成率
  const completionRate = () => {
    const goals = currentGoals();
    if (goals.length === 0) return 0;
    
    const completedCount = goals.filter(goal => goal.completed).length;
    return Math.round((completedCount / goals.length) * 100);
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
    ]}>
      <View style={styles.header}>
        <Button
          variant="link"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? Colors.dark.text : Colors.light.text} 
          />
          <ButtonText style={{ color: isDark ? Colors.dark.text : Colors.light.text }}>
            返回
          </ButtonText>
        </Button>
        <Text style={[
          styles.headerTitle,
          { color: isDark ? Colors.dark.text : Colors.light.text }
        ]}>
          情绪目标设定
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[
        styles.periodSelector,
        { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }
      ]}>
        <TouchableOpacity 
          style={[
            styles.periodTab,
            activePeriod === 'week' && (isDark ? styles.activeTabDark : styles.activeTab)
          ]} 
          onPress={() => setActivePeriod('week')}
        >
          <Text style={[
            styles.periodText,
            activePeriod === 'week' && styles.activeText,
            isDark && { color: activePeriod !== 'week' ? '#aaa' : '#fff' }
          ]}>一周目标</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.periodTab,
            activePeriod === 'month' && (isDark ? styles.activeTabDark : styles.activeTab)
          ]} 
          onPress={() => setActivePeriod('month')}
        >
          <Text style={[
            styles.periodText,
            activePeriod === 'month' && styles.activeText,
            isDark && { color: activePeriod !== 'month' ? '#aaa' : '#fff' }
          ]}>一个月目标</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.periodTab,
            activePeriod === 'year' && (isDark ? styles.activeTabDark : styles.activeTab)
          ]} 
          onPress={() => setActivePeriod('year')}
        >
          <Text style={[
            styles.periodText,
            activePeriod === 'year' && styles.activeText,
            isDark && { color: activePeriod !== 'year' ? '#aaa' : '#fff' }
          ]}>一年目标</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[
          styles.statsCard,
          { backgroundColor: isDark ? '#2c2c2c' : '#fff' }
        ]}>
          <Text style={[
            styles.statTitle,
            { color: isDark ? '#ddd' : '#333' }
          ]}>目标完成率</Text>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${completionRate()}%` },
                { backgroundColor: completionRate() > 50 ? '#4caf50' : '#ff9800' }
              ]} 
            />
          </View>
          <Text style={[
            styles.statValue,
            { color: isDark ? '#fff' : '#333' }
          ]}>{completionRate()}%</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { 
                color: isDark ? '#fff' : '#333',
                backgroundColor: isDark ? '#444' : '#f5f5f5',
                borderColor: isDark ? '#555' : '#ddd'
              }
            ]}
            placeholder="添加新的情绪目标..."
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <TouchableOpacity 
            style={[
              styles.addButton,
              { backgroundColor: isDark ? '#3a7bbf' : '#007AFF' }
            ]}
            onPress={addGoal}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.goalsContainer}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#ddd' : '#333' }
        ]}>
          {activePeriod === 'week' ? '本周目标' : 
           activePeriod === 'month' ? '本月目标' : '今年目标'}
        </Text>
        
        {currentGoals().length === 0 ? (
          <Text style={[
            styles.emptyText,
            { color: isDark ? '#aaa' : '#999' }
          ]}>
            暂无目标，添加一个新目标开始吧！
          </Text>
        ) : (
          currentGoals().map((goal) => (
            <View 
              key={goal.id} 
              style={[
                styles.goalItem,
                { backgroundColor: isDark ? '#3c3c3c' : '#fff' }
              ]}
            >
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => toggleGoal(goal.id)}
              >
                {goal.completed ? (
                  <Ionicons name="checkmark-circle" size={24} color={isDark ? "#4CAF50" : "#4CAF50"} />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color={isDark ? "#ddd" : "#999"} />
                )}
              </TouchableOpacity>
              
              <Text style={[
                styles.goalText,
                goal.completed && styles.completed,
                { color: isDark ? '#ddd' : '#333' }
              ]}>
                {goal.text}
              </Text>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteGoal(goal.id)}
              >
                <Ionicons name="trash-outline" size={22} color={isDark ? "#ff6b6b" : "#ff6b6b"} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#e6f2ff',
  },
  activeTabDark: {
    backgroundColor: '#1e3a5f',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    padding: 16,
  },
  statsCard: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
});