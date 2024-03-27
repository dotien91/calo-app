import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import uuid from "react-native-uuid";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import useStore from "@services/zustand/store";
import { useLiveChatHistory } from "./hooks/useChatStream";
import LiveMessageItem from "./components/LiveStreamMessageItem";
import { isIos } from "@helpers/device.info.helper";
import InputChatLive from "./components/InputChatLiveStream";
import { Device } from "@utils/device.utils";
import AnimatedLottieView from "lottie-react-native";
import ReactionLiveStreamComponent from "./components/ReactionLiveStreamComponent";
import eventEmitter from "@services/event-emitter";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { pinShoppingLiveRequest } from "@services/api/course.api";
import { emitSocket } from "@helpers/socket.helper";
import { getPriceCourse } from "@helpers/string.helper";
import PressableBtn from "@shared-components/button/PressableBtn";
import { SCREENS } from "constants";
import FastImage from "react-native-fast-image";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import IconBtn from "@shared-components/button/IconBtn";
import { updateLivestream2 } from "@services/api/stream.api";

interface ChatViewProps {
  liveStreamId: string;
  isPublisher: boolean;
  liveData: any;
  showLiveStream: () => void;
  hideLiveStream: () => void;
}

const ListChatLiveStream: React.FC<ChatViewProps> = ({
  liveStreamId,
  isPublisher,
  liveData,
  showLiveStream,
  hideLiveStream,
}) => {
  const userData = useStore((state) => state.userData);
  const refReaction = React.useRef(null);
  const { setMessages, messages, sendChatMessage, _getChatHistory } =
    useLiveChatHistory({ liveStreamId, isPublisher });
  const [showReactionAnimation, setShowReactionAnimation] =
    React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setShowReactionAnimation(false);
    }, 7000);
  }, []);

  // send txt message
  const _sendChatMessage = (text: string) => {
    const message = {
      chat_content: text,
      _id: uuid.v4(),
      createBy: userData,
    };
    setMessages([message, ...messages]);
    sendChatMessage(text);
  };

  const renderItem = (item, index) => {
    return <LiveMessageItem {...item.item} key={index} />;
  };

  React.useEffect(() => {
    eventEmitter.on("show_reaction_animation", showReact);

    return () => {
      eventEmitter.off("show_reaction_animation", showReact);
    };
  }, []);

  const showReact = (type: string) => {
    refReaction.current?.newReaction({ react_type: type, user_id: userData });
  };

  return (
    <>
      <FlatList
        style={!isIos() ? { scaleY: -1 } : {}}
        inverted={isIos()}
        data={messages}
        renderItem={renderItem}
        contentContainerStyle={messages.length ? styles.listChat : {}}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={_getChatHistory}
        // ListEmptyComponent={ListEmptyComponent}
      />
      <ShoppingLiveProduct
        showLiveStream={showLiveStream}
        hideLiveStream={hideLiveStream}
        hide
        liveData={liveData}
        isTeacher={isPublisher}
      />
      <ReactionLiveStreamComponent ref={refReaction} />
      <InputChatLive
        chatRoomId={liveStreamId}
        sendChatMessage={_sendChatMessage}
        isPublisher={isPublisher}
        liveData={liveData}
        hideLiveStream={hideLiveStream}
      />

      {showReactionAnimation && (
        <AnimatedLottieView
          source={require("assets/lotties/reaction.json")}
          style={{
            width: Device.width,
            height: Device.width,
            position: "absolute",
            right: -150,
            bottom: 80,
          }}
          autoPlay
        />
      )}
    </>
  );
};

const ShoppingLiveProduct = React.memo(
  ({ isTeacher, liveData, hideLiveStream }) => {
    const isPin = true;
    const setShoppingProduct = useStore((state) => state.setShoppingProduct);
    const shoppingProduct = useStore((state) => state.shoppingProduct);
    if (!shoppingProduct) return null;

    const _onPress = () => {
      hideLiveStream();
      NavigationService.navigate(SCREENS.COURSE_DETAIL, {
        course_id: shoppingProduct._id,
        dataCourse: shoppingProduct,
      });

      console.log("isTeacher...", isTeacher);
    };

    const onClose = async () => {
      setShoppingProduct(null);
      if (isTeacher) {
        const dataRequest = {
          product_ids: [],
          livestream_id: liveData._id,
        };
        await updateLivestream2({
          product_id: null,
          _id: liveData?._id,
        });
        pinShoppingLiveRequest(dataRequest).then((res) => {
          console.log("pinsh", res);
        });
        emitSocket("emitProduct", "");
      }
    };

    return (
      <PressableBtn onPress={_onPress} style={styles.viewCourse}>
        <View style={styles.viewCard}>
          <View style={styles.viewImage}>
            <FastImage
              source={{ uri: shoppingProduct?.media_id?.media_thumbnail }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 6,
              }}
              resizeMode={"cover"}
            />
          </View>
          <View style={styles.viewDescription}>
            <Text numberOfLines={1} style={styles.viewTitleName}>
              {shoppingProduct?.title}
            </Text>
            <View style={styles.viewRate}>
              <View style={styles.viewStyleView}>
                <Text style={styles.viewTxt}>{translations.best}</Text>
              </View>
              <View style={styles.viewStyleRate}>
                <IconText
                  nameIcon="icStarFull"
                  text={
                    shoppingProduct?.user_id?.member_count
                      ? `${(
                          shoppingProduct?.user_id?.member_count + "" || ""
                        ).slice(0, 3)} ${translations.ratings}`
                      : translations.course.noreview
                  }
                />
              </View>
            </View>
            <View style={styles.viewStylePrice}>
              <View style={styles.viewPrice}>
                <Text style={styles.txtPriceNew}>
                  {getPriceCourse(shoppingProduct).newPrice}
                </Text>
                <Text style={styles.txtPriceOld}>
                  {getPriceCourse(shoppingProduct).oldPrice}
                </Text>
              </View>
              {!isTeacher && (
                <View style={isPin ? styles.itemPin : styles.viewBtnBuy}>
                  <Text
                    style={[
                      styles.txtBtn,
                      isPin && { color: palette.textOpacity6 },
                    ]}
                  >
                    {translations.buy}
                  </Text>
                </View>
              )}
              {/* <Button style={styles.viewBtnBuy} text={translations.buy} /> */}
            </View>
          </View>
        </View>
        <IconBtn
          onPress={onClose}
          customStyle={styles.closeIcon}
          name="x"
          color={palette.textOpacity8}
          size={20}
        />
      </PressableBtn>
    );
  },
);

const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconSvg name={nameIcon} size={14} color={palette.textOpacity6} />
      <Text style={[styles.txtBodyContent, { marginLeft: 4 }]}>{text}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    right: 9,
    top: 9,
    zIndex: 1,
  },
  listChat: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingBottom: 12,
    paddingTop: 12,
    marginHorizontal: 12,
  },
  viewCourse: {
    marginHorizontal: 8,
    maxHeight: (Device.height * 2) / 3,
    backgroundColor: palette.white,
    borderRadius: 8,
  },
  viewCard: {
    ...CS.row,
    padding: 8,
    gap: 12,
  },
  viewImage: {
    ...CS.center,
    // backgroundColor: palette.red,
  },
  viewDescription: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  viewTitleName: {
    ...CS.hnMedium,
    width: "100%",
    // height: 32,
  },
  viewRate: {
    ...CS.row,
    height: 24,
    gap: 8,
  },
  viewStyleView: {
    ...CS.center,
    backgroundColor: palette.bgBestSeller,
    width: 74,
    height: 22,
    borderRadius: 4,
  },
  viewStyleRate: {
    ...CS.center,
  },
  viewTxt: {
    ...CS.textOpacity4,
  },
  txtBodyContent: {
    ...CS.textRate,
  },
  viewStylePrice: {
    ...CS.row,
    justifyContent: "space-between",
    height: 28,
    gap: 8,
  },
  viewPrice: {
    ...CS.row,
    gap: 4,
  },
  txtPriceNew: {
    ...CS.txtPriceNew,
  },
  txtPriceOld: {
    ...CS.txtPriceOld,
    textDecorationLine: "line-through",
    paddingTop: 4,
  },
  viewBtnBuy: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.primary,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  itemPin: {
    ...CS.center,
    width: 60,
    height: 24,
    backgroundColor: palette.grey,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
  },
  txtBtn: {
    ...CS.textBuy,
  },
});

export default React.memo(ListChatLiveStream);
