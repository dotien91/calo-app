/* eslint-disable no-underscore-dangle, no-use-before-define */
import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { Avatar, Day, utils } from "react-native-gifted-chat";
import Bubble from "./MessageBubble";
import { EnumMessageStatus } from "constants/chat.constant";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { isSameMinute } from "@utils/date.utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TypedMessageGiftedChat } from "models/chat.model";
import { SCREENS } from "constants";

const { isSameUser, isSameDay } = utils;

interface IMessageBubble {
  renderAvatar: () => React.JSX.Element;
  renderBubble: () => React.JSX.Element;
  renderDay: () => React.JSX.Element;
  currentMessage: TypedMessageGiftedChat;
  nextMessage: TypedMessageGiftedChat;
  previousMessage: TypedMessageGiftedChat;
  user: any;
  containerStyle: ViewStyle;
}

const MessageBubble = (props: IMessageBubble) => {
  const getInnerComponentProps = () => {
    return {
      ...props,
      position: "left",
      isSameUser,
      isSameDay,
    };
  };

  const renderDay = () => {
    if (props.currentMessage.createdAt) {
      const dayProps = getInnerComponentProps();
      if (props.renderDay) {
        return props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  };

  const renderBubble = () => {
    const bubbleProps = getInnerComponentProps();
    if (props.renderBubble) {
      return props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} />;
  };

  const checkIsMe = (currentMessage: TypedMessageGiftedChat) => {
    return currentMessage?.createBy?._id == props.user._id;
  };

  const openProfile = () => {
    const isMe = checkIsMe(props.currentMessage);
    if (isMe) return;
    NavigationService.navigate(SCREENS.PROFILE_CURRENT_USER, {
      _id: props.currentMessage.createBy?._id,
    });
  };

  const renderAvatar = () => {
    let extraStyle;
    if (
      // isSameUser(props.currentMessage, props.previousMessage) &&
      // isSameDay(props.currentMessage, props.previousMessage)
      isSameMinute(
        props.currentMessage.createdAt,
        props.previousMessage.createdAt,
      )
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 };
    }

    const avatarProps = getInnerComponentProps();
    return (
      <TouchableOpacity onPress={openProfile}>
        <Avatar
          {...avatarProps}
          imageStyle={{
            left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle],
          }}
        />
      </TouchableOpacity>
    );
  };

  const marginBottom = isSameUser(props.currentMessage, props.nextMessage)
    ? 2
    : 10;

  const renderStatus = () => {
    const status = props.currentMessage?.status;
    if (status == EnumMessageStatus.Pending) {
      return (
        <View style={styles.wrapStatus}>
          <Text
            style={{
              ...CommonStyle.hnRegular,
              fontSize: 14,
              color: palette.timeColor,
            }}
          >
            {translations.keyboard.sending}
          </Text>
        </View>
      );
    }
    if (status == EnumMessageStatus.Fail) {
      return (
        <View style={styles.wrapStatus}>
          <Icon
            color={palette.danger}
            type={IconType.Ionicons}
            size={18}
            name={"alert-circle-outline"}
          />
        </View>
      );
    }
    return null;
  };
  return (
    <View>
      {renderDay()}
      <View style={[styles.container, { marginBottom }, props.containerStyle]}>
        {renderAvatar()}
        {renderBubble()}
      </View>
      {renderStatus()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyle.flexStart,
    marginLeft: 8,
    marginRight: 0,
    alignItems: "flex-start",
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 30,
    width: 30,
    borderRadius: 12,
    marginTop: 6,
  },
  wrapStatus: {
    paddingLeft: 45,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default React.memo(MessageBubble);
