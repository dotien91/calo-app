import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { goBack, getRoute } from '@helpers/navigation.helper';
import useStore from '@services/zustand/store';

import ScanResultView from './components/ScanResultView';
import Header from '@shared-components/header/Header';
import { translations } from '@localization';
import { createStyles } from './calorier.scanner.screen.style';

const CalorieResultScreen = () => {
  const route = getRoute() as any;
  const data = route?.params?.data;
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS, styles } = useMemo(() => createStyles(isLightMode), [isLightMode]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <Header
        text={(translations as any).scanner.mealDetail}
        onPressLeft={goBack}
        customStyle={{ backgroundColor: COLORS.bg, marginBottom: 0, shadowOpacity: 0, elevation: 0 }}
      />
      <ScanResultView data={data} readOnly hideHeaderNav onBack={goBack} COLORS={COLORS} />
    </SafeAreaView>
  );
};

export default CalorieResultScreen;

