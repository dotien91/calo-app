/* eslint-disable no-underscore-dangle, no-use-before-define */

import CommonStyle from "@theme/styles";
import React from "react";
import {
  Text,
  // Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ViewStyle,
} from "react-native";
import { MessageText } from "react-native-gifted-chat";

import { isSameMinute } from "@utils/date.utils";
import { palette } from "@theme/themes";
import { TypedMessageGiftedChat } from "models/chat.model";
import MessageMediaView from "./message.media.view";
import { sliceString } from "@helpers/string.helper";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { MediaType } from "react-native-image-picker";

interface IBubble {
  touchableProps: () => void;
  onLongPress: () => void;
  // renderMessageImage: () => React.JSX.Element;
  renderMessageText: () => React.JSX.Element;
  renderCustomView: () => React.JSX.Element;
  renderUsername: () => React.JSX.Element;
  renderTime: () => React.JSX.Element;
  renderTicks: () => React.JSX.Element;
  currentMessage: TypedMessageGiftedChat;
  nextMessage: TypedMessageGiftedChat;
  previousMessage: TypedMessageGiftedChat;
  user: any;
  containerStyle: ViewStyle;
  wrapperStyle: ViewStyle;
  messageTextStyle: ViewStyle;
  usernameStyle: ViewStyle;
  tickStyle: ViewStyle;
  containerToNextStyle: ViewStyle;
  containerToPreviousStyle: ViewStyle;
  textStyle: ViewStyle;
  chatRoomId: string;
  listMedia: MediaType[];
}

const Bubble = (props: IBubble) => {
  const {
    onLongPress,
    currentMessage,
    containerStyle,
    wrapperStyle,
    user,
    renderUsername,
    touchableProps,
    renderCustomView,
    renderTicks,
    // renderMessageImage,
    tickStyle,
    chatRoomId,
    listMedia,
  } = props;

  const _onLongPress = () => {
    if (onLongPress) {
      onLongPress(currentMessage);
    } else {
      if (currentMessage.text) {
        // const options = ["Copy Text", "Cancel"];
        // const cancelButtonIndex = options.length - 1;
        // context.actionSheet().showActionSheetWithOptions(
        //   {
        //     options,
        //     cancelButtonIndex,
        //   },
        //   buttonIndex => {
        //     switch (buttonIndex) {
        //       case 0:
        //         Clipboard.setString(currentMessage.text)
        //         break
        //     }
        //   },
        // )
      }
    }
  };

  const userData = useStore((state) => state.userData);
  const isMe = userData?._id == currentMessage.user._id;

  const _renderMessageText = () => {
    if (currentMessage.text) {
      return (
        <View
          style={[
            styles.viewMess,
            isMe && {
              backgroundColor: palette.secondColor,
            },
          ]}
        >
          <MessageText
            {...props}
            customTextStyle={{
              color: palette.textOpacity8,
            }}
            linkStyle={{
              left: [{ color: palette.textOpacity8 }],
            }}
          />
        </View>
      );
    }
    return null;
  };

  // const _renderMessageImage = () => {
  //   if (currentMessage.image || currentMessage.video) {
  //     if (renderMessageImage) {
  //       return renderMessageImage(props);
  //     }
  //     return (
  //       <MessageImage
  //         {...props}
  //         imageStyle={[styles.slackImage, props?.imageStyle]}
  //       />
  //     );
  //   }
  //   return null;
  // };

  const _renderMessageVideo = () => {
    const mediaIds = props.currentMessage.media_ids;
    if (!mediaIds?.length) return null;
    return (
      <MessageMediaView
        listMedia={listMedia}
        chatRoomId={chatRoomId}
        data={mediaIds}
        status={props.currentMessage.status}
      />
    );
  };

  const _renderTicks = () => {
    if (renderTicks) {
      return renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && (
            <Text style={[styles.standardFont, styles.tick, tickStyle]}>✓</Text>
          )}
          {currentMessage.received && (
            <Text style={[styles.standardFont, styles.tick, tickStyle]}>✓</Text>
          )}
        </View>
      );
    }
    return null;
  };

  const _renderUsername = () => {
    const username = currentMessage.user.name;
    if (username) {
      if (renderUsername) {
        return renderUsername(usernameProps);
      }
      return (
        <Text
          style={[styles.standardFont, styles.headerItem, styles.txtHeader]}
        >
          {isMe ? translations.you : sliceString(username, 12)}
        </Text>
      );
    }
    return null;
  };

  // const _renderTime = () => {
  //   if (currentMessage.createdAt) {
  //     return (
  //       <Time
  //         {...props}
  //         containerStyle={{ left: [styles.timeContainer] }}
  //         timeTextStyle={{
  //           left: [styles.standardFont, styles.headerItem, styles.time],
  //         }}
  //       />
  //     );
  //   }
  //   return null;
  // };

  const _renderCustomView = () => {
    if (renderCustomView) {
      return renderCustomView(props);
    }
    return null;
  };

  const isSameThread = isSameMinute(
    props.currentMessage.createdAt,
    props.previousMessage.createdAt,
  );

  const messageHeader = isSameThread ? null : (
    <View style={styles.headerView}>
      {_renderUsername()}
      {/* {_renderTime()} */}
      {_renderTicks()}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onLongPress={_onLongPress}
        accessibilityTraits="text"
        {...touchableProps}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <View>
            {_renderCustomView()}
            {messageHeader}
            {/* {_renderMessageImage()} */}
            {_renderMessageVideo()}
            {_renderMessageText()}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Note: Everything is forced to be "left" positioned with component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    ...CommonStyle.hnRegular,
    // color: Colors.danger
  },
  // slackMessageText: {
  //   marginLeft: 4,
  //   marginRight: 4,
  // },
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: "flex-end",
  },
  // username: {
  //   fontWeight: "bold",
  // },
  // time: {
  //   textAlign: "left",
  //   fontSize: 14,
  //   color: palette.textOpacity4,
  // },
  // timeContainer: {
  //   marginLeft: 0,
  //   marginRight: 0,
  //   marginBottom: 0,
  // },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === "android" ? -2 : 0,
    flexDirection: "row",
    alignItems: "baseline",
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: "transparent",
    color: "white",
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: "row",
  },
  viewMess: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    backgroundColor: palette.grey4,
  },
  txtHeader: {
    fontSize: 14,
    color: palette.textOpacity6,
  },
});

export default React.memo(Bubble);
