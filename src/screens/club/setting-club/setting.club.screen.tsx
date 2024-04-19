import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { removeGroup } from "@services/api/club.api";
import { palette } from "@theme/themes";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import eventEmitter from "@services/event-emitter";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";

const SettingClubScreen = () => {
  const route = useRoute();

  const club_id = route.params?.club_id || "";
  const tier = route.params?.tier;
  console.log("tier", tier);

  const ItemGroup = ({
    nameIcon,
    text,
    onPress,
  }: {
    nameIcon: string;
    text: string;
    onPress: () => void;
  }) => {
    return (
      <PressableBtn style={styles.viewBtn} onPress={onPress}>
        <TextBase fontSize={16} fontWeight="500" color={palette.text}>
          {text}
        </TextBase>
        <IconSvg name={nameIcon} size={24} color={palette.text} />
      </PressableBtn>
    );
  };

  const goToDelete = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.event.confirmDelete,
        cb: () =>
          removeGroup(club_id).then((res) => {
            console.log("delete......", club_id);
            if (!res.isError) {
              NavigationService.navigate(SCREENS.CLUB_SCREEN);
              closeSuperModal();
              showToast({
                type: "success",
                message: translations.club.deleteGroupSuccess,
              });
              eventEmitter.emit("reload_list_club");
            }
          }),
      },
    });
  };

  const goToEditClub = () => {
    NavigationService.navigate(SCREENS.CREATE_CLUB_SCREEN, {
      club_id: club_id,
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={translations.club.settingClub} />
      <View style={styles.container}>
        <ItemGroup
          nameIcon="icGoNext"
          text={translations.club.namAndDes}
          onPress={goToEditClub}
        />
        {tier == 3 && (
          <ItemGroup
            nameIcon="icGoNext"
            text={translations.club.deleteGroup}
            onPress={goToDelete}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SettingClubScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  viewBtn: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
