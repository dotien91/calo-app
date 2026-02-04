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
  SafeAreaView,
  Animated,
  Easing
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
  Image as ImageIcon, 
  MagicWand, 
} from 'phosphor-react-native';
import Svg, { Path, G } from 'react-native-svg';
import { translations } from '@localization';

const { width, height } = Dimensions.get("window");

// --- CẤU HÌNH UI CHO SCANNER — khung scan trùng với ảnh preview (sát header, full width, 4:3) ---
const PREVIEW_ASPECT = 3 / 4; // height/width
const FRAME_WIDTH = width;
const FRAME_HEIGHT = width * PREVIEW_ASPECT;
const STROKE_WIDTH = 5;
const ARM_LENGTH = 40;
const CORNER_RADIUS = 20;

const MASK_COLOR = 'rgba(0, 0, 0, 0.7)';

// Tính toán khoảng cách an toàn cho nút Close (tránh tai thỏ)
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 40;

interface ScanningViewProps {
  image: any;
  status: 'idle' | 'uploading' | 'success' | 'error';
  onCapture: (photo: PhotoFile) => void;
  onSelectLibrary: () => void;
  onClose: () => void;
}

const ScanningView = ({ 
  image, 
  status, 
  onCapture, 
  onSelectLibrary,
  onClose,
}: ScanningViewProps) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((result) => {
        // Handle permission
      });
    }
  }, [hasPermission]);

  useEffect(() => {
    if (status === 'uploading') {
      laserAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      laserAnim.stopAnimation();
    }
  }, [status]);

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

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_HEIGHT],
  });

  // 1. Giao diện Scanner (Overlay khi đang xử lý)
// 1. Giao diện Scanner (Overlay khi đang xử lý)
const renderScanningOverlay = () => {
  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {/* Khung scan trùng với ảnh: sát header, full width, cùng tỉ lệ 4:3 */}
      <View style={[styles.scanFrameWrap, { width: FRAME_WIDTH, height: FRAME_HEIGHT }]}>
        <Svg height="100%" width="100%" viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`} style={styles.corners}>
          <G fill="none" stroke="#FFF" strokeWidth={STROKE_WIDTH} strokeLinecap="round">
            <Path d={`M 0 ${ARM_LENGTH} V ${CORNER_RADIUS} Q 0 0 ${CORNER_RADIUS} 0 H ${ARM_LENGTH}`} />
            <Path d={`M ${FRAME_WIDTH - ARM_LENGTH} 0 H ${FRAME_WIDTH - CORNER_RADIUS} Q ${FRAME_WIDTH} 0 ${FRAME_WIDTH} ${CORNER_RADIUS} V ${ARM_LENGTH}`} />
            <Path d={`M ${FRAME_WIDTH} ${FRAME_HEIGHT - ARM_LENGTH} V ${FRAME_HEIGHT - CORNER_RADIUS} Q ${FRAME_WIDTH} ${FRAME_HEIGHT} ${FRAME_WIDTH - CORNER_RADIUS} ${FRAME_HEIGHT} H ${FRAME_WIDTH - ARM_LENGTH}`} />
            <Path d={`M ${ARM_LENGTH} ${FRAME_HEIGHT} H ${CORNER_RADIUS} Q 0 ${FRAME_HEIGHT} 0 ${FRAME_HEIGHT - CORNER_RADIUS} V ${FRAME_HEIGHT - ARM_LENGTH}`} />
          </G>
        </Svg>
        <Animated.View style={[styles.laserLine, { transform: [{ translateY: laserTranslateY }] }]} />
      </View>

      {/* Phần dưới: mask + text */}
      <View style={[styles.maskBlock, { flex: 1, width: width, alignItems: 'center', paddingTop: 160 }]}>
        <Text style={styles.processingText}>{translations.scanner?.processingText ?? 'Đang chuẩn bị kết quả'}</Text>
        <Text style={styles.successText}>{translations.scanner?.successText ?? 'Sắp xong rồi!'}</Text>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 50 }}>
          <Text style={styles.bottomNote}>{translations.scanner?.bottomNote ?? 'Vui lòng không đóng ứng dụng hoặc khoá thiết bị của bạn'}</Text>
        </View>
      </View>
    </View>
  );
};
  // 2. Giao diện Controls (Chụp ảnh)
  const renderCameraControls = () => {
    return (
      <View style={styles.controlsContainer}>
         {/* Spacer rỗng ở trên để đẩy nội dung xuống dưới (thay vì header cũ) */}
         <View style={{ flex: 1 }} /> 

         {/* Footer */}
         <View style={styles.footer}>
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
                <Text style={styles.modeText}>{translations.scanner?.modeVoice ?? 'GIỌNG NÓI'}</Text>
                <Text style={[styles.modeText, styles.activeModeText]}>{translations.scanner?.modeImage ?? 'HÌNH ẢNH'}</Text>
                <Text style={styles.modeText}>{translations.scanner?.modeManual ?? 'THỦ CÔNG'}</Text>
            </View>
         </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* LỚP 1: CAMERA — ảnh preview sát header */}
      {imageSource ? (
        <View style={styles.imageWrap}>
          <FastImage source={imageSource} style={styles.previewImage} resizeMode="cover" />
        </View>
      ) : showCamera ? (
        <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} resizeMode="cover"/>
      ) : (
        <View style={styles.placeholderCamera}><ActivityIndicator color="#FFF" size="large" /></View>
      )}

      {/* LỚP 3: UI LOGIC */}
      <View style={styles.uiLayer}>
        {status === 'uploading' || status === 'success' 
            ? renderScanningOverlay()
            : renderCameraControls()
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  placeholderCamera: { flex: 1, backgroundColor: '#000'},
  imageWrap: { position: 'absolute', top: 80, left: 0, right: 0, alignItems: 'stretch' },
  previewImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: 20 },
  uiLayer: { flex: 1, zIndex: 1 },

  // --- HEADER NÚT CLOSE ---
  absoluteHeader: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT, 
    left: 20,
    zIndex: 999, // Đảm bảo luôn nằm trên cùng
  },
  closeBtn: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    // backgroundColor: 'rgba(0,0,0,0.4)', // Uncomment nếu muốn nền mờ cho nút
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // --- SCANNING OVERLAY ---
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  scanFrameWrap: { position: 'relative', marginTop: 80 },
  maskBlock: { backgroundColor: MASK_COLOR },
  corners: { position: 'absolute', top: 0, left: 0 },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%', height: 4, backgroundColor: 'rgba(72, 239, 113, 0.9)',
    shadowColor: '#48EF71', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 5,
  },
  processingText: { color: '#A0A0A0', fontSize: 16, marginBottom: 8, fontWeight: '500' },
  successText: { color: '#48EF71', fontSize: 22, fontWeight: 'bold' },
  bottomNote: { color: '#8E8E93', fontSize: 12, textAlign: 'center', paddingHorizontal: 40 },

  // --- CAMERA CONTROLS ---
  controlsContainer: { flex: 1, justifyContent: 'space-between' },
  footer: { backgroundColor: 'transparent', paddingBottom: 30, paddingTop: 10, alignItems: 'center' }, // transparent để thấy camera
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