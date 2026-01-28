import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Camera, X } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

interface ScanningViewProps {
  image: any;
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error'; // Định nghĩa lại type cho rõ ràng
  onCapture: () => void;
  onClose: () => void;
}

const ScanningView = ({ image, status, onCapture, onClose }: ScanningViewProps) => {
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  // Hiệu ứng nhấp nháy chữ
  useEffect(() => {
    if (image) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [image]);

  return (
    <View style={styles.scanContainer}>
      <StatusBar barStyle="light-content" />

      {/* HEADER ẨN (Để nút Close) */}
      <View style={styles.scanHeader}>
         {image && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
               <X size={24} color="#FFF" />
            </TouchableOpacity>
         )}
      </View>

      {/* 1. KHUNG CAMERA / ẢNH */}
      <View style={styles.cameraContainer}>
        {image ? (
          <FastImage 
            source={{ uri: image.uri }} 
            style={styles.cameraImage} 
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity style={styles.placeholderBox} onPress={onCapture}>
            <Camera size={48} color="#666" weight="light" />
            <Text style={styles.placeholderText}>Chạm để chụp món ăn</Text>
          </TouchableOpacity>
        )}

        {/* Overlay Khung Quét */}
        <View style={styles.overlayContainer} pointerEvents="none">
           <View style={[styles.corner, styles.topLeft]} />
           <View style={[styles.corner, styles.topRight]} />
           <View style={[styles.corner, styles.bottomLeft]} />
           <View style={[styles.corner, styles.bottomRight]} />
           
           {/* Hiệu ứng viền xanh lá sáng dưới đáy (chỉ hiện khi có ảnh) */}
           {image && <View style={styles.bottomGlow} />}
        </View>
      </View>

      {/* 2. TRẠNG THÁI TEXT */}
      <View style={styles.statusContainer}>
        {image ? (
          <>
            <Text style={styles.statusSubText}>
              {status === 'uploading' ? 'Đang tải ảnh lên...' : 'Đang chuẩn bị kết quả'}
            </Text>
            <Animated.Text style={[styles.statusMainText, { opacity: fadeAnim }]}>
              {status === 'uploading' ? 'Vui lòng đợi...' : 'Sắp xong rồi!'}
            </Animated.Text>
          </>
        ) : (
          <Text style={styles.statusSubText}>Sẵn sàng quét</Text>
        )}
      </View>

      {/* 3. FOOTER TEXT */}
      <View style={styles.scanFooter}>
        <Text style={styles.footerText}>
          Vui lòng không đóng ứng dụng hoặc khoá thiết bị của bạn
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanHeader: {
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 20,
    zIndex: 20,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  cameraContainer: {
    width: width * 0.9,
    height: width * 0.75,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 40,
    backgroundColor: '#1A1D21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 12,
    fontSize: 16,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  corner: {
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 4,
    borderRadius: 8,
    position: 'absolute',
  },
  topLeft: { top: 20, left: 20, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 20, right: 20, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 20, left: 20, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 20, right: 20, borderLeftWidth: 0, borderTopWidth: 0 },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2ECC71',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
    height: 80,
  },
  statusSubText: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 12,
  },
  statusMainText: {
    color: '#2ECC71',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scanFooter: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 40,
  },
  footerText: {
    color: '#636366',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default ScanningView;