import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from './_layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 1. 定義縮小後的寬度 (從 0.85 降到 0.75)
const GUIDE_WIDTH = SCREEN_WIDTH * 0.75; 
// 2. 定義比例 (9:16 = 1.77)，這樣無論螢幕多大，圖片比例都不會跑掉
const ASPECT_RATIO = 13 / 6; 
const GUIDE_HEIGHT = GUIDE_WIDTH * ASPECT_RATIO;

export default function SettingScreen() {
  const { isDark, setIsDark, theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const uiColor = isDark ? '#FFF0DE' : '#6B4F4F'; 

  const guideImages = [
    require('../assets/1.png'),
    require('../assets/2.png'),
    require('../assets/3.png'),
    require('../assets/4.png'),
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / GUIDE_WIDTH);
    setCurrentPage(page);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <MaterialIcons name="wb-sunny" size={24} color={uiColor} />
        <Text style={{ fontSize: 20, marginHorizontal: 5, color: uiColor }}>/</Text>
        <MaterialIcons name="nights-stay" size={24} color={uiColor} />
        <View style={{ flex: 1 }} />
        <Switch
          trackColor={{ false: "#ccc", true: "#8FAE9D" }}
          onValueChange={() => setIsDark(!isDark)}
          value={isDark}
        />
      </View>

      <View style={styles.menuList}>
        <TouchableOpacity style={styles.item} onPress={() => setModalVisible(true)}>
          <Text style={[styles.itemText, { color: uiColor }]}>導覽</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={[styles.itemText, { color: uiColor }]}>聯絡我們</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.guideWrapper}>
            
            {/* 圖片視窗 */}
            <View style={[styles.scrollWindow, { width: GUIDE_WIDTH, height: GUIDE_HEIGHT }]}>
              <TouchableOpacity 
                style={styles.closeBtn} 
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="cancel" size={32} color={uiColor} style={styles.closeIconShadow} />
              </TouchableOpacity>

              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                style={{ width: GUIDE_WIDTH }}
              >
                {guideImages.map((img, index) => (
                  <View key={index} style={{ width: GUIDE_WIDTH, height: GUIDE_HEIGHT }}>
                    <Image source={img} style={styles.guideImg} resizeMode="stretch" />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 小圓點 */}
            <View style={styles.dotsContainer}>
              {guideImages.map((_, index) => (
                <View 
                  key={index} 
                  style={[styles.dot, { backgroundColor: currentPage === index ? '#8FAE9D' : '#ccc' }]} 
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 80 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 50 },
  menuList: { gap: 30 },
  itemText: { fontSize: 22, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  guideWrapper: { alignItems: 'center' },
  scrollWindow: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000', // 防止圖片載入前的閃爍
  },
  closeBtn: { position: 'absolute', top: 10, right: 10, zIndex: 99 },
  closeIconShadow: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  guideImg: { width: '100%', height: '100%' },
  dotsContainer: { flexDirection: 'row', marginTop: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 }
});