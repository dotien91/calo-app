/* eslint-disable no-underscore-dangle, no-use-before-define */
import React from "react";
import { View, StyleSheet, Text, ViewStyle } from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { Avatar, utils } from "react-native-gifted-chat";
import Bubble from "./message.bubble";
import { EnumMessageStatus } from "constants/chat.constant";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import CommonStyle from "@theme/styles";
import { formatDateTime, isSameDate, isSameMinute } from "@utils/date.utils";
import { TypedMessageGiftedChat } from "models/chat.model";
import { SCREENS } from "constants";
import { isEqualObjectsSameKeys } from "@utils/index";

const { isSameUser, isSameDay } = utils;

interface IMessageBubble {
  renderAvatar: () => React.JSX.Element;
  renderBubble: () => React.JSX.Element;
  currentMessage: TypedMessageGiftedChat;
  nextMessage: TypedMessageGiftedChat;
  previousMessage: TypedMessageGiftedChat;
  user: any;
  containerStyle: ViewStyle;
  chatRoomId: string;
}

const MessageBubble = ({ chatRoomId, listMedia, ...props }: IMessageBubble) => {
  const getInnerComponentProps = () => {
    return {
      ...props,
      position: "left",
      isSameUser,
      isSameDay,
    };
  };

  const isSameTime = isSameMinute(
    props.currentMessage.createdAt,
    props.nextMessage.createdAt,
  );
  const isSameTimeShow = isSameDate(
    props.currentMessage.createdAt,
    props.previousMessage.createdAt,
  );
  const sameAvatar = isSameUser(props.currentMessage, props.nextMessage);
  const sameUser = isSameUser(props.currentMessage, props.nextMessage);
  const renderDay = () => {
    if (!isSameTimeShow) {
      return (
        <View style={{ width: "100%", ...CommonStyle.center }}>
          <Text style={styles.txtTime}>
            {formatDateTime(props.currentMessage.createdAt)}
          </Text>
        </View>
      );
    }
    // return <Day {...dayProps} />;

    return null;
  };

  const renderBubble = () => {
    const bubbleProps = getInnerComponentProps();
    if (props.renderBubble) {
      return props.renderBubble(bubbleProps);
    }
    return (
      <Bubble listMedia={listMedia} chatRoomId={chatRoomId} {...bubbleProps} />
    );
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
    if (isSameTime && sameAvatar) {
      extraStyle = { height: 0 };
    }

    const avatarProps = getInnerComponentProps();
    return (
      <Avatar
        {...avatarProps}
        onPressAvatar={openProfile}
        imageStyle={{
          left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle],
        }}
      />
    );
  };

  const marginBottom = sameUser ? 2 : 10;

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
      <View
        style={[
          styles.container,
          { marginBottom },
          props.containerStyle,
          !isSameTime && !sameUser && styles.viewMargin,
        ]}
      >
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
    alignItems: "flex-end",
  },
  viewMargin: {
    marginTop: 16,
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 30,
    width: 30,
    borderRadius: 15,
    marginTop: 6,
  },
  wrapStatus: {
    paddingLeft: 45,
    marginTop: -5,
    marginBottom: 10,
  },
  txtTime: {
    ...CommonStyle.hnRegular,
    color: palette.textOpacity6,
  },
});

export default React.memo(MessageBubble, (props, nextProps) => {
  return isEqualObjectsSameKeys(props.currentMessage, nextProps.currentMessage);
});
