import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/utils/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { theme } = useTheme();
  
  // Use the theme from our context to determine the background color
  const backgroundColor = theme === 'dark'
    ? darkColor || '#1c1c1c'  // Default dark background
    : lightColor || '#ffffff'; // Default light background

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
