import { useState, createContext } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export const ThemeContext = createContext();

export default function TabLayout() {
  const [isDark, setIsDark] = useState(false);

  const theme = {
    tabBg: isDark ? '#1A1A1A' : '#FFF0DE',
    activeBox: isDark ? '#8FAE9D' : '#A8BCB1',
    text: isDark ? '#FFF0DE' : '#6B4F4F',
    bg: isDark ? '#333333' : '#FFF0DE',

    mapCircle: isDark ? 'rgba(143, 174, 157, 0.4)' : 'rgba(0,122,255,0.15)',
  buttonBg: isDark ? '#8FAE9D' : '#8FAE9D', // 也可以根據模式微調綠色
  cardInner: isDark ? '#444444' : '#FFFFFF', // 卡片內部的區塊底色
  searchBar: isDark ? '#555555' : '#FFF0DE',
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isDark ? '#FFFFFF' : '#6B4F4F', // 夜間選中變白
          tabBarInactiveTintColor: theme.text,
          tabBarStyle: {
            backgroundColor: theme.tabBg,
            height: 110,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,        
            fontWeight: 'bold',  
            marginTop: 5,        
            marginBottom: 10,    
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => (
          <View style={[styles.iconBox, focused ? { backgroundColor: theme.activeBox } : null]}>
            <MaterialIcons name="home" size={28} color={focused ? '#FFF' : theme.text} />
          </View>
        )}} />

        <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: ({ focused }) => (
          <View style={[styles.iconBox, focused ? { backgroundColor: theme.activeBox } : null]}>
            <MaterialIcons name="menu" size={28} color={focused ? '#FFF' : theme.text} />
          </View>
        )}} />

        <Tabs.Screen name="setting" options={{ title: 'Setting', tabBarIcon: ({ focused }) => (
          <View style={[styles.iconBox, focused ? { backgroundColor: theme.activeBox } : null]}>
            <MaterialIcons name="settings" size={28} color={focused ? '#FFF' : theme.text} />
          </View>
        )}} />


        <Tabs.Screen 
          name="Card" 
          options={{ href: null }} 
        />
        <Tabs.Screen 
          name="addcomment" 
          options={{ href: null }} 
        />



      </Tabs>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  iconBox: { width: 60, height: 35, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});