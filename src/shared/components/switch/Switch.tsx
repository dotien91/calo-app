import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { MotiView } from "@motify/components";
import { MotiTransitionProp } from "@motify/core";
import { Easing } from "react-native-reanimated";

interface SwitchProps {
  size: number;
  onPress: () => void;
  isActive: boolean;
}

const _color = {
  active: "#77A300",
  inActive: "#00363D",
};

const transition: MotiTransitionProp = {
  type: "timing",
  duration: 300,
  easing: Easing.inOut(Easing.ease),
};

export default function Switch({ size, onPress, isActive }: SwitchProps) {
  const trackWidth = useMemo(() => {
    return size * 1.2;
  }, [size]);
  const trackHeight = useMemo(() => {
    return size * 0.5;
  }, [size]);
  const knobSize = useMemo(() => {
    return size * 0.6;
  }, [size]);
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: size * 0.3 }}>
      <View style={{ alignContent: "center", justifyContent: "center" }}>
        <MotiView
          from={{
            backgroundColor: isActive ? _color.active : _color.inActive,
          }}
          animate={{
            backgroundColor: isActive ? _color.active : _color.inActive,
          }}
          transition={transition}
          style={{
            position: "absolute",
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: _color.active,
          }}
        ></MotiView>
        <MotiView
          transition={transition}
          animate={{
            translateX: isActive ? trackWidth / 3 : -trackWidth / 6,
          }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MotiView
            transition={transition}
            animate={{
              width: isActive ? 0 : knobSize,
              borderColor: isActive ? _color.active : _color.inActive,
            }}
            style={{
              width: knobSize,
              height: knobSize,
              borderRadius: knobSize / 2,
              borderWidth: size * 0.1,
              borderColor: _color.active,
            }}
          />
        </MotiView>
      </View>
    </Pressable>
  );
}
