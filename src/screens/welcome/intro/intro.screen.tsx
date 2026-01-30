import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, G } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { SCREENS } from 'constants';
import { navigate } from '@helpers/navigation.helper';
import { showSuperModal, EnumModalContentType, EnumStyleModalType } from '@helpers/super.modal.helper';
import { translations } from '@localization';
import useStore from '@services/zustand/store';

// --- CONFIG ---
const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#5ED90B'; // Xanh Neon đặc trưng
const BG_COLOR = '#000000';      // Nền đen

// Cấu hình kích thước Mockup điện thoại
const PHONE_WIDTH = width * 0.65; // Điện thoại chiếm 65% chiều rộng
const PHONE_HEIGHT = PHONE_WIDTH * 2; // Tỉ lệ 1:2
const FRAME_SIZE = PHONE_WIDTH * 0.7; // Khung quét bên trong
const STROKE_WIDTH = 4;
const CORNER_LENGTH = 30;
const CORNER_RADIUS = 16;

const LANGUAGE_BUTTON_MAP: Record<string, { shortCode: string; flag: string }> = {
  vi: { shortCode: 'VI', flag: '🇻🇳' },
  en: { shortCode: 'EN', flag: '🇺🇸' },
  jp: { shortCode: 'JP', flag: '🇯🇵' },
};

const IntroScreen = () => {
  const insets = useSafeAreaInsets();
  const currentLanguage = useStore((state) => state.language);
  const langDisplay = LANGUAGE_BUTTON_MAP[currentLanguage] ?? LANGUAGE_BUTTON_MAP.en;

  const handleStart = () => {
    navigate(SCREENS.ONBOARDING_FLOW);
  };

  const handleChangeLanguage = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ChooseLanguage,
      styleModalType: EnumStyleModalType.Bottom,
    });
  };

  const handleSignIn = () => {
    navigate(SCREENS.LOGIN_PAGE);
  };

  // SVG Khung quét (nhỏ hơn để vừa trong mockup)
  const ScannerFrame = useMemo(() => (
    <View style={styles.frameContainer} pointerEvents="none">
      <Svg width={FRAME_SIZE} height={FRAME_SIZE} viewBox={`0 0 ${FRAME_SIZE} ${FRAME_SIZE}`}>
        <G fill="none" stroke={PRIMARY_COLOR} strokeWidth={STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
          <Path d={`M 0 ${CORNER_LENGTH} V ${CORNER_RADIUS} Q 0 0 ${CORNER_RADIUS} 0 H ${CORNER_LENGTH}`} />
          <Path d={`M ${FRAME_SIZE - CORNER_LENGTH} 0 H ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} 0 ${FRAME_SIZE} ${CORNER_RADIUS} V ${CORNER_LENGTH}`} />
          <Path d={`M ${FRAME_SIZE} ${FRAME_SIZE - CORNER_LENGTH} V ${FRAME_SIZE - CORNER_RADIUS} Q ${FRAME_SIZE} ${FRAME_SIZE} ${FRAME_SIZE - CORNER_RADIUS} ${FRAME_SIZE} H ${FRAME_SIZE - CORNER_LENGTH}`} />
          <Path d={`M ${CORNER_LENGTH} ${FRAME_SIZE} H ${CORNER_RADIUS} Q 0 ${FRAME_SIZE} 0 ${FRAME_SIZE - CORNER_RADIUS} V ${FRAME_SIZE - CORNER_LENGTH}`} />
        </G>
      </Svg>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      
      {/* 1. LANGUAGE BUTTON (Góc phải) */}
      <TouchableOpacity 
        style={[styles.langButton, { top: insets.top + 10 }]} 
        onPress={handleChangeLanguage}
      >
        <Text style={{fontSize: 14}}>{langDisplay.flag}</Text> 
        <Text style={styles.langText}>{langDisplay.shortCode}</Text>
      </TouchableOpacity>

      {/* 2. PHONE MOCKUP (Hình ảnh cái điện thoại ở giữa) */}
      <View style={styles.centerContainer}>
        {/* Khung viền điện thoại */}
        <View style={styles.phoneMockup}>
          {/* Dynamic Island / Notch giả lập */}
          <View style={styles.phoneNotch} />
          
          {/* Màn hình bên trong điện thoại */}
          <View style={styles.phoneScreen}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop' }} 
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
            />
            {/* Gradient đen mờ bên trong điện thoại */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={StyleSheet.absoluteFillObject}
            />
            
            {/* Khung quét nằm trong điện thoại */}
            {ScannerFrame}

            {/* Nút chụp giả lập trong điện thoại */}
            <View style={styles.fakeShutterButton} />
          </View>
        </View>
      </View>

      {/* 3. BOTTOM SECTION (Text & Button) */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        
        <Text style={styles.title}>
          {translations.intro?.title ?? "Calorie tracking\nmade easy"}
        </Text>
        
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.btnText}>{translations.intro?.getStarted ?? "Get Started"}</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>{translations.intro?.alreadyHaveAccount ?? "Already have an account? "}</Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>{translations.intro?.signIn ?? "Sign In"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  
  // --- LANGUAGE BUTTON ---
  langButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333', // Nền xám đậm hợp với nền đen
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  langText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // --- CENTER VISUAL (PHONE MOCKUP) ---
  centerContainer: {
    flex: 2, // Chiếm phần lớn màn hình
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  phoneMockup: {
    width: PHONE_WIDTH,
    height: PHONE_HEIGHT,
    borderRadius: 40,
    borderWidth: 6, // Viền dày giả lập khung máy
    borderColor: '#333', // Màu viền máy (Xám đậm)
    backgroundColor: '#000',
    overflow: 'hidden', // Để bo góc ảnh bên trong
    position: 'relative',
    // Shadow cho điện thoại nổi lên
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  phoneNotch: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 80,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 12,
    zIndex: 20,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeShutterButton: {
    position: 'absolute',
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: 'transparent',
  },
  frameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- BOTTOM SECTION ---
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 40,
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: PRIMARY_COLOR, // Màu xanh Neon style cũ
    borderRadius: 28, // Bo tròn kiểu Pill
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#000000', // Chữ đen trên nền xanh
    fontSize: 16,
    fontWeight: '700',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    color: '#888',
    fontSize: 14,
  },
  signInLink: {
    color: '#FFF', // Hoặc dùng PRIMARY_COLOR nếu muốn nổi bật hơn
    fontWeight: '700',
    fontSize: 14,
  },
});

export default IntroScreen;