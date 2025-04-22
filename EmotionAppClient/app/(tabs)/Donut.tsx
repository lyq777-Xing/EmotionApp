import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import DonutChart from '../../components/EmotionDonutChart';
import axios from 'axios';
import CalendarHeatmap from "../../components/EmotionHeatmap";

export default function DonutScreen() {
    const [emotionData, setEmotionData] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState<{ date: string; value: number }[]>([]);

    // const getIntensityColor = (value: number) => {
    //     if (value === 0) return '#eee';
    //     if (value <= 0.2) return '#cfe2f3';
    //     if (value <= 0.4) return '#9fc5e8';
    //     if (value <= 0.6) return '#6fa8dc';
    //     if (value <= 0.8) return '#3d85c6';
    //     return '#073763';
    // };
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

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <Text style={styles.title}>近七天情绪分布图</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                ) : Object.keys(emotionData).length > 0 ? (
                    <>
                        <DonutChart data={emotionData} />
                        <View style={styles.card}>
                            <Text style={styles.suggestion}>{getSuggestion()}</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noData}>暂无数据</Text>
                )}
            </View>

            <View style={styles.heatmapContainer}>
                <Text style={styles.title}>近30天情绪强度</Text>
                <CalendarHeatmap
                    data={heatmapData}
                    // title="近30天情绪强度"
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
    chartContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
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
