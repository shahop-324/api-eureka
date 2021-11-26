import React, { useState } from "react";

import "./../Styles/report.scss";
import "./../../../Styles/root.scss";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import ReportActions from "../Sub/ReportActions";
import WhatsWrong from "../Sub/WhatsWrong";
import ReportedMsg from "./ReportedMsg";

const ReportedMsgElement = ({
  reportedBy,
  reason,
  timestamp,
  name,
  image,
  organisation,
  designation,
  msg,
  msgId,
  warned,
  removedFromEvent,
  deleted,
  senderId,
}) => {
  const [openActions, setOpenActions] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenActions = () => {
    setOpenActions(true);
  };
  const handleCloseActions = () => {
    setOpenActions(false);
  };
  return (
    <>
      <div className="reported-msg-container px-4 py-3 mb-3">
        <div className="d-flex flex-row align-items-center mb-4">
          <Avatar
            src={
              reportedBy
                ? reportedBy.image
                  ? reportedBy.image.startsWith("https://")
                    ? reportedBy.image
                    : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${reportedBy.image}`
                  : ""
                : ""
            }
            alt={reportedBy && reportedBy.firstName}
            variant="rounded"
            className="me-3"
          />

          <div className="alert-from-text me-1">
            {`${reportedBy && reportedBy.firstName} ${
              reportedBy && reportedBy.lastName
            }`}

            <span style={{ fontWeight: "400" }}> reported</span>
          </div>
        </div>
        <ReportedMsg
          timestamp={timestamp}
          organisation={organisation}
          designation={designation}
          name={name}
          image={
            image
              ? image.startsWith("https://")
                ? image
                : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${image}`
              : ""
          }
          msgText={msg}
        />

        <div className="d-flex flex-row align-items-center">
          <button
            onClick={() => {
              handleOpen();
            }}
            className="btn btn-light btn-outline-text me-3"
            style={{ width: "48%" }}
          >
            What's wrong?
          </button>
          <button
            onClick={() => {
              handleOpenActions();
            }}
            className="btn btn-primary btn-outline-text"
            style={{ width: "48%" }}
          >
            Take action
          </button>
        </div>
      </div>

      <WhatsWrong
        open={open}
        handleClose={handleClose}
        reason={reason}
        name={`${reportedBy && reportedBy.firstName} ${
          reportedBy && reportedBy.lastName
        }`}
      />

      <ReportActions
        warned={warned}
        removedFromEvent={removedFromEvent}
        deleted={deleted}
        name={name}
        image={
          image
            ? image.startsWith("https://")
              ? image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${image}`
            : ""
        }
        organisation={organisation}
        designation={designation}
        msgId={msgId}
        open={openActions}
        handleClose={handleCloseActions}
        senderId={senderId}
      />
    </>
  );
};

const renderReports = (reports) => {
  return reports.map((report) => {
    if (report.senderId) {
      // This is a personal message
      return (
        <ReportedMsgElement
          reportedBy={report.reportedBy}
          reason={report.reportReason}
          timestamp={report.createdAt}
          name={report.senderName}
          image={report.senderImage}
          organisation={report.senderOrganisation}
          designation={report.senderDesignation}
          msg={report.textMessage}
          msgId={report._id}
          deleted={report.deleted}
          warned={report.warned}
          removedFromEvent={report.suspended}
          senderId={report.senderId}
        />
      );
    } else {
      // This is not a personal message
      return (
        <ReportedMsgElement
          reportedBy={report.reportedBy}
          reason={report.reportReason}
          timestamp={report.createdAt}
          name={report.userName}
          image={report.userImage}
          organisation={report.userOrganisation}
          designation={report.userDesignation}
          msg={report.textMessage}
          msgId={report._id}
          deleted={report.deleted}
          warned={report.warned}
          removedFromEvent={report.suspended}
          senderId={report.userId}
        />
      );
    }
  });
};

const ModerationReportedList = ({ reports }) => {
  return (
    <>
      <div className="people-container pt-2 px-2" style={{ height: "75vh" }}>
        <div className="scrollable-chat-element-container">
          {renderReports(reports)}
        </div>
      </div>
    </>
  );
};

export default ModerationReportedList;
