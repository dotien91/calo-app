import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRoute, goBack } from '@helpers/navigation.helper';
import useStore from '@services/zustand/store';
import { showToast } from '@helpers/super.modal.helper';
import eventEmitter from '@services/event-emitter';

import ScanResultView from './components/ScanResultView';
import EditResultModal from './components/EditResultModal';
import Header from '@shared-components/header/Header';
import { translations } from '@localization';
import { createStyles } from './calorier.scanner.screen.style';
import { reanalyzeCalorie } from '@services/api/calorie.api';

function mapAnalysisToUIData(record: any) {
  return {
    name: record.food_name,
    time: record.createdAt
      ? new Date(record.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      : '--:--',
    healthScore: record.health_score || 0,
    image: record.image_url,
    total: {
      weight: record.total_weight || 0,
      calories: record.total_calories || 0,
      carbs: record.total_carbs || 0,
      protein: record.total_protein || 0,
      fat: record.total_fat || 0,
    },
    ingredients: (record.ingredients || []).map((ing: any, index: number) => ({
      id: index,
      name: ing.name,
      weight: ing.weight,
      unit: ing.unit,
      cal: ing.calories,
      c: ing.carbs,
      p: ing.protein,
      f: ing.fat,
    })),
  };
}

const CalorieResultScreen = () => {
  const route = getRoute() as any;
  const initialData = route?.params?.data;
  const analysisId = route?.params?.analysisId as string | undefined;
  const [data, setData] = useState(initialData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reanalyzeLoading, setReanalyzeLoading] = useState(false);
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS, styles } = useMemo(() => createStyles(isLightMode), [isLightMode]);

  const handleReanalyze = async (userEditHint: string) => {
    if (!analysisId) return;
    try {
      setReanalyzeLoading(true);
      const updated = await reanalyzeCalorie(analysisId, {
        user_edit_hint: userEditHint || undefined,
      });
      setData(mapAnalysisToUIData(updated));
      setShowEditModal(false);
      showToast({ type: 'success', message: (translations as any).scanner.reanalyzeSuccess ?? 'Đã phân tích lại thành công.' });
      eventEmitter.emit('reload_home_page');
    } catch (_) {
      showToast({ type: 'error', message: (translations as any).scanner.saveError });
    } finally {
      setReanalyzeLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <Header
        text={(translations as any).scanner.mealDetail}
        onPressLeft={() => {
          eventEmitter.emit('reload_home_page');
          goBack();
        }}
        customStyle={{ backgroundColor: COLORS.bg, marginBottom: 0, shadowOpacity: 0, elevation: 0 }}
      />
      {data && (
        <>
          <ScanResultView
            data={data}
            readOnly
            hideHeaderNav
            onBack={() => {
              eventEmitter.emit('reload_home_page');
              goBack();
            }}
            onEditResult={analysisId ? () => setShowEditModal(true) : undefined}
            COLORS={COLORS}
          />
          <EditResultModal
            visible={showEditModal}
            onClose={() => setShowEditModal(false)}
            onReanalyze={handleReanalyze}
            reanalyzeLoading={reanalyzeLoading}
            colors={{
              text: COLORS.text,
              card: COLORS.card,
              border: COLORS.border,
              accent: COLORS.accent ?? '#2ECC71',
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default CalorieResultScreen;

