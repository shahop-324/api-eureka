/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./../../../Styles/root.scss";
import "./../../../Styles/chatComponent.scss";
import ReplyRoundedIcon from "@material-ui/icons/ReplyRounded";
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';




const OutgoingChatMsgElement = ({
//   name,
//   image,
  msgText,
  forReply,
  createReplyWidget,
}) => {


const [open, setOpen] = useState(false);

const [visibility, setVisibility] = useState("none");

const [openDelete, setOpenDelete] = useState(false);


const handleClose = () => {
  setOpen(false);
}

const handleCloseDelete = () => {
  setOpenDelete(false);
}
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
            {/* <Avatar src={image} alt={name} variant="rounded" /> */}
            <div></div>
            <div
              className="chat-box-name ms-3"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              {/* <div>{name}</div> */}
              <div></div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#4B4B4B",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                {/* <div>Product Manager, Evenz</div> */}
                <div></div>

                <div>Just now</div>
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
                //   createReplyWidget(name, image, msgText);
                }}
                className="chat-msg-hover-icon me-2"
                style={{ display: visibility }}
              />
              <DeleteOutlineRoundedIcon
              onClick={() => {
                setOpenDelete(true)
              }}
                className="chat-msg-hover-icon"
                style={{ display: visibility }}
              />
            </div>
            <div className="chat-msg-text ms-3 p-3" style={{backgroundColor: "#6E6E6E", color: "#ffffff", borderTopRightRadius: "0"}}>
              <div>{msgText}</div>
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      {/* <ReportMsg name={name} image={image} msgText={msgText} open={open} handleClose={handleClose}/> */}

      {/* <DeleteMsg name={name} image={image} msgText={msgText} open={openDelete} handleClose={handleCloseDelete}/> */}
    </>
  );
};

export default OutgoingChatMsgElement;
