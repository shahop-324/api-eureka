/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Dialog, IconButton, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import socket from "./../../service/socket";
import "./../../../../index.css";
import "./../../Styles/rooms.scss"
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import AgoraRTC from "agora-rtc-sdk-ng";
import styled from "styled-components";
import StreamBody from "../../Functions/Lounge/StreamBody";
import { getRTCTokenForBoothScreenShare } from "./../../../../actions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Portal from "@mui/core/Portal";
import SideComponent from "./SideComponent";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TableNum = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #ffffff;
`;

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  client: null,
  screenClient: null,
};

const TableScreenBody = styled.div`
  background-color: #0b1b20 !important;
`;

const TableScreen = ({
  openTableScreen,
  closeTableScreen,
  id, // * This is tableId
}) => {
  const [fullScreen, setFullScreen] = useState(false);
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

  const { boothTables } = useSelector((state) => state.boothTables);

  let currentTable = boothTables.find((table) => table.tableId === id);

  const dispatch = useDispatch();

  const userId = useSelector((state) => state.eventAccessToken.id);

  const { token, screenToken } = useSelector((state) => state.RTC);

  const params = useParams();

  const eventId = params.eventId;

  const table = id;

  let options = {
    // Pass your app ID here.
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: table,
    // Set the user role in the channel.
    role: "host",
    // Use server generated token
    token: token,
    // Uid
    uid: userId,
  };

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xl");

  // * At this point we have all people in this table in peopleInThisRoom array with all of their relevant details

  // console.log(peopleInThisRoom);

  // This is for screen sharing purpose

  const startScreenCall = async () => {
    rtc.screenClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    rtc.client.setClientRole(options.role);

    await rtc.screenClient.join(
      options.appId,
      table,
      screenToken,
      `screen_${userId}`
    );

    rtc.localScreenTrack = await AgoraRTC.createScreenVideoTrack();

    await rtc.screenClient.setClientRole("host");

    await rtc.screenClient.publish(rtc.localScreenTrack);

    rtc.localScreenTrack.on("track-ended", () => {
    //   handleStopScreenShare();
    });

    return rtc.localScreenTrack;
  };

  return (
    <>
      {/* <ControlReRender rtc={rtc} /> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openTableScreen}
        aria-labelledby="customized-dialog-title"
        style={{
          maxWidth: "1600px",
          minWidth: "1333px",
          height: "100vh",
          margin: "0 auto 0 auto",
        }}
      >
        <TableScreenBody className="px-4" id="table-full-screen-element">
          <div className="table-screen-header d-flex flex-row align-items-center justify-content-between pt-3">
            <div className="table-num-and-heading px-2">
              <span
                className="pe-4"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  borderRight: "1px solid rgb(98, 98, 98",
                }}
              >
                <TableNum>{`Table ${table.slice(31) * 1 + 1}`}</TableNum>

                {/* Table number */}
              </span>
              <span className="ps-4">
                {currentTable
                  ? currentTable.title
                    ? currentTable.title
                    : ""
                  : ""}
              </span>
              {/* Table title */}
            </div>
            <div>
              <IconButton>
                <CloseRoundedIcon
                  style={{ fill: "#ffffff" }}
                  id="leave-table"
                  onClick={() => {
                
                  }}
                />
              </IconButton>
            </div>
          </div>

          <div
            className="table-meet-body-dark-container py-4"
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "5fr 1.65fr",
              gridGap: "20px",
            }}
          >
            <div
              className="d-flex flex-column justify-content-between"
              style={{ width: "100%", height: "100%", maxHeight: "65vh" }}
            >
                {/* // Here we need to place stream body */}
              <div>
                <hr style={{ color: "rgb(98, 98, 98)" }} />
              </div>
              <div
                className="session-video-controls-grid "
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  alignItems: "center",
                }}
              >
                <div className="stage-left-controls d-flex flex-row  align-items-center"></div>

                <div className="" style={{ justifySelf: "center" }}>
                  <IconButton
                    onClick={() => {
                     
                    }}
                    aria-label="audio"
                  >
                   
                      <VideocamRoundedIcon
                        style={{ fill: "#D3D3D3", size: "24" }}
                      />
                   
                  </IconButton>

                  <IconButton
                    onClick={() => {
                     
                    }}
                    aria-label="audio"
                    className="mx-3"
                  >
                    
                      <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                   
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      
                    }}
                    aria-label="share screen"
                  >
                    
                      <ScreenShareRoundedIcon
                        style={{ fill: "#D3D3D3", size: "24" }}
                      />
                   
                  </IconButton>

                  <IconButton aria-label="settings" className="mx-3">
                    <SettingsOutlinedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                </div>

                {/* // TODO Provide a leave button here */}
                <div className="d-flex flex-row justify-content-end"></div>
              </div>
            </div>
            <div
              className=""
              style={{ display: "grid", gridTemplateColumns: "8fr 0.2fr" }}
            >
              <SideComponent
                // peopleInThisRoom={peopleInThisRoom}
                tableId={table}
              />
              {/* This is the side component */}
              {/* // Here provide appropriate ui for table chat and people on this table only in list view mode */}
            </div>
          </div>
        </TableScreenBody>
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

export default TableScreen;