import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. IMPORT COMPONENTS UI
import ScanningView from './components/ScanningView';
import ScanResultView from './components/ScanResultView';

// 2. IMPORT HOOKS & HELPERS
import { useAnalysisImageFood } from '@helpers/hooks/useAnalysisImageFood';
import { showToast } from '@helpers/super.modal.helper';
import { goBack } from '@helpers/navigation.helper';
import eventEmitter from '@services/event-emitter';
import { createManualCalorie } from '@services/api/calorie.api';

// --- ĐỊNH NGHĨA TYPES CHO UI ---
// (Dùng riêng cho việc hiển thị, khác với Type của API)

export type IngredientUI = {
  id: number | string; // ID để xử lý xóa
  name: string;
  weight: number;
  unit?: string;
  cal: number;
  c: number; // Carb
  p: number; // Protein
  f: number; // Fat
};

export type FoodResultUI = {
  name: string;
  time: string;
  healthScore: number;
  image: string;
  total: {
    weight: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  ingredients: IngredientUI[];
};

type ViewMode = 'SCANNING' | 'RESULT';

const CalorieScannerScreen = () => {
  // --- STATE QUẢN LÝ MÀN HÌNH ---
  const [viewMode, setViewMode] = useState<ViewMode>('SCANNING');
  
  // State chứa dữ liệu món ăn đang hiển thị (Local State)
  // Ta cần state này để user có thể Xóa thành phần mà không làm hỏng dữ liệu gốc từ API
  const [foodResult, setFoodResult] = useState<FoodResultUI | null>(null);

  // --- SỬ DỤNG HOOK LOGIC ---
  const {
    image,
    status,         // 'idle' | 'uploading' | 'success' | 'error'
    analysisResult, // Dữ liệu gốc từ API trả về
    onSelectPicture,
    clearImage,
  } = useAnalysisImageFood(1);

  console.log("analysisResult", analysisResult);

  // =================================================================
  // 1. EFFECT: LẮNG NGHE KẾT QUẢ TỪ API -> CHUYỂN MÀN HÌNH
  // =================================================================
  useEffect(() => {
    // Chỉ chạy khi status thành công VÀ đang ở màn hình Scan
    if (status === 'success' && analysisResult && viewMode === 'SCANNING') {
      
      // MAP DATA: Chuyển từ API Response (analysisResult) -> UI State (foodResult)
      const mappedData: FoodResultUI = {
        name: analysisResult.food_name,
        // Lấy giờ hiện tại
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        healthScore: analysisResult.health_score || 0,
        
        // Ưu tiên ảnh URL từ server (đã crop/xử lý), nếu không có thì dùng ảnh local
        image: analysisResult.image_url || image?.uri, 
        
        total: {
          weight: analysisResult.total_weight,
          calories: analysisResult.total_calories,
          carbs: analysisResult.total_carbs,
          protein: analysisResult.total_protein,
          fat: analysisResult.total_fat,
        },
        
        // Map ingredients và thêm ID tạm để thao tác xóa
        ingredients: analysisResult.ingredients.map((ing, index) => ({
          id: index, // Dùng index làm ID tạm
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
      showToast({ type: 'success', message: 'Phân tích thành công!' });
    }

    // Xử lý lỗi
    if (status === 'error') {
      // Logic clear ảnh hoặc giữ lại tùy UX bạn muốn
      // clearImage(); 
    }
  }, [status, analysisResult]); // Chạy lại khi status hoặc data thay đổi

  console.log("foodResult", foodResult);

  // =================================================================
  // 2. LOGIC: XÓA THÀNH PHẦN & TÍNH LẠI (RECALCULATE)
  // =================================================================
  const handleRemoveIngredient = (idToRemove: number | string) => {
    if (!foodResult) return;

    Alert.alert(
      "Xóa thành phần", 
      "Bạn có chắc muốn xóa thành phần này khỏi món ăn?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive",
          onPress: () => {
            // A. Lọc bỏ thành phần có id tương ứng
            const newIngredients = foodResult.ingredients.filter(item => item.id !== idToRemove);

            // B. Tính toán lại tổng dinh dưỡng (Reduce)
            const newTotal = newIngredients.reduce((acc, curr) => ({
              weight: acc.weight + curr.weight,
              calories: acc.calories + curr.cal,
              carbs: acc.carbs + curr.c,
              protein: acc.protein + curr.p,
              fat: acc.fat + curr.f,
            }), { weight: 0, calories: 0, carbs: 0, protein: 0, fat: 0 });

            // C. Cập nhật State UI
            setFoodResult({
              ...foodResult,
              ingredients: newIngredients,
              total: {
                weight: Math.round(newTotal.weight),
                calories: Math.round(newTotal.calories),
                // Làm tròn 1 chữ số thập phân để hiển thị đẹp
                carbs: Number(newTotal.carbs.toFixed(1)),
                protein: Number(newTotal.protein.toFixed(1)),
                fat: Number(newTotal.fat.toFixed(1)),
              }
            });
          }
        }
      ]
    );
  };

  // =================================================================
  // 3. CÁC ACTION KHÁC (BACK / SAVE)
  // =================================================================
  
  // Quay lại màn hình chụp (Reset toàn bộ)
  const handleBackToScan = () => {
    setViewMode('SCANNING');
    clearImage();       // Reset hook upload
    setFoodResult(null); // Clear data cũ
  };

  // Lưu vào nhật ký (Gọi API Save)
  const handleSave = async () => {
    if (!foodResult) return;

    try {
      console.log('💾 Saving Food Log:', foodResult);
      
      // Chuẩn bị dữ liệu để gửi lên API
      const apiData = {
        food_name: foodResult.name,
        // Lưu luôn image_url để backend có thể hiển thị lại ảnh món ăn
        image_url: foodResult.image,
        total_weight: foodResult.total.weight,
        total_calories: foodResult.total.calories,
        total_carbs: foodResult.total.carbs,
        total_protein: foodResult.total.protein,
        total_fat: foodResult.total.fat,
        ingredients: foodResult.ingredients.map(ing => ({
          name: ing.name,
          weight: ing.weight,
          unit: (ing.unit as "g" | "ml") || "g",
          calories: ing.cal,
          carbs: ing.c,
          protein: ing.p,
          fat: ing.f,
        })),
      };

      console.log("apiData", apiData);

      // Gọi API lưu nhật ký
      await createManualCalorie(apiData);
      
      showToast({ type: 'success', message: 'Đã lưu bữa ăn vào nhật ký!' });
      
      // Về home và báo home refresh data
      eventEmitter.emit('reload_home_page');
      goBack();
    } catch (error: any) {
      console.error('Error saving food log:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi khi lưu dữ liệu.';
      showToast({ type: 'error', message: errorMessage });
    }
  };

  // =================================================================
  // 4. RENDER
  // =================================================================
  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 'SCANNING' ? (
        <ScanningView 
          image={image}
          // Hook trả về 'uploading' khi đang xử lý -> Map sang UI status
          status={status === 'uploading' ? 'uploading' : 'idle'} 
          onCapture={onSelectPicture}
          onClose={clearImage}
        />
      ) : (
        <ScanResultView 
          data={foodResult} 
          onBack={handleBackToScan}
          onSave={handleSave}
          // Truyền hàm xóa xuống component con
          onRemoveItem={handleRemoveIngredient} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101214', // Màu nền đen chủ đạo
  },
});

export default CalorieScannerScreen;