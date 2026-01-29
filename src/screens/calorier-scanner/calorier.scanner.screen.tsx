import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. IMPORT COMPONENTS
import ScanningView from './components/ScanningView';
import ScanResultView from './components/ScanResultView';

// 2. IMPORT HOOKS & SERVICES
import { useAnalysisImageFood } from '@helpers/hooks/useAnalysisImageFood';
import { showToast } from '@helpers/super.modal.helper';
import { goBack } from '@helpers/navigation.helper';
import eventEmitter from '@services/event-emitter';
import { createManualCalorie } from '@services/api/calorie.api';
import Header from '@shared-components/header/Header';
import { translations } from '@localization';
import useStore from '@services/zustand/store';
import { createStyles } from './calorier.scanner.screen.style';

// --- TYPES MAPPING (Nếu file hook chưa export đủ type UI) ---
// Nếu bạn đã định nghĩa type trong hook thì import vào, nếu chưa thì định nghĩa tại đây để map.
type ViewMode = 'SCANNING' | 'RESULT';

const CalorieScannerScreen = () => {
  const isLightMode = useStore((state) => state.isLightMode);
  const { COLORS, styles } = useMemo(() => createStyles(isLightMode), [isLightMode]);

  const [viewMode, setViewMode] = useState<ViewMode>('SCANNING');
  const [foodResult, setFoodResult] = useState<any | null>(null);

  // --- SỬ DỤNG HOOK (Logic chính nằm ở đây) ---
  const {
    image,             // Ảnh preview
    status,            // Trạng thái upload
    analysisResult,    // Kết quả API
    onSelectPicture,   // Hàm mở thư viện
    onTakePhoto,       // Hàm nhận ảnh từ Camera
    clearImage,        // Hàm reset
  } = useAnalysisImageFood(1);

  // --- EFFECT: LẮNG NGHE KẾT QUẢ TỪ HOOK ---
  useEffect(() => {
    // Khi API thành công VÀ đang ở màn hình Scan -> Chuyển sang màn Result
    if (status === 'success' && analysisResult && viewMode === 'SCANNING') {
      
      // Map Data từ API Response -> UI Format
      const mappedData = {
        name: analysisResult.food_name,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        healthScore: analysisResult.health_score || 0,
        // Ưu tiên ảnh từ server (đã crop), fallback về ảnh local
        image: analysisResult.image_url || image?.uri, 
        
        total: {
          weight: analysisResult.total_weight,
          calories: analysisResult.total_calories,
          carbs: analysisResult.total_carbs,
          protein: analysisResult.total_protein,
          fat: analysisResult.total_fat,
        },
        ingredients: analysisResult.ingredients.map((ing, index) => ({
          id: index, // ID tạm để xóa trên UI
          name: ing.name,
          weight: ing.weight,
          unit: ing.unit,
          cal: ing.calories,
          c: ing.carbs,
          p: ing.protein,
          f: ing.fat,
        }))
      };

      setFoodResult(mappedData);
      setViewMode('RESULT');
      showToast({ type: 'success', message: (translations as any).scanner.analysisSuccess });
    }
  }, [status, analysisResult]);

  // --- LOGIC: XÓA THÀNH PHẦN (Ở màn hình kết quả) ---
  const handleRemoveIngredient = (idToRemove: number | string) => {
    if (!foodResult) return;
    Alert.alert((translations as any).scanner.deleteIngredientTitle, (translations as any).scanner.deleteIngredientMessage, [
        { text: (translations as any).scanner.cancel, style: "cancel" },
        { 
          text: (translations as any).scanner.delete, style: "destructive",
          onPress: () => {
            const newIngredients = foodResult.ingredients.filter((item: any) => item.id !== idToRemove);
            
            // Tính lại tổng dinh dưỡng
            const newTotal = newIngredients.reduce((acc: any, curr: any) => ({
              weight: acc.weight + curr.weight,
              calories: acc.calories + curr.cal,
              carbs: acc.carbs + curr.c,
              protein: acc.protein + curr.p,
              fat: acc.fat + curr.f,
            }), { weight: 0, calories: 0, carbs: 0, protein: 0, fat: 0 });

            setFoodResult({
              ...foodResult,
              ingredients: newIngredients,
              total: {
                weight: Math.round(newTotal.weight),
                calories: Math.round(newTotal.calories),
                carbs: Number(newTotal.carbs.toFixed(1)),
                protein: Number(newTotal.protein.toFixed(1)),
                fat: Number(newTotal.fat.toFixed(1)),
              }
            });
          }
        }
    ]);
  };

  // --- ACTION: QUAY LẠI CHỤP ---
  const handleBackToScan = () => {
    setViewMode('SCANNING');
    clearImage();       // Reset hook
    setFoodResult(null); // Clear UI data
  };

  // --- ACTION: LƯU NHẬT KÝ ---
  const handleSave = async () => {
    if (!foodResult) return;
    try {
      // Map UI Data -> API Payload
      const apiData = {
        food_name: foodResult.name,
        image_url: foodResult.image,
        total_weight: foodResult.total.weight,
        total_calories: foodResult.total.calories,
        total_carbs: foodResult.total.carbs,
        total_protein: foodResult.total.protein,
        total_fat: foodResult.total.fat,
        ingredients: foodResult.ingredients.map((ing: any) => ({
          name: ing.name,
          weight: ing.weight,
          unit: ing.unit || "g",
          calories: ing.cal,
          carbs: ing.c, protein: ing.p, fat: ing.f,
        })),
      };

      await createManualCalorie(apiData);
      showToast({ type: 'success', message: (translations as any).scanner.saveSuccess });
      eventEmitter.emit('reload_home_page');
      goBack();
    } catch (error: any) {
      showToast({ type: 'error', message: (translations as any).scanner.saveError });
    }
  };

  // --- RENDER ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <Header
        text={viewMode === 'SCANNING' ? (translations as any).scanner.title : (translations as any).scanner.result}
        onPressLeft={viewMode === 'SCANNING' ? goBack : handleBackToScan}
        customStyle={{ backgroundColor: COLORS.bg, marginBottom: 0, shadowOpacity: 0, elevation: 0 }}
      />
      {viewMode === 'SCANNING' ? (
        <ScanningView 
          // Truyền state từ Hook
          image={image}
          status={status === 'uploading' ? 'uploading' : 'idle'} 
          
          // Truyền Action từ Hook
          onCapture={onTakePhoto}        // Hook tự xử lý PhotoFile
          onSelectLibrary={onSelectPicture} // Hook tự xử lý Library
          hideHeader
          onClose={() => {
            clearImage();
            setViewMode('SCANNING');
            setFoodResult(null);
            goBack();
          }}
        />
      ) : (
        <ScanResultView 
          data={foodResult} 
          onBack={handleBackToScan}
          onSave={handleSave}
          onRemoveItem={handleRemoveIngredient} 
          hideHeaderNav
          COLORS={COLORS}
        />
      )}
    </SafeAreaView>
  );
};

export default CalorieScannerScreen;