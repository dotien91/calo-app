import * as React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import { palette } from "@theme/themes";

interface PracticeHomeScreenProps {}

const PracticeHomeScreen = (props: PracticeHomeScreenProps) => {
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
  const gotoListening = () => {};
  const gotoReading = () => {};
  const gotoWriting = () => {};
  const gotoSpeaking = () => {};

  return (
    <SafeAreaView style={CS.container}>
      <Header text={translations.ieltsPractice.praticeTest} />
      <View style={styles.viewGroup}>
        <ItemView
          iconName={"icListening"}
          title={"Listening"}
          onPress={gotoListening}
        />
        <ItemView
          iconName={"icWriting"}
          title={"Writing"}
          onPress={gotoWriting}
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
          onPress={gotoSpeaking}
        />
      </View>
    </SafeAreaView>
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
