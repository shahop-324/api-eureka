import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Dialog, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  setNetworkingRoom,
  setOpenAudioVideoSettings,
} from "./../../../actions";

import socket from "./../service/socket";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import SettingsIcon from "@mui/icons-material/Settings";
import MainChatComponent from "./Sub/NetworkingChat/MainChatComponent";
import { useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Portal from "@mui/core/Portal";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

const NetworkingTableBody = styled.div`
  min-height: 85vh;
  max-width: 1600px;
  background-color: #0c1a1f;
`;

const UpperSection = styled.div`
  height: 77vh;
  display: grid;
  grid-template-columns: 5fr 1.65fr;
  grid-gap: 20px;
`;

const LowerSection = styled.div`
  height: 10%;
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  grid-gap: 12px !important;
  border-top: 1px solid #2c2c2c;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const NetworkingScreen = ({ open, handleClose }) => {
  console.log("This is networking screen");
  const dispatch = useDispatch();
  const params = useParams();

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState(null);
  const [severity, setSeverity] = React.useState("info");

  let vertical = "bottom";
  let horizontal = "left";

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xl");

  const { id } = useSelector((state) => state.eventAccessToken);
  const eventId = params.eventId;

  const { matchedWith, networkingRoom } = useSelector(
    (state) => state.networking
  );

  const leaveNetworkingRoom = async () => {
    // emit socket to leave this room
    socket.emit(
      "leaveNetworking",
      {
        room: networkingRoom,
        userId: id,
        eventId: eventId,
      },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );
    handleClose();
    dispatch(setNetworkingRoom(null));

    rtc.localAudioTrack && rtc.localAudioTrack.close(); // Destroy and unpublish local audio track object
    rtc.localVideoTrack && rtc.localVideoTrack.close(); // Destroy and unpublish local video track object

    // Leave the channel.
    if (rtc.client) {
      // Traverse all remote users.
      rtc.client.remoteUsers.forEach((user) => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
      });

      await rtc.client.leave();
    }
  };

  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={"1550px"}
        open={open}
        aria-labelledby="responsive-dialog-title"
        style={{
          width: "90vw",
          maxWidth: "1550px",
          minWidth: "1333px",
          height: "100vh",
          margin: "0 auto 0 auto",
        }}
      >
        <NetworkingTableBody>
          <UpperSection className="mx-4 py-3">
            <VideoGrid className="p-3"></VideoGrid>
            <div className="py-3">
              <MainChatComponent />
            </div>
          </UpperSection>

          <LowerSection className="mx-4 py-3 mt-2">
            <button
              id="leave-networking"
              onClick={() => {
                leaveNetworkingRoom();
              }}
              className="btn btn-outline-text btn-danger px-4"
              style={{ width: "max-content" }}
            >
              Leave
            </button>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <IconButton aria-label="audio" className="me-3">
                <VideocamRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
              </IconButton>
              <IconButton aria-label="audio" className="me-3">
                <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
              </IconButton>
              <IconButton aria-label="audio" className="me-3">
                <ScreenShareIcon style={{ fill: "#D3D3D3", size: "24" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  dispatch(setOpenAudioVideoSettings(true));
                }}
              >
                <SettingsIcon style={{ color: "#ffffff", size: "24" }} />
              </IconButton>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end">
              <button className="btn btn-outline-text btn-light px-4">
                Connect
              </button>
              <button className="btn btn-outline-text btn-outline-light px-4 ms-3">
                Share Business card
              </button>
            </div>
          </LowerSection>
        </NetworkingTableBody>
      </Dialog>

      <Portal>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};

export default NetworkingScreen;
