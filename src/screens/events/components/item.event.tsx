import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import * as NavigationService from "react-navigation-helpers";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import FastImage from "react-native-fast-image";
import { formatDateMonth } from "@utils/date.utils";

const ItemEvent = ({ data }: { data: any }) => {
  const renderImg = () => {
    return (
      <FastImage
        style={{
          ...styles.viewImg,
        }}
        source={{
          uri: data?.cover || "",
          headers: { Authorization: "someAuthToken" },
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const renderInfo = () => {
    const IconText = ({
      nameIcon,
      text,
    }: {
      nameIcon: string;
      text: string;
    }) => {
      return (
        <View style={styles.viewIcon}>
          <IconSvg name={nameIcon} size={16} color={palette.textOpacity6} />
          <TextBase
            fontSize={12}
            fontWeight="400"
            color={EnumColors.textOpacity6}
          >
            {text}
          </TextBase>
        </View>
      );
    };

    return (
      <View style={styles.viewContent}>
        <TextBase
          fontSize={12}
          fontWeight="500"
          title={`${formatDateMonth(data?.start_time)} - ${formatDateMonth(
            data?.end_time,
          )}`}
          color={EnumColors.primary}
        />
        <TextBase
          fontSize={16}
          fontWeight="700"
          title={data?.name}
          color={EnumColors.text}
          numberOfLines={2}
        />
        <TextBase
          fontSize={12}
          fontWeight="400"
          color={EnumColors.textOpacity6}
          title={`${data?.interested_user_ids} ${translations.event.interested} - ${data?.interested_user_ids} ${translations.event.going}`}
        />
        <IconText nameIcon="icLocation" text={data?.location} />
        <View style={styles.viewInfo}>
          <FastImage
            style={{
              ...styles.viewAvatar,
            }}
            source={{
              uri: data?.create_by?.user_avatar || "",
              headers: { Authorization: "someAuthToken" },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TextBase
            fontSize={14}
            fontWeight="400"
            color={EnumColors.textOpacity8}
            title={data?.create_by?.display_name}
          />
        </View>
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
      </View>
    );
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        NavigationService.navigate(SCREENS.DETAILEVENTSCREEN, {
          id: data._id,
          name: data?.name,
          item: data,
        });
      }}
    >
      {renderImg()}
      {renderInfo()}
    </Pressable>
  );
};

export default React.memo(ItemEvent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 8,
    marginBottom: 10,
  },
  viewImg: {
    borderRadius: 8,
    backgroundColor: palette.red,
    width: 56,
    height: 56,
  },
  viewContent: {
    flex: 1,
  },
  viewIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAvatar: {
    height: 24,
    width: 24,
    borderRadius: 100,
    backgroundColor: palette.gold,
  },
  viewInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingTop: 8,
  },
  viewBtn: {
    paddingTop: 8,
  },
  btn: {
    borderRadius: 12,
  },
});
