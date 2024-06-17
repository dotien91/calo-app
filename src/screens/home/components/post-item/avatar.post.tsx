import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

import { TypedUser } from "shared/models";
import { SCREENS } from "constants";

interface AvatarPostProps {
  data: TypedUser;
  sizeAvatar: number;
  showLevel?: boolean;
  canPress?: boolean;
  _onPress?: () => void;
}

const AvatarPost = ({
  canPress = true,
  data,
  sizeAvatar,
  showLevel,
  _onPress,
}: AvatarPostProps) => {
  const BORDER_AVATAR = sizeAvatar / 2;
  const Component = canPress ? PressableBtn : View;

  const onPressAvatar = () => {
    if (_onPress) return _onPress();
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id: data?._id,
      userInfo: data,
    });
  };

  return (
    <Component
      onPress={onPressAvatar}
      style={{
        width: sizeAvatar,
        height: sizeAvatar,
        borderRadius: BORDER_AVATAR,
      }}
    >
      <Image
        source={{ uri: data?.user_avatar || data?.user_avatar_thumbnail }}
        style={{
          width: sizeAvatar,
          height: sizeAvatar,
          borderRadius: BORDER_AVATAR,
        }}
      />
      {showLevel && (
        <View style={styles.viewLevelAbsolute}>
          <View style={styles.viewLevel}>
            <Text style={styles.txtLevel}>{data?.level || 1}</Text>
          </View>
        </View>
      )}
    </Component>
  );
};

export default React.memo(AvatarPost);

const styles = StyleSheet.create({
  viewLevelAbsolute: {
    position: "absolute",
    bottom: -5,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 1,
    ...CS.center,
  },
  viewLevel: {
    borderRadius: 5,
    backgroundColor: palette.red,
    paddingHorizontal: 8,
    ...CS.center,
  },
  txtLevel: {
    fontSize: 8,
    color: palette.white,
  },
});
