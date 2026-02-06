import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GrainsIcon } from 'phosphor-react-native';
import { IconProtein, IconFat } from '@assets/svg/CustomeSvg';
import { translations } from '@localization';
import { palette } from '@theme/themes';


const getMacroLabels = () => ({
  protein: translations.home?.macros?.PROTEIN ,
  carb: translations.home?.macros?.CARBS,
  fat: translations.home?.macros?.FAT
});

export type MacroBadgeLayout = 'horizontal' | 'vertical';

export interface MacroBadgeRowProps {
  carbs?: number;
  protein?: number;
  fat?: number;
  layout?: MacroBadgeLayout;
  iconSize?: number;
  textColor?: string;
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
  showLabel = false,
  percentages,
  style,
}) => {
  const { colors: themeColors } = useTheme();
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
      <View style={[localStyles.item, isVertical && localStyles.itemVertical]}>
        <GrainsIcon size={iconSize} color={themeColors.carb} weight="fill" />
        {renderTextContent(labels.carb, carbs, percentages?.carbs)}
      </View>
        <IconProtein size={iconSize} color={themeColors.protein} />
        {renderTextContent(labels.protein, protein, percentages?.protein)}
      </View>
      <View style={[localStyles.item, isVertical && localStyles.itemVertical]}>
        <IconFat size={iconSize} color={themeColors.fat} />
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