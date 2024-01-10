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

import { MessageText, Time, utils } from "react-native-gifted-chat";

import MediasView from "@screens/chat/chat-room/components/MediasView";
const { isSameUser, isSameDay } = utils;

interface IBubble {
  touchableProps: any;
  onLongPress: any;
  // renderMessageImage: () => React.JSX.Element;
  renderMessageText: () => React.JSX.Element;
  renderCustomView: () => React.JSX.Element;
  renderUsername: () => React.JSX.Element;
  renderTime: () => React.JSX.Element;
  renderTicks: () => React.JSX.Element;
  currentMessage: any;
  nextMessage: any;
  previousMessage: any;
  user: any;
  containerStyle: ViewStyle;
  wrapperStyle: ViewStyle;
  messageTextStyle: ViewStyle;
  usernameStyle: ViewStyle;
  tickStyle: ViewStyle;
  containerToNextStyle: ViewStyle;
  containerToPreviousStyle: ViewStyle;
  textStyle: ViewStyle;
}

const Bubble = (props: IBubble) => {
  const {
    onLongPress,
    currentMessage,
    containerStyle,
    wrapperStyle,
    messageTextStyle,
    user,
    previousMessage,
    renderUsername,
    usernameStyle,
    touchableProps,
    renderCustomView,
    renderTicks,
    // renderMessageImage,
    tickStyle,
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

  const _renderMessageText = () => {
    if (currentMessage.text) {
      // if (renderMessageText) {
      //   return renderMessageText(props);
      // }
      return (
        <MessageText
          {...props}
          textStyle={{
            left: [
              styles.standardFont,
              styles.slackMessageText,
              props?.textStyle,
              messageTextStyle,
            ],
          }}
        />
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
    return <MediasView data={mediaIds} />;
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
          style={[
            styles.standardFont,
            styles.headerItem,
            styles.username,
            usernameStyle,
          ]}
        >
          {username}
        </Text>
      );
    }
    return null;
  };

  const _renderTime = () => {
    if (currentMessage.createdAt) {
      return (
        <Time
          {...props}
          containerStyle={{ left: [styles.timeContainer] }}
          timeTextStyle={{
            left: [styles.standardFont, styles.headerItem, styles.time],
          }}
        />
      );
    }
    return null;
  };

  const _renderCustomView = () => {
    if (renderCustomView) {
      return renderCustomView(props);
    }
    return null;
  };

  const isSameThread =
    isSameUser(currentMessage, previousMessage) &&
    isSameDay(currentMessage, previousMessage);

  const messageHeader = isSameThread ? null : (
    <View style={styles.headerView}>
      {_renderUsername()}
      {_renderTime()}
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
    // color: Colors.mainColor2
  },
  slackMessageText: {
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: "flex-end",
  },
  username: {
    fontWeight: "bold",
  },
  time: {
    textAlign: "left",
    fontSize: 16,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
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
});

export default React.memo(Bubble);
