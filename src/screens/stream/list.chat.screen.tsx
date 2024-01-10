import React from "react";
import { View, FlatList } from "react-native";
import uuid from "react-native-uuid";

/**
 * ? Local Imports
 */
import useStore from "@services/zustand/store";
import { useLiveChatHistory } from "./hooks/use.stream.chat";
import LiveMessageItem from "./components/LiveStreamMessageItem";
import { isIos } from "@helpers/device.info.helper";
import InputChatLive from "./components/InputChatLiveStream";

interface ChatViewProps {
  liveStreamId: string;
  isPublisher: boolean;
}

const ListChatLiveStream: React.FC<ChatViewProps> = ({
  liveStreamId,
  isPublisher,
}) => {
  const userData = useStore((state) => state.userData);

  const { setMessages, messages, sendChatMessage, _getChatHistory } =
    useLiveChatHistory({ liveStreamId, isPublisher });

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

  return (
    <View>
      <FlatList
        style={!isIos() ? { scaleY: -1 } : {}}
        inverted={isIos()}
        data={messages}
        renderItem={renderItem}
        // contentContainerStyle={styles.listFriend}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={_getChatHistory}
        // ListEmptyComponent={ListEmptyComponent}
      />
      <InputChatLive
        chatRoomId={liveStreamId}
        sendChatMessage={_sendChatMessage}
        isPublisher={isPublisher}
      />
    </View>
  );
};

export default React.memo(ListChatLiveStream);
