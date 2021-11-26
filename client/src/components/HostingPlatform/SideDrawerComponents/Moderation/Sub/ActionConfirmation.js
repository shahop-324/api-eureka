import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "./../../../../../actions";
import socket from "./../../../../HostingPlatform/service/socket";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import "./../Styles/report.scss";
import { Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ActionConfirmation = ({
  name,
  image,
  organisation,
  designation,
  msgId,
  openDrawer,
  handleCloseDrawer,
  intent,
  senderId,
}) => {
  let text;
  let visibility = "none";

  const dispatch = useDispatch();

  const params = useParams();
  const eventId = params.eventId;

  const [warningText, setWarningText] = useState(null);

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  if (intent === "eventSuspension" || intent === "suspendOnly") {
    text =
      "This person will be removed from this event and will be notified about the same through user dashboard & mail.";
  }

  if (intent === "warnOnly") {
    text =
      "This person will recieve a warning message via mail and will also be notified via user dashboard.";
  }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="py-3 px-4" style={{ width: "460px" }}>
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
                    handleCloseDrawer();
                  }}
                />
              </div>
              <div
                className="ms-3"
                style={{
                  color: "#212121",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Back
              </div>
            </div>
            <div className="confirm-action-heading mb-4">
              Confirm your action
            </div>
            <div className="confirm-action-preview px-4 py-3 mb-3">
              <div
                className="mb-4"
                style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
              >
                <Avatar
                  src={
                    image
                      ? image.startsWith("https")
                        ? image
                        : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${image}`
                      : ""
                  }
                  alt={name}
                  variant="rounded"
                />
                <div>
                  <div
                    className="chat-box-name ms-3 mb-3"
                    style={{
                      textTransform: "capitalize",
                      fontFamily: "Ubuntu",
                    }}
                  >
                    <div>{name}</div>
                    <div
                      style={{
                        fontWeight: "500",
                        color: "#4B4B4B",
                        fontSize: "0.75rem",
                      }}
                      className="d-flex flex-row align-items-center justify-content-between"
                    >
                      <div>
                        {designation} {organisation}
                      </div>
                    </div>
                  </div>

                  <div
                    className="ms-3 action-confirmation-text"
                    style={{ maxWidth: "400px" }}
                  >
                    {text}
                  </div>
                </div>
              </div>
              <div className="mb-4 overlay-form-input-row">
                <label
                  for="shortDescription"
                  className="form-label form-label-customized"
                >
                  Your Message
                </label>
                <textarea
                  value={warningText}
                  onChange={(e) => {
                    setWarningText(e.target.value);
                  }}
                  name="shortDescription"
                  type="text"
                  className="form-control"
                  id="shortDescription"
                  ariadescribedby="communityName"
                  placeholder="write what you want to convey to this user."
                />
              </div>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-end">
              <button
                onClick={() => {
                  handleCloseDrawer();
                }}
                className="btn btn-light btn-outline-text me-3"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (intent === "eventSuspension") {
                    //
                    if (!warningText) {
                      dispatch(
                        showSnackbar(
                          "info",
                          "Please provide a valid message to suspend"
                        )
                      );
                      return;
                    }
                    socket.emit(
                      "suspendFromEvent",
                      {
                        msgId,
                        eventId: eventId,
                        warning: warningText,
                        userId: userId,
                      },
                      (error) => {
                        alert(error);
                      }
                    );
                  }
                  if (intent === "warnOnly") {
                    //
                    if (!warningText) {
                      dispatch(
                        showSnackbar(
                          "info",
                          "Please provide a valid message to warn"
                        )
                      );
                      return;
                    }
                    socket.emit(
                      "warn",
                      {
                        msgId,
                        eventId: eventId,
                        warning: warningText,
                        userId: userId,
                      },
                      (error) => {
                        alert(error);
                      }
                    );
                  }
                  if (intent === "suspendOnly") {
                    if (!warningText) {
                      dispatch(
                        showSnackbar(
                          "info",
                          "Please provide a valid message to suspend"
                        )
                      );
                      return;
                    }
                    socket.emit(
                      "suspendOnly",
                      {
                        eventId: eventId,
                        userId: userId,
                        senderId: senderId,
                        warning: warningText,
                      },
                      (error) => {
                        alert(error);
                      }
                    );
                  }
                }}
                className="btn btn-primary btn-outline-text"
              >
                Proceed
              </button>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ActionConfirmation;
