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
  MinusCircle,
} from 'phosphor-react-native';

import { IconCarb, IconProtein, IconFat } from '../../../assets/svg/CustomeSvg';
import { translations } from '@localization';
import MacroBadgeRow from '@shared-components/MacroBadgeRow';

const DEFAULT_COLORS = {
  bg: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  subText: '#8E8E93',
  border: '#2C2C2E',
  separator: '#2C2C2E',
  cardSecondary: '#2C2C2E',
  textSecondary: '#D1D1D6',
  saveBtnBg: '#FFFFFF',
  saveBtnText: '#000000',
  accent: '#2ECC71',
  iconMuted: '#3A3A3C',
};

// --- SUB-COMPONENT NHỎ (Nội bộ file này) ---
const IngredientRow = ({
  item,
  onRemoveItem,
  readOnly = false,
  c,
}: {
  item: any;
  onRemoveItem: (id: string) => void;
  readOnly?: boolean;
  c: typeof DEFAULT_COLORS;
}) => (
  <View style={styles.ingredientRow}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.ingName, { color: c.text }]}>{item.name}</Text>
      <View style={styles.ingMetaRow}>
        <Text style={[styles.ingWeight, { color: c.textSecondary }]}>{item.weight}{item.unit || 'g'}</Text>
        <Text style={[styles.ingDot, { color: c.subText }]}>•</Text>
        <Text style={[styles.ingCal, { color: c.subText }]}>{item.cal}kcal</Text>
        <View style={[styles.verticalLine, { backgroundColor: c.border }]} />
        <MacroBadgeRow
          carbs={item.c}
          protein={item.p}
          fat={item.f}
          iconSize={12}
          textColor={c.textSecondary}
          showLabel={false}
          style={styles.miniMacroRow}
        />
      </View>
    </View>
    {!readOnly && (
      <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
        <MinusCircle size={24} color={c.iconMuted} weight="fill" />
      </TouchableOpacity>
    )}
  </View>
);

interface ScanResultViewProps {
  data: any;
  onBack: () => void;
  onSave?: () => void;
  onRemoveItem?: (id: string) => void;
  readOnly?: boolean;
  hideHeaderNav?: boolean;
  COLORS?: typeof DEFAULT_COLORS;
}

const ScanResultView = ({
  data,
  onBack,
  onSave,
  onRemoveItem,
  readOnly = false,
  hideHeaderNav = false,
  COLORS: COLORSProp,
}: ScanResultViewProps) => {
  const c = COLORSProp ?? DEFAULT_COLORS;

  return (
    <View style={[styles.resultContainer, { backgroundColor: c.bg }]}>
      {!hideHeaderNav && (
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={onBack}>
            <ArrowLeft size={24} color={c.text} />
          </TouchableOpacity>
          {!readOnly && (
            <TouchableOpacity>
              <DotsThree size={24} color={c.text} weight="bold" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.foodHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.timeText, { color: c.subText }]}>{data.time}</Text>
            <Text style={[styles.foodName, { color: c.text }]}>{data.name}</Text>
            <View style={styles.healthRow}>
              <Heart size={16} color="#FF453A" weight="fill" />
              <Text style={[styles.healthText, { color: c.subText }]}>
                {(translations as any).scanner.health}: {data.healthScore}/10
              </Text>
            </View>
          </View>
          <FastImage source={{ uri: data.image }} style={[styles.foodThumbnail, { borderColor: c.border }]} />
        </View>

        <Text style={[styles.sectionTitle, { color: c.subText }]}>
          {(translations as any).scanner.nutritionTitle}
        </Text>
        <View style={styles.macroRow}>
          <View style={[styles.macroCard, { backgroundColor: c.card }]}>
             <Text style={[styles.macroLabel, { color: c.subText }]}>
               {(translations as any).scanner.quantity}
             </Text>
             <Text style={[styles.macroValueBig, { color: c.text }]}>
               {data.total.weight}<Text style={{ fontSize: 16, color: c.subText }}>g</Text>
             </Text>
          </View>
          <View style={[styles.macroCard, { backgroundColor: c.card }]}>
             <Text style={[styles.macroLabel, { color: c.subText }]}>
               {(translations as any).scanner.calories}
             </Text>
             <Text style={[styles.macroValueBig, { color: c.text }]}>{data.total.calories}</Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <View style={[styles.macroCardSmall, { backgroundColor: c.card }]}>
             <Text style={[styles.macroLabel, { color: c.subText }]}>
               {(translations as any).scanner.carbs}
             </Text>
             <View style={styles.macroValueRow}>
                <IconCarb size={18} color="#F4D03F" />
                <Text style={[styles.macroValueSmall, { color: c.text }]}>{data.total.carbs}</Text>
                <Text style={[styles.unitSmall, { color: c.subText }]}>g</Text>
             </View>
          </View>
          <View style={[styles.macroCardSmall, { backgroundColor: c.card }]}>
             <Text style={[styles.macroLabel, { color: c.subText }]}>
               {(translations as any).scanner.protein}
             </Text>
             <View style={styles.macroValueRow}>
                <IconProtein size={18} color="#E74C3C" />
                <Text style={[styles.macroValueSmall, { color: c.text }]}>{data.total.protein}</Text>
                <Text style={[styles.unitSmall, { color: c.subText }]}>g</Text>
             </View>
          </View>
          <View style={[styles.macroCardSmall, { backgroundColor: c.card }]}>
             <Text style={[styles.macroLabel, { color: c.subText }]}>
               {(translations as any).scanner.fat}
             </Text>
             <View style={styles.macroValueRow}>
                <IconFat size={18} color="#2ECC71" />
                <Text style={[styles.macroValueSmall, { color: c.text }]}>{data.total.fat}</Text>
                <Text style={[styles.unitSmall, { color: c.subText }]}>g</Text>
             </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24, color: c.subText }]}>
          {(translations as any).scanner.ingredients}
        </Text>
        <View style={styles.ingredientsContainer}>
          {data.ingredients.map((item: any) => (
            <React.Fragment key={item.id}>
              <IngredientRow
                item={item}
                onRemoveItem={readOnly ? () => {} : (onRemoveItem || (() => {}))}
                readOnly={readOnly}
                c={c}
              />
              <View style={[styles.separator, { backgroundColor: c.separator }]} />
            </React.Fragment>
          ))}
        </View>

        {!readOnly && (
          <TouchableOpacity style={styles.addIngredientBtn}>
            <Plus size={16} color={c.accent} weight="bold"/>
            <Text style={[styles.addIngredientText, { color: c.accent }]}>
              {(translations as any).scanner.addIngredient}
            </Text>
          </TouchableOpacity>
        )}

        {!readOnly && (
          <Text style={[styles.helperText, { color: c.subText }]}>
            {(translations as any).scanner.tweakHint}
          </Text>
        )}

        {!readOnly && (
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: c.cardSecondary }]}>
            <Text style={[styles.editBtnText, { color: c.text }]}>
              {(translations as any).scanner.editResult}
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {!readOnly && onSave ? (
        <View style={[styles.fixedFooter, { backgroundColor: c.bg, borderTopColor: c.border }]}>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.saveBtnBg }]} onPress={onSave}>
            <Text style={[styles.saveBtnText, { color: c.saveBtnText }]}>
              {(translations as any).scanner.save}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: { flex: 1 },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  timeText: { fontSize: 14, marginBottom: 4 },
  foodName: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  healthRow: { flexDirection: 'row', alignItems: 'center' },
  healthText: { fontSize: 14, marginLeft: 6 },
  foodThumbnail: { width: 150, height: 100, borderRadius: 12, borderWidth: 2 },
  sectionTitle: { fontSize: 16, marginBottom: 12 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  macroCard: { borderRadius: 16, padding: 16, width: '48%', alignItems: 'center' },
  macroCardSmall: { borderRadius: 16, padding: 12, width: '31%', alignItems: 'center' },
  macroLabel: { fontSize: 13, marginBottom: 4 },
  macroValueBig: { fontSize: 24, fontWeight: 'bold' },
  macroValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 4 },
  macroValueSmall: { fontSize: 18, fontWeight: 'bold', marginLeft: 4 },
  unitSmall: { fontSize: 12, marginLeft: 2, marginBottom: 2 },
  ingredientsContainer: {},
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  separator: { height: 1 },
  ingName: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
  ingMetaRow: { flexDirection: 'row', alignItems: 'center' },
  ingWeight: { fontSize: 13, fontWeight: '500' },
  ingDot: { marginHorizontal: 4, fontSize: 10 },
  ingCal: { fontSize: 13 },
  verticalLine: { width: 1, height: 12, marginHorizontal: 8 },
  miniMacro: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  miniMacroText: { fontSize: 12, marginLeft: 2 },
  miniMacroRow: { marginLeft: 8 },
  addIngredientBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  addIngredientText: { fontSize: 15, fontWeight: '600', marginLeft: 8 },
  helperText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  editBtn: { paddingVertical: 14, borderRadius: 24, alignItems: 'center', marginBottom: 20 },
  editBtnText: { fontSize: 16, fontWeight: '600' },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  saveBtn: { paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: 'bold' },
});

export default ScanResultView;