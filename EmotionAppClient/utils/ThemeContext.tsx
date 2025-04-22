// // context/ThemeContext.tsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { Appearance } from 'react-native';

// // 主题上下文
// type Theme = 'light' | 'dark';

// interface ThemeContextProps {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// // 提供主题的上下文组件
// export const ThemeProvider: React.FC = ({ children }) => {
//   const [theme, setTheme] = useState<Theme>(Appearance.getColorScheme() || 'light');

//   // 监听系统主题变化
//   useEffect(() => {
//     const subscription = Appearance.addChangeListener(({ colorScheme }) => {
//       setTheme(colorScheme || 'light');
//     });
//     return () => subscription.remove();
//   }, []);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // 自定义 hook 用于访问主题
// export const useTheme = (): ThemeContextProps => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
