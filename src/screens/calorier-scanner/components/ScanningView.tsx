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
  Platform
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
// 1. IMPORT SVG
import Svg, { Path, G } from 'react-native-svg';
import { translations } from '@localization';

const { width } = Dimensions.get("window");

// --- CẤU HÌNH SVG ---
const FRAME_SIZE = width * 0.75; // Kích thước khung vuông
const STROKE_WIDTH = 5;          // Độ dày nét
const ARM_LENGTH = 40;           // Độ dài cạnh góc
const CORNER_RADIUS = 16;        // Độ bo tròn

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
  // ... (Giữ nguyên logic Camera, Permission, Flash cũ) ...
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  // NOTE: Project typings for react-navigation do not expose useIsFocused.
  // We keep camera active while this screen is mounted.
  const isFocused = true;
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((result) => {
        if (!result) {
          Alert.alert(
            (translations as any).scanner.cameraPermissionTitle,
            (translations as any).scanner.cameraPermissionMessage,
            [
              { text: (translations as any).scanner.cancel },
              { text: (translations as any).scanner.openSettings, onPress: () => Linking.openSettings() },
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

  const showCamera = device != null && hasPermission && isFocused && !image;
  const imageSource = image ? { uri: image.uri } : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* LAYER 1: CAMERA PREVIEW (Giữ nguyên) */}
      <View style={styles.cameraPreview}>
        {imageSource ? (
          <FastImage source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover"/>
        ) : showCamera ? (
          <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} resizeMode="cover"/>
        ) : (
          <View style={styles.placeholderCamera}><Text style={styles.guideText}>Đang khởi động Camera...</Text></View>
        )}
      </View>

      {/* LAYER 2: HEADER (Giữ nguyên) */}
      {!hideHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}><X size={24} color="#FFF" weight="bold" /></TouchableOpacity>
          <Text style={styles.headerTitle}>CaloSnap</Text>
          <TouchableOpacity style={styles.iconButton}><Question size={24} color="#FFF" weight="bold" /></TouchableOpacity>
        </View>
      )}

      {/* === LAYER 3: FRAME UI (THAY THẾ BẰNG SVG) === */}
      <View style={styles.scanFrameContainer} pointerEvents="none">
         {/* Container cho khung quét */}
         <View style={styles.scanFrame}>
            <Svg height="100%" width="100%" viewBox={`0 0 ${FRAME_SIZE} ${FRAME_SIZE}`}>
              {/* Nhóm các đường nét có chung thuộc tính */}
              <G 
                fill="none" 
                stroke="#FFF" 
                strokeWidth={STROKE_WIDTH} 
                strokeLinecap="round" // Làm tròn đầu mút của nét vẽ
                strokeLinejoin="round" // Làm tròn góc nối
              >
                {/* Giải thích Path Data (d):
                  M: Move to (Di chuyển đến điểm)
                  V: Vertical line to (Vẽ đường dọc đến Y)
                  H: Horizontal line to (Vẽ đường ngang đến X)
                  Q: Quadratic Bezier (Vẽ đường cong bo góc: Q điểm_điều_khiển điểm_kết_thúc)
                */}

                {/* Góc Trên-Trái */}
                <Path d={`M 0 ${ARM_LENGTH} V ${CORNER_RADIUS} Q 0 0 ${CORNER_RADIUS} 0 H ${ARM_LENGTH}`} />
                
                {/* Góc Trên-Phải */}
                <Path d={`M ${FRAME_SIZE - ARM_LENGTH} 0 H ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} 0 ${FRAME_SIZE} ${CORNER_RADIUS} V ${ARM_LENGTH}`} />
                
                {/* Góc Dưới-Phải */}
                <Path d={`M ${FRAME_SIZE} ${FRAME_SIZE - ARM_LENGTH} V ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} ${FRAME_SIZE} ${FRAME_SIZE - CORNER_RADIUS} ${FRAME_SIZE} H ${FRAME_SIZE - ARM_LENGTH}`} />
                
                {/* Góc Dưới-Trái */}
                <Path d={`M ${ARM_LENGTH} ${FRAME_SIZE} H ${CORNER_RADIUS} Q 0 ${FRAME_SIZE} 0 ${FRAME_SIZE - CORNER_RADIUS} V ${FRAME_SIZE - ARM_LENGTH}`} />
              </G>
            </Svg>
         </View>
         
         {/* Badge Loading (Giữ nguyên) */}
         {status === 'uploading' && (
           <View style={styles.loadingBadge}>
             <ActivityIndicator color="#FFF" size="small" style={{marginRight: 8}}/>
             <Text style={styles.loadingText}>Đang phân tích...</Text>
           </View>
         )}
      </View>

      {/* LAYER 4: CONTROLS (Giữ nguyên) */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraPreview: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1c1c1e', justifyContent: 'center', alignItems: 'center' },
  placeholderCamera: { justifyContent: 'center', alignItems: 'center' },
  guideText: { color: '#8E8E93', fontSize: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 20, zIndex: 10 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', opacity: 0.9 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },

  // --- STYLES MỚI CHO KHUNG SVG ---
  scanFrameContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: 5,
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    // Padding nhẹ để nét vẽ SVG không bị cắt ở mép do strokeWidth
    padding: STROKE_WIDTH / 2, 
  },
  // Đã xóa các style corner, topLeft, topRight... cũ
  
  loadingBadge: { position: 'absolute', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 204, 113, 0.9)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  loadingText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  bottomContainer: { position: 'absolute', bottom: 0, width: '100%', paddingBottom: 40, paddingTop: 20, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10, alignItems: 'center' },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', paddingHorizontal: 30, marginBottom: 30 },
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