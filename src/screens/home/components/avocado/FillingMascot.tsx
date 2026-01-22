import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AvocadoIcon from './AvocadoIcon';

interface Props {
  percentage: number;
  size?: number;
  fillColor: string;
}

const FillingMascot = ({ 
  percentage, 
  size = 160, 
  fillColor 
}: Props) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const clampedPercent = Math.min(Math.max(percentage, 0), 100);
    Animated.timing(animatedHeight, {
      toValue: clampedPercent,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  return (
    <View style={{ width: size, height: size }}>
      <View style={StyleSheet.absoluteFill}>
        <AvocadoIcon size={size} bodyColor="#FEF08A" />
      </View>

      <Animated.View
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden',
          height: animatedHeight.interpolate({
            inputRange: [0, 100], outputRange: ['0%', '100%'],
          }),
        }}
      >
        <View style={{ position: 'absolute', bottom: 0, width: size, height: size }}>
          <AvocadoIcon size={size} bodyColor={fillColor}  percentage={percentage} />
        </View>
      </Animated.View>
    </View>
  );
};

export default FillingMascot;