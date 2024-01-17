import React from "react";
import { View, Image, ImageStyle, StyleProp } from "react-native";
import FastImage, { ResizeMode } from "react-native-fast-image";
import defaultAvatar from "@assets/images/default_avatar.jpg";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ISource {
  uri: string;
}

interface IAvatar {
  style: StyleProp<ImageStyle>;
  sourceUri: ISource;
  resizeMode?: ResizeMode;
  onPress?: () => void;
}

const Avatar = ({ style, sourceUri, resizeMode, onPress }: IAvatar) => {
  const Component = onPress ? TouchableOpacity : View;

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
