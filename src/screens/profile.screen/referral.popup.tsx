import * as React from "react";
import { View, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import PressableBtn from "@shared-components/button/PressableBtn";
import { EnumColors, TypedUser } from "models";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";

interface ReferralPopupProps {
  data: TypedUser;
}

const ReferralPopup = ({ data }: ReferralPopupProps) => {
  const gotoProfile = () => {
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id: data._id,
    });
    closeSuperModal();
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.viewTitle}>
        <TextBase style={styles.textTitle}>
          {translations.referrals.yourReferral}
        </TextBase>
      </View>
      <View style={styles.container}>
        <Avatar
          style={styles.styleAvatar}
          sourceUri={{
            uri: data.user_avatar_thumbnail,
          }}
        />
        <TextBase fontSize={16} fontWeight="600" style={styles.marginVertical}>
          {data.display_name}
        </TextBase>
        <View style={styles.viewBtn}>
          <TextBase
            style={{ color: palette.white }}
          >{`level: ${data.level}`}</TextBase>
        </View>
        <PressableBtn onPress={gotoProfile} style={styles.viewPerson}>
          <Icon
            name="person-circle"
            type={IconType.Ionicons}
            size={24}
            color={palette.textOpacity6}
          />
          <TextBase color={EnumColors.white}>
            {translations.referrals.viewProfile}
          </TextBase>
        </PressableBtn>
      </View>
    </View>
  );
};

export default ReferralPopup;

const styles = StyleSheet.create({
  container: {
    ...CS.center,
    marginTop: 24,
  },
  viewTitle: {
    height: 40,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textTitle: {
    ...CS.hnSemiBold,
    fontSize: 20,
    color: palette.text,
  },

  styleAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  marginVertical: {
    marginVertical: 4,
  },
  viewBtn: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    backgroundColor: palette.primary,
    borderRadius: 8,
  },
  viewPerson: {
    paddingVertical: 1,
    backgroundColor: palette.grey5,
    borderRadius: 8,
    height: 40,
    marginTop: 16,
    ...CS.center,
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
});
