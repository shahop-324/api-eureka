import React from "react";
import { useParams } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Faker from "faker";
import styled from "styled-components";
import socket from "./../../service/socket";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import "./../../Styles/root.scss";
import { Avatar, IconButton } from "@material-ui/core";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import UnansweredQnA from "./UnansweredQnA";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

const QnABody = styled.div`
  width: 100%;
  height: auto;
  padding: 15px;

  background: #152d3509;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const PersonName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #212121;
  display: block;
`;

const UserRoleTag = styled.div`
  background-color: #152d35;
  height: max-content;
  border-radius: 5px;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.7rem;
  color: #ffffff;

  padding: 4px 8px;
`;

const QuesText = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #5F5F5F;
`;

const UpvoteWidget = styled.div`
  padding: 4px 10px;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 5px;

  background-color: transparent;
  color: #152d35;
  border: 1px solid #152d35;

  &:hover {
    border: 1px solid transparent;
    background-color: #152d35;
    color: #ffffff;
    cursor: pointer;
  }
`;

const TextAreaWidget = styled.textarea`
  padding: 5px 10px;
  border-radius: 5px;
  width: 100%;
  /* background-color: #345b63; */
  background-color: transparent;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;

  color: #212121;

  &:focus {
    border: 1px solid #152d35;
    outline: none;
  }
`;

const StyledOutlineButton = styled.button`
  border: 1px solid #152d35 !important;
  color: #152d35 !important;

  &:hover {
    background-color: #152d35 !important;
    color: #ffffff !important;
  }
`;

const QnAComponent = () => {
  return (
    <>
      <QnABody className="">
        <div className="d-flex flex-row mb-4 justify-content-between">
          <div className="d-flex flex-row">
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
              className="me-3"
            />
            <div>
              <PersonName>{Faker.name.findName()}</PersonName>
              <PersonName>{"Product manager, Bluemeet"}</PersonName>
            </div>
          </div>

          <UserRoleTag>Host</UserRoleTag>
        </div>

        <div className="d-flex flex-row align-items-center mb-3">
          <div className="me-3"></div>
          <QuesText>how about investing money in crypto or NFTs ?</QuesText>
        </div>
      </QnABody>
    </>
  );
};

const DeleteQnA = ({ open, handleClose }) => {
  const params = useParams();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const eventId = params.eventId;
  const sessionId = params.sessionId;

  //   const deleteMsg = (msgId) => {
  //     socket.emit(
  //       "deleteSessionMessage", // !change this to deleteSessionMessage
  //       {
  //         msgId: msgId,
  //         eventId: eventId,
  //         sessionId: sessionId,
  //       },
  //       (error) => {
  //         if (error) {
  //           alert(error);
  //         }
  //       }
  //     );
  //   };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="report-activity-container">
          <div className="d-flex lfex-row align-items-center justify-content-between p-3 mb-3">
            <span
              style={{
                fontWeight: "600",
                fontSize: "1.05rem",
                color: "#212121",
              }}
            >
              Are you sure to delete this Question ?
            </span>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <HighlightOffRoundedIcon />
            </IconButton>
          </div>

          {/* <ChatMsgElement /> */}
          <div className="msg-to-report-container p-3 mb-4">
            {/* Here goes QnA element */}
            <QnAComponent />
          </div>

          {/* Write warning message here */}

          <div
            className="msg-to-report-container mb-3"
            style={{ border: "none" }}
          >
            <button
              //   onClick={() => {
              //     console.log("Delete msg with this Id", msgId);
              //     deleteMsg(msgId);
              //   }}
              className="btn btn-primary btn-outline-text"
              style={{ width: "100%" }}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteQnA;
