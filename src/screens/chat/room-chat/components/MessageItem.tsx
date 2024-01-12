/* eslint-disable no-underscore-dangle, no-use-before-define */
import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Avatar, Day, utils } from "react-native-gifted-chat";
import Bubble from "./MessageBubble";
import { EnumMessageStatus } from "constants/chat.constant";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { isSameMinute } from "@utils/date.utils";

const { isSameUser, isSameDay } = utils;

interface IMessageBubble {
  renderAvatar: () => React.JSX.Element;
  renderBubble: () => React.JSX.Element;
  renderDay: () => React.JSX.Element;
  currentMessage: any;
  nextMessage: any;
  previousMessage: any;
  user: any;
  containerStyle: any;
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
      <Avatar
        {...avatarProps}
        imageStyle={{
          left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle],
        }}
      />
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
