import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { useTheme } from "@react-navigation/native";

import CommonStyle from "@theme/styles";
import IconSvg from "assets/svg";
import { convertLastActive } from "@utils/time.utils";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
  showWarningLogin,
} from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import { TypedPost } from "shared/models";

const FONT_SIZE = 16;

interface HeaderItempostProps {
  onPress: () => void;
  data: TypedPost;
  isDetail?: boolean;
}

const HeaderItempost = ({
  data,
  onPress,
  isDetail = false,
}: HeaderItempostProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const userData = useStore((state) => state.userData);

  const _showStickBottom = () => {
    if (!userData) {
      showWarningLogin();
    } else {
      showSuperModal({
        contentModalType: EnumModalContentType.PostAction,
        styleModalType: EnumStyleModalType.Bottom,
        data: { ...data, isDetail },
      });
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          ...CommonStyle.flex1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...CommonStyle.hnBold,
              ...CommonStyle.flex1,
              fontSize: FONT_SIZE,
              color: colors.mainColor2,
            }}
            onPress={onPress}
          >
            {data?.user_id?.display_name + " "}
            {data?.user_id?.official_status && (
              <IconSvg name="icVerify" size={FONT_SIZE} />
            )}
            <Text
              style={{
                ...CommonStyle.hnRegular,
                color: colors.text,
                fontSize: FONT_SIZE,
              }}
            >
              {" " + convertLastActive(data?.createdAt)}
            </Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={_showStickBottom}>
        <Icon
          size={20}
          name="ellipsis-vertical"
          type={IconType.Ionicons}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(HeaderItempost);
