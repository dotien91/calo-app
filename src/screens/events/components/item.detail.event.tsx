import React, { useEffect, useState } from "react";
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
import { updateEvent } from "@services/api/event.api";
import useStore from "@services/zustand/store";
import eventEmitter from "@services/event-emitter";
import { useRoute } from "@react-navigation/native";

const ItemDetailEvent = ({ item }: { item: any }) => {
  const route = useRoute();
  const _count = route.params.count || 0;

  const userData = useStore((store) => store.userData);
  const [buttonText, setButtonText] = useState<string>(
    route.params?.interested,
  );
  const [count, setCount] = useState<number>(0);
  const [isEventEnded, setIsEventEnded] = useState<boolean>(false);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const eventEndTime = new Date(item?.end_time).getTime();

    setIsEventEnded(currentTime >= eventEndTime);
  }, [item?.end_time]);

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

  useEffect(() => {
    setCount(_count);
  }, [_count]);

  const handlePress = () => {
    if (buttonText === "interested") {
      updateEvent({ remove_user_id: userData?._id, _id: item._id }).then(
        (res) => {
          if (!res.isError) {
            eventEmitter.emit("reload_list_event");
          }
        },
      );
      setButtonText("interest");
      setCount(count - 1);
    } else {
      updateEvent({ add_user_id: userData?._id, _id: item._id }).then((res) => {
        if (!res.isError) {
          eventEmitter.emit("reload_list_event");
        }
      });
      setButtonText("interested");
      setCount(count + 1);
    }
  };

  const renderInfo = () => {
    return (
      <View style={styles.viewContent}>
        <TextBase
          fontSize={14}
          fontWeight="400"
          title={`${formatDateAtTime(item?.start_time)}`}
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
        <View style={styles.viewBtn}>{renderButton()}</View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconText
            nameIcon="icPersonal"
            text={`${translations.event.eventBy}`}
          />
          <View style={{ paddingTop: 17 }}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={item?.create_by?.display_name}
            />
          </View>
        </View>
        <IconText nameIcon="icLocated" text={item?.location} />
        <IconText
          nameIcon="icCheckbox"
          text={`${count} ${translations.event.interested}`}
        />
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
