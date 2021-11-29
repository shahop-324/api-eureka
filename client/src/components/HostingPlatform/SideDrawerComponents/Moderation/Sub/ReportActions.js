/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "./../../../service/socket";
import ReactTooltip from "react-tooltip";
import { Avatar, Dialog, IconButton } from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import "./../Styles/report.scss";
import ActionConfirmation from "./ActionConfirmation";

import Chip from "@mui/material/Chip";

const ReportActions = ({
  open,
  handleClose,
  msgId,
  deleted,
  name,
  image,
  organisation,
  designation,
  warned,
  removedFromEvent,
  senderId,
}) => {
  const params = useParams();
  const eventId = params.eventId;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [intent, setIntent] = useState(null);

  const { userDetails } = useSelector((state) => state.user);

  const { eventDetails } = useSelector((state) => state.event);

  const userId = userDetails._id;

  const handleOpenActionConfirmation = () => {
    setOpenDrawer(true);
  };

  const handleCloseActionConfirmation = () => {
    setOpenDrawer(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        // onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="report-actions-container p-3">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "1.05rem",
                  color: "#212121",
                }}
              >
                Take Action
              </span>

              <a
                data-tip="You can undo these actions from community dashboard"
                className="ms-3"
              >
                <InfoOutlinedIcon
                  style={{ fill: "#6E6E6E", fontSize: "22px" }}
                />
              </a>

              <ReactTooltip place="bottom" type="dark" effect="float" />
            </div>

            <IconButton
              onClick={() => {
                handleCloseActionConfirmation();
                handleClose();
              }}
            >
              <HighlightOffRoundedIcon />
            </IconButton>
          </div>

          <div>
            <hr />
          </div>

          <div
            style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
          >
            <div
              className="mb-4"
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
                  <div>
                    {designation} {organisation}
                  </div>

                  {/* <div></div> */}
                </div>
              </div>
            </div>

            <div className="mb-3">
              {removedFromEvent || eventDetails.blocked.includes(senderId) ? (
                <Chip
                  style={{
                    fontWeight: "500",
                    width: "100%",
                    color: eventDetails ? eventDetails.color : "#152d35",
                    border: eventDetails
                      ? `1px solid ${eventDetails.color}`
                      : `1px solid #152d35`,
                  }}
                  label="Removed from event"
                  color="primary"
                  variant="outlined"
                />
              ) : (
                <button
                  onClick={() => {
                    setIntent("eventSuspension");
                    handleOpenActionConfirmation();
                  }}
                  className="btn btn-outline-primary btn-outline-text"
                  style={{ width: "100%" }}
                >
                  Remove from this event
                </button>
              )}
            </div>

            <div className="mb-3">
              {warned ? (
                <Chip
                  style={{ fontWeight: "500", width: "100%", color: eventDetails ? eventDetails.color : "#152d35",
                  border: eventDetails
                    ? `1px solid ${eventDetails.color}`
                    : `1px solid #152d35`, }}
                  label="Warned"
                  color="primary"
                  variant="outlined"
                />
              ) : (
                <button
                  onClick={() => {
                    setIntent("warnOnly");
                    handleOpenActionConfirmation();
                  }}
                  className="btn btn-outline-primary btn-outline-text"
                  style={{ width: "100%" }}
                >
                  Issue warning
                </button>
              )}
            </div>
            <div className="mb-3">
              {deleted ? (
                <Chip
                  style={{ fontWeight: "500", width: "100%", color: eventDetails ? eventDetails.color : "#152d35",
                  border: eventDetails
                    ? `1px solid ${eventDetails.color}`
                    : `1px solid #152d35`, }}
                  label="Message Deleted"
                  color="primary"
                  variant="outlined"
                />
              ) : (
                <button
                  onClick={() => {
                    socket.emit("deleteReportedMsg", {
                      msgId,
                      userId,
                      eventId,
                    });
                    // delete this message and transmit message to all in Realtime
                  }}
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%",  }}
                >
                  Delete Message
                </button>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      <ActionConfirmation
        name={name}
        image={image}
        organisation={organisation}
        designation={designation}
        msgId={msgId}
        openDrawer={openDrawer}
        handleCloseDrawer={handleCloseActionConfirmation}
        intent={intent}
        senderId={senderId}
      />
    </>
  );
};

export default ReportActions;
