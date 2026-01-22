import React from 'react';
import { View, Text } from 'react-native';

type MacroCardProps = {
  title: string;
  current?: number;
  total?: number;
  color?: string;
  progressBarBg?: string;
  styles: any;
  COLORS: any;
};

const MacroCard = ({
  title,
  current = 0,
  total = 100,
  color,
  progressBarBg,
  styles,
  COLORS,
}: MacroCardProps) => {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return (
    <View style={[styles.macroCard, { backgroundColor: COLORS.card }]}>
      <Text style={[styles.macroTitle, { color: color || COLORS.subText }]}>{title}</Text>
      <Text style={[styles.macroValue, { color: COLORS.text }]}>{current}/{total}</Text>
      <View style={[styles.progressBarBg, { backgroundColor: progressBarBg || COLORS.progressBarBg }]}>
        <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: COLORS.primary }]} />
      </View>
    </View>
  );
};

export default MacroCard;
