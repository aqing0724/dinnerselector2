import { useState, useContext, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { ThemeContext } from './_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MenuScreen() {
  const [filter, setFilter] = useState('Recent');
  const [allReviews, setAllReviews] = useState([]);
  const { isDark, theme } = useContext(ThemeContext);
  const scrollViewRef = useRef(null);

  // 每次進入頁面重新讀取資料
  useFocusEffect(
    useCallback(() => {
      const loadReviews = async () => {
        try {
          const data = await AsyncStorage.getItem('reviews');
          if (data) {
            setAllReviews(JSON.parse(data));
          }
        } catch (e) {
          console.log('讀取失敗', e);
        }
      };
      loadReviews();
    }, [])
  );

  // --- 排序與分類邏輯 ---
  // 先把所有評論反轉，確保「最新」的在陣列最前面
  const sortedReviews = [...allReviews].reverse();

  const recentData = sortedReviews; 
  const likeData = sortedReviews.filter(r => r.like === 'like');
  const avoidData = sortedReviews.filter(r => r.like === 'dislike');

  const handleTabPress = (index, name) => {
    setFilter(name);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    const names = ['Recent', 'Like', 'Avoid'];
    setFilter(names[index]);
  };

  const renderReviewList = (data) => (
    <ScrollView contentContainerStyle={styles.listPadding}>
      {data.length === 0 ? (
        <View style={styles.emptyPage}>
          <Text style={{ color: theme.text, opacity: 0.5 }}>尚無評價紀錄</Text>
        </View>
      ) : (
        data.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: isDark ? '#8FAE9D' : '#C5D5CB' }]}>
            <View style={styles.cardTop}>
              {/* 店名：使用 flex:1 並限制一行，避免擠掉日期 */}
              <Text style={styles.restaurantName} numberOfLines={1}>
                {item.restaurantName || "未知店家"}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            
            <Text style={styles.reviewText}>{item.text}</Text>

            {item.images && item.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
                {item.images.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.img} />
                ))}
              </ScrollView>
            )}

            {/* 右下角讚/倒讚圖樣 */}
            <View style={styles.bottomIcon}>
              <MaterialIcons 
                name={item.like === 'like' ? 'thumb-up' : 'thumb-down'} 
                size={22} 
                color={item.like === 'like' ? '#6B8E7D' : '#D9534F'} 
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.tabBar}>
        {['Recent', 'Like', 'Avoid'].map((item, index) => (
          <TouchableOpacity key={item} onPress={() => handleTabPress(index, item)}>
            <Text style={[
              styles.tabText, 
              { color: isDark ? '#F5F5F5' : '#6B4F4F' },
              filter === item ? { borderBottomColor: '#8FAE9D', borderBottomWidth: 3, color: '#8FAE9D' } : null
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.contentScroll}
      >
        <View style={{ width: SCREEN_WIDTH }}>{renderReviewList(recentData)}</View>
        <View style={{ width: SCREEN_WIDTH }}>{renderReviewList(likeData)}</View>
        <View style={{ width: SCREEN_WIDTH }}>{renderReviewList(avoidData)}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginBottom: 10 },
  tabText: { fontSize: 20, fontWeight: 'bold', paddingBottom: 4 },
  contentScroll: { flex: 1 },
  listPadding: { padding: 20, paddingBottom: 100 },
  emptyPage: { height: 300, justifyContent: 'center', alignItems: 'center' },
  
  card: {
    padding: 20,
    borderRadius: 22,
    marginBottom: 15,
    position: 'relative', // 讓右下角圖示可以絕對定位
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 5 
  },
  restaurantName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#4A5B52',
    flex: 1,           // 讓店名佔據剩餘空間
    marginRight: 10    // 與日期保持距離
  },
  date: { 
    fontSize: 11, 
    color: 'rgba(74, 91, 82, 0.6)',
    minWidth: 75,      // 確保日期寬度足夠
    textAlign: 'right' 
  },
  reviewText: { 
    marginTop: 8, 
    fontSize: 15, 
    color: '#4A5B52',
    lineHeight: 20,
    paddingRight: 30   // 避開右下角圖示空間
  },
  imageRow: { marginTop: 15 },
  img: { width: 85, height: 85, borderRadius: 12, marginRight: 10 },
  bottomIcon: { 
    position: 'absolute', 
    right: 15, 
    bottom: 15 
  }
});