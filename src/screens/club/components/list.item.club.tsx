import React from "react";
import { Image, StyleSheet, View } from "react-native";

import * as NavigationService from "react-navigation-helpers";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";

const ItemClub = ({ data }: { data: any }) => {
  return (
    <View style={style.container}>
      <PressableBtn
        onPress={() => {
          NavigationService.navigate(SCREENS.ELITE_CLUB);
        }}
        style={style.styleView}
      >
        <Image style={style.styleImg} source={{ uri: data?.img || "" }} />
        <View style={style.viewTxt}>
          <TextBase numberOfLines={3} fontSize={16} fontWeight="700">
            {data?.title}
          </TextBase>
          <TextBase fontSize={12} fontWeight="400">
            {`${translations.club.attended} ${data?.time} ${translations.club.ago}`}
          </TextBase>
        </View>
      </PressableBtn>
    </View>
  );
};

export default ItemClub;

const style = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  styleView: {
    flexDirection: "row",
    gap: 12,
  },
  styleImg: {
    height: 48,
    width: 48,
    borderRadius: 8,
    backgroundColor: palette.red,
  },
  viewTxt: {
    flex: 1,
  },
});
