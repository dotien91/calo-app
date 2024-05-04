import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
} from "react-native";

/**
 * ? Local Imports
 */

import { translations } from "@localization";
import Input from "@shared-components/form/Input";
import IconBtn from "@shared-components/button/IconBtn";
import { palette } from "@theme/themes";
import CommonStyle from "@theme/styles";
import { likeLiveStream } from "@services/api/stream.api";
import { throttle } from "lodash";
import images from "./reaction-animation/Themes/Images";
import { Device } from "@utils/device.utils";
import eventEmitter from "@services/event-emitter";
import PressableBtn from "@shared-components/button/PressableBtn";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";
import IconSvg from "assets/svg";
import { useListData } from "@helpers/hooks/useListData";
import { ICourseItem } from "models/course.model";
import { getMyCourse } from "@services/api/course.api";
import TextBase from "@shared-components/TextBase";
import { EnumColors } from "models";

const reactionData = [
  { type: "like", image: images.like_static, gif: images.like_gif },
  { type: "love", image: images.love_static, gif: images.love_gif },
  { type: "care", image: images.angry_static, gif: images.angry_gif },
  { type: "haha", image: images.haha_static, gif: images.haha_gif },
  { type: "wow", image: images.wow_static, gif: images.wow_gif },
  { type: "sad", image: images.sad_static, gif: images.sad_gif },
  { type: "angry", image: images.angry_static, gif: images.angry_gif },
];

interface InputChatLiveProps {
  sendChatMessage: () => void;
  hideLiveStream: () => void;
  chatRoomId: string;
  isPublisher: boolean;
  liveData: any;
}

const InputChatLive: React.FC<InputChatLiveProps> = ({
  sendChatMessage,
  chatRoomId,
  isPublisher,
  liveData,
  hideLiveStream,
}) => {
  const inputRef = useRef(null);

  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const paramsRequest = {
    limit: "6",
    created_user_id: liveData?.user_id?._id,
    public_status: "active",
    // auth_id: idTeacher,
  };

  const { totalCount } = useListData<ICourseItem>(paramsRequest, getMyCourse);

  const onSend = () => {
    const text = inputRef.current.value || "";
    sendChatMessage(text);
    inputRef.current.setValue("");
  };

  const _showSuperModalCourse = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.ListCourse,
      styleModalType: EnumStyleModalType.Middle,
      data: {
        isTeacher: isPublisher,
        liveData,
        cbOnpressCourse: hideLiveStream,
      },
    });
  };

  const renderShop = () => {
    return (
      <PressableBtn onPress={_showSuperModalCourse} style={styles.imageShop}>
        <IconSvg name="icShop" size={24} color={palette.primary} />
        {!!totalCount && (
          <View style={styles.totalBox}>
            <TextBase fontSize={10} color={EnumColors.white}>
              {totalCount > 99 ? "99+" : totalCount}
            </TextBase>
          </View>
        )}
      </PressableBtn>
    );
  };

  const renderReaction = () => {
    if (isPublisher) return null;
    return (
      <>
        {reactionData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                eventEmitter.emit("show_reaction_animation", item.type);
                throttle(() => pressLike(item), 3000)();
              }}
              key={index}
              style={styles.reactionBtn}
            >
              <Image
                source={item.image}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.box}>
        <View
          style={[
            styles.wrapInput,
            (isKeyboardVisible || isPublisher) && { width: Device.width - 30 },
          ]}
        >
          {renderShop()}
          <Input
            ref={inputRef}
            placeholder={translations.chat.typeMessage}
            placeholderTextColor={palette.white}
            customStyle={styles.input}
            onFocus={() => {
              setKeyboardVisible(true);
            }}
            showClearIcon={false}
            returnKeyType="send"
            onSubmitEditing={onSend}
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
        {!isKeyboardVisible && renderReaction()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 8,
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
  imageShop: {
    width: 30,
    height: 30,
    // backgroundColor: palette.white,
    ...CommonStyle.center,
    zIndex: 1,
  },
  totalBox: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: palette.red,
    paddingHorizontal: 4,
    borderRadius: 99,
    ...CommonStyle.borderStyle,
    borderColor: palette.white,
    borderWidth: 2,
    zIndex: 1,
  },
});

export default React.memo(InputChatLive);
