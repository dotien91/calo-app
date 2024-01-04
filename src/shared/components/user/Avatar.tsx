import React from "react";
import { View, Image, ImageStyle, StyleProp } from "react-native";
import FastImage, { ResizeMode } from "react-native-fast-image";
import Button from "@shared-components/button/Button";
import defaultAvatar from "@assets/images/default_avatar.jpg";

interface IAvatar {
  style: StyleProp<ImageStyle>;
  sourceUri: any;
  resizeMode?: ResizeMode;
  onPress?: () => void;
}

const Avatar = ({ style, sourceUri, resizeMode, onPress }: IAvatar) => {
  const Component = onPress ? Button : View;

  return (
    <Component onPress={() => onPress?.()}>
      {sourceUri.uri ? (
        <FastImage source={sourceUri} style={style} resizeMode={resizeMode} />
      ) : (
        <Image source={defaultAvatar} style={style} resizeMode={resizeMode} />
      )}
    </Component>
  );
};

export default Avatar;
