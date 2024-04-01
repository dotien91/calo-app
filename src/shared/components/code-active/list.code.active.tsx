import React, { useEffect, useMemo, useState } from "react";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import {
  getReferralByMe,
  getReferralMe,
  postInvitationCode,
} from "@services/api/user.api";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { Text, TouchableOpacity, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
import IconSvg from "assets/svg";
import CS from "@theme/styles";
import createStyles from "./list.code.active.style";
import { useTheme } from "@react-navigation/native";

const ListCodeActive = () => {
  const theme = useTheme();
  const [referralMe, setReferralMe] = useState([]);
  const userData = useStore((state) => state.userData);
  const setShowInvite = useStore((store) => store.setShowInvite);
  const setListUserRef = useStore((state) => state.setListUserRef);
  const [referralByMe, setReferralByMe] = useState([]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const showInvite = useStore((store) => store.showInvite);
  const params = {};

  const _getReferralMe = () => {
    getReferralMe(params).then((res) => {
      setReferralMe(res.data);
    });
  };

  const _getReferralByMe = () => {
    getReferralByMe(params).then((res) => {
      if (!res.isError) {
        setReferralByMe(res.data);
        setListUserRef(res.data);
      } else {
        setReferralByMe([]);
        setListUserRef([]);
      }
    });
  };

  useEffect(() => {
    _getReferralByMe();
    _getReferralMe();
  }, [userData?._id, showInvite]);

  const sendCode = (txt: string) => {
    const data = {
      invitation_code: txt,
    };
    postInvitationCode(data).then((res) => {
      if (!res.isError) {
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
      }
    });
  };

  const showReferrer = () => {
    if (referralMe?.length > 0) {
      showSuperModal({
        contentModalType: EnumModalContentType.Referral,
        styleModalType: EnumStyleModalType.Bottom,
        data: referralMe[0]?.from_user_id,
      });
    } else {
      showSuperModal({
        contentModalType: EnumModalContentType.TextInput,
        styleModalType: EnumStyleModalType.Bottom,
        data: {
          title: translations.invite.enterCode,
          cb: sendCode,
          icon: "icInviteCode",
          txtBtn: translations.codeActivations.activate,
        },
      });
    }
  };

  const pressCodeActivations = () => {
    if (referralByMe?.length > 0) {
      NavigationService.navigate(SCREENS.CODE_ACTIVATIONS_SCREEN);
    } else {
      showToast({
        type: "info",
        message: translations.invite.emptyListInvite,
      });
    }
  };

  const ItemCodeActive = ({ backgroundIcon, icon, title, onPress, count }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={[
            { backgroundColor: backgroundIcon },
            styles.viewItemLeftCodeActive,
          ]}
        >
          <IconSvg name={icon} size={20} />
        </View>
        <View style={styles.viewTitleAndNumberCodeActive}>
          <Text style={styles.textTitleCodeActive}>{title}</Text>
          {!!count && (
            <Text
              style={{ ...CS.hnRegular, fontSize: 14, color: palette.text }}
            >
              {count}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <ItemCodeActive
        icon="iconBookNote"
        title={translations.codeActivations.header}
        backgroundIcon={palette.lightBlue}
        onPress={pressCodeActivations}
        count={referralByMe?.length}
      />

      <ItemCodeActive
        icon="iconFriends"
        title={
          referralMe?.length > 0
            ? translations.codeActivations.referrer
            : translations.invite.enterCode
        }
        backgroundIcon={palette.gold}
        onPress={showReferrer}
        count={""}
      />
    </View>
  );
};

export default ListCodeActive;
