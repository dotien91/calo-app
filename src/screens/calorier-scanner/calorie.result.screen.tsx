import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { goBack, getRoute } from '@helpers/navigation.helper';

import ScanResultView from './components/ScanResultView';
import Header from '@shared-components/header/Header';
import { translations } from '@localization';

const CalorieResultScreen = () => {
  const route = getRoute() as any;
  const data = route?.params?.data;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        text={(translations as any).scanner.mealDetail}
        onPressLeft={goBack}
        customStyle={{ backgroundColor: '#000', marginBottom: 0, shadowOpacity: 0, elevation: 0 }}
      />
      <ScanResultView data={data} readOnly hideHeaderNav onBack={goBack} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default CalorieResultScreen;

