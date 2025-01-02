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
  const [urlImage, setUrlImage] = React.useState<any>();

  React.useEffect(() => {
    setUrlImage(data?.user_avatar);
  }, [data?._id]);
  const onPressAvatar = () => {
    if (_onPress) return _onPress();
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id: data?._id,
      userInfo: data,
    });
  };
  // console.log("data...", data);

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
        source={{
          uri: urlImage
            ? urlImage
            : "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg",
        }}
        style={{
          width: sizeAvatar,
          height: sizeAvatar,
          borderRadius: BORDER_AVATAR,
        }}
        onError={() =>
          setUrlImage(
            "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg",
          )
        }
      />
      {showLevel && (data?.current_point || data?.target_point) && (
        <View style={styles.viewLevelAbsolute}>
          <View
            style={[
              styles.viewLevel,
              {
                backgroundColor: data?.target_point
                  ? palette.red
                  : palette.green,
              },
            ]}
          >
            <Text style={styles.txtLevel}>
              {data?.target_point || data?.current_point}
            </Text>
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
