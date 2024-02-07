import { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";

import {
  TypedChatHistory,
  TypedMessageGiftedChat,
  IMediaUpload,
} from "models/chat.model";
import useStore from "@services/zustand/store";
import { onSocket, offSocket, emitSocket } from "../socket.helper";
import {
  createChatRoom,
  getChatHistory,
  sendChatToChatRoom,
  viewRoom,
} from "@services/api/chat.api";
import { EnumMessageStatus } from "constants/chat.constant";

const limit = 20;

export const useChatHistory = (txtSearch: string, searchModeChat: boolean) => {
  const route = useRoute();
  const [chatRoomId, setChatRoomId] = useState(route.params?.["id"]);

  const userData = useStore((state) => state.userData);
  const [messages, setMessages] = useState([]);
  const [isEmptyMessage, setIsEmptyMessage] = useState(false);

  const [roomDetail, setRoomDetail] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadmore, setIsLoadmore] = useState(false);
  const setSearchModeChat = useStore((state) => state.setSearchModeChat);
  const updateCurrentMediaIds = useStore(
    (state) => state.updateCurrentMediaIds,
  );
  const [loading, setLoading] = useState(false);

  const pageNumber = useRef(1);
  const isFetching = useRef(false);
  const noMoredata = useRef(false);

  useEffect(() => {
    pageNumber.current = 1;
    noMoredata.current = false;
    setMessages([]);
    _getChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txtSearch]);

  const _getChatHistory = () => {
    if (isFetching.current || noMoredata.current) return;
    const showLoading = searchModeChat || !messages.length;
    isFetching.current = true;
    const params = {
      id: chatRoomId,
      limit,
      page: pageNumber.current,
      order_by: "DESC",
      search: txtSearch,
    };
    if (showLoading) setLoading(true);
    getChatHistory(params).then((res) => {
      isFetching.current = false;
      if (showLoading) setLoading(false);
      if (!res.isError) {
        setIsLoadmore(false);
        pageNumber.current = pageNumber.current + 1;
        const data = res.data.map((item: TypedChatHistory) => {
          const systemMessage = item.media_ids?.[0];
          return {
            ...item,
            text:
              item.chat_content ||
              (systemMessage?.media_type == "system_message"
                ? systemMessage?.media_meta?.[0]?.value
                : ""),
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
        if (!data.length && pageNumber.current == 2) {
          setIsEmptyMessage(true);
        }
        if (pageNumber.current > 2) {
          setMessages([...messages, ...data]);
          return;
        }
        setMessages(data);
      } else {
        setIsLoadmore(false);
      }
    });
  };

  const loadMoreMessage = () => {
    if (isFetching.current || noMoredata.current) return;
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
    setMessages((old) => [newMessage, ...old]);
  };

  const typingToClient = (data: string) => {
    if (data) {
      const dataTyping = JSON.parse(data);
      if (dataTyping.user_id != userData?._id) {
        setIsTyping(true);
      }
    }
  };

  const sendChatMessage = (
    text: string,
    mediaData?: IMediaUpload[],
    giftedMessages: TypedMessageGiftedChat[],
  ) => {
    const data = {
      chat_content: text,
      chat_room_id: chatRoomId,
    };
    if (mediaData.length) {
      data.media_data = JSON.stringify(mediaData);
    }
    sendChatToChatRoom(data).then((res) => {
      let newMessages = [];
      if (!res.isError) {
        newMessages = giftedMessages.map((item) => {
          if (item?.status == EnumMessageStatus.Pending)
            return {
              ...item,
              status: EnumMessageStatus.Send,
            };
          return item;
        });
      } else {
        newMessages = giftedMessages.map((item) => {
          if (item?.status == EnumMessageStatus.Pending)
            return {
              ...item,
              status: EnumMessageStatus.Fail,
            };
          return item;
        });
      }
      setMessages(newMessages);
    });
  };

  const partnerId = route.params?.["partner_id"];

  const getRoomDetail = () => {
    viewRoom({ id: chatRoomId }).then((res) => {
      if (!res.isError) {
        setRoomDetail(res.data);
      }
    });
  };

  useEffect(() => {
    const mediaIds = [...messages]
      .reverse()
      .filter((item) => !item?.text)
      .reduce((ids, currentItem) => {
        console.log("itemitemitem", currentItem);
        return ids.concat(currentItem.media_ids);
      }, []);
    // setCurrentMediaIds(mediaIds);
    updateCurrentMediaIds({ data: mediaIds, id: chatRoomId });
    console.log("mediaIdsmediaIdsmediaIds", mediaIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!chatRoomId) {
      //create chat room from listfriend
      createChatRoom({
        partner_id: partnerId,
        chat_type: "personal",
      }).then((res) => {
        console.log("create room====", res);
        if (!res.isError) {
          setChatRoomId(res.data.chat_room_id._id);
        }
      });
      return;
    }
    getRoomDetail();
    _getChatHistory();
    onSocket("msgToClient", msgToClient);
    onSocket("typingToClient", typingToClient);
    emitSocket("joinRoom", "room_" + chatRoomId);
    return () => {
      offSocket("msgToClient", msgToClient);
      offSocket("typingToClient", typingToClient);
      setSearchModeChat(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

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
    roomDetail,
    isEmptyMessage,
    isLoadmore,
    loading,
  };
};
