import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-safearea-height";

export const TOP_CLASS_HEIGHT =  44 + getStatusBarHeight() + 16
export const BOTTOM_CLASS_HEIGHT = 64
export const STUDENT_VIDEO_HEIGHT = 98

export const TEACHER_VIDEO_HEIGHT = Dimensions.get("screen").height - STUDENT_VIDEO_HEIGHT - BOTTOM_CLASS_HEIGHT - 8