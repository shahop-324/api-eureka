/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import ChatMsgElement from "./ChatMsgElement";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MsgInput from "./MsgInput";
import ReactDOM from "react-dom";
import "./../../../Styles/chatComponent.scss";
import socket from "../../../service/socket";
import {  fetchEventChats, fetchPreviousEventChatMessages } from "../../../../../actions";

const AllChatsComponent = () => {

  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  useEffect(() => {

    dispatch(fetchPreviousEventChatMessages(eventId));

    socket.on("previousEventMessages", ({chats}) => {
      console.log(chats);
     dispatch(fetchEventChats(chats));
    })
  }, [dispatch, eventId]);

  const { RTMClient } = useSelector((state) => state.RTM);

  

  let channel = RTMClient.createChannel(eventId.toString());

  const { firstName, lastName, email, image, _id } = useSelector(
    (state) => state.user.userDetails
  );

  const peopleInThisEvent = useSelector(
    (state) => state.user.peopleInThisEvent
  );

  const userRole = useSelector((state) => state.eventAccessToken.role);

  const previousEventChats = useSelector((state) => state.chats.eventChats);

  const renderChats = (chats) => {
    return chats.map((chat) => {
      return (
        <ChatMsgElement
          msgText={chat.textMessage}
          image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${chat.userImage}`}
          name={chat.userName}
        />
      );
    });
  };

  const findSender = (id) => {
    const sender = peopleInThisEvent.find((person) => person.userId === id);
    return sender;
  };

  

  const joining = async () => {
    await channel.join();
  };

  useEffect(() => {
    joining();
    return () => {
      (async () => {
        await channel.leave();
      })();
    };
  }, [channel]);

  channel.on("ChannelMessage", function (message, memberId) {
   
    const {  userName, userImage } = findSender(memberId);
    

    ReactDOM.render(
      <ChatMsgElement
        msgText={message.text}
        name={userName}
        image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${userImage}`}
      />,
      document
      .getElementById("all-chat-msg-container")
      .appendChild(document.createElement("div"))
    );

    // userId, userName, userEmail, userImage
  });

  const sendChannelMessage = async (msgText) => {
    if (channel != null) {
      await channel.sendMessage({ text: msgText }).then(() => {
        ReactDOM.render(
          <ChatMsgElement
            msgText={msgText}
            name={`${firstName} ${lastName}`}
            image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`}
          />,
          document
            .getElementById("all-chat-msg-container")
            .appendChild(document.createElement("div"))
        );

        // firstName, lastName, email, image, _id

        socket.emit(
          "transmitEventMessage",
          {
            textMessage: msgText,
            eventId: eventId,
            createdAt: Date.now(),
            userRole: userRole,
            userName: `${firstName} ${lastName}`,
            userEmail: email,
            userImage: image,
            userId: _id,
            reported: false,
            numOfTimesReported: 0,
            visibilityStatus: "Active",
          },
          (error) => {
            if (error) {
              alert(error);
            }
          }
        );
      });
    }
  };

  return (
    <>
      <div className="chat-msg-container pt-2 px-2">
        <div
          className="scrollable-chat-element-container"
          id="all-chat-msg-container"
        >
          {renderChats(previousEventChats)}
        </div>
        <MsgInput sendChannelMessage={sendChannelMessage} />
      </div>
    </>
  );
};

export default AllChatsComponent;
