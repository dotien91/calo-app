import React from "react";
import { StyleSheet, View } from "react-native";
import { getBottomSpace } from "react-native-iphone-screen-helper";
import * as NavigationService from "react-navigation-helpers";

import CS from "@theme/styles";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import { translations } from "@localization";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { deleteEventID } from "@services/api/event.api";
import eventEmitter from "@services/event-emitter";
import { SCREENS } from "constants";

const PopupMoreEvent = ({ item }) => {
  console.log("lisstt iteam...", JSON.stringify(item, null, 1));

  const goToDelete = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.event.confirmDelete,
        cb: () =>
          deleteEventID(item._id).then((res) => {
            console.log("delete......", item._id);
            if (!res.isError) {
              NavigationService.goBack();
              closeSuperModal();
              showToast({
                type: "success",
                message: translations.event.deleteEventSuccess,
              });
              eventEmitter.emit("reload_list_event");
            }
          }),
      },
    });
  };

  const goToFormEdit = () => {
    NavigationService.navigate(SCREENS.UPDATE_EVENT_SCREEN, {
      item: item,
    });
    closeSuperModal();
  };

  const ItemPopup = ({
    onPress,
    title,
    icName = "",
  }: {
    onPress: () => void;
    title: string;
    icName?: string;
  }) => {
    return (
      <PressableBtn onPress={onPress} style={styles.containerFull}>
        <View style={styles.viewItem}>
          <IconSvg name={icName} size={20} color={palette.textOpacity8} />
        </View>
        <TextBase
          fontSize={16}
          fontWeight="500"
          color={EnumColors.textOpacity8}
        >
          {title}
        </TextBase>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.container}>
      <ItemPopup
        icName="iconEdit"
        onPress={goToFormEdit}
        title={translations.event.editEvent}
      />
      <ItemPopup
        icName="icTrash"
        onPress={goToDelete}
        title={translations.event.deleteEvent}
      />
    </View>
  );
};

export default PopupMoreEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: getBottomSpace(),
  },
  containerFull: {
    ...CS.row,
    height: 40,
    gap: 8,
    marginBottom: 10,
  },
  viewItem: {
    ...CS.center,
    width: 40,
    height: 40,
  },
});
