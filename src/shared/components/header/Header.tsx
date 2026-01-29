import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import { CaretLeft, IconProps } from "phosphor-react-native"; // Import IconProps để định nghĩa type chuẩn

import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import { isAndroid } from "@helpers/device.info.helper";
import IconSvg from "assets/svg";

// Định nghĩa kiểu cho Component Icon của Phosphor
type PhosphorIconComponent = React.ComponentType<IconProps>;

interface HeaderProps {
  // Thay vì iconName (string), ta chỉ dùng Component
  LeftIcon?: PhosphorIconComponent;
  RightIcon?: PhosphorIconComponent;
  
  text?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  textRight?: string;
  customStyle?: ViewStyle;
  titleStyle?: TextStyle; // Thêm props để custom style text nếu cần
  badge?: number;
  hideBackBtn?: boolean;
  rightComponent?: JSX.Element;
  isVIP?: boolean;
}

const Header = ({
  LeftIcon,
  RightIcon,
  text,
  onPressLeft,
  onPressRight,
  textRight,
  customStyle,
  titleStyle,
  badge,
  hideBackBtn = false,
  rightComponent,
  isVIP,
}: HeaderProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const _onPressLeft = () => {
    if (onPressLeft) {
      onPressLeft();
    } else {
      NavigationService.goBack();
    }
  };

  // Xác định Icon bên trái: Nếu có truyền vào thì dùng, không thì mặc định là CaretLeft
  const RenderLeftIcon = LeftIcon || CaretLeft;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card || colors.background },
        customStyle,
      ]}
    >
      {/* LEFT SECTION */}
      <View style={styles.viewIcons}>
        {!hideBackBtn && (
          <TouchableOpacity onPress={_onPressLeft} style={styles.touchIcon}>
            <RenderLeftIcon size={24} color={colors.white} weight="bold" />
          </TouchableOpacity>
        )}
      </View>

      {/* CENTER TITLE */}
      <Text
        numberOfLines={1}
        style={[
          styles.textHeader,
          { color: colors.white, ...CommonStyle.flex1 },
          titleStyle
        ]}
      >
        {text || ""}
        {isVIP && (
          <IconSvg
            style={{ marginLeft: 8 }}
            name="icVip"
            size={24}
            color={palette.primary}
          />
        )}
      </Text>

      {/* RIGHT SECTION */}
      <View style={styles.viewIcons}>
        {/* Ưu tiên hiển thị TextRight nếu có */}
        {textRight && textRight.trim() !== "" ? (
           <TouchableOpacity
           onPress={onPressRight}
           style={styles.touchTextRight}
         >
           <Text
             style={[
               styles.textHeader,
               { 
                 color: colors.white, 
                 fontSize: 16, // Text right thường nhỏ hơn title chút
                 textDecorationLine: "underline" 
               },
             ]}
           >
             {textRight}
           </Text>
         </TouchableOpacity>
        ) : (
          // Nếu không có TextRight thì hiển thị Icon hoặc RightComponent
          <>
            {rightComponent ? (
              rightComponent
            ) : RightIcon ? (
              <TouchableOpacity onPress={onPressRight} style={styles.touchIcon}>
                <RightIcon size={24} color={colors.white} weight="bold" />
              </TouchableOpacity>
            ) : null}

            {/* Badge Notification */}
            {!!badge && (
              <TouchableOpacity onPress={onPressRight} style={styles.badge}>
                <Text style={styles.txtBadge}>{badge > 99 ? "99+" : badge}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Android Status Bar Cover Hack (Giữ nguyên từ code cũ của bạn) */}
      {isAndroid() && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: -20,
            right: 0,
            height: 20,
            backgroundColor: colors.card || colors.background,
            zIndex: 1,
          }}
        />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    shadowColor: "rgba(0,0,0,0.4)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    elevation: 10,
    shadowRadius: 5,
  },
  textHeader: {
    ...CommonStyle.hnSemiBold,
    fontSize: 20,
    textAlign: "center",
  },
  viewIcons: {
    width: 40,
    height: 40,
    ...CommonStyle.center,
    // position relative để badge định vị theo view này
    position: 'relative', 
  },
  touchIcon: {
    width: 40,
    height: 40,
    ...CommonStyle.center,
  },
  touchTextRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: -16, // Negative margin để căn sát lề phải hơn nếu cần
    paddingRight: 16,
    zIndex: 1,
    ...CommonStyle.center,
    minWidth: 60, // Đảm bảo vùng bấm đủ lớn
    alignItems: 'flex-end',
  },
  badge: {
    minWidth: 20, // Đổi thành minWidth để số to không bị vỡ
    height: 20,
    paddingHorizontal: 4,
    position: "absolute",
    top: -4, 
    right: -4,
    backgroundColor: palette.red,
    ...CommonStyle.flexCenter,
    borderRadius: 10,
    ...CommonStyle.borderStyle,
    borderColor: palette.white,
    zIndex: 2,
  },
  txtBadge: {
    ...CommonStyle.hnRegular,
    fontSize: 10, // Giảm font size xíu cho vừa vòng tròn
    color: palette.white,
  },
});