import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

// Import hook mới
import { useUploadFile } from '@helpers/hooks/useUploadFile';
import { showToast } from '@helpers/super.modal.helper';

const { width } = Dimensions.get('window');

const CalorieScannerScreen = () => {
  const theme = useTheme();
  const { colors } = theme;
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. KHỞI TẠO HOOK MỚI
  const {
    image,           // Object ảnh hiện tại (chứa uri, isLocal...)
    status,          // 'idle' | 'uploading' | 'success' | 'error'
    onSelectPicture, // Hàm mở thư viện/camera
    clearImage,      // Hàm xóa ảnh
  } = useUploadFile(1);

  // 2. HÀM CHỌN ẢNH MỚI
  const handleCapture = () => {
    if (isAnalyzing) return;
    
    // Xóa ảnh cũ & reset status trước khi chụp mới
    clearImage();
    
    // Gọi hàm chọn ảnh
    onSelectPicture();
  };

  // 3. HÀM TÍNH CALO (GỌI AI)
  const onAnalyzeFood = async () => {
    // Check trạng thái upload từ hook
    if (status === 'uploading') {
      showToast({ type: 'info', message: 'Đang tải ảnh lên server, vui lòng đợi...' });
      return;
    }

    if (status === 'error') {
      showToast({ type: 'error', message: 'Upload ảnh thất bại, vui lòng thử lại' });
      return;
    }

    // Nếu chưa có ảnh hoặc ảnh chưa lên server (vẫn là local)
    if (!image || image.isLocal) {
      showToast({ type: 'error', message: 'Vui lòng đợi ảnh upload xong' });
      return;
    }

    // Lấy URL Remote
    const remoteUrl = image.uri;
    if (!remoteUrl) {
      showToast({ type: 'error', message: 'Lỗi: Không tìm thấy đường dẫn ảnh' });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('🔗 Sending URL to AI:', remoteUrl);

      // --- KHU VỰC GỌI API AI ---
      // Ví dụ: const res = await aiService.scanFood(remoteUrl);
      
      // Giả lập delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult = {
        foodName: 'Cơm Tấm Sườn Bì',
        calories: 650,
        protein: '35g',
        fat: '20g',
        carbs: '80g',
      };

      Alert.alert(
        '🥗 Kết quả Phân Tích',
        `Món: ${mockResult.foodName}\n🔥 Calo: ${mockResult.calories} kcal\n💪 Protein: ${mockResult.protein}`
      );
      // ---------------------------

    } catch (error) {
      console.error(error);
      showToast({ type: 'error', message: 'Không thể phân tích ảnh này. Thử lại sau.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  console.log("image", image);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background || '#F8F9FA' }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border || '#EEE' }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Calorie Scanner 🥗</Text>
      </View>

      <View style={styles.content}>
        {/* KHUNG HIỂN THỊ ẢNH */}
        <View style={[styles.imageCard, { backgroundColor: colors.card || '#FFF', borderColor: colors.border || '#DDD' }]}>
          {image ? (
            <>
              <FastImage
                style={styles.image}
                source={{ uri: image.uri }}
                resizeMode={FastImage.resizeMode.cover}
              />

              {/* Nút Xóa Ảnh */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={clearImage}
                disabled={isAnalyzing || status === 'uploading'}
              >
                <Icon name="close-circle" size={30} color="#FF5252" />
              </TouchableOpacity>

              {/* Loading Overlay khi đang Upload */}
              {status === 'uploading' && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#FFF" />
                  <Text style={styles.loadingText}>Đang tải ảnh lên...</Text>
                </View>
              )}
            </>
          ) : (
            // Giao diện khi chưa có ảnh
            <TouchableOpacity style={styles.placeholder} onPress={handleCapture}>
              <Icon name="camera-plus-outline" size={60} color={colors.text || '#999'} />
              <Text style={[styles.placeholderText, { color: colors.text || '#666' }]}>
                Chạm để chụp ảnh món ăn
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* KHU VỰC NÚT BẤM */}
        <View style={styles.actionContainer}>
          {/* Trường hợp 1: Chưa có ảnh -> Nút Chụp */}
          {!image && (
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <Icon name="camera" size={24} color="#FFF" />
              <Text style={styles.btnText}>Chụp / Chọn Ảnh</Text>
            </TouchableOpacity>
          )}

          {/* Trường hợp 2: Có ảnh & Upload thành công -> Nút Tính Calo */}
          {image && status === 'success' && (
            <TouchableOpacity
              style={styles.analyzeBtn}
              onPress={onAnalyzeFood}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="fire" size={24} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>Tính Calo Ngay</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Trường hợp 3: Upload lỗi -> Nút Thử lại */}
          {image && status === 'error' && (
             <TouchableOpacity style={[styles.captureBtn, { backgroundColor: '#FF5252' }]} onPress={handleCapture}>
               <Icon name="refresh" size={24} color="#FFF" />
               <Text style={styles.btnText}>Thử lại</Text>
             </TouchableOpacity>
          )}
        </View>

        {/* Hướng dẫn nhỏ */}
        {!image && (
          <Text style={[styles.hintText, { color: colors.text || '#888' }]}>
            * Mẹo: Hãy chụp rõ món ăn và chụp từ trên xuống để AI nhận diện tốt nhất.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    height: width * 0.9,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  captureBtn: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  analyzeBtn: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  hintText: {
    marginTop: 24,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});

export default CalorieScannerScreen;