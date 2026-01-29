import React from "react";
import { SvgProps } from "react-native-svg";


const Icons = {
  
};

interface IconSvgProps {
  allowUpdate?: boolean; // Default to false: do not allow component to re-render
  name: string;
  size?: number; // Use size props will set width = height = size
  width?: number; // Do not use together with `size`
  height?: number; // Do not use together with `size`
  color?: string;
  rotate?: number; // Eg: 90 mean 90deg
  style?: object;
  onPress?: () => void;
}
const IconSvg = (props: IconSvgProps) => {
  const {
    name = "IconBack",
    size = null,
    width = 18,
    height = 18,
    color = "white",
    rotate = 0,
    style = null,
    onPress,
  } = props;
  if (!(name in Icons)) {
    return null;
  }
  const optionalProps = {};

  /**
   * Cannot directly modify the s.foo because it's immutable
   */
  let rotationStyle = null;
  if (rotate) {
    rotationStyle = { transform: [{ rotateZ: rotate + "deg" }] };
    optionalProps.style = rotationStyle;
  }

  if (style) {
    optionalProps.style = [style, rotationStyle];
  }

  const widthIcon = size || width;
  const heightIcon = size || height;
  const IconSvgComponent: React.FC<SvgProps> = Icons[name];
  return (
    <IconSvgComponent
      onPress={!!onPress && onPress}
      width={widthIcon}
      height={heightIcon}
      {...optionalProps}
      color={color}
    />
  );
};

export default IconSvg;
