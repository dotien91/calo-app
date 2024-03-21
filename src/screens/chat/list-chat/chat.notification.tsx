import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

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
  const read_status = item.read_status || 0;
  const onPress = () => {
    NavigationService.navigate(SCREENS.NOTIFICATION);
  };

  return (
    <PressableBtn onPress={onPress} style={styles.container}>
      <View style={styles.viewAvatar}>
        <IconSvg name="icNotification" size={32} color={palette.white} />
      </View>
      <View style={styles.viewText}>
        <Text numberOfLines={1} style={styles.txtTitleReaded}>
          {translations.notifications.notifications}
        </Text>
        <Text numberOfLines={1} style={styles.txtDesReaded}>
          {item.content || item?.title}
        </Text>
      </View>
      {read_status != 1 && <View style={styles.viewRead} />}
    </PressableBtn>
  );
};

export default ChatNotification;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    ...CS.center,
    backgroundColor: palette.backgroundNotification,
  },
  viewText: {
    ...CS.flex1,
    gap: 8,
    justifyContent: "center",
  },

  txtTitleReaded: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },

  txtDesReaded: {
    ...CS.hnRegular,
    fontSize: 14,
    color: palette.textOpacity8,
  },
  viewRead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
});
