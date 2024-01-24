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
import icClose from "./icon-close.svg";
import icFacebook from "./social-fb.svg";
import icGoogle from "./social-gg.svg";
import icMail from "./social-mail.svg";
import icEyeCrossed from "./login-eye-crossed.svg";
import icEye from "./login-eye.svg";
import icLoginFullname from "./login-fullname.svg";
import icLock from "./login-password.svg";
import icBack from "./icon-back.svg";
import icAudio from "./icon-audio.svg";
import icCsv from "./icon-csv.svg";
import icDoc from "./icon-doc.svg";
import icFile from "./icon-file.svg";
import icPdf from "./icon-pdf.svg";
import icPlanText from "./icon-plan-text.svg";
import icPpt from "./icon-ppt.svg";
import icWarning from "./icon-warning.svg";
import icXls from "./icon-xls.svg";
import icZip from "./icon-zip.svg";
import icPoll from "./icon-poll.svg";
import icCreatePostImage from "./icon-create-post-image.svg";
import icLink from "./icon-link.svg";
import icVideo from "./icon-video.svg";
import icComment from "./icon-comment.svg";
import icMore from "./icon-more.svg";
import icVerify from "./icon-verify.svg";
import icShare from "./icon-share.svg";
import icHeart from "./icon-heart.svg";
import icHearted from "./icon-hearted.svg";
import icLive from "./icon-live.svg";
import icBook from "./book.svg";
import icBookFull from "./book-full.svg";
import icCourse from "./course.svg";
import icDiscovery from "./discovery.svg";
import icGraduate from "./graduate.svg";
import icProfile from "./profile.svg";
import icReview from "./review.svg";
import icStarFull from "./star-full.svg";
import icStarHalf from "./star-half.svg";
import icStar from "./star.svg";
import icStudent from "./student.svg";
import icRateStar from "./rate-star.svg";
import icFormOfLearn from "./form-of-learn.svg";
import icWarningCircle from "./warning.svg";
import icLanguage from "./icon-language.svg";
import icCC from "./iconCC.svg";

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
  icAudio,
  icClose,
  icCsv,
  icDoc,
  icFile,
  icPdf,
  icPlanText,
  icPpt,
  icWarning,
  icXls,
  icZip,
  icPoll,
  icCreatePostImage,
  icLink,
  icVideo,
  icComment,
  icMore,
  icVerify,
  icShare,
  icHeart,
  icHearted,
  icLive,
  icBook,
  icBookFull,
  icCourse,
  icDiscovery,
  icGraduate,
  icProfile,
  icReview,
  icStarFull,
  icStarHalf,
  icStar,
  icStudent,
  icRateStar,
  icFormOfLearn,
  icWarningCircle,
  icLanguage,
  icCC,
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
