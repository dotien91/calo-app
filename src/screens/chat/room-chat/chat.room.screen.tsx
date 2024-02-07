import React, { useEffect, useRef, Platform } from "react";
import { SafeAreaView, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import emojiUtils from "emoji-utils";
import uuid from "react-native-uuid";
import { useTheme } from "@react-navigation/native";

/**
 * ? Local Imports
 */
import { IMediaUpload, TypedMessageGiftedChat } from "models/chat.model";
import MessageItem from "./components/message/message.item";
import { emitSocket } from "@helpers/socket.helper";
import useStore from "@services/zustand/store";
import ChatHeader from "./chat.room.header";
import RecordModal from "./components/audio/RecordModal";
import InputToolbar from "./components/form/InputToolbar";
import { EnumMessageStatus } from "constants/chat.constant";
import { useChatHistory } from "@helpers/hooks/useChatHistory";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import { getStatusBarHeight } from "react-native-safearea-height";
import SearchInput from "../../../shared/components/search-input.tsx/search.input";
import { translations } from "@localization";
import EmptyResultView from "@shared-components/empty.data.component";
import createStyles from "./chat.room.screen.style";
import LoadingList from "@shared-components/loading.list.component";
import { useFooBar } from "@services/zustand/chat.media.store";
interface ChatRoomScreenProps {}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = () => {
  const userData = useStore((state) => state.userData);
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const { foo, bar } = useFooBar();

  const [txtSearch, setTxtSearch] = React.useState("");
  const setSearchModeChat = useStore((state) => state.setSearchModeChat);
  const searchModeChat = useStore((state) => state.searchModeChat);
  const giftedChatRef = useRef(null);

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
    roomDetail,
    isEmptyMessage,
    isLoadmore,
    loading,
  } = useChatHistory(txtSearch, searchModeChat);

  const {
    uploadRecord,
    listFile,
    setListFile,
    listFileLocal,
    setListFileLocal,
    onSelectPicture,
    onSelectVideo,
  } = useUploadFile();

  const cancelSearchMode = () => {
    setTxtSearch("");
    setSearchModeChat(false);
  };
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
          media_mime_type: item.type,
          media_type: item.type,
          media_url: item.uri,
        };
      }),
      user: userSendMessage,
    };

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

    sendChatMessage("", mediaIds, messages);
    setListFile([]);
    setListFileLocal([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFile]);

  // send txt message
  const _sendChatMessage = (text: string) => {
    if (!text) return;
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

    //scroll to new message
    setTimeout(() => {
      giftedChatRef.current?._listRef?._scrollRef?.scrollTo({
        y: 0,
        animated: true,
      });
    }, 700);
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
        lineHeight: Platform.OS === "android" ? 34 : 30,
      };
    }
    return <MessageItem {...props} messageTextStyle={messageTextStyle} />;
  };

  const _renderChatEmpty = () => {
    if (searchModeChat) return null;
    if (!!messages.length || !isEmptyMessage) return null;
    return (
      <View style={styles.emptyView}>
        <EmptyResultView
          title={translations.noNewMessageTittle}
          desc={translations.noNewMessageDesc}
          icon={"chatbubble-ellipses-outline"}
        />
      </View>
    );
  };

  const renderInputToolbar = () => {
    if (searchModeChat) return null;
    return (
      <InputToolbar
        sendChatMessage={_sendChatMessage}
        openRecordModal={openRecordModal}
        onSelectPicture={onSelectPicture}
        onSelectVideo={onSelectVideo}
      />
    );
  };

  const renderSearchView = () => {
    return (
      <>
        {/* {loading && <LoadingList numberItem={3} />} */}
        {!loading && searchModeChat && !messages.length && (
          <EmptyResultView title={translations.noResult} />
        )}
        {searchModeChat && (
          <SearchInput
            onCancel={cancelSearchMode}
            setTxtSearch={setTxtSearch}
            txtSearch={txtSearch}
            showCancelBtn={true}
          />
        )}
      </>
    );
  };

  const renderHeaderChat = () => {
    if (!isLoadmore) return null;
    return <LoadingList />;
  };

  const renderTopChat = () => {
    if (!loading) return null;
    return <LoadingList numberItem={3} />;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: getStatusBarHeight(), paddingBottom: 8 }}
    >
      <ChatHeader roomDetail={roomDetail} messages={messages} />
      {_renderChatEmpty()}
      <GiftedChat
        messageContainerRef={(ref) => (giftedChatRef.current = ref)}
        messages={messages}
        user={{
          _id: userData?._id,
        }}
        isTyping={isTyping}
        renderMessage={renderMessage}
        showAvatarForEveryMessage={true}
        listViewProps={{
          ListFooterComponent: renderHeaderChat,
          ListHeaderComponent: renderTopChat,
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }) => {
            if (isCloseToTop(nativeEvent)) {
              loadMoreMessage();
            }
          },
        }}
        renderInputToolbar={renderInputToolbar}
      />

      {renderSearchView()}
      <RecordModal uploadRecord={uploadRecord} ref={recordModalRef} />
    </SafeAreaView>
  );
};

export default React.memo(ChatRoomScreen);
