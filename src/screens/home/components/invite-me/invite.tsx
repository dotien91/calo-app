import React from "react";
import { View, StyleSheet } from "react-native";

import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import Button from "@shared-components/button/Button";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { postInvitationCode } from "@services/api/user.api";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const InviteView = () => {
  const userData = useStore((store) => store.userData);
  console.log("userData...", userData);
  const showInvite = useStore((store) => store.showInvite);
  const setShowInvite = useStore((store) => store.setShowInvite);
  const sendCode = (txt: string) => {
    const data = {
      invitation_code: txt,
    };
    postInvitationCode(data).then((res) => {
      if (!res.isError) {
        console.log("data,", res.data);
        setShowInvite(false);
        closeSuperModal();
        showToast({
          type: "success",
          message: translations.invite.enterCodeSuccess,
        });
      } else {
        showToast({
          type: "success",
          message: translations.invite.enterCodeFaild,
        });
        console.log("data,", res.message);
      }
    });
  };

  const showEnterCode = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.TextInput,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        title: translations.invite.enterCode,
        cb: sendCode,
      },
    });
  };
  if (!userData?._id || !showInvite || userData?.is_referral) {
    return null;
  }

  const closeInviteView = () => {
    setShowInvite(false);
  };
  return (
    <View style={styles.container}>
      <TextBase marginBottom={8} fontWeight="600">
        {translations.invite.titleInvite}
      </TextBase>
      <TextBase marginBottom={16} fontSize={14}>
        {translations.invite.desInvite}
      </TextBase>
      <View style={CS.row}>
        <Button
          type="primary"
          onPress={showEnterCode}
          text={translations.invite.enterCode}
        />
      </View>
      <View style={styles.viewClose}>
        <Icon
          onPress={closeInviteView}
          size={20}
          name="close-outline"
          type={IconType.Ionicons}
          color={palette.text}
        />
      </View>
    </View>
  );
};

export default InviteView;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3.05,
    shadowOpacity: 0.17,
    elevation: 4,
    borderRadius: 8,
    backgroundColor: palette.white,
  },
  viewClose: {
    position: "absolute",
    width: 20,
    height: 20,
    top: 8,
    right: 16,
  },
});
