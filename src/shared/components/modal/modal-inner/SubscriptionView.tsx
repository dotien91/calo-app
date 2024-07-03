import React from "react";
import { Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
/**
 * ? Local Imports
 */
import FastImage from "react-native-fast-image";
import useStore from "@services/zustand/store";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import SubscriptionBtn from "@screens/home/components/subscription-btn/SubscriptionBtn";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import { EnumColors } from "models";
import CS from "@theme/styles";

const SubscriptionView = () => {
  const extraUserData = useStore((state) => state.extraUserData);
  const data = extraUserData?.subscription_sell;
  if (!data) return null;

  const OpenURLButton = (url: string) => {
    Linking.openURL(url);
  };

  const onPressPolicy = () => {
    OpenURLButton("https://guides.ikigai.vn/privacy-policy");
  };
  const onPressTermOfUs = () => {
    OpenURLButton("https://guides.ikigai.vn/term-and-conditions");
  };
  return (
    <ScrollView
      style={{
        backgroundColor: palette.white,
        borderRadius: 12,
        paddingBottom: 16,
      }}
    >
      <FastImage
        style={{
          width: Device.width - 32,
          height: ((Device.width - 32) * 9) / 16,
          borderRadius: 12,
          marginBottom: 8,
        }}
        source={{ uri: data.cover_url }}
      />
      <View>
        <TextBase title={data.title} fontWeight="600" fontSize={20} />
        <TextBase title={data.description} marginBottom={12} />
        <SubscriptionBtn />
      </View>
      <View style={styles.viewDes}>
        <TextBase
          color={EnumColors.textOpacity4}
          title={translations.premiumAccount.des1}
          fontSize={14}
          fontWeight="700"
        />
        <TextBase
          title={
            Platform.OS == "ios"
              ? translations.premiumAccount.des2IOS
              : translations.premiumAccount.des2Android
          }
          fontSize={12}
          style={{ textAlign: "center" }}
          color={EnumColors.textOpacity4}
        />
        <View style={styles.viewTerm}>
          <PressableBtn onPress={onPressPolicy}>
            <TextBase
              title={translations.aboutUs.privacy}
              fontSize={12}
              style={styles.policy}
              color={EnumColors.textOpacity4}
            />
          </PressableBtn>
          <PressableBtn onPress={onPressTermOfUs}>
            <TextBase
              title={translations.aboutUs.termofus}
              fontSize={12}
              style={styles.policy}
              color={EnumColors.textOpacity4}
            />
          </PressableBtn>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewDes: {
    paddingHorizontal: 16,
    marginVertical: 24,
    alignItems: "center",
  },
  policy: {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 12,
  },
  viewTerm: {
    ...CS.row,
    gap: 8,
  },
});

export default React.memo(SubscriptionView);
