import React from "react";
import { SvgProps } from "react-native-svg";
import icFlagvi from "./flag-vi.svg";
import icFlagen from "./flag-en.svg";
import icFlagcn from "./flag-cn.svg";
import icFlagjp from "./flag-jp.svg";
import icFlagkr from "./flag-kr.svg";
import icSearch from "./search.svg";
import icWelcome from "./welcome.svg";
import icCheckCircleFill from "./check_circle_fill.svg";
import logoIeltsHunter from "./ielts-hunter.svg";
import icApple from "./social-apple.svg";
import icFacebook from "./social-fb.svg";
import icGoogle from "./social-gg.svg";
import icMail from "./social-mail.svg";
import icEyeCrossed from "./login-eye-crossed.svg";
import icEye from "./login-eye.svg";
import icLoginFullname from "./login-fullname.svg";
import icLock from "./login-password.svg";
import icBack from "./icon-back.svg";

const Icons = {
  icFlagvi,
  icFlagen,
  icFlagcn,
  icFlagjp,
  icFlagkr,
  icSearch,
  icWelcome,
  icCheckCircleFill,
  logoIeltsHunter,
  icApple,
  icFacebook,
  icGoogle,
  icMail,
  icEyeCrossed,
  icEye,
  icLoginFullname,
  icLock,
  icBack,
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
      width={widthIcon}
      height={heightIcon}
      {...optionalProps}
      color={color}
    />
  );
};

export default IconSvg;
