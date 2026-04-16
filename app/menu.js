import { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ThemeContext } from './_layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MenuScreen() {
  const [filter, setFilter] = useState('Recent');
  const { isDark, theme } = useContext(ThemeContext);
  
  // 建立一個參考點，用來控制滑動位置
  const scrollViewRef = useRef(null);

  const pageTheme = {
    textInactive: isDark ? '#F5F5F5' : '#6B4F4F', // 已調白深色模式字體
    underline: '#8FAE9D',
  };

  // 點擊文字時，叫 ScrollView 滑動到對應位置
  const handleTabPress = (index, name) => {
    setFilter(name);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  // 手動滑動停止後，更新頂部文字的狀態
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    const names = ['Recent', 'Like', 'Avoid'];
    setFilter(names[index]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* 頂部 Tab 橫列 */}
      <View style={styles.tabBar}>
        {['Recent', 'Like', 'Avoid'].map((item, index) => (
          <TouchableOpacity key={item} onPress={() => handleTabPress(index, item)}>
            <Text style={[
              styles.tabText, 
              { color: pageTheme.textInactive },
              filter === item ? { borderBottomColor: pageTheme.underline, borderBottomWidth: 3 } : null
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 下方滑動內容區 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll} // 監聽滑動停止動作
        style={styles.contentScroll}
      >
        {/* 第一頁：Recent */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <Text style={{ color: theme.text, opacity: 0.5 }}>這是 Recent 內容區</Text>
        </View>

        {/* 第二頁：Like */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <Text style={{ color: theme.text, opacity: 0.5 }}>這是 Like 內容區</Text>
        </View>

        {/* 第三頁：Avoid */}
        <View style={[styles.page, { width: SCREEN_WIDTH }]}>
          <Text style={{ color: theme.text, opacity: 0.5 }}>這是 Avoid 內容區</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  tabBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingHorizontal: 20,
    zIndex: 10 // 確保點擊不會被遮擋
  },
  tabText: { fontSize: 20, fontWeight: 'bold', paddingBottom: 4 },
  contentScroll: { flex: 1 },
  page: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});