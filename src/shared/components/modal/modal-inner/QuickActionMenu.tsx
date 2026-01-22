import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { X, ForkKnife, Drop, Barbell, Moon, Sun, Cookie, Camera } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

// --- ĐỊNH NGHĨA DỮ LIỆU ---
interface ActionItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  bgColor?: string;
  color?: string;
}

interface QuickActionMenuProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const QuickActionMenu = ({ onClose, onNavigate }: QuickActionMenuProps) => {

  // Dữ liệu hàng 1
  const row1Items: ActionItem[] = [
    { id: 'scanner', label: 'Scan Food', icon: Camera, bgColor: '#E8F5E8', color: '#2E7D32' },
    { id: 'activity', label: 'Activity', icon: Barbell, bgColor: '#E0F2F1', color: '#009688' },
    { id: 'water', label: 'Water', icon: Drop, bgColor: '#E3F2FD', color: '#2196F3' },
  ];

  // Dữ liệu hàng 2
  const row2Items: ActionItem[] = [
    { id: 'weight', label: 'Weight', icon: Moon, bgColor: '#E8EAF6', color: '#3F51B5' },
    { id: 'breakfast', label: 'Breakfast', icon: Sun, bgColor: '#FFF9C4', color: '#FBC02D' },
    { id: 'lunch', label: 'Lunch', icon: ForkKnife, bgColor: '#FFEBEE', color: '#E53935' },
    { id: 'dinner', label: 'Dinner', icon: ForkKnife, bgColor: '#F3E5F5', color: '#8E24AA' },
  ];

  // Component render từng nút tròn
  const RenderItem = ({ item }: { item: ActionItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.8}
      onPress={() => {
        onClose();
        onNavigate(item.id);
      }}
    >
      <View style={[styles.circle, { backgroundColor: item.bgColor || 'white' }]}>
        {item.icon && <item.icon size={32} color={item.color} weight="fill" />}
      </View>
      {/* Label màu trắng có shadow để dễ đọc trên mọi nền */}
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Vùng chứa các Icon */}
      <View style={styles.menuContent}>
        {/* Hàng 1 */}
        <View style={styles.row}>
          {row1Items.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </View>

        {/* Hàng 2 */}
        <View style={[styles.row, { marginTop: 24 }]}>
          {row2Items.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </View>
      </View>

      {/* Nút Đóng (X) */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.9}
        >
          {/* Icon X màu trắng nổi bật */}
          <X size={32} color="white" weight="bold" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  // Container trong suốt hoàn toàn
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'transparent', // [QUAN TRỌNG] Đảm bảo nền trong suốt
  },
  menuContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 4,
  },
  itemContainer: {
    alignItems: 'center',
    width: width / 4 - 10,
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    // Shadow cho nút nổi lên trên nền trong suốt
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    color: '#FFFFFF', // [QUAN TRỌNG] Chữ trắng để nổi trên nền tối (Overlay)
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    // Thêm text shadow để chữ không bị chìm nếu nền phía sau sáng màu
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    height: 80,
  },
  closeButton: {
    width: 66,
    height: 66,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow mạnh cho nút đóng
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    position: 'absolute',
    backgroundColor: '#444444',
    bottom: 40,

  },
});

export default QuickActionMenu;