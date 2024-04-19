import { navigate, pop } from "@helpers/navigation.helper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { deleteMemberGroup } from "@services/api/club.api";
import useStore from "@services/zustand/store";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { SCREENS } from "constants";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";

interface PopupClubPostProps {
  dataGroup: any;
}

const PopupClubPost = ({ dataGroup }: PopupClubPostProps) => {
  console.log("dataGroup...", dataGroup);
  const userData = useStore((state) => state.userData);

  const navigateSetting = () => {
    navigate(SCREENS.SETTING_CLUB_SCREEN, {
      club_id: dataGroup?._id,
      tier: dataGroup?.attend_data?.tier || "1",
    });
  };

  const confirmLeave = () => {
    deleteMemberGroup(userData?._id);
    // .then((res) => {
    //   console.log("res.leave..", res);
    // });
    pop(1);
  };

  const showConfirmLeaveGroup = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.club.leaveGroup,
        cb: confirmLeave,
      },
    });
  };

  return (
    <View style={styles.container}>
      {dataGroup?.attend_data?.tier == 3 && (
        <PressableBtn style={styles.item} onPress={navigateSetting}>
          <IconSvg name="icSetting" />
          <Text style={styles.txt}>{translations.club.settingClub}</Text>
        </PressableBtn>
      )}
      {dataGroup?.attend_data?.tier != 3 && (
        <PressableBtn style={styles.item} onPress={showConfirmLeaveGroup}>
          <Text style={styles.txt}>{translations.club.leaveGroup}</Text>
        </PressableBtn>
      )}
    </View>
  );
};

export default PopupClubPost;

const styles = StyleSheet.create({
  container: {
    minHeight: 40 + getBottomSpace(),
  },
  item: {
    ...CS.row,
    height: 40,
    gap: 10,
  },
  txt: {
    ...CS.flex1,
    ...CS.hnRegular,
  },
});
