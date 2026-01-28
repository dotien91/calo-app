import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity // Thêm TouchableOpacity để bấm vào món ăn nếu cần
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { format } from 'date-fns';
import { ForkKnife } from 'phosphor-react-native'; // Giữ icon này cho EmptyState
import { translations } from '@localization';
import { IconCarb, IconProtein, IconFat } from '../../../assets/svg/CustomeSvg';


// --- TYPES ---
type RecentActivityRecord = {
  _id: string;
  food_name?: string;
  image_url?: string;
  total_calories?: number;
  total_carbs?: number;
  total_protein?: number;
  total_fat?: number;
  createdAt?: string;
};

type DayEntry = {
  date: string;
  records: RecentActivityRecord[];
  totals?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    meals?: number;
  };
};

// --- 1. Sub-Component: Item Món Ăn ---
const FoodItem = ({ item }: { item: RecentActivityRecord }) => {
  const { colors } = useTheme();

  const formatTime = (isoString?: string) => {
    try {
      if (!isoString) return '--:--';
      const date = new Date(isoString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return '--:--';
    }
  };

  const MACRO_COLORS = {
    carb: '#F4D03F',    
    protein: '#E74C3C', 
    fat: '#2ECC71',     
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      {/* Ảnh món ăn */}
      <Image 
        source={{ uri: item.image_url }} 
        style={[styles.foodImage, { backgroundColor: colors.border }]} 
        resizeMode="cover" 
      />
      
      {/* Thông tin chi tiết */}
      <View style={styles.infoContainer}>
        <Text style={[styles.foodName, { color: colors.text }]} numberOfLines={1}>
          {item.food_name}
        </Text>
        
        {/* Hàng Macro */}
        <View style={styles.macroRow}>
          {/* Calo */}
          <Text style={[styles.caloText, { color: colors.textOpacity6 }]}>
            {item.total_calories}kcal
          </Text>
          
          <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
          
          {/* Carb (Icon Tự Vẽ) */}
          <View style={styles.macroItem}>
            <IconCarb size={20} color={MACRO_COLORS.carb} />
            <Text style={[styles.macroText, { color: colors.textOpacity8 }]}>
              {item.total_carbs}
            </Text>
          </View>
          
          {/* Protein (Icon Tự Vẽ) */}
          <View style={styles.macroItem}>
            <IconProtein size={20} color={MACRO_COLORS.protein} />
            <Text style={[styles.macroText, { color: colors.textOpacity8 }]}>
              {item.total_protein}
            </Text>
          </View>
          
          {/* Fat (Icon Tự Vẽ) */}
          <View style={styles.macroItem}>
            <IconFat size={20} color={MACRO_COLORS.fat} />
            <Text style={[styles.macroText, { color: colors.textOpacity8 }]}>
              {item.total_fat}
            </Text>
          </View>
        </View>
      </View>

      {/* Thời gian */}
      <Text style={[styles.timeText, { color: colors.textOpacity4 }]}>
        {formatTime(item.createdAt)}
      </Text>
    </TouchableOpacity>
  );
};

// --- 2. Sub-Component: Empty State ---
const EmptyState = () => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.emptyContainer, 
      { 
        backgroundColor: colors.card, 
        borderColor: colors.border 
      }
    ]}>
      <ForkKnife size={32} color={colors.textOpacity4} weight="duotone" />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {translations.home?.emptyMealsTitle ?? 'Chưa có bữa ăn nào!'}
      </Text>
      <Text style={[styles.emptySub, { color: colors.textOpacity6 }]}>
        {translations.home?.emptyMealsSub ?? 'Nhấn + để thêm bữa ăn đầu tiên trong ngày.'}
      </Text>
    </View>
  );
};

// --- 3. MAIN COMPONENT ---
const RecentActivity = ({
  data,
  selectedDate,
}: {
  data?: DayEntry[] | { records?: RecentActivityRecord[] };
  selectedDate?: string;
}) => {
  const { colors } = useTheme();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const targetDate = selectedDate || today;

  // Xử lý data: có thể là mảng (theo ngày) hoặc object (danh sách phẳng)
  const dayEntry = Array.isArray(data) 
    ? data.find((d) => d?.date === targetDate) 
    : data;

  const records = dayEntry?.records || [];
  const hasData = records.length > 0;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {translations.home?.recentActivity ?? 'Gần đây'}
      </Text>

      {hasData ? (
        <View>
          {records.map((item: RecentActivityRecord) => (
            <FoodItem key={item._id} item={item} />
          ))}
        </View>
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

// --- 4. Styles ---
const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 12,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  foodImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  verticalDivider: {
    width: 1,
    height: 10,
    marginRight: 8,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 3,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});

export default RecentActivity;