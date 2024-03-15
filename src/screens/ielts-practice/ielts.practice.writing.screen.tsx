import * as React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import * as Progress from "react-native-progress";

import { translations } from "@localization";
import Header from "@shared-components/header/Header";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { Device } from "@utils/device.utils";

interface PracticeWritingScreenProps {}

const PracticeWritingScreen = (props: PracticeWritingScreenProps) => {
  const HeaderWriting = () => {
    return (
      <View style={styles.header}>
        <IconSvg name="icWritingHeader" width={180} height={119} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <TextBase fontSize={24} fontWeight="600">
            50%
          </TextBase>
          <View style={styles.btnPractice}>
            <TextBase color="primary" fontSize={14} fontWeight="500">
              {translations.ieltsPractice.praticeTest}
            </TextBase>
          </View>
        </View>
      </View>
    );
  };

  const ItemPracticeTest = ({ item }) => {
    return (
      <View style={styles.viewItem}>
        <View style={styles.headerItem}>
          {item.isSuccess && (
            <IconSvg name="icCheck" size={16} color={palette.green} />
          )}
          <TextBase fontWeight="600">{item.title}</TextBase>
        </View>

        <View style={styles.formTask}>
          <View style={styles.viewTask}>
            <IconSvg name="iconWriting" size={32} color={palette.primary} />
            <TextBase color="text" style={CS.flex1}>
              {item.txtTask1}
            </TextBase>
            {item.isSuccess && (
              <IconSvg name="icCheck" size={20} color={palette.green} />
            )}
          </View>
          <View style={styles.viewTask}>
            <IconSvg name="iconWriting" size={32} color={palette.yellow} />
            <TextBase color="text" style={CS.flex1}>
              {item.txtTask2}
            </TextBase>
            {item.isSuccess && (
              <IconSvg name="icCheck" size={20} color={palette.green} />
            )}
          </View>
        </View>
      </View>
    );
  };
  let widthImage = Device.width - 32;

  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.ieltsPractice.praticeTest} />
      <HeaderWriting />
      <Progress.Bar
        style={styles.viewBar}
        progress={0.7}
        borderWidth={0}
        unfilledColor={palette.grey3}
        color={palette.primary}
        width={widthImage}
        borderRadius={8}
        height={8}
      ></Progress.Bar>

      <ItemPracticeTest
        item={{
          title: "Practice test 1",
          txtTask1: "Writing 1",
          txtTask2: "Writing 2",
          isSuccess: true,
        }}
      />
      <ItemPracticeTest
        item={{
          title: "Practice test 2",
          txtTask1: "Writing 1",
          txtTask2: "Writing 2",
          isSuccess: false,
        }}
      />
    </SafeAreaView>
  );
};

export default PracticeWritingScreen;

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  btnPractice: {
    ...CS.center,
    marginTop: 8,
    backgroundColor: palette.secondColor,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    minWidth: 100,
  },
  viewBar: {
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  viewItem: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3.05,
    shadowOpacity: 0.17,
    elevation: 4,
    backgroundColor: palette.white,
  },
  headerItem: {
    paddingHorizontal: 16,
    gap: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  formTask: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: palette.borderColor,
  },
  viewTask: {
    paddingVertical: 4,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
});
