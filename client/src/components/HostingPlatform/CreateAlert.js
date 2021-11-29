import React, { useState } from "react";
import { useSelector } from "react-redux";
import socket from "./service/socket";
import { useParams } from "react-router";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #727272 !important;
  margin-bottom: 5px;
`;

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const AlertContainer = styled.div`
  height: auto;
  width: 460px;
`;

const Preview = styled.div`
  border-radius: 5px;
  background-color: #d3d3d369;
  padding: 12px;

  min-height: 100px;

  font-size: 0.78rem;
  color: #5a5a5a;
  font-weight: 500;
`;

const CreateAlert = ({ open, handleClose }) => {
  const theme = useTheme();
  const params = useParams();
  const eventId = params.eventId;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [alertText, setAlertText] = useState(null);

  const { userDetails } = useSelector((state) => state.user);
  const { eventDetails } = useSelector((state) => state.event);

  const userId = userDetails._id;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 py-3">
            <div></div>
            <div className="coupon-overlay-form-headline">
              Create event alert
            </div>
          </HeaderFooter>
          <AlertContainer className="px-4 py-3">
            <FormLabel className="mb-2">Event Alert</FormLabel>

            <textarea
              value={alertText}
              onChange={(e) => {
                setAlertText(e.target.value);
              }}
              className="form-control mb-3"
              rows="3"
              placeholder="Write what you want to convey to everyone inside this event."
            />

            <FormLabel className="mb-2">Alert Preview</FormLabel>

            <Preview className="mb-3">{alertText}</Preview>

            <div className="d-flex flex-row align-items-center justify-content-end">
              <button
                onClick={() => {
                  handleClose();
                }}
                className="btn btn-outline-dark btn-outline-text me-3"
              >
                cancel
              </button>
              <button
                style={{
                  backgroundColor: eventDetails
                    ? eventDetails.color
                    : "#152d35",
                  border: eventDetails
                    ? `1px solid ${eventDetails.color}`
                    : `1px solid #152d35`,
                }}
                onClick={() => {
                  // Create alert via socket
                  socket.emit(
                    "createAlert",
                    { userId, alertText, eventId },
                    (error) => {
                      alert(error);
                    }
                  );
                }}
                className="btn btn-primary btn-outline-text"
              >
                Send
              </button>
            </div>
          </AlertContainer>
        </>
      </Dialog>
    </>
  );
};

export default CreateAlert;
