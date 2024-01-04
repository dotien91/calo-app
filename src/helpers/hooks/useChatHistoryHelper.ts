import { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";

import {
  TypedChatHistory,
  TypedMessageGiftedChat,
  IMediaUpload,
} from "@services/models/ChatModels";
import useStore from "@services/zustand/store";
import { onSocket, offSocket, emitSocket } from "../SocketHelper";
import { getChatHistory, sendChatToChatRoom } from "@services/api/chatApi";
import { EnumMessageStatus } from "@shared-constants/Chat";

const limit = 20;

export const useChatHistoryHelper = () => {
  const route = useRoute();
  const chatRoomId = route.params?.["id"];

  const userData = useStore((state) => state.userData);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadmore, setIsLoadmore] = useState(false);

  const pageNumber = useRef(1);
  const isFetching = useRef(false);
  const noMoredata = useRef(false);

  const _getChatHistory = () => {
    if (isFetching.current || noMoredata.current) return;
    isFetching.current = true;
    const params = {
      id: chatRoomId,
      limit,
      page: pageNumber.current,
      order_by: "DESC",
    };
    getChatHistory(params).then((res) => {
      isFetching.current = false;

      if (!res.isError) {
        setIsLoadmore(false);
        pageNumber.current = pageNumber.current + 1;
        const data = res.data.map((item: TypedChatHistory) => {
          return {
            ...item,
            text: item.chat_content,
            createdAt: item.send_at,
            user: {
              ...item.createBy,
              name: item?.createBy?.display_name,
              avatar: item?.createBy?.user_avatar || item?.createBy?.thumbnail,
            },
          };
        });
        if (data.length < limit) {
          noMoredata.current = true;
        }
        if (pageNumber.current > 2) {
          setMessages([...messages, ...data]);
          return;
        }
        setMessages(data);
      }
    });
  };

  const loadMoreMessage = () => {
    if (isLoadmore) return;
    setIsLoadmore(true);
    _getChatHistory();
  };

  const msgToClient = (data: string) => {
    let newMessage: TypedMessageGiftedChat = JSON.parse(data);
    newMessage = {
      ...newMessage,
      text: newMessage.chat_content || "",
      user: {
        ...newMessage.createBy,
        name: newMessage?.createBy?.display_name,
        avatar:
          newMessage?.createBy?.user_avatar || newMessage?.createBy?.thumbnail,
      },
    };
    //Check case message from another room
    if (newMessage.chat_room_id != chatRoomId) {
      return;
    }
    //Check case message from me
    if (newMessage.user._id == userData?._id) {
      return;
    }
    setMessages([newMessage, ...messages]);
  };

  const typingToClient = (data: string) => {
    if (data) {
      const dataTyping = JSON.parse(data);
      console.log("dataTypingdataTyping", dataTyping, userData);
      if (dataTyping.user_id != userData?._id) {
        setIsTyping(true);
      }
    }
  };

  const sendChatMessage = (text: string, mediaData?: IMediaUpload[]) => {
    sendChatToChatRoom({
      chat_content: text,
      chat_room_id: chatRoomId,
      media_data: JSON.stringify(mediaData),
    }).then((res) => {
      let newMessages = [];
      if (!res.isError) {
        newMessages = messages.map((item) => {
          return { ...item, status: EnumMessageStatus.Send };
        });
      } else {
        newMessages = messages.map((item) => {
          return { ...item, status: EnumMessageStatus.Fail };
        });
      }
      setMessages(newMessages);
    });
  };

  useEffect(() => {
    _getChatHistory();
    onSocket("msgToClient", msgToClient);
    onSocket("typingToClient", typingToClient);
    emitSocket("joinRoom", "room_" + chatRoomId);
    return () => {
      offSocket("msgToClient", msgToClient);
      offSocket("typingToClient", typingToClient);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCloseToTop = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  };

  return {
    setMessages,
    messages,
    isTyping,
    chatRoomId,
    sendChatMessage,
    loadMoreMessage,
    isCloseToTop,
  };
};
