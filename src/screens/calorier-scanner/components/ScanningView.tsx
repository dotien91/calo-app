import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
  SafeAreaView // Dùng SafeAreaView để tránh tai thỏ
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { 
  Camera, 
  useCameraDevice, 
  useCameraPermission,
  PhotoFile
} from 'react-native-vision-camera';
import { 
  X, 
  Question, 
  Image as ImageIcon, 
  MagicWand, 
} from 'phosphor-react-native';
import Svg, { Path, G } from 'react-native-svg';
import { translations } from '@localization';

const { width } = Dimensions.get("window");

// --- CẤU HÌNH UI ---
const FRAME_SIZE = width * 0.7; 
const STROKE_WIDTH = 4;
const ARM_LENGTH = 40;
const CORNER_RADIUS = 20;

interface ScanningViewProps {
  image: any;
  status: 'idle' | 'uploading' | 'success' | 'error';
  onCapture: (photo: PhotoFile) => void;
  onSelectLibrary: () => void;
  onClose: () => void;
  hideHeader?: boolean;
}

const ScanningView = ({ 
  image, 
  status, 
  onCapture, 
  onSelectLibrary,
  onClose,
  hideHeader = false,
}: ScanningViewProps) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((result) => {
        if (!result) {
          Alert.alert(
            (translations as any).scanner.cameraPermissionTitle || "Quyền Camera",
            (translations as any).scanner.cameraPermissionMessage || "Cần quyền camera để tiếp tục",
            [
              { text: "Hủy" },
              { text: "Cài đặt", onPress: () => Linking.openSettings() },
            ],
          );
        }
      });
    }
  }, [hasPermission]);

  const handleTapShutter = useCallback(async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current.takePhoto({ flash: flash, enableShutterSound: true });
      onCapture(photo); 
    } catch (e) { console.error(e); }
  }, [camera, flash, onCapture]);

  const toggleFlash = () => setFlash(prev => prev === 'off' ? 'on' : 'off');

  const showCamera = device != null && hasPermission && !image;
  const imageSource = image ? { uri: image.uri } : null;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* 1. HEADER (Cố định ở trên, nền đen) */}
      {!hideHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <X size={24} color="#FFF" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CaloSnap</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Question size={24} color="#FFF" weight="bold" />
          </TouchableOpacity>
        </View>
      )}

      {/* 2. MIDDLE AREA (Vùng xám - Camera & Khung quét) */}
      {/* flex: 1 giúp vùng này tự co giãn lấp đầy khoảng trống giữa Header và Footer */}
      <View style={styles.middleContainer}>
        
        {/* Lớp nền Camera/Ảnh */}
        {imageSource ? (
          <FastImage source={imageSource} style={StyleSheet.absoluteFill} resizeMode="contain"/>
        ) : showCamera ? (
          <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} resizeMode="cover"/>
        ) : (
          <View style={styles.placeholderCamera}>
             <ActivityIndicator size="small" color="#666" />
             <Text style={styles.guideText}>Đang tải Camera...</Text>
          </View>
        )}

        {/* Lớp Khung quét (Overlay lên vùng giữa) */}
        <View style={styles.scanFrameContainer} pointerEvents="none">
           <View style={styles.scanFrame}>
              <Svg height="100%" width="100%" viewBox={`0 0 ${FRAME_SIZE} ${FRAME_SIZE}`}>
                <G fill="none" stroke="#FFF" strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
                  <Path d={`M 0 ${ARM_LENGTH} V ${CORNER_RADIUS} Q 0 0 ${CORNER_RADIUS} 0 H ${ARM_LENGTH}`} />
                  <Path d={`M ${FRAME_SIZE - ARM_LENGTH} 0 H ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} 0 ${FRAME_SIZE} ${CORNER_RADIUS} V ${ARM_LENGTH}`} />
                  <Path d={`M ${FRAME_SIZE} ${FRAME_SIZE - ARM_LENGTH} V ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} ${FRAME_SIZE} ${FRAME_SIZE - CORNER_RADIUS} ${FRAME_SIZE} H ${FRAME_SIZE - ARM_LENGTH}`} />
                  <Path d={`M ${ARM_LENGTH} ${FRAME_SIZE} H ${CORNER_RADIUS} Q 0 ${FRAME_SIZE} 0 ${FRAME_SIZE - CORNER_RADIUS} V ${FRAME_SIZE - ARM_LENGTH}`} />
                </G>
              </Svg>
           </View>
           
           {status === 'uploading' && (
             <View style={styles.loadingBadge}>
               <ActivityIndicator color="#FFF" size="small" style={{marginRight: 8}}/>
               <Text style={styles.loadingText}>Đang phân tích...</Text>
             </View>
           )}
        </View>
      </View>

      {/* 3. FOOTER CONTROLS (Cố định ở dưới, nền đen) */}
      {!image && (
        <View style={styles.bottomContainer}>
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.sideButton} onPress={onSelectLibrary}>
                    <View style={styles.galleryIconOverlay}><ImageIcon size={24} color="#FFF" /></View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleTapShutter} style={styles.shutterButtonOuter}>
                    <View style={styles.shutterButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
                    <View style={[styles.iconCircle, flash === 'on' && styles.activeIcon]}>
                        <MagicWand size={24} color={flash === 'on' ? "#000" : "#FFF"} weight={flash === 'on' ? "fill" : "regular"}/>
                    </View>
                </TouchableOpacity>
            </View>
            
            <View style={styles.modeSelector}>
                <Text style={styles.modeText}>GIỌNG NÓI</Text>
                <Text style={[styles.modeText, styles.activeModeText]}>HÌNH ẢNH</Text>
                <Text style={styles.modeText}>THỦ CÔNG</Text>
            </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: '#000' // Nền đen tổng thể
  },

  // --- 1. Header Styles ---
  header: { 
    height: 60, // Chiều cao cố định
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    backgroundColor: '#000', // Nền đen tách biệt
    zIndex: 10 
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', opacity: 0.9 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },

  // --- 2. Middle Container (Vùng xám) ---
  middleContainer: {
    flex: 1, // Quan trọng: Chiếm hết khoảng trống còn lại
    position: 'relative',
    backgroundColor: '#1c1c1e', // Màu xám như ảnh
    overflow: 'hidden', // Bo gọn camera vào trong
    // borderRadius: 20, // Nếu muốn bo góc vùng camera như ảnh iOS mới thì uncomment dòng này
    // marginHorizontal: 0, 
  },
  
  placeholderCamera: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  guideText: { color: '#8E8E93', fontSize: 14 },

  // --- Scan Frame (Căn giữa tuyệt đối trong Middle Container) ---
  scanFrameContainer: {
    ...StyleSheet.absoluteFillObject, // Phủ lên middleContainer
    justifyContent: 'center', 
    alignItems: 'center',     
    zIndex: 5,
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    padding: STROKE_WIDTH / 2, 
  },
  
  loadingBadge: { 
    position: 'absolute', flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(46, 204, 113, 0.9)', 
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 
  },
  loadingText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  // --- 3. Bottom Controls ---
  bottomContainer: { 
    backgroundColor: '#000', // Nền đen tách biệt
    paddingBottom: 20, 
    paddingTop: 30, 
    alignItems: 'center',
    zIndex: 10,
    // Không dùng position absolute nữa
  },
  actionRow: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', 
    width: '100%', paddingHorizontal: 30, marginBottom: 30 
  },
  sideButton: { width: 50, alignItems: 'center' },
  galleryIconOverlay: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  activeIcon: { backgroundColor: '#FFD700' },
  
  shutterButtonOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  shutterButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF' },
  
  modeSelector: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  modeText: { color: '#8E8E93', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  activeModeText: { color: '#FFF', fontWeight: 'bold' },
});

export default ScanningView;