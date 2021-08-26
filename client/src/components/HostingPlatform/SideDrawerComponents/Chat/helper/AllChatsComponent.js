/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import ChatMsgElement from "./ChatMsgElement";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MsgInput from "./MsgInput";
import "./../../../Styles/chatComponent.scss";
import socket from "../../../service/socket";
import {
  fetchEventChats,
  fetchPreviousEventChatMessages,
} from "../../../../../actions";

const AllChatsComponent = () => {
  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  useEffect(() => {
    dispatch(fetchPreviousEventChatMessages(eventId));

    socket.on("previousEventMessages", ({ chats }) => {
      console.log(chats);
      dispatch(fetchEventChats(chats));
    });
  }, [dispatch, eventId]);

  const eventChats = useSelector((state) => state.chats.eventChats);

  const renderChats = (chats) => {
    return chats.map((chat) => {
      return (
        <ChatMsgElement
          msgText={chat.textMessage}
          image={
            chat.userImage.startsWith("https://")
              ? chat.userImage
              : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${chat.userImage}`
          }
          name={chat.userName}
        />
      );
    });
  };

  return (
    <>
      <div className="chat-msg-container pt-2 px-2">
        <div
          className="scrollable-chat-element-container"
          id="all-chat-msg-container"
        >
          {renderChats(eventChats)}
        </div>
        <MsgInput
        //  sendChannelMessage={sendChannelMessage}
        />
      </div>
    </>
  );
};

export default AllChatsComponent;
