import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { 
  ArrowLeft, 
  Heart, 
  Plus, 
  DotsThree, 
  Grains,      
  FishSimple,  
  Drop,        
  MinusCircle
} from 'phosphor-react-native';

// Import Custom Icons
import { IconCarb, IconProtein, IconFat } from '../../../assets/svg/CustomeSvg';

// --- SUB-COMPONENT NHỎ (Nội bộ file này) ---
const IngredientRow = ({ item, onRemoveItem }: { item: any, onRemoveItem: (id: string) => void }) => (
  <View style={styles.ingredientRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.ingName}>{item.name}</Text>
      <View style={styles.ingMetaRow}>
        <Text style={styles.ingWeight}>{item.weight}{item.unit || 'g'}</Text>
        <Text style={styles.ingDot}>•</Text>
        <Text style={styles.ingCal}>{item.cal}kcal</Text>
        <View style={styles.verticalLine} />
        
        {/* Macros nhỏ */}
        <View style={styles.miniMacro}>
          <Grains size={12} color="#F4D03F" weight="fill" />
          <Text style={styles.miniMacroText}>{item.c}</Text>
        </View>
        <View style={styles.miniMacro}>
          <FishSimple size={12} color="#E74C3C" weight="fill" />
          <Text style={styles.miniMacroText}>{item.p}</Text>
        </View>
        <View style={styles.miniMacro}>
          <Drop size={12} color="#2ECC71" weight="fill" />
          <Text style={styles.miniMacroText}>{item.f}</Text>
        </View>
      </View>
    </View>
    <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
   <MinusCircle size={24} color="#3A3A3C" weight="fill" /> 
</TouchableOpacity>
  </View>
);

interface ScanResultViewProps {
  data: any;
  onBack: () => void;
  onSave: () => void;
  onRemoveItem: (id: string) => void;
}

const ScanResultView = ({ data, onBack, onSave, onRemoveItem }: ScanResultViewProps) => {
  return (
    <View style={styles.resultContainer}>
      {/* HEADER NAV */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <DotsThree size={24} color="#FFF" weight="bold" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER MÓN ĂN */}
        <View style={styles.foodHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeText}>{data.time}</Text>
            <Text style={styles.foodName}>{data.name}</Text>
            <View style={styles.healthRow}>
              <Heart size={16} color="#FF453A" weight="fill" />
              <Text style={styles.healthText}>Sức Khỏe: {data.healthScore}/10</Text>
            </View>
          </View>
          <FastImage source={{ uri: data.image }} style={styles.foodThumbnail} />
        </View>

        {/* TỔNG QUAN DINH DƯỠNG */}
        <Text style={styles.sectionTitle}>Calo & Dinh dưỡng</Text>
        <View style={styles.macroRow}>
          <View style={styles.macroCard}>
             <Text style={styles.macroLabel}>Số lượng</Text>
             <Text style={styles.macroValueBig}>{data.total.weight}<Text style={{fontSize:16, color:'#8E8E93'}}>g</Text></Text>
          </View>
          <View style={styles.macroCard}>
             <Text style={styles.macroLabel}>Calo</Text>
             <Text style={styles.macroValueBig}>{data.total.calories}</Text>
          </View>
        </View>

        {/* Macros Detail */}
        <View style={styles.macroRow}>
          <View style={styles.macroCardSmall}>
             <Text style={styles.macroLabel}>Tinh bột</Text>
             <View style={styles.macroValueRow}>
                <IconCarb size={18} color="#F4D03F" /> 
                <Text style={styles.macroValueSmall}>{data.total.carbs}</Text>
                <Text style={styles.unitSmall}>g</Text>
             </View>
          </View>
          <View style={styles.macroCardSmall}>
             <Text style={styles.macroLabel}>Chất đạm</Text>
             <View style={styles.macroValueRow}>
                <IconProtein size={18} color="#E74C3C" />
                <Text style={styles.macroValueSmall}>{data.total.protein}</Text>
                <Text style={styles.unitSmall}>g</Text>
             </View>
          </View>
          <View style={styles.macroCardSmall}>
             <Text style={styles.macroLabel}>Chất béo</Text>
             <View style={styles.macroValueRow}>
                <IconFat size={18} color="#2ECC71" />
                <Text style={styles.macroValueSmall}>{data.total.fat}</Text>
                <Text style={styles.unitSmall}>g</Text>
             </View>
          </View>
        </View>

        {/* DANH SÁCH THÀNH PHẦN */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Thành phần</Text>
        <View style={styles.ingredientsContainer}>
          {data.ingredients.map((item: any) => (
            <React.Fragment key={item.id}>
              <IngredientRow item={item} onRemoveItem={onRemoveItem} />
              <View style={styles.separator} />
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.addIngredientBtn}>
           <Plus size={16} color="#2ECC71" weight="bold"/>
           <Text style={styles.addIngredientText}>Thêm thành phần mới</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Muốn tinh chỉnh kết quả của bạn? Nhấn "Sửa kết quả" và cho chúng tôi biết!
        </Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Sửa kết quả</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* FOOTER FIXED */}
      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  timeText: { color: '#8E8E93', fontSize: 14, marginBottom: 4 },
  foodName: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  healthRow: { flexDirection: 'row', alignItems: 'center' },
  healthText: { color: '#8E8E93', fontSize: 14, marginLeft: 6 },
  foodThumbnail: {
    width: 100, height: 70, borderRadius: 12, borderWidth: 2, borderColor: '#333',
  },
  sectionTitle: { color: '#8E8E93', fontSize: 16, marginBottom: 12 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  macroCard: {
    backgroundColor: '#1C1C1E', borderRadius: 16, padding: 16, width: '48%', alignItems: 'center',
  },
  macroCardSmall: {
    backgroundColor: '#1C1C1E', borderRadius: 16, padding: 12, width: '31%', alignItems: 'center',
  },
  macroLabel: { color: '#8E8E93', fontSize: 13, marginBottom: 4 },
  macroValueBig: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  macroValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 },
  macroValueSmall: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 4 },
  unitSmall: { color: '#8E8E93', fontSize: 12, marginLeft: 2, marginBottom: 2 },
  
  ingredientsContainer: {},
  ingredientRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12,
  },
  separator: { height: 1, backgroundColor: '#2C2C2E' },
  ingName: { color: '#FFF', fontSize: 16, fontWeight: '500', marginBottom: 6 },
  ingMetaRow: { flexDirection: 'row', alignItems: 'center' },
  ingWeight: { color: '#EBEBF5', fontSize: 13, fontWeight: '500' },
  ingDot: { color: '#8E8E93', marginHorizontal: 4, fontSize: 10 },
  ingCal: { color: '#8E8E93', fontSize: 13 },
  verticalLine: { width: 1, height: 12, backgroundColor: '#444', marginHorizontal: 8 },
  miniMacro: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  miniMacroText: { color: '#D1D1D6', fontSize: 12, marginLeft: 2 },
  
  addIngredientBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  addIngredientText: { color: '#2ECC71', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  helperText: {
    color: '#8E8E93', fontSize: 13, textAlign: 'center', marginTop: 30, marginBottom: 12, paddingHorizontal: 20,
  },
  editBtn: {
    backgroundColor: '#2C2C2E', paddingVertical: 14, borderRadius: 24, alignItems: 'center', marginBottom: 20,
  },
  editBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  fixedFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 30,
    backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#1C1C1E',
  },
  saveBtn: {
    backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 30, alignItems: 'center',
  },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});

export default ScanResultView;