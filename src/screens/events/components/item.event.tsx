import React, { useEffect, useState } from "react";
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
import useStore from "@services/zustand/store";
import { updateEvent } from "@services/api/event.api";

type ButtonText = "interested" | "interest";

const ItemEvent = ({ data, tier }: { data: any; tier: string }) => {
  const userData = useStore((store) => store.userData);
  const [buttonText, setButtonText] = useState<ButtonText>(
    data?.interested_user_ids?.includes(userData?._id) ? "interested" : "",
  );
  const [count, setCount] = useState<number>(data?.interested_user_ids.length);
  const [isEventEnded, setIsEventEnded] = useState<boolean>(false);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const eventEndTime = new Date(data?.end_time).getTime();
    setIsEventEnded(currentTime >= eventEndTime);
  }, [data?.end_time]);

  const goToEventScreen = () => {
    if (data?.is_join) {
      NavigationService.navigate(SCREENS.CLUB_SCREEN, {
        id: data._id,
        name: data?.name,
        item: data,
        tier: tier,
      });
    } else {
      NavigationService.navigate(SCREENS.DETAILEVENTSCREEN, {
        id: data._id,
        name: data?.name,
        item: data,
        tier: tier,
        interested: buttonText,
        count: count,
      });
    }
  };

  useEffect(() => {
    if (data?.interested_user_ids.includes(userData?._id)) {
      setButtonText("interested");
      setCount(data?.interested_user_ids.length);
    } else {
      setButtonText("interest");
      setCount(data?.interested_user_ids.length);
    }
  }, [data?.interested_user_ids]);

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

  const handlePress = () => {
    if (buttonText === "interested") {
      updateEvent({ remove_user_id: userData?._id, _id: data._id }).then();
      setButtonText("interest");
      setCount(count - 1);
    } else {
      updateEvent({ add_user_id: userData?._id, _id: data._id }).then();
      setButtonText("interested");
      setCount(count + 1);
    }
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
            style={{ flex: 1 }}
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
          title={`${count} ${translations.event.interested}`}
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
        <View style={styles.viewBtn}>{renderButton()}</View>
      </View>
    );
  };

  const renderButton = () => {
    if (isEventEnded) {
      return (
        <Button
          style={styles.btn}
          text={translations.event.eventEnded}
          backgroundColor={palette.grey3}
          textColor={palette.textOpacity6}
          disabled
        />
      );
    }

    return (
      <Button
        style={styles.btn}
        text={
          buttonText === "interested"
            ? translations.event.interested
            : translations.event.interest
        }
        backgroundColor={
          buttonText === "interested" ? palette.colorMoney : palette.grey3
        }
        textColor={
          buttonText === "interested" ? palette.primary : palette.textOpacity6
        }
        onPress={handlePress}
      />
    );
  };

  return (
    <Pressable style={styles.container} onPress={goToEventScreen}>
      {renderImg()}
      {renderInfo()}
    </Pressable>
  );
};

export default ItemEvent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 8,
    marginBottom: 10,
  },
  viewImg: {
    borderRadius: 8,
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
