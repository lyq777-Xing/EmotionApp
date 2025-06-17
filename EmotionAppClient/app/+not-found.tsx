import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/utils/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />      <ThemedView style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }
      ]}>
        <View style={styles.content}>
          <ThemedText style={styles.emoji}>😵‍💫</ThemedText>
          <ThemedText type="title" style={styles.title}>Oops!</ThemedText>
          <ThemedText style={styles.subtitle}>
            We couldn't find the page you're looking for.
          </ThemedText>
          <ThemedText style={styles.description}>
            Don't worry, it happens to the best of us. Let's get you back on track.
          </ThemedText>
          <Link href="/" style={styles.link}>
            <View style={[
              styles.button, 
              { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }
            ]}>
              <ThemedText type="link" style={[
                styles.buttonText,
                { color: isDarkMode ? Colors.dark.background : '#FFFFFF' }
              ]}>Go to home screen!</ThemedText>
            </View>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 320,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 32,
  },  link: {
    width: '100%',
    alignItems: 'center', //水平居中
    justifyContent: 'center', //垂直居中
    display: 'flex', //确保 flex 布局
    flexDirection: 'row', //设置为行布局
  },button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
