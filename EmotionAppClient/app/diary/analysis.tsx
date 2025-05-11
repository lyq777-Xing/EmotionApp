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
  emotionCategory: string;
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
  const params = useLocalSearchParams();

  // 从前一个页面获取情绪分析结果
  const [emotion, setEmotion] = useState(0);
  const [intensity, setIntensity] = useState(0.55);
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");

  const [loading, setLoading] = useState(false);
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

  // 在组件加载时处理参数
  useEffect(() => {
    // 检查是否使用 result 字符串传递参数（旧方式）
    if (params.result) {
      try {
        const resultObj = JSON.parse(params.result as string);
        setEmotion(resultObj.emotion === "1" ? 1 : 0);
        setIntensity(resultObj.intensity || 0.55);
        setDiaryContent(resultObj.content || "");
        setDiaryTitle(resultObj.title || "");
      } catch (error) {
        console.error("解析 result 参数失败:", error);
      }
    } else {
      // 直接从单独的参数获取（新方式）
      setEmotion(params.emotion === "1" ? 1 : 0);
      setIntensity(Number(params.intensity) || 0.55);
      setDiaryContent((params.content as string) || "");
      setDiaryTitle((params.title as string) || "");
    }
  }, [params]); // 此useEffect只处理参数解析，不再调用API

  // 单独的useEffect处理API调用
  useEffect(() => {
    // 如果已经请求过，就不再重复请求
    if (!hasRequestedRecommendations) {
      fetchKnowledgeRecommendations();
    }
  }, [hasRequestedRecommendations]); // 只依赖于是否已请求标记

  // 处理返回主页
  const handleBack = () => {
    router.push("/(tabs)");
  };

  // 获取情绪知识推荐
  const fetchKnowledgeRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      // 从后端获取数据
      const response = await axios.get(
        "http://localhost:5081/api/EmotionKnowledge/recommend",
        {
          params: {
            category: emotion ,
            intensity: intensity,
          },
        }
      );
      setRecommendations(response.data);
      setHasRequestedRecommendations(true); // 设置标记为已请求
    } catch (error) {
      console.error("获取情绪知识推荐失败:", error);
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
                      <View key={`item-${itemIndex}`} style={styles.listItem}>
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
                  } else if (item.trim()) {
                    // 列表中的非列表项文本
                    return (
                      <Text
                        key={`text-${itemIndex}`}
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
          } else if (paragraph.trim()) {
            // 处理普通段落
            return (
              <Text
                key={`para-${index}`}
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
      </View>

      <ScrollView style={styles.content}>
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
                  <View style={styles.emotionCategoryContainer}>
                    <Text
                      style={[
                        styles.emotionCategory,
                        isDark && styles.textDark,
                      ]}
                    >
                      {rec.emotionCategory}
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
                      {" " + rec.contentType}
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
        )}

        {/* 添加底部间距，确保内容在滚动时完全可见 */}
        <View style={styles.bottomPadding} />
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
  },
  bottomPadding: {
    height: 16,
  },
});
