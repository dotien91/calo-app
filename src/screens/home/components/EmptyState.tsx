import React from 'react';
import { View, Text } from 'react-native';
import { ForkKnife } from 'phosphor-react-native';
import { translations } from '@localization';

type Props = {
  styles: any;
  COLORS: any;
};

const EmptyState = ({ styles, COLORS }: Props) => {
  return (
    <View style={styles.recentSection}>
      <Text style={[styles.sectionTitle, { color: COLORS.text }]}>{translations.home?.recentActivity || 'Gần đây'}</Text>
      <View style={styles.emptyState}>
        <ForkKnife size={32} color={COLORS.emptyIconColor} weight="duotone" />
        <Text style={[styles.emptyTitle, { color: COLORS.text }]}>{translations.home?.emptyMealsTitle || 'Chưa có bữa ăn nào!'}</Text>
        <Text style={[styles.emptySub, { color: COLORS.subText }]}>{translations.home?.emptyMealsSub || 'Nhấn + để thêm bữa ăn đầu tiên trong ngày.'}</Text>
      </View>
    </View>
  );
};

export default EmptyState;
