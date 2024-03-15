import * as React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import CS from "@theme/styles";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import { translations } from "@localization";
import IconSvg from "assets/svg";

interface ChatNotificationProps {
  item: any;
}

const ChatNotification = ({ item }: ChatNotificationProps) => {
  const isreaded = false;

  const onPress = () => {
    NavigationService.navigate(SCREENS.NOTIFICATION);
  };

  return (
    <PressableBtn onPress={onPress} style={styles.container}>
      {item?.createdBy?.user_avatar_thumbnail ? (
        <Image
          style={styles.viewAvatar}
          source={{ uri: item?.createdBy?.user_avatar_thumbnail }}
        />
      ) : (
        <View style={styles.viewAvatar}>
          <IconSvg name="logoIeltsHunter" size={32} />
        </View>
      )}
      <View style={styles.viewText}>
        <Text
          numberOfLines={1}
          style={isreaded ? styles.txtTitleReaded : styles.txtTitle}
        >
          {translations.notifications.notifications}
        </Text>
        <Text
          numberOfLines={1}
          style={isreaded ? styles.txtDesReaded : styles.txtDes}
        >
          {item.content}
        </Text>
      </View>
    </PressableBtn>
  );
};

export default ChatNotification;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    ...CS.center,
  },
  viewText: {
    ...CS.flex1,
    gap: 8,
    justifyContent: "center",
  },
  txtTitle: {
    ...CS.hnSemiBold,
  },
  txtTitleReaded: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
  txtDes: {
    ...CS.hnRegular,
  },
  txtDesReaded: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
});
