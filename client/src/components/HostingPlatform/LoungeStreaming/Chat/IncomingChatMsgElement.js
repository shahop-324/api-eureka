import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import "./../../Styles/root.scss";
import "./../../Styles/chatComponent.scss";
import ReplyRoundedIcon from "@material-ui/icons/ReplyRounded";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import ReportMsg from "./ReportMsg";
import DeleteMsg from "./DeleteMsg";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const IncomingChatMsgElement = ({
  name,
  image,
  organisation,
  designation,
  msgText,
  forReply,
  createReplyWidget,
  showOptions,
  timestamp,
  chatMsgId,
  showDelete,
  tableId,
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

  return (
    <>
      <div
        className="chat-msg-element py-2"
        onMouseEnter={() => {
          if (!forReply) {
            setVisibility("inline-block");
          }
        }}
        onMouseLeave={() => {
          if (!forReply) {
            setVisibility("none");
          }
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            className=" mb-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
          >
            <Avatar src={image} alt={name} variant="rounded" />
            <div
              className="chat-box-name ms-3"
              style={{
                textTransform: "capitalize",
                fontFamily: "Ubuntu",
                color: "#fff",
              }}
            >
              <div style={{ color: "#CECECE" }}>{name}</div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#FFFFFF",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                <div style={{ color: "#CECECE" }}>
                  {designation}, {organisation}
                </div>
                <div style={{ color: "#CECECE" }}>
                  {timeAgo.format(new Date(timestamp), "round")}
                </div>
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
                  createReplyWidget(
                    name,
                    image,
                    msgText,
                    organisation,
                    designation,
                    timestamp,
                    chatMsgId
                  );
                }}
                className="chat-msg-hover-icon me-2"
                style={{ display: visibility, fontSize: "18px" }}
              />
              <ReportOutlinedIcon
                onClick={() => {
                  setOpen(true);
                }}
                className="chat-msg-hover-icon"
                style={{ display: visibility, fontSize: "18px" }}
              />
              {showDelete ? (
                <DeleteOutlineRoundedIcon
                  onClick={() => {
                    setOpenDelete(true);
                  }}
                  className="chat-msg-hover-icon  ms-2"
                  style={{ display: visibility, fontSize: "18px" }}
                />
              ) : (
                <></>
              )}
            </div>
            <div
              className="chat-msg-text ms-3 p-3"
              style={{ borderTopLeftRadius: "0", color: "#212121" }}
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
        msgId={chatMsgId}
        open={open}
        handleClose={handleClose}
      />

      <DeleteMsg
        name={name}
        image={image}
        msgText={msgText}
        msgId={chatMsgId}
        organisation={organisation}
        designation={designation}
        timestamp={timestamp}
        open={openDelete}
        handleClose={handleCloseDelete}
        tableId={tableId}
      />
    </>
  );
};

export default IncomingChatMsgElement;
