import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local Imports
 */
import createStyles from "./chat.room.screen.style";
import ActionBtn from "./components/form/KeyboardBtn";
import CommonStyle from "@theme/styles";
import { getFormatDayMessage } from "@utils/date.utils";
import { translations } from "@localization";
import GoBackButton from "@screens/auth/components/GoBackButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SCREENS } from "constants";
import { PERMISSION } from "@screens/call/utils";
import { grantPermission } from "@screens/call/permission.helper";

interface ChatHeaderProps {
  messages: any;
  roomDetail: any;
  isAdmin: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  messages,
  roomDetail,
  isAdmin = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const partnerName = route.params?.["partner_name"];
  const isGroup =
    route.params?.["isGroup"] || roomDetail?.chat_room_id?.room_type == "group";
  const readAt = messages?.[0]?.read_at;

  const time = getFormatDayMessage(readAt, "HH:mm", "DD/MM");
  const goToProfileChat = () => {
    if (!isAdmin && roomDetail) {
      NavigationService.navigate(SCREENS.PROFILE_CHAT, {
        isGroup,
        roomDetail,
        partner: roomDetail?.partner_id,
      });
    }
  };

  const handleOpenCallPage = async (callType: string) => {
    // NavigationService.push(SCREENS.CALL_PAGE);
    // console.log(PERMISSION.permissionMedia, "PERMISSION.permissionMedia");
    const grantedPermission = grantPermission(PERMISSION.permissionMedia);
    const res = await grantedPermission(true, true);
    if (!res) {
      return;
    }
    NavigationService.navigate(SCREENS.CALL_PAGE, {
      item: roomDetail,
      type: callType,
    });
  };

  return (
    <View style={styles.wrapHeader}>
      <View style={[styles.headerLeft, isGroup && { flex: 0.85 }]}>
        <GoBackButton />
        <TouchableOpacity style={styles.roomInfo} onPress={goToProfileChat}>
          <Text numberOfLines={1} style={styles.txtNamePartner}>
            {roomDetail?.chat_room_id?.room_name || partnerName}
          </Text>
          {!!readAt && (
            <Text numberOfLines={1} style={styles.txtReadAt}>
              {readAt ? translations.chat.lastSeen + "  " + time : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {isGroup || isAdmin ? null : (
        <View style={[CommonStyle.flexEnd, styles.headerRight]}>
          <ActionBtn
            icon="phone"
            color={colors.black}
            callback={() => handleOpenCallPage("audio_call")}
            customStyle={{ backgroundColor: colors.white }}
          />
          <ActionBtn
            icon="video"
            callback={() => handleOpenCallPage("video_call")}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(ChatHeader);
