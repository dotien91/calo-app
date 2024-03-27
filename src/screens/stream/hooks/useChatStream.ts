import { useEffect, useRef, useState } from "react";

import useStore from "@services/zustand/store";
import { onSocket, offSocket, emitSocket } from "@helpers/socket.helper";
import {
  sendChatToLiveRoom,
  getChatLiveHistory,
} from "@services/api/stream.api";
import { v4 as uuidv4 } from "uuid";
import { TypedUser } from "models";

const limit = 5;

export const useLiveChatHistory = ({
  liveStreamId,
}: // isPublisher,
{
  liveStreamId: string;
  // isPublisher: boolean;
}) => {
  const userData = useStore((state) => state.userData);
  const [messages, setMessages] = useState([]);

  const pageNumber = useRef(1);
  const isFetching = useRef(false);
  const noMoredata = useRef(false);
  const setViewNumber = useStore((state) => state.setViewNumber);
  const setShoppingProduct = useStore((state) => state.setShoppingProduct);

  useEffect(() => {
    _getChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _getChatHistory = () => {
    if (isFetching.current || noMoredata.current) return;
    isFetching.current = true;
    const params = {
      id: liveStreamId,
      limit,
      page: pageNumber.current,
      order_by: "DESC",
    };
    getChatLiveHistory(params).then((res) => {
      isFetching.current = false;
      if (!res.isError) {
        const data = res.data;
        pageNumber.current = pageNumber.current + 1;
        if (data.length < limit) {
          noMoredata.current = true;
        }
        if (pageNumber.current > 2) {
          setMessages((old) => [...old, ...data]);
          return;
        }
        setMessages(data);
      }
    });
  };

  const sendChatMessage = (text: string) => {
    sendChatToLiveRoom({
      chat_content: text,
      livestream_id: liveStreamId,
    })
  };

  const isMe = (user: TypedUser) => {
    return userData?._id == user?._id;
  };

  const msgToClient = (data: string) => {
    if (!data) return;
    const newMessage = JSON.parse(data);
    //Check case message from another room
    if (newMessage.livestream_id != liveStreamId) {
      return;
    }
    console.log("msgToClient", newMessage?.createBy?._id , userData?._id)

    //Check case message from me
    if (newMessage.createBy._id == userData?._id) {
      return;
    }
    setMessages((old) => [newMessage, ...old]);
  };

  const joinRoomToClient = (data) => {
    console.log("firstjoinRoomToClient", data);
    if (!data) return;
    data = JSON.parse(data);
    if (isMe(data)) return;
    const newMessage = {
      _id: uuidv4(),
      chat_content: data.display_name + " đã tham gia livestream",
    };
    setMessages((old) => [newMessage, ...old]);
  };

  const updateViewNumber = (data) => {
    if (!data) return;
    data = JSON.parse(data);
    const viewNumber = data?.livestream_id?.view_number;
    if (!viewNumber) return;
    setViewNumber(viewNumber);
  };

  // const emojiToClient = (data: string) => {
  //   // console.log("onsocket emojiToClient", JSON.parse(data))
  // };

  const livestreamEndToClient = (data: string) => {
    // console.log("onsocket livestreamEndToClient", JSON.parse(data))
    if (!data) return;
    const newMessage = {
      _id: uuidv4(),
      chat_content: "Phiên livestream đã kết thúc",
    };
    setMessages((old) => [newMessage, ...old]);
  };

  const leaveRoomToClient = (data: string) => {
    // console.log("onsocket leaveRoomToClient", JSON.parse(data))
    if (!data) return;
    data = JSON.parse(data);
    const newMessage = {
      _id: uuidv4(),
      chat_content: data.display_name + " đã rời livestream",
    };
    setMessages((old) => [newMessage, ...old]);
  };

  const clearData = () => {
    setViewNumber(0);
  };

  useEffect(() => {
    if (!liveStreamId) return;
    _getChatHistory();
    onSocket("livestreamToClient", msgToClient); //comment incomming
    onSocket("joinRoomToClient", joinRoomToClient); //viewer join live
    onSocket("viewToClient", updateViewNumber); // view number update
    // onSocket("emojiToClient", emojiToClient); //reaction update
    onSocket("leaveRoomToClient", leaveRoomToClient); //viewer leave live
    onSocket("livestreamEndToClient", livestreamEndToClient); //pulisher end livestream
    emitSocket("joinLivestream", "livestream_" + liveStreamId);

    return () => {
      setShoppingProduct(null);
      offSocket("livestreamToClient", msgToClient); //comment incomming
      offSocket("joinRoomToClient", joinRoomToClient); //viewer join live
      offSocket("viewToClient", updateViewNumber); // view number update
      // offSocket("emojiToClient", emojiToClient); //reaction update
      offSocket("leaveRoomToClient", leaveRoomToClient); //viewer leave live
      offSocket("livestreamEndToClient", livestreamEndToClient); //pulisher end livestream
      clearData();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStreamId]);

  return {
    setMessages,
    messages,
    sendChatMessage,
    _getChatHistory,
  };
};
