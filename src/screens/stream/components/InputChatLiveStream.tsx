import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

/**
 * ? Local Imports
 */

import { translations } from "@localization";
import Input from "@shared-components/form/Input";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
import { likeLiveStream } from "@services/api/livestreamApi";
import { throttle } from "lodash";
import images from "./reaction-animation/Themes/Images";
import { Device } from "@utils/device.utils";

const reactionData = [
  { type: "like", image: images.like_static },
  { type: "love", image: images.love_static },
  { type: "care", image: images.care_static },
  { type: "haha", image: images.haha_static },
  { type: "wow", image: images.wow_static },
  { type: "sad", image: images.sad_static },
  { type: "angry", image: images.angry_static },
];

interface InputChatLiveProps {
  sendChatMessage: () => void;
  chatRoomId: string;
  isPublisher: boolean;
}

const InputChatLive: React.FC<InputChatLiveProps> = ({
  sendChatMessage,
  chatRoomId,
  isPublisher,
}) => {
  const inputRef = useRef(null);
  const onSend = () => {
    const text = inputRef.current.value || "";
    sendChatMessage(text);
    inputRef.current.setValue("");
  };

  const renderReaction = () => {
    if (isPublisher) return null;
    return (
      <>
        {reactionData.map((item, index) => (
          <TouchableOpacity
            onPress={throttle(() => pressLike(item), 3000)}
            key={index}
            style={styles.reactionBtn}
          >
            <Image
              source={item.image}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </>
    );
  };

  const pressLike = (item: any) => {
    likeLiveStream({
      livestream_id: chatRoomId,
      react_type: item.type,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      // contentContainerStyle={{ flex: 1 }}
    >
      {/* <AnimationScreen /> */}
      <View style={styles.box}>
        <View
          style={[
            styles.wrapInput,
            isPublisher && { width: Device.width - 30 },
          ]}
        >
          <Input
            ref={inputRef}
            otherProps={{
              placeholder: translations.chat.typeMessage,
              placeholderTextColor: palette.white,
            }}
            customStyle={styles.input}
          />
          <IconBtn
            name={"send"}
            color={palette.white}
            size={18}
            onPress={onSend}
            customStyle={styles.iconSend}
          />
        </View>
        {/* <IconBtn
          name={"share-social"}
          color={palette.white}
          size={20}
          onPress={pressLike}
          customStyle={styles.iconLike}
        /> */}
        {renderReaction()}
      </View>
    </ScrollView>
  );
};

const styles: any = StyleSheet.create({
  box: {
    ...CommonStyle.flexRear,
    marginLeft: 12,
    height: 70,
    marginTop: -10,
  },
  wrapInput: {
    ...CommonStyle.flexStart,
    width: (Device.width - 18) / 1.5,
    marginRight: 6,
    height: 40,
  },
  input: {
    backgroundColor: palette.lightOverlay,
    height: 40,
    borderRadius: 99,
    color: palette.white,
  },
  iconSend: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  // iconLike: {
  //   backgroundColor: palette.lightOverlay,
  //   width: 30,
  //   height: 30,
  //   ...CommonStyle.flexCenter,
  // },
  reactionBtn: {
    marginRight: 6,
  },
});

export default React.memo(InputChatLive);
