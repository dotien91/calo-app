import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GrainsIcon } from 'phosphor-react-native';
import { IconProtein, IconFat } from '@assets/svg/CustomeSvg';
import { translations } from '@localization';

export const MACRO_COLORS = {
  carb: '#3B82F6',
  protein: '#EF4444',
  fat: '#EAB308',
};

/** Fallback khi chưa có translations.home.macros */
export const MACRO_LABELS = {
  carb: 'Đường bột',
  protein: 'Chất đạm',
  fat: 'Chất béo',
};

const getMacroLabels = () => ({
  protein: translations.home?.macros?.PROTEIN ?? MACRO_LABELS.protein,
  carb: translations.home?.macros?.CARBS ?? MACRO_LABELS.carb,
  fat: translations.home?.macros?.FAT ?? MACRO_LABELS.fat,
});

export type MacroBadgeLayout = 'horizontal' | 'vertical';

export interface MacroBadgeRowProps {
  carbs?: number;
  protein?: number;
  fat?: number;
  layout?: MacroBadgeLayout;
  iconSize?: number;
  textColor?: string;
  colors?: Partial<typeof MACRO_COLORS>;
  showLabel?: boolean;
  percentages?: { carbs: number; protein: number; fat: number };
  style?: object;
}

const MacroBadgeRow: React.FC<MacroBadgeRowProps> = ({
  carbs = 0,
  protein = 0,
  fat = 0,
  layout = 'horizontal',
  iconSize = 20,
  textColor,
  colors: customColors,
  showLabel = false,
  percentages,
  style,
}) => {
  const { colors: themeColors } = useTheme();
  const colors = { ...MACRO_COLORS, ...customColors };
  const finalTextColor = textColor ?? themeColors?.text;
  const labelColor = textColor ?? themeColors?.textOpacity8;
  const isVertical = layout === 'vertical';
  const labels = getMacroLabels();

  const renderTextContent = (label: string, value: number, pct?: number) => {
    const valueText = pct !== undefined ? `${pct}% (${value}g)` : `${value}g`;
    
    return (
      <>
        {showLabel && (
          <Text style={[localStyles.label, { color: labelColor }]}>{label}</Text>
        )}
        <Text style={[localStyles.value, { color: finalTextColor }]}>{valueText}</Text>
      </>
    );
  };

  return (
    <View style={[localStyles.row, isVertical && localStyles.rowVertical, style]}>
      
      <View style={[localStyles.item, isVertical && localStyles.itemVertical]}>
        <IconProtein size={iconSize} color={colors.protein} />
        {renderTextContent(labels.protein, protein, percentages?.protein)}
      </View>
      <View style={[localStyles.item, isVertical && localStyles.itemVertical]}>
        <GrainsIcon size={iconSize} color={colors.carb} weight="fill" />
        {renderTextContent(labels.carb, carbs, percentages?.carbs)}
      </View>
      <View style={[localStyles.item, isVertical && localStyles.itemVertical]}>
        <IconFat size={iconSize} color={colors.fat} />
        {renderTextContent(labels.fat, fat, percentages?.fat)}
      </View>

    </View>
  );
};

const localStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  itemVertical: {
    marginRight: 0,
    marginBottom: 12,
    justifyContent: 'flex-start', // Căn trái
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 10,
    flex: 1, 
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default MacroBadgeRow;