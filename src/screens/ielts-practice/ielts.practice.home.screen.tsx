import * as React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { EnumTestType } from "models/course.model";
import { useUserHook } from "@helpers/hooks/useUserHook";
import { showWarningLogin } from "@helpers/super.modal.helper";

const PracticeHomeScreen = () => {
  const { isLoggedIn } = useUserHook();

  const gotoTest = (type: string) => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    NavigationService.navigate(SCREENS.IELTS_PRACTICE_LIST, {
      type,
    });
  };
  const gotoReading = () => {
    if (!isLoggedIn()) {
      showWarningLogin();
      return;
    }
    NavigationService.navigate(SCREENS.IELTS_PRACTICE_LIST, {
      type: EnumTestType.Reading,
    });
  };

  return (
    <SafeAreaView style={CS.container}>
      <Header text={translations.ieltsPractice.praticeTest} />
      <View style={styles.viewGroup}>
        <ItemView
          iconName={"icListening"}
          title={"Listening"}
          onPress={() => gotoTest(EnumTestType.Listening)}
        />
        <ItemView
          iconName={"icWriting"}
          title={"Writing"}
          onPress={() => gotoTest(EnumTestType.Writing)}
        />
      </View>
      <View style={styles.viewGroup}>
        <ItemView
          iconName={"icReading"}
          title={"Reading"}
          onPress={gotoReading}
        />
        <ItemView
          iconName={"icSpeaking"}
          title={"Speaking"}
          onPress={() => gotoTest(EnumTestType.Speaking)}
        />
      </View>
    </SafeAreaView>
  );
};

const ItemView = ({ iconName, title, onPress }) => {
  return (
    <PressableBtn onPress={onPress} style={styles.itemView}>
      <IconSvg name={iconName} size={120} />
      <TextBase fontSize={16} fontWeight="600" color="text">
        {title}
      </TextBase>
    </PressableBtn>
  );
};

export default PracticeHomeScreen;

const styles = StyleSheet.create({
  viewGroup: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
  },
  itemView: {
    ...CS.center,
    height: 168,
    flex: 1,
    backgroundColor: palette.secondColor,
    borderRadius: 8,
  },
});
