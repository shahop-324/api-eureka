/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
  // let name = "Shreyansh shah";
  // let image = useSelector((state) => state.user.userDetails);
  // let msg = "What should be the working hours?"

  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState(null);

  const createReplyWidget = (name, img, msg) => {
    setName(name);
    setImage(img);
    setMsg(msg);

    console.log("create reply widget was invoked");
  };

  const destroyReplyWidget = () => {
    setName(null);
    setImage(null);
    setMsg(null);
  };

  // Also create function to set name image and msg back to null so that reply widgets disappears.

  // create and pass a function as props to Chat Msg Element which can set value of name, image and msg when clicked on reply icon.

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
          createReplyWidget={createReplyWidget}
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
      <div className="chat-msg-container pt-2 px-2 d-flex flex-column justify-content-between">
        <div
          className="scrollable-chat-element-container"
          id="all-chat-msg-container"
        >
          {renderChats(eventChats)}
        </div>
        <MsgInput
          name={name}
          image={image}
          msg={msg}
          destroyReplyWidget={destroyReplyWidget}
          //  sendChannelMessage={sendChannelMessage}
        />
      </div>
    </>
  );
};

export default AllChatsComponent;
