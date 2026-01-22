import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  styles: any;
  COLORS: any;
  Icon: React.ElementType;
  label: string;
  value: string;
};

const DailyProgressItem = ({ styles, COLORS, Icon, label, value }: Props) => {
  return (
    <View style={[styles.dailyProgressItem, { backgroundColor: COLORS.card }]}> 
      <Icon size={24} color={COLORS.text} weight="regular" />
      <View style={styles.dailyProgressInfo}>
        <Text style={[styles.dailyProgressLabel, { color: COLORS.subText }]}>{label}</Text>
        <Text style={[styles.dailyProgressValue, { color: COLORS.text }]}>{value}</Text>
      </View>
    </View>
  );
};

export default DailyProgressItem;
