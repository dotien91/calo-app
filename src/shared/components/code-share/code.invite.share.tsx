import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Clipboard, Image, Text, TouchableOpacity, View } from "react-native";
import createStyles from "./code.invite.share.style";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconSvg from "assets/svg";
import { showToast } from "@helpers/super.modal.helper";
import useStore from "@services/zustand/store";
import { shareCodeInvite } from "@utils/share.utils";

const InviteCode = () => {
  const theme = useTheme();
  const userData = useStore((state) => state.userData);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const coppyClipboard = () => {
    Clipboard.setString(userData?.invitation_code || "");
    showToast({
      type: "success",
      message: translations.codeActivations.copyCodeSuccsess,
    });
  };

  const shareCode = () => {
    shareCodeInvite(userData?.invitation_code || "");
  };

  return (
    <View style={styles.viewInviteFriend}>
      <View style={styles.viewInviteFriendTop}>
        <View>
          <Text style={styles.textMyCode}>{translations.task.mycode}</Text>
          <PressableBtn
            onPress={coppyClipboard}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={styles.textInviteCode}>
              {userData?.invitation_code || "---"}
            </Text>
            <Image
              style={{ height: 15.3, width: 13.79, marginLeft: 4 }}
              source={require("assets/images/CopyIcon.png")}
            />
          </PressableBtn>
        </View>
        <TouchableOpacity onPress={shareCode} style={styles.touchShare}>
          <IconSvg name="icupLoad" width={32} height={18} />
          <Text style={styles.textShare}>
            {translations.affiliate.shareCode}
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.viewLineInviteFriend}></View> */}
      <Text style={styles.textDesciption}>
        {translations.affiliate.description}
      </Text>
    </View>
  );
};

export default InviteCode;
