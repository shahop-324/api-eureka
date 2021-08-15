/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Dialog, IconButton, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import socket from "./../service/socket";
import "./../../../index.css";

import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";

import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";

import {connect} from 'twilio-video';
import { twillioActions } from "../../../reducers/twillioSlice";
import { fetchTwillioVideoRoomToken } from "../../../actions";

const connectToTwillioRoom = (token, table) => {
  console.log(token, table);

  // connect(token, { name: table }).then(room => {
  //   console.log(`Successfully joined a Room: ${room}`);
  //   room.on('participantConnected', participant => {
  //     console.log(`A remote Participant connected: ${participant}`);
  //   });
  // }, error => {
  //   console.error(`Unable to connect to Room: ${error.message}`);
  // });
}


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const TableScreen = ({ openTableScreen, launchTableScreen, closeTableScreen, id }) => {

  const dispatch = useDispatch();

  const table = id;

  const classes = useStyles();

  const params = useParams();

  const eventId = params.eventId;

  // const [appToken, setAppToken] = useState(false);
  // const [appScreenToken, setAppScreenToken] = useState(false);

  const currentChairId = useSelector(
    (state) => state.user.currentlyJoinedChair
  );

  const token = useSelector((state) => state.twillio.videoRoomToken);

  const userDetails = useSelector((state) => state.user.userDetails);

  const userToken = useSelector((state) => state.auth.token);

  const [grid, setGrid] = useState(0);

  let col = "1fr 1fr 1fr 1fr";

  let row = "1fr 1fr";

 

  if (grid === 1) {
    col = "1fr";
    row = "1fr";
  } else if (grid === 2) {
    col = "1fr 1fr";
    row = "1fr";
  } else if (grid === 3) {
    col = "1fr 1fr 1fr";
    row = "1fr";
  } else if (grid === 4) {
    col = "1fr 1fr";
    row = "1fr 1fr";
  } else if (grid === 5) {
    col = "1fr 1fr 1fr 1fr";
    row = "1fr 1fr";
  }

  const userId = userDetails._id;

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  useEffect(() => {
    connectToTwillioRoom(token, table);
  }, []);


  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openTableScreen}
        aria-labelledby="customized-dialog-title"
      >
        <div
          className="table-meet-body-dark-container"
          style={{ width: "100%", height: "100%", backgroundColor: "#3B3B3B" }}
        >
          <div
            className="d-flex flex-column justify-content-between px-3 py-4"
            style={{ width: "100%", height: "100%", minHeight: "80vh" }}
          >
            <div
              className="session-video-layout-grid"
              id="table-video-layout-grid"
              style={{
                display: "grid",
                gridTemplateColumns: col,
                gridTemplateRows: row,
                gridGap: "10px",
                height: "100%",
                minHeight: "75vh",
              }}
            >
              {/* Here Dynamic video containers will get injected as number of people keeps growing */}
            </div>
            <div
              className="session-video-controls-grid "
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
              }}
            >
              <div className="stage-left-controls d-flex flex-row justify-content-between align-items-center ms-3">
                
                <div className="room-no-text">

                Table 1
                </div>
                
              </div>

              {/* This is Mid Stage Controls */}
              <div
                className="stage-mid-controls"
                style={{ justifySelf: "center" }}
              >
                <IconButton
                  aria-label="video"
                  className={classes.margin}
                >
                  
                    <VideocamRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  
                    {/* <VideocamOffIcon style={{ fill: "#C72E2E", size: "24" }} /> */}
                 
                </IconButton>

                <IconButton
                  
                  aria-label="audio"
                  className={classes.margin}
                >
                 
                    <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                  
                    {/* <MicOffIcon style={{ fill: "#C72E2E", size: "24" }} /> */}
                 
                </IconButton>

                <IconButton
                  aria-label="share screen"
                  className={classes.margin}
                >
                  <ScreenShareRoundedIcon
                    style={{ fill: "#D3D3D3", size: "24" }}
                  />
                </IconButton>

                <IconButton aria-label="settings" className={classes.margin}>
                  <SettingsOutlinedIcon
                    style={{ fill: "#D3D3D3", size: "24" }}
                  />
                </IconButton>
              </div>

              <div
                className="btn-filled-h-stage end-session-btn  px-3 py-2 ms-4"
                id="leave-table"
                style={{ maxWidth: "90px", justifySelf: "end" }}
                onClick={() => {
                  socket.emit(
                    "leaveChair",
                    { chairId: currentChairId, eventId, tableId: id },
                    (error) => {
                      if (error) {
                        alert(error);
                      }
                    }
                  );
                  closeTableScreen();
                }}
              >
                Leave
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TableScreen;
