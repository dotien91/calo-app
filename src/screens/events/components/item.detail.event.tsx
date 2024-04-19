import React from "react";
import FastImage from "react-native-fast-image";
import { StyleSheet, View } from "react-native";
import { ScreenWidth } from "@freakycoder/react-native-helpers";

import Button from "@shared-components/button/Button";
import IconSvg from "assets/svg";
import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import { translations } from "@localization";
import { formatDateAtTime } from "@utils/date.utils";

const ItemDetailEvent = ({ item }) => {
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

  const renderImg = () => {
    return (
      <FastImage
        style={{
          ...styles.viewImg,
        }}
        source={{
          uri: item?.cover || null,
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const renderInfo = () => {
    return (
      <View style={styles.viewContent}>
        <TextBase
          fontSize={14}
          fontWeight="400"
          title={`${formatDateAtTime(item?.createdAt)}`}
          color={EnumColors.textOpacity8}
        />
        <TextBase
          fontSize={20}
          fontWeight="700"
          title={item?.name}
          color={EnumColors.text}
          numberOfLines={2}
        />
        <TextBase
          fontSize={16}
          fontWeight="400"
          title={item?.location}
          color={EnumColors.textOpacity8}
        />
        <View style={styles.viewBtn}>
          <Button
            style={styles.btn}
            text={translations.event.interested}
            backgroundColor={palette.colorMoney}
            textColor={palette.primary}
            onPress={() => {
              console.log(1111111111);
            }}
          />
        </View>
        <IconText
          nameIcon="icPersonal"
          text={`${translations.event.eventBy} ${item?.create_by.display_name}`}
        />
        <IconText nameIcon="icLocated" text={item?.location} />
        <IconText
          nameIcon="icCheckbox"
          text={`${item?.interested_user_ids.length} ${translations.event.going} - ${item?.interested_user_ids.length} ${translations.event.interested}`}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderImg()}
      {renderInfo()}
    </View>
  );
};

export default ItemDetailEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewImg: {
    height: 200,
    width: ScreenWidth,
    backgroundColor: palette.placeholder,
  },
  viewContent: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  viewBtn: {
    marginTop: 8,
  },
  btn: {
    width: "100%",
  },
  viewIcon: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
