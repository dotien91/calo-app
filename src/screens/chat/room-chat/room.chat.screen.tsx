import React, { useEffect, useRef, Platform } from "react";
import { SafeAreaView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";
import uuid from "react-native-uuid";

/**
 * ? Local Imports
 */
import { IMediaUpload, TypedMessageGiftedChat } from "models/chat.model";
import MessageItem from "./components/MessageItem";
import { emitSocket } from "@helpers/socket.helper";
import useStore from "@services/zustand/store";
import ChatHeader from "./room.chat.header";
import RecordModal from "./components/audio/RecordModal";
import InputToolbar from "./components/InputToolbar";
import { EnumMessageStatus } from "constants/chat.constant";
import { useChatHistory } from "@helpers/hooks/useChatHistory";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import { getStatusBarHeight } from "react-native-safearea-height";

interface ChatRoomScreenProps {}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = () => {
  const userData = useStore((state) => state.userData);

  const recordModalRef = useRef(null);
  const userSendMessage = {
    ...userData,
    name: userData?.display_name,
    avatar: userData?.user_avatar,
  };

  const {
    setMessages,
    messages,
    isTyping,
    chatRoomId,
    sendChatMessage,
    loadMoreMessage,
    isCloseToTop,
  } = useChatHistory();

  const {
    uploadRecord,
    listFile,
    setListFile,
    listFileLocal,
    setListFileLocal,
    onSelectPicture,
    onSelectVideo,
  } = useUploadFile();

  //append local media file
  useEffect(() => {
    if (!listFileLocal?.length) return;
    const message: TypedMessageGiftedChat = {
      createdAt: new Date(),
      _id: uuid.v4(),
      status: EnumMessageStatus.Pending,
      media_ids: listFileLocal.map((item) => {
        return {
          ...item,
          media_type: item.type,
        };
      }),
      user: userSendMessage,
    };

    console.log("messagesmessagesmessages", message);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFileLocal]);

  //send media message
  useEffect(() => {
    if (!listFile.length) return;
    const mediaIds: IMediaUpload[] = listFile.map((item) => {
      return { id: item._id };
    });

    console.log("listFile", mediaIds);
    sendChatMessage("", mediaIds, messages);
    setListFile([]);
    setListFileLocal([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFile]);

  // send txt message
  const _sendChatMessage = (text: string) => {
    const message = {
      text,
      createdAt: new Date(),
      _id: uuid.v4(),
      user: userSendMessage,
      status: EnumMessageStatus.Pending,
    };
    const giftedMessages = GiftedChat.append(messages, message);
    emitSocket("typingToServer", "room_" + chatRoomId);
    setMessages(giftedMessages);
    sendChatMessage(text, [], giftedMessages);
  };

  const openRecordModal = () => {
    recordModalRef.current.openModal();
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    let messageTextStyle;
    // Make "pure emoji" messages much bigger than plain text.
    if (
      currentMessage.currText &&
      emojiUtils.isPureEmojiString(currentMessage.currText)
    ) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === "android" ? 34 : 30,
      };
    }
    return <MessageItem {...props} messageTextStyle={messageTextStyle} />;
  };

  // const _renderChatEmpty = () => {
  //   return (
  //     <View style={styles.emptyView}>
  //       <EmptyResultView
  //         title={translations.noNewMessageTittle}
  //         desc={translations.noNewMessageDesc}
  //         icon={"chatbubble-ellipses-outline"}
  //       />
  //     </View>
  //   );
  // };

  const renderInputToolbar = () => {
    return (
      <InputToolbar
        sendChatMessage={_sendChatMessage}
        openRecordModal={openRecordModal}
        onSelectPicture={onSelectPicture}
        onSelectVideo={onSelectVideo}
      />
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: getStatusBarHeight(), paddingBottom: 8 }}
    >
      <ChatHeader messages={messages} />
      <GiftedChat
        messages={messages}
        user={{
          _id: userData?._id,
        }}
        isTyping={isTyping}
        renderMessage={renderMessage}
        showAvatarForEveryMessage={true}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }) => {
            if (isCloseToTop(nativeEvent)) {
              loadMoreMessage();
            }
          },
        }}
        renderInputToolbar={renderInputToolbar}
      />
      <RecordModal uploadRecord={uploadRecord} ref={recordModalRef} />
    </SafeAreaView>
  );
};

export default React.memo(ChatRoomScreen);
