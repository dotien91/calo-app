import React, { useEffect, useState } from 'react';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

type Props = {
  size?: number;
  bodyColor?: string; // Đây sẽ là màu Vàng tiêu chuẩn
  percentage?: number;
};

const AvocadoIcon = ({ 
  size = 150, 
  bodyColor = '#FACC15', 
  percentage = 0 
}: Props) => {
  const STROKE = '#262626';     
  const SKIN_GREEN = '#3F6212'; 
  const INNER_GREEN = '#84CC16';
  const EMPTY_COLOR = '#ECFCCB';

  // --- BẢNG MÀU ---
  const COLOR_LOW = '#FEF08A';    // Vàng nhạt (< 50%)
  const COLOR_MEDIUM = bodyColor; // Vàng tiêu chuẩn (50% - 99%)
  const COLOR_FULL = '#FFB347';   // Cam nhạt (>= 100%)

  // State Animation
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 1000;
    const startTime = Date.now();
    const startValue = animatedPercent;
    const endValue = Math.min(100, Math.max(0, percentage));

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); 

      setAnimatedPercent(startValue + (endValue - startValue) * ease);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [percentage]);

  // --- LOGIC MÀU SẮC (3 MỨC ĐỘ) ---
  // Dùng animatedPercent để màu đổi theo mực nước dâng
  // Hoặc dùng percentage để đổi màu ngay lập tức theo mục tiêu
  const currentPercentToCheck = animatedPercent; 

  let activeFillColor;
  if (currentPercentToCheck >= 100) {
    activeFillColor = COLOR_FULL;
  } else if (currentPercentToCheck >= 50) {
    activeFillColor = COLOR_MEDIUM;
  } else {
    activeFillColor = COLOR_LOW;
  }

  // --- RENDER PARTS ---
  const renderFace = () => {
    if (percentage >= 100) {
      return (
        <G>
           <Path d="M68 118 Q75 105 82 118" stroke={STROKE} strokeWidth="4" strokeLinecap="round" fill="none" />
           <Path d="M118 118 Q125 105 132 118" stroke={STROKE} strokeWidth="4" strokeLinecap="round" fill="none" />
           <Path d="M85 135 Q100 150 115 135" stroke={STROKE} strokeWidth="3" strokeLinecap="round" fill="none" />
           <Ellipse cx="60" cy="125" rx="7" ry="5" fill="#F472B6" opacity="0.8" />
           <Ellipse cx="140" cy="125" rx="7" ry="5" fill="#F472B6" opacity="0.8" />
        </G>
      );
    }
    if (percentage > 0) {
      return (
        <G>
          <Circle cx="75" cy="115" r="5" fill={STROKE} />
          <Path d="M122 117 L128 111 L134 117" stroke={STROKE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M94 125 Q100 130 106 125" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
          <Ellipse cx="65" cy="125" rx="5" ry="3" fill="#F472B6" opacity="0.6" />
          <Ellipse cx="135" cy="125" rx="5" ry="3" fill="#F472B6" opacity="0.6" />
        </G>
      );
    }
    return (
      <G>
        <Circle cx="75" cy="115" r="6" fill={STROKE} />
        <Circle cx="125" cy="115" r="6" fill={STROKE} />
        <Path d="M92 130 Q100 135 108 130" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
      </G>
    );
  };

  const renderArmsAndProps = () => {
    const leftArmPath = "M55 155 Q45 170 50 185";
    if (percentage >= 100) {
      return (
        <G>
          <Path d={leftArmPath} stroke={SKIN_GREEN} strokeWidth="5" strokeLinecap="round" />
          <Path d="M145 155 Q135 155 115 170" stroke={SKIN_GREEN} strokeWidth="5" strokeLinecap="round" />
        </G>
      );
    }
    return (
      <G>
        <Path d={leftArmPath} stroke={SKIN_GREEN} strokeWidth="5" strokeLinecap="round" />
        <G rotation="20" origin="170, 155">
           <G stroke={STROKE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M170 175 L170 145" />
              <Path d="M162 120 L162 137 Q162 147 170 147 Q178 147 178 137 L178 120" fill="none" />
              <Path d="M170 145 L170 120" />
           </G>
        </G>
        <Path d="M145 155 Q160 150 170 155" stroke={SKIN_GREEN} strokeWidth="5" strokeLinecap="round" />
      </G>
    );
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 200 250" fill="none">
      <Defs>
        <LinearGradient id="pitGradient" x1="100" y1="130" x2="100" y2="190">
          <Stop offset="0%" stopColor="#795548" />
          <Stop offset="100%" stopColor="#3E2723" />
        </LinearGradient>

        <LinearGradient id="bodyFillGradient" x1="0" y1="1" x2="0" y2="0">
          <Stop offset={`${animatedPercent}%`} stopColor={activeFillColor} />
          <Stop offset={`${animatedPercent}%`} stopColor={EMPTY_COLOR} />
          <Stop offset="100%" stopColor={EMPTY_COLOR} />
        </LinearGradient>
      </Defs>

      <G translateY={0}>
        <Path d="M100 40 Q100 30 110 25" stroke={SKIN_GREEN} strokeWidth="4" fill="none" />
        <Path d="M110 25 Q130 15 140 30 Q145 45 125 45 Q115 45 110 25" fill="#4ADE80" stroke={SKIN_GREEN} strokeWidth="3" />
        <Path d="M100 40 C 80 40, 65 65, 65 95 C 65 115, 35 135, 35 175 C 35 215, 65 230, 100 230 C 135 230, 165 215, 165 175 C 165 135, 135 115, 135 95 C 135 65, 120 40, 100 40 Z" fill={SKIN_GREEN} stroke={STROKE} strokeWidth="6" strokeLinejoin="round" />
        <Path d="M100 48 C 82 48, 72 70, 72 95 C 72 115, 45 135, 45 175 C 45 210, 70 222, 100 222 C 130 222, 155 210, 155 175 C 155 135, 128 115, 128 95 C 128 70, 118 48, 100 48 Z" fill={INNER_GREEN} />
        
        <Path 
          d="M100 55 C 85 55, 78 75, 78 95 C 78 115, 55 135, 55 175 C 55 205, 75 214, 100 214 C 125 214, 145 205, 145 175 C 145 135, 122 115, 122 95 C 122 75, 115 55, 100 55 Z" 
          fill="url(#bodyFillGradient)" 
        />

        <Circle cx="100" cy="165" r="30" fill="url(#pitGradient)" stroke={STROKE} strokeWidth="4" />
        <Ellipse cx="92" cy="158" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-20 92 158)" />
        <Path d="M80 225 L75 240" stroke={SKIN_GREEN} strokeWidth="6" strokeLinecap="round" />
        <Path d="M120 225 L125 240" stroke={SKIN_GREEN} strokeWidth="6" strokeLinecap="round" />

        {renderFace()}
        {renderArmsAndProps()}
      </G>
    </Svg>
  );
};

export default AvocadoIcon;