import React from "react";
import { FlatList } from "react-native";
import uuid from "react-native-uuid";

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

interface ChatViewProps {
  liveStreamId: string;
  isPublisher: boolean;
}

const ListChatLiveStream: React.FC<ChatViewProps> = ({
  liveStreamId,
  isPublisher,
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
        // contentContainerStyle={styles.listFriend}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={_getChatHistory}
        // ListEmptyComponent={ListEmptyComponent}
      />
      <ReactionLiveStreamComponent ref={refReaction} />
      <InputChatLive
        chatRoomId={liveStreamId}
        sendChatMessage={_sendChatMessage}
        isPublisher={isPublisher}
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

export default React.memo(ListChatLiveStream);
