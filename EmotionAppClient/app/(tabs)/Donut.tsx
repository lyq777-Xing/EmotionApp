import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DonutChart from '../../components/EmotionDonutChart';
import axios from 'axios';
import CalendarHeatmap from "../../components/EmotionHeatmap";
import { useTheme } from '../../utils/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function DonutScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [emotionData, setEmotionData] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState<{ date: string; value: number }[]>([]);

    const getIntensityColor = (value: number) => {
        if (value === 0) return '#eee'; // light grey for no intensity
        if (value <= 0.2) return '#f8d9e1'; // soft light pink
        if (value <= 0.4) return '#f3a0c1'; // light pink
        if (value <= 0.6) return '#ec7a99'; // medium pink
        if (value <= 0.8) return '#e34e71'; // stronger pink
        return '#c21f45'; // deep pink
    };

    useEffect(() => {
        const fetchEmotionData = async () => {
            try {
                const userId = 1978;
                const response = await axios.get(`http://localhost:5081/api/analysis/chart/donut?userId=${userId}`);
                setEmotionData(response.data);
            } catch (error) {
                console.error('获取情绪分布数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchHeatmapData = async () => {
            try {
                const userId = 1978;
                const response = await axios.get(`http://localhost:5081/api/analysis/chart/month?userId=${userId}`);
                const convertedData = response.data.map((item: { date: string, intensity: number }) => ({
                    date: item.date,
                    value: item.intensity,
                }));
                setHeatmapData(convertedData);
            } catch (error) {
                console.error('获取情绪强度热力图数据失败:', error);
            }
        };

        fetchEmotionData();
        fetchHeatmapData();
    }, []);

    const getSuggestion = () => {
        const happy = emotionData.happy || 0;
        const sad = emotionData.sad || 0;

        if (happy === 0 && sad === 0) return "暂无足够的情绪数据进行分析~";

        return happy > sad
            ? "这周情绪保持不错呀 😊"
            : "这周情绪好像不太好，下周记得多多调节 🧘‍♂️";
    };

    const getEmoji = () => {
        const happy = emotionData.happy || 0;
        const sad = emotionData.sad || 0;
        
        if (happy === 0 && sad === 0) return "🤔";
        return happy > sad ? "😊" : "🙂";
    };

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, isDark && styles.textDark]}>情绪分析</Text>
                <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{getEmoji()}</Text>
                </View>
            </View>
            
            <View style={[styles.chartContainer, isDark && styles.chartContainerDark]}>
                <Text style={[styles.title, isDark && styles.textDark]}>近七天情绪分布图</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={isDark ? "#7EB6FF" : "#007AFF"} style={styles.loader} />
                ) : Object.keys(emotionData).length > 0 ? (
                    <>
                        <DonutChart data={emotionData} />
                        <View style={[styles.card, isDark && styles.cardDark]}>
                            <Ionicons 
                                name="bulb-outline" 
                                size={24} 
                                color={isDark ? "#FFD700" : "#FF9500"} 
                                style={styles.suggestionIcon}
                            />
                            <Text style={[styles.suggestion, isDark && styles.textDark]}>{getSuggestion()}</Text>
                        </View>
                    </>
                ) : (
                    <Text style={[styles.noData, isDark && styles.textDark]}>暂无数据</Text>
                )}
            </View>

            <View style={[styles.heatmapContainer, isDark && styles.chartContainerDark]}>
                <Text style={[styles.title, isDark && styles.textDark]}>近30天情绪强度</Text>
                <CalendarHeatmap
                    data={heatmapData}
                    valueLabel="强度"
                    getColor={getIntensityColor}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    containerDark: {
        backgroundColor: '#1c1c1c',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    emojiContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 28,
    },
    chartContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    chartContainerDark: {
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        padding: 10,
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    textDark: {
        color: '#f5f5f5',
    },
    loader: {
        marginTop: 40,
    },
    noData: {
        marginTop: 20,
        color: '#999',
        fontSize: 16,
    },
    card: {
        marginTop: 30,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#f9f9e1',
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignItems: 'center',
    },
    cardDark: {
        backgroundColor: '#3c3c3c',
    },
    suggestionIcon: {
        marginBottom: 10,
    },
    suggestion: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
        fontStyle: 'italic',
    },
    heatmapContainer: {
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
});
