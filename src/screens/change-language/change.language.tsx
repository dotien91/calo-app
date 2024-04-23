import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import RNRestart from "react-native-restart"; // Import package from node modules
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-screen-helper";
import { isAndroid } from "@freakycoder/react-native-helpers";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import IconSvg from "assets/svg";
import { updateSession } from "@services/api/notification.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

interface TypeItemLanguage {
  label: string;
  value: string;
  flag: React.JSX.Element;
}

const ChangeLanguage = () => {
  const languageList: TypeItemLanguage[] = [
    {
      label: "English",
      value: "en",
      flag: <IconSvg name="icFlagen" size={32} />,
    },
    {
      label: "Vietnamese",
      value: "vi",
      flag: <IconSvg name="icFlagvi" size={32} />,
    },
    {
      label: "Japanese",
      value: "jp",
      flag: <IconSvg name="icFlagjp" size={32} />,
    },
  ];

  const [selected, setSelected] = useState(useStore((state) => state.language));

  const setLanguage = useStore((state) => state.setLanguage);

  const switchLanguage = () => {
    setLanguage(selected);
    translations.setLanguage(selected);
    updateSession({ picked_language: selected });
    RNRestart.Restart();
  };

  const handleAccept = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.Confirm,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        title: translations.switchLanguage,
        cb: switchLanguage,
      },
    });
    // }
  };

  const ItemLanguage = ({ item }: { item: TypeItemLanguage }) => {
    const isSelect: boolean = item.value == selected;
    return (
      <Pressable
        onPress={() => setSelected(item.value)}
        style={
          isSelect
            ? styles.itemLanguageSelected
            : styles.itemLanguageNotSelected
        }
      >
        <View style={styles.contentItem}>
          <View style={styles.leftItem}>
            {item.flag}
            <Text style={styles.textLanguage}>{item.label}</Text>
          </View>
        </View>
        {item.value == selected && <IconSvg name="icCheckCircleFill" />}
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: getStatusBarHeight(),
        marginBottom: isAndroid ? getBottomSpace() : 0,
      }}
    >
      <Header
        text={translations.settings.changeLanguage}
        onPressRight={handleAccept}
        iconNameRight="check"
      />
      <View style={styles.child}>
        <View style={styles.viewItem}>
          {languageList.map((item, index: number) => {
            return <ItemLanguage key={index} item={item} />;
          })}
        </View>
      </View>
    </View>
  );
};
export default ChangeLanguage;

const styles = StyleSheet.create({
  child: {
    ...CS.flex1,
    marginTop: 26,
    backgroundColor: palette.white,
  },
  viewItem: {
    ...CS.flex1,
    gap: 10,
  },
  itemLanguageSelected: {
    ...CS.row,
    height: 60,
    paddingLeft: 16,
    paddingRight: 24,
    justifyContent: "space-between",
    backgroundColor: "#F2FFFB",
    borderRadius: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: palette.blueChart,
  },
  itemLanguageNotSelected: {
    ...CS.row,
    height: 60,
    paddingLeft: 16,
    paddingRight: 24,
    justifyContent: "space-between",
    backgroundColor: palette.white,
    borderRadius: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: palette.grey3,
  },
  contentItem: {
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    justifyContent: "space-between",
  },
  leftItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  textLanguage: {
    ...CS.hnSemiBold,
    fontSize: 18,
    color: palette.mainColor2,
    marginLeft: 16,
  },
});
