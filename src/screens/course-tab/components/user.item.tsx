import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import createStyles from "./course.component.style";
import CS from "@theme/styles";
import { TypedUser } from "models";
import Avatar from "@shared-components/user/Avatar";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";

interface TutorItemProps extends TypedUser {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
}

const UserItem = ({
  display_name,
  user_avatar_thumbnail,
  _id,
  ...res
}: TutorItemProps) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const openProfile = () => {
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id,
      userInfo: {
        display_name,
        user_avatar_thumbnail,
        _id,
        ...res,
      },
    });
  };

  const renderInfo = () => {
    return (
      <>
        <View
          style={[
            CS.flexStart,
            {
              alignItems: "flex-start",
              marginBottom: 8,
            },
          ]}
        >
          {renderImg()}
          <View style={{ flex: 1 }}>
            <View style={[CS.flexRear, { alignItems: "flex-start" }]}>
              <Text numberOfLines={2} style={styles.tutorName}>
                {display_name}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderImg = () => {
    return (
      <View>
        <Avatar
          style={{
            width: 64,
            height: 64,
            borderRadius: 99,
            marginRight: 10,
          }}
          sourceUri={{ uri: user_avatar_thumbnail }}
        />
      </View>
    );
  };

  return (
    <PressableBtn onPress={openProfile} style={[styles.tutorItem]}>
      {renderInfo()}
    </PressableBtn>
  );
};

export default React.memo(UserItem);
