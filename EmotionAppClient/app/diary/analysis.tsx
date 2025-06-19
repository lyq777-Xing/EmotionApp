import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { useTheme } from "@/utils/ThemeContext";
import { Colors } from "@/constants/Colors";
import axios from "axios";

type AnalysisResponse = {
  authorName: string;
  role: {
    label: string;
  };
  items: {
    $type: string;
    text: string;
    modelId: string;
  }[];
  modelId: string;
};

type KnowledgeRecommendation = {
  id: number;
  emotionCategory: number;
  emotionIntensity: number;
  recommendedAction: string;
  psychologicalBasis: string;
  contentType: string;
  contentUrl: string | null;
  targetNeeds: string;
  description: string;
};

export default function DiaryAnalysisScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 获取路由参数
  // 使用 useLocalSearchParams 获取参数
  const params = useLocalSearchParams();

  // 从前一个页面获取情绪分析结果
  // 使用 useState Hook 来定义组件的状态。
  // 定义一个状态变量来存储情绪类型  初始值： 0
  const [emotion, setEmotion] = useState(0); 
  const [intensity, setIntensity] = useState(0.55);
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [loading, setLoading] = useState(false);
  // 作用： 控制分析类型的选择
  const [analysisType, setAnalysisType] = useState<"none" | "abc" | "maslow">(
    "none"
  );
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  // 情绪知识推荐相关状态
  const [recommendations, setRecommendations] = useState<
    KnowledgeRecommendation[]
  >([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  // 添加标记以防止重复请求
  const [hasRequestedRecommendations, setHasRequestedRecommendations] = useState(false);
  // 添加参数有效性标记
  const [hasValidParams, setHasValidParams] = useState(false);// 在组件加载时处理参数
  useEffect(() => {
    console.log('收到的所有参数:', params);
    console.log('参数类型检查:', {
      emotion: typeof params.emotion,
      intensity: typeof params.intensity,
      content: typeof params.content,
      title: typeof params.title
    });
    
    // 检查是否使用 result 字符串传递参数（旧方式）
    if (params.result) {
      try {
        const resultObj = JSON.parse(params.result as string);
        console.log('解析的result对象:', resultObj);
          // 处理情绪类型，支持多种情绪值
        const emotionValue = Number.parseInt(String(resultObj.emotion), 10);
        if (!Number.isNaN(emotionValue)) {
          setEmotion(emotionValue);
        }
        
        // 处理情绪强度，确保在合理范围内
        const intensityValue = Number.parseFloat(String(resultObj.intensity));
        if (!Number.isNaN(intensityValue)) {
          setIntensity(Math.max(0, Math.min(1, intensityValue))); // 限制在0-1之间
        }setDiaryContent(String(resultObj.content || ""));
        setDiaryTitle(String(resultObj.title || ""));
        
        // 标记参数有效
        setHasValidParams(true);
          // 参数解析完成后，立即调用API获取推荐
        if (!hasRequestedRecommendations && (!Number.isNaN(emotionValue) || !Number.isNaN(intensityValue))) {
          fetchKnowledgeRecommendations(
            Number.isNaN(emotionValue) ? 0 : emotionValue, 
            Number.isNaN(intensityValue) ? 0.5 : intensityValue
          );
        }
      } catch (error) {
        console.error("解析 result 参数失败:", error);
        // 标记参数无效
        setHasValidParams(false);
      }
    } else if (params.emotion || params.intensity || params.content || params.title) {
      // 直接从单独的参数获取（新方式）
      console.log('使用新方式获取参数');
      
      try {        // 处理情绪类型 - 更健壮的转换
        let emotionValue: number | undefined;
        if (params.emotion !== undefined && params.emotion !== null) {
          if (typeof params.emotion === 'string') {
            emotionValue = Number.parseInt(params.emotion, 10);
          } else if (typeof params.emotion === 'number') {
            emotionValue = params.emotion;
          } else {
            // 如果是其他类型，尝试转换为字符串再解析
            emotionValue = Number.parseInt(String(params.emotion), 10);
          }
        }
        if (emotionValue !== undefined && !Number.isNaN(emotionValue)) {
          setEmotion(emotionValue);
        }
        
        // 处理情绪强度 - 更健壮的转换
        let intensityValue: number | undefined;
        if (params.intensity !== undefined && params.intensity !== null) {
          if (typeof params.intensity === 'string') {
            intensityValue = Number.parseFloat(params.intensity);
          } else if (typeof params.intensity === 'number') {
            intensityValue = params.intensity;
          } else {
            // 如果是其他类型，尝试转换为字符串再解析
            intensityValue = Number.parseFloat(String(params.intensity));
          }
        }
        if (intensityValue !== undefined && !Number.isNaN(intensityValue)) {
          setIntensity(Math.max(0, Math.min(1, intensityValue))); // 限制在0-1之间
        }
        
        // 处理内容和标题
        setDiaryContent(String(params.content || ""));
        setDiaryTitle(String(params.title || ""));        console.log('最终设置的值:', {
          emotion: emotionValue,
          intensity: intensityValue,
          content: String(params.content || ""),
          title: String(params.title || "")
        });
        
        // 标记参数有效
        setHasValidParams(true);
        
        // 参数解析完成后，立即调用API获取推荐
        if (!hasRequestedRecommendations && (emotionValue !== undefined || intensityValue !== undefined)) {
          fetchKnowledgeRecommendations(emotionValue || 0, intensityValue || 0.5);
        }
      } catch (error) {
        console.error("解析参数失败:", error);
        // 标记参数无效
        setHasValidParams(false);
      }
    } else {
      console.log('没有收到任何有效参数');
      // 标记参数无效
      setHasValidParams(false);
    }
  }, [params, hasRequestedRecommendations]); // 此useEffect只处理参数解析，不再调用API  // 单独的useEffect处理API调用
  useEffect(() => {
    // 使用 hasValidParams 来判断是否应该调用API
    if (!hasRequestedRecommendations && hasValidParams) {
      console.log('触发API调用，当前状态:', { emotion, intensity, hasRequestedRecommendations, hasValidParams });
      fetchKnowledgeRecommendations();
    }
  }, [emotion, intensity, hasRequestedRecommendations, hasValidParams]); // 依赖于相关状态的值变化

  // 处理返回主页
  const handleBack = () => {
    router.push("/(tabs)");
  };  // 获取情绪知识推荐
  const fetchKnowledgeRecommendations = async (emotionValue?: number, intensityValue?: number) => {
    setLoadingRecommendations(true);
    
    // 使用传入的参数或当前状态值
    const currentEmotion = emotionValue !== undefined ? emotionValue : emotion;
    const currentIntensity = intensityValue !== undefined ? intensityValue : intensity;
    
    try {
      console.log('发送推荐请求参数:', {
        category: currentEmotion,
        intensity: currentIntensity,
        来源: emotionValue !== undefined ? '传入参数' : '当前状态'
      });
      
      // 从后端获取数据，参数格式: /api/EmotionKnowledge/recommend?category=0&intensity=0.5
      // category直接使用从create.tsx传过来的emotion值
      const response = await axios.get(
        "http://localhost:5081/api/EmotionKnowledge/recommend",
        {
          params: {
            category: currentEmotion,
            intensity: currentIntensity,
          },
        }
      );      console.log('推荐API响应:', response.data);
      console.log('第一个推荐项详情:', response.data[0]);
      if (response.data[0]) {
        console.log('emotionCategory字段:', response.data[0].emotionCategory, typeof response.data[0].emotionCategory);
        console.log('emotionIntensity字段:', response.data[0].emotionIntensity, typeof response.data[0].emotionIntensity);
      }
        // 对API响应数据进行类型规范化
      const normalizedRecommendations = response.data.map((rec: Record<string, unknown>) => ({
        ...rec,
        emotionCategory: typeof rec.emotionCategory === 'string' 
          ? Number.parseInt(rec.emotionCategory, 10) 
          : rec.emotionCategory,
        emotionIntensity: typeof rec.emotionIntensity === 'string'
          ? Number.parseFloat(rec.emotionIntensity)
          : rec.emotionIntensity
      })) as KnowledgeRecommendation[];
      
      console.log('规范化后的推荐数据:', normalizedRecommendations[0]);
      setRecommendations(normalizedRecommendations);
      setHasRequestedRecommendations(true); // 设置标记为已请求
    } catch (error) {
      console.error("获取情绪知识推荐失败:", error);
      if (axios.isAxiosError(error)) {
        console.error("API错误详情:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // 处理链接点击
  const handleUrlPress = (url: string | null) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("无法打开链接:", err));
    }
  };

  // 执行ABC情绪调节分析
  const handleAbcAnalysis = async () => {
    setLoading(true);
    setAnalysisType("abc");
    try {
      // 尝试调用 gemma3 的 ABC 接口
      const response = await axios.get("http://localhost:5081/api/gemma3", {
        params: {
          theory: "abc",
          context: diaryContent,
        },
      });

      // 保存完整的 JSON 响应，仅用于调试
      console.log("ABC分析响应:", JSON.stringify(response.data));

      // 提取文本用于显示
      setAnalysisResult(response.data.items[0].text);
    } catch (error) {
      console.error("ABC分析请求失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 执行马斯洛需求分析
  const handleMaslowAnalysis = async () => {
    setLoading(true);
    setAnalysisType("maslow");
    try {
      // 尝试调用标准的马斯洛接口
      const response = await axios.get("http://localhost:5081/api/gemma3", {
        params: {
          theory: "maslow",
          context: diaryContent,
        },
      });

      // 保存完整的 JSON 响应，仅用于调试
      console.log("马斯洛分析响应:", JSON.stringify(response.data));

      // 提取文本用于显示
      setAnalysisResult(response.data.items[0].text);
    } catch (error) {
      console.error("马斯洛分析请求失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化分析结果，处理换行符和列表格式
  const formatAnalysisText = (text: string) => {
    // 将Markdown风格的文本按段落和列表项分割
    const paragraphs = text.split("\n\n");

    return (
      <View>
        {paragraphs.map((paragraph, index) => {
          if (paragraph.includes("*   ") || paragraph.includes("*  ")) {
            // 处理列表
            const listItems = paragraph.split("\n");
            return (
              <View key={`para-${index}`} style={styles.paragraphContainer}>
                {listItems.map((item, itemIndex) => {
                  if (item.includes("*   ") || item.includes("*  ")) {
                    const content = item.replace(/^\s*\*\s*/, "");
                    return (
                      <View key={`item-${item.substring(0, 10)}-${index}-${itemIndex}`} style={styles.listItem}>
                        <Text
                          style={[
                            styles.bulletPoint,
                            isDark && styles.textDark,
                          ]}
                        >
                          •
                        </Text>
                        <Text
                          style={[
                            styles.listItemText,
                            isDark && styles.textDark,
                          ]}
                        >
                          {content}
                        </Text>
                      </View>
                    );
                  }
                  
                  if (item.trim()) {
                    // 列表中的非列表项文本
                    return (
                      <Text
                        key={`text-${item.substring(0, 10)}-${index}-${itemIndex}`}
                        style={[styles.paragraph, isDark && styles.textDark]}
                      >
                        {item}
                      </Text>
                    );
                  }
                  
                  return null;
                })}
              </View>
            );
          }
          
          // 处理普通段落
          if (paragraph.trim()) {
            return (
              <Text
                key={`para-${paragraph.substring(0, 10)}-${index}`}
                style={[styles.paragraph, isDark && styles.textDark]}
              >
                {paragraph}
              </Text>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const getIntensityColor = (intensity: number, isDark: boolean) => {
    if (intensity < 0.3) return isDark ? "#4CAF50" : "#81C784";
    if (intensity < 0.6) return isDark ? "#FFB74D" : "#FF9800";
    return isDark ? "#E57373" : "#F44336";
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Button variant="link" onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
          <ButtonText
            style={{ color: isDark ? Colors.dark.text : Colors.light.text }}
          >
            返回
          </ButtonText>
        </Button>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? Colors.dark.text : Colors.light.text },
          ]}
        >
          情绪分析
        </Text>
        <View style={styles.placeholder} />
      </View>      <ScrollView style={styles.content}>
        {!hasValidParams ? (
          // 当参数无效时显示友好提示
          <View style={[styles.emotionCard, isDark && styles.emotionCardDark]}>
            <View style={styles.emotionContent}>
              <Ionicons
                name="information-circle-outline"
                size={80}
                color={isDark ? Colors.dark.tint : Colors.light.tint}
                style={styles.emotionIcon}
              />
              <Text style={[styles.emotionText, isDark && styles.textDark]}>
                无法获取分析数据
              </Text>
              <Text style={[styles.subtitle, isDark && styles.textDark]}>
                抱歉，我们无法获取到您的日记分析数据。请返回日记创建页面重新进行情绪分析。
              </Text>
              <Button 
                onPress={() => router.push('/diary/create')} 
                style={styles.analysisButton}
              >
                <ButtonText>重新分析</ButtonText>
              </Button>
            </View>
          </View>
        ) : (
          <>
        <View style={[styles.emotionCard, isDark && styles.emotionCardDark]}>
          <View style={styles.emotionContent}>
            {emotion === 1 ? (
              <>
                <Ionicons
                  name="happy"
                  size={60}
                  color="#4CAF50"
                  style={styles.emotionIcon}
                />
                <Text style={[styles.emotionText, isDark && styles.textDark]}>
                  今天心情不错呀！
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="sad"
                  size={60}
                  color="#FF5722"
                  style={styles.emotionIcon}
                />
                <Text style={[styles.emotionText, isDark && styles.textDark]}>
                  今天心情有点低落...
                </Text>
              </>
            )}
          </View>
          <View style={styles.intensityContainer}>
            <Text style={[styles.intensityLabel, isDark && styles.textDark]}>
              情绪强度:
            </Text>
            <View style={styles.intensityBarContainer}>
              <View
                style={[
                  styles.intensityBar,
                  { width: `${intensity * 100}%` },
                  emotion === 1 ? styles.positiveBar : styles.negativeBar,
                ]}
              />
            </View>
            <Text style={[styles.intensityValue, isDark && styles.textDark]}>
              {Math.round(intensity * 100)}%
            </Text>
          </View>
        </View>

        <View style={[styles.actionsCard, isDark && styles.actionsCardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDark]}>
            深度分析
          </Text>
          <Text style={[styles.cardSubtitle, isDark && styles.textDark]}>
            我们可以对你的日记进行更深度的情绪和需求分析
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              action={analysisType === "abc" ? "primary" : "secondary"}
              onPress={handleAbcAnalysis}
              style={[
                styles.analysisButton,
                analysisType === "abc" && styles.activeButton,
              ]}
            >
              <ButtonText>进行ABC情绪调节分析</ButtonText>
            </Button>

            <Button
              action={analysisType === "maslow" ? "primary" : "secondary"}
              onPress={handleMaslowAnalysis}
              style={[
                styles.analysisButton,
                analysisType === "maslow" && styles.activeButton,
              ]}
            >
              <ButtonText>进行马斯洛需求分析</ButtonText>
            </Button>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#7EB6FF" : "#007AFF"}
            />
            <Text style={[styles.loadingText, isDark && styles.textDark]}>
              正在进行分析...
            </Text>
          </View>
        )}

        {!loading && analysisResult && (
          <View style={[styles.resultCard, isDark && styles.resultCardDark]}>
            <Text style={[styles.resultTitle, isDark && styles.textDark]}>
              {analysisType === "abc"
                ? "ABC情绪调节分析结果"
                : "马斯洛需求分析结果"}
            </Text>
            {formatAnalysisText(analysisResult)}
          </View>
        )}

        {!loadingRecommendations && recommendations.length > 0 && (
          <View
            style={[styles.recommendationCard, isDark && styles.resultCardDark]}
          >
            <View style={styles.cardTitleContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color={isDark ? "#7EB6FF" : "#007AFF"}
                style={styles.cardIcon}
              />
              <Text style={[styles.resultTitle, isDark && styles.textDark]}>
                情绪知识推荐
              </Text>
            </View>

            {recommendations.map((rec) => (
              <View
                key={rec.id}
                style={[
                  styles.recommendationItem,
                  isDark
                    ? styles.recommendationItemDark
                    : styles.recommendationItemLight,
                ]}
              >
                <View style={styles.recommendationHeader}>
                  <View style={styles.emotionCategoryContainer}>                    <Text
                      style={[
                        styles.emotionCategory,
                        isDark && styles.textDark,
                      ]}
                    >
                      {rec.emotionCategory === 1 ? "积极" : "消极"}
                    </Text>
                    <View
                      style={[
                        styles.intensityBadge,
                        {
                          backgroundColor: getIntensityColor(
                            rec.emotionIntensity,
                            isDark
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.intensityBadgeText}>
                        强度: {Math.round(rec.emotionIntensity * 100)}%
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.psychologicalBasis,
                      isDark && styles.textDark,
                    ]}
                  >
                    基于: {rec.psychologicalBasis}
                  </Text>
                </View>

                <View style={styles.recommendationContent}>
                  <Text
                    style={[
                      styles.recommendationText,
                      isDark && styles.textDark,
                    ]}
                  >
                    {rec.recommendedAction}
                  </Text>

                  <Text
                    style={[
                      styles.recommendationDescription,
                      isDark && styles.textSubtle,
                    ]}
                  >
                    {rec.description}
                  </Text>

                  <View style={styles.recommendationFooter}>
                    <Text
                      style={[styles.contentTypeTag, isDark && styles.textDark]}
                    >
                      <Ionicons
                        name={
                          rec.contentType === "视频"
                            ? "videocam-outline"
                            : "document-text-outline"
                        }
                        size={14}
                        color={isDark ? "#e0e0e0" : "#666"}
                        style={styles.contentTypeIcon}
                      />
                      {` ${rec.contentType}`}
                    </Text>

                    {rec.contentUrl && (
                      <TouchableOpacity
                        onPress={() => handleUrlPress(rec.contentUrl)}
                        style={styles.linkButton}
                      >
                        <Text style={styles.linkButtonText}>查看详情</Text>
                        <Ionicons
                          name="arrow-forward-outline"
                          size={16}
                          color="#FFF"
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}        {/* 添加底部间距，确保内容在滚动时完全可见 */}
        <View style={styles.bottomPadding} />
        </>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emotionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emotionCardDark: {
    backgroundColor: "#2c2c2c",
  },
  emotionContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  emotionIcon: {
    marginBottom: 12,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  intensityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  intensityLabel: {
    fontSize: 16,
    color: "#555",
    width: 80,
  },
  intensityBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  intensityBar: {
    height: "100%",
  },
  positiveBar: {
    backgroundColor: "#4CAF50",
  },
  negativeBar: {
    backgroundColor: "#FF5722",
  },
  intensityValue: {
    fontSize: 16,
    color: "#555",
    width: 50,
    textAlign: "right",
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsCardDark: {
    backgroundColor: "#2c2c2c",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  analysisButton: {
    width: "100%",
  },
  activeButton: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultCardDark: {
    backgroundColor: "#2c2c2c",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  paragraphContainer: {
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    paddingLeft: 8,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
    lineHeight: 24,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  textDark: {
    color: "#e0e0e0",
  },
  textSubtle: {
    color: "#a0a0a0", // Example subtle color for dark mode
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16, // Added to match original resultTitle margin
  },
  cardIcon: {
    marginRight: 8, // Added for spacing
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationItemDark: {
    backgroundColor: "#3c3c3c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recommendationItemLight: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  emotionCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emotionCategory: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  intensityBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  intensityBadgeText: {
    fontSize: 12,
    color: "#fff",
  },
  psychologicalBasis: {
    fontSize: 14,
    fontStyle: "italic",
  },
  recommendationContent: {
    marginTop: 8,
  },
  recommendationText: {
    fontSize: 16,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recommendationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentTypeTag: {
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  contentTypeIcon: {
    marginRight: 4,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  linkButtonText: {
    color: "#FFF",
    fontSize: 14,
  },  bottomPadding: {
    height: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
});
