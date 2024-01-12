import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import createStyles from "./room.chat.screen.style";
import ActionBtn from "./components/KeyboardBtn";
import CommonStyle from "@theme/styles";
import { getFormatDayMessage } from "@utils/date.utils";
import { translations } from "@localization";
import GoBackButton from "@screens/auth/components/GoBackButton";

interface ChatHeaderProps {
  messages: any;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ messages }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const partnerName = route.params?.["partner_name"];
  const time = getFormatDayMessage(messages?.[0]?.read_at, "HH:mm", "DD/MM");

  return (
    <View style={styles.wrapHeader}>
      <View style={[CommonStyle.flexEnd, styles.headerLeft]}>
        <GoBackButton />
      </View>
      <View style={[styles.headerCenter, !time && { paddingTop: 8 }]}>
        <Text numberOfLines={1} style={styles.txtNamePartner}>
          {partnerName}
        </Text>
        {!!time && (
          <Text numberOfLines={1} style={styles.txtReadAt}>
            {translations.chat.lastSeen + "  " + time}
          </Text>
        )}
      </View>
      <View style={[CommonStyle.flexEnd, styles.headerRight]}>
        <ActionBtn
          icon="call"
          color={colors.black}
          customStyle={{ backgroundColor: colors.white }}
        />
        <ActionBtn icon="videocam" />
      </View>
    </View>
  );
};

export default React.memo(ChatHeader);
