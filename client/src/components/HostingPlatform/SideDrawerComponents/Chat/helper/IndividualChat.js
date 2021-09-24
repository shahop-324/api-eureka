/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";

import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";

import Ripple from "../../../../ActiveStatusRipple";
import MsgInput from "./MsgInput";
import ChatMsgElement from "./ChatMsgElement";
import OutgoingChatMsgElement from "./OutgoingChatElement";

const IndividualChat = ({
  handleOpen,
  exitPersonalChat,
  handleOpenVideoOptions,
}) => {
  const [status] = useState("active");

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

  return (
    <>
      <div className="individaul-chat-container">
        {/* Back button */}
        <div className="d-flex flex-row align-items-center mb-4">
          <div
            style={{
              backgroundColor: "#94949436",
              width: "fit-content",
              borderRadius: "5px",
            }}
            className="px-2 py-1"
          >
            <ArrowBackIosRoundedIcon
              className="chat-msg-hover-icon"
              style={{ fontSize: "18px" }}
              onClick={() => {
                exitPersonalChat();
              }}
            />
          </div>
          <div
            className="ms-3"
            style={{ color: "#212121", fontWeight: "500", fontSize: "0.9rem" }}
          >
            Back
          </div>
        </div>

        {/* Avatar, name, company, position, online status, i button to view complete profile */}

        <div className="">
          <div className="individual-chat-summary-container mb-2 px-3 ">
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
            />
            <div className="">
              <div
                className="chat-box-name"
                style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
              >
                {Faker.name.findName()}
              </div>
              {status === "active" ? (
                <div
                  className="d-flex flex-row align-items-center event-field-label field-label-value"
                  style={{
                    color: "#75BF72",
                    fontFamily: "Ubuntu",
                    fontSize: "0.8rem",
                  }}
                >
                  <Ripple /> Active{" "}
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: "Ubuntu",
                    fontWeight: "500",
                    color: "#D64329",
                    fontSize: "0.8rem",
                  }}
                >
                  Inactive
                </div>
              )}
            </div>

            <div
              className="d-flex flex-row align-items-center"
              style={{ justifySelf: "end" }}
            >
              <VideocamOutlinedIcon
                onClick={() => {
                  handleOpenVideoOptions();
                }}
                className="chat-msg-hover-icon me-3"
              />

              <InfoOutlinedIcon
                className="chat-msg-hover-icon"
                onClick={() => {
                  handleOpen();
                }}
              />
              {/* When clicked on i button then open user profile component */}
            </div>
          </div>
        </div>

        {/* Sepaerator */}

        <div>
          <hr />
        </div>

        {/* Incoming and outgoing Chat widget */}

        {/* Message input box */}

        <div
          className="chat-msg-container pt-2 px-2 d-flex flex-column justify-content-between"
          style={{ height: "63vh" }}
        >
          <div
            className="scrollable-chat-element-container"
            id="all-chat-msg-container"
          >
              {/* <IncomingChat /> */}
              <ChatMsgElement name={Faker.name.findName()} image={Faker.image.avatar()} msgText={"Hi there"}/>
              <OutgoingChatMsgElement msgText={"Hi, how you have been?"}/>
            {/* {renderChats(eventChats)} */}
          </div>
          <MsgInput
            name={name}
            image={image}
            msg={msg}
            destroyReplyWidget={destroyReplyWidget}
            //  sendChannelMessage={sendChannelMessage}
          />
        </div>
      </div>
    </>
  );
};

export default IndividualChat;
