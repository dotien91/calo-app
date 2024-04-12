import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { palette } from "@theme/themes";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import IconSvg from "assets/svg";

const DetailScreenEvent = () => {
  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <IconSvg name={nameIcon} size={20} color={palette.textOpacity8} />
        <TextBase
          fontSize={16}
          fontWeight="400"
          color={EnumColors.textOpacity8}
        >
          {text}
        </TextBase>
      </View>
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.viewImg} />
        {/* <FastImage
          style={{
            ...styles.viewImg,
          }}
          source={{
            uri: image?.media_thumbnail,
            headers: { Authorization: "someAuthToken" },
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> */}
        <View style={styles.viewContent}>
          <TextBase
            fontSize={14}
            fontWeight="400"
            title="SUNDAY AT 7AM"
            color={EnumColors.textOpacity8}
          />
          <TextBase
            fontSize={20}
            fontWeight="700"
            title="Talkshow: Beginner to Professional Manager"
            color={EnumColors.text}
            numberOfLines={2}
          />
          <TextBase
            fontSize={16}
            fontWeight="400"
            title="8, Pham Hung, Mai Dich, Cau Giay, Hanoi"
            color={EnumColors.textOpacity8}
          />
          <View style={styles.viewBtn}>
            <Button
              style={styles.btn}
              text={translations.event.interested}
              backgroundColor={palette.primary}
              textColor={palette.white}
              onPress={() => {
                console.log(1111111111);
              }}
            />
            <Button
              style={styles.btn}
              text={translations.event.going}
              backgroundColor={palette.grey3}
              textColor={palette.textOpacity6}
              onPress={() => {
                console.log(1111111111);
              }}
            />
          </View>
          <IconText
            nameIcon="icPersonal"
            text={`${translations.event.eventBy}`}
          />
          <IconText
            nameIcon="icLocated"
            text="8, Pham Hung, Mai Dich, Cau Giay, Hanoi"
          />
          <IconText
            nameIcon="icCheckbox"
            text={`58 ${translations.event.going} - 414 ${translations.event.interested}`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreenEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewImg: {
    height: 200,
    width: ScreenWidth,
    backgroundColor: palette.green,
  },
  viewContent: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  viewBtn: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    width: "49%",
  },
  viewIcon: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
