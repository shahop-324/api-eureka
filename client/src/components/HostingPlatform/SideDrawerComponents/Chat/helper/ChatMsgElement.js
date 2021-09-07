import React, { useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import "./../../../Styles/root.scss";
import "./../../../Styles/chatComponent.scss";
import ReplyRoundedIcon from "@material-ui/icons/ReplyRounded";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";

import SentimentSatisfiedRoundedIcon from "@material-ui/icons/SentimentSatisfiedRounded";
import ReportRoundedIcon from "@material-ui/icons/ReportRounded";
import Emoji1 from "./../../../../../assets/images/emoji1.png";
import Emoji2 from "./../../../../../assets/images/emoji2.png";
import Emoji3 from "./../../../../../assets/images/emoji3.png";
import Emoji4 from "./../../../../../assets/images/emoji4.png";
import Emoji5 from "./../../../../../assets/images/emoji5.png";
import Emoji6 from "./../../../../../assets/images/emoji6.png";
import Emoji7 from "./../../../../../assets/images/emoji7.png";
import Emoji8 from "./../../../../../assets/images/emoji8.png";
import ReportMsg from "./ReportMsg";
import DeleteMsg from "./DeleteMsg";

const ChatMsgElement = ({
  name,
  image,
  msgText,
  forReply,
  createReplyWidget,
  showOptions,
}) => {
  const [open, setOpen] = useState(false);

  const [visibility, setVisibility] = useState("none");

  const [openDelete, setOpenDelete] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // if(!showOptions) {
  //   setVisibility("none");
  // }

  return (
    <>
      <div
        className="chat-msg-element py-2"
        onMouseEnter={() => {
          if (!forReply) {
            setVisibility("inline-block");
          }

          console.log("mouse enter detected");
        }}
        onMouseLeave={() => {
          if (!forReply) {
            setVisibility("none");
          }

          console.log("mouse leave detected");
        }}
      >
        <div style={{ position: "relative" }}>
          {/* <div
            className="chat-elm-emoji flex-row align-items-center justify-content-between px-2 py-2"
            style={{ display: visibility }}
          >
            <img
              src={Emoji1}
              alt={"Happy"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji2}
              alt={"Haha"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji3}
              alt={"Ewww"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji4}
              alt={"Wow"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji5}
              alt={"Hi"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji6}
              alt={"All good"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji7}
              alt={"Like"}
              style={{ display: visibility }}
              className="me-2 chat-msg-emoji"
            />
            <img
              src={Emoji8}
              alt={"Clap"}
              style={{ display: visibility }}
              className="chat-msg-emoji"
            />
          </div> */}

          <div
            className=" mb-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
          >
            <Avatar src={image} alt={name} variant="rounded" />
            <div
              className="chat-box-name ms-3"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              <div>{name}</div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#4B4B4B",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                <div>Product Manager, Evenz</div>

                <div>3m ago</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className=" mb-2"
          style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
        >
          <div></div>
          <div style={{ position: "relative" }}>
            <div
              className="chat-msg-hover-elm flex-row align-items-center justify-content-between px-2 py-1"
              style={{ display: visibility }}
            >
              <ReplyRoundedIcon
                onClick={() => {
                  createReplyWidget(name, image, msgText);
                }}
                className="chat-msg-hover-icon me-2"
                style={{ display: visibility }}
              />
              <ReportOutlinedIcon
                onClick={() => {
                  setOpen(true);
                }}
                className="chat-msg-hover-icon me-2"
                style={{ display: visibility }}
              />
              <DeleteOutlineRoundedIcon
                onClick={() => {
                  setOpenDelete(true);
                }}
                className="chat-msg-hover-icon"
                style={{ display: visibility }}
              />
            </div>
            <div
              className="chat-msg-text ms-3 p-3"
              style={{ borderTopLeftRadius: "0" }}
            >
              <div>{msgText}</div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <ReportMsg
        name={name}
        image={image}
        msgText={msgText}
        open={open}
        handleClose={handleClose}
      />

      <DeleteMsg
        name={name}
        image={image}
        msgText={msgText}
        open={openDelete}
        handleClose={handleCloseDelete}
      />
    </>
  );
};

export default ChatMsgElement;
