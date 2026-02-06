import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ForkKnife, Drop, Barbell, Moon, Sun, Camera } from 'phosphor-react-native';
import { palette } from '@theme/themes';
import { SCREENS } from 'constants';

const { width } = Dimensions.get('window');

// --- ĐỊNH NGHĨA DỮ LIỆU ---
interface ActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  screen: string;
}

interface QuickActionMenuProps {
  onClose: () => void;
  onNavigate: (payload: { id: string; screen: string }) => void;
}

const QuickActionMenu = ({ onClose, onNavigate }: QuickActionMenuProps) => {

  const row1Items: ActionItem[] = [
    { id: 'scanner', label: 'Scan Food', icon: Camera, screen: SCREENS.CALORIER_SCANNER },
    { id: 'activity', label: 'Activity', icon: Barbell, screen: '' },
    { id: 'water', label: 'Water', icon: Drop, screen: '' },
  ];

  const row2Items: ActionItem[] = [
    { id: 'weight', label: 'Weight', icon: Moon, screen: SCREENS.RECORD_WEIGHT },
    { id: 'breakfast', label: 'Breakfast', icon: Sun, screen: SCREENS.ADD_MEAL_SCREEN },
    { id: 'lunch', label: 'Lunch', icon: ForkKnife, screen: SCREENS.ADD_MEAL_SCREEN },
    { id: 'dinner', label: 'Dinner', icon: ForkKnife, screen: SCREENS.ADD_MEAL_SCREEN },
  ];

  const RenderItem = ({ item }: { item: ActionItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.7}
      onPress={() => {
        onClose();
        onNavigate({ id: item.id, screen: item.screen });
      }}
    >
      <View style={styles.iconContainer}>
        <item.icon size={36} color="#FFFFFF" weight="fill" />
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Thanh trang trí nhỏ ở trên cùng (Handle bar) */}
      <View style={styles.handleBar} />

      <View style={styles.menuContent}>
        <View style={styles.row}>
          {row1Items.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </View>

        <View style={[styles.row, { marginTop: 24 }]}>
          {row2Items.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </View>
      </View>

      {/* Đã xóa Footer chứa nút Close */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    // Tăng padding dưới lên để bù lại khoảng trống khi xóa nút close, 
    // giúp layout trông cân đối hơn ở đáy màn hình
    paddingBottom: 40, 
    paddingTop: 16,
    backgroundColor: palette.black, 
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 20,
  },
  menuContent: {
    width: '100%',
    alignItems: 'center',
    // Giảm margin bottom vì không còn nút phía dưới, tránh khoảng trống quá lớn
    marginBottom: 10, 
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
  iconContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default QuickActionMenu;