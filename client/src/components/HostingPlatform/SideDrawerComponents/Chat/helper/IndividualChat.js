/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import {useDispatch, useSelector} from "react-redux";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import Ripple from "../../../../ActiveStatusRipple";
import MsgInput from "./MsgInput";
import ChatMsgElement from "./ChatMsgElement";
import OutgoingChatMsgElement from "./OutgoingChatElement";
import { setPersonalChatConfig } from "../../../../../actions";
import Loader from "./../../../../Loader";

const IndividualChat = ({
  handleOpen,
  exitPersonalChat,
  handleOpenVideoOptions,
}) => {

  const {id} = useSelector((state) => state.personalChat);

  const {peopleInThisEvent} = useSelector((state) => state.user);

  const requiredPerson = peopleInThisEvent.find((element) => element.userId === id);

  const IsPersonLoaded = requiredPerson ? true : false;

  const dispatch = useDispatch();

  const [status] = useState("active");

  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [organisation, setOrganisation] = useState(null);
  const [designation, setDesignation] = useState(null);

  const createReplyWidget = (
    name,
    img,
    msg,
    organisation,
    designation,
    timestamp
  ) => {
    setName(name);
    setImage(img);
    setMsg(msg);
    setOrganisation(organisation);
    setDesignation(designation);
    setTimestamp(timestamp);
  };

  const destroyReplyWidget = () => {
    setName(null);
    setImage(null);
    setMsg(null);
    setOrganisation(null);
    setDesignation(null);
    setTimestamp(null);
  };

  if(!IsPersonLoaded) {
    return <Loader />
  }

  const profileName = requiredPerson.userName;
  const profileImage = requiredPerson.userImage.startsWith("https://") ? requiredPerson.userImage : `https://bluemeet.s3.us-west-1.amazonaws.com/${requiredPerson.userImage}`;
  const profileOrganisation = requiredPerson.userOrganisation;
  const profileDesigantion = requiredPerson.userDesignation;
  const profileStatus = requiredPerson.status;

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
                dispatch(setPersonalChatConfig(null))
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
              src={profileImage}
              alt={profileName}
              variant="rounded"
            />
            <div className="">
              <div
                className="chat-box-name"
                style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
              >
                {profileName}
              </div>
              {profileStatus === "Active" ? (
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
              <CalendarTodayRoundedIcon
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
            <ChatMsgElement
              name={Faker.name.findName()}
              image={Faker.image.avatar()}
              msgText={"Hi there"}
              organisation={"Google"}
              designation={"SDE"}
              timestamp={Date.now()} // timestamp of chat msg
              chatMsgId={'901skk'} // Id of chat msg
            />
            {/* Outgoing chat */}
            <OutgoingChatMsgElement msgText={"Hi, how you have been?"} timestamp={Date.now()} />
            {/* {renderChats(eventChats)} */}
          </div>

          <MsgInput
            name={name}
            image={image}
            msg={msg}
            organisation={organisation}
            designation={designation}
            timestamp={timestamp}
            destroyReplyWidget={destroyReplyWidget}
            // sendChannelMessage={sendChannelMessage}
          />
        </div>
      </div>
    </>
  );
};

export default IndividualChat;