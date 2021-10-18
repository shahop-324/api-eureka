/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Dialog, IconButton, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import socket from "./../service/socket";
import "./../../../index.css";
import "./../Styles/rooms.scss";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import ViewCompactRoundedIcon from "@material-ui/icons/ViewCompactRounded";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import ZoomOutMapOutlinedIcon from "@material-ui/icons/ZoomOutMapOutlined";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import KeyboardTabRoundedIcon from "@material-ui/icons/KeyboardTabRounded";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import AgoraRTC from "agora-rtc-sdk-ng";
import styled from "styled-components";
import { fetchTableChats } from "./../../../actions";

const TableScreenBody = styled.div`
  background-color: #0b1b20 !important;
`;

// ? Local tracks and client are being managed in rtc object

// ? main view is being managed in mainView object

// ? mini view is being managed in miniView object

// video profile settings
var cameraVideoProfile = "480_4"; // 640 × 480 @ 30fps  & 750kbs
var screenVideoProfile = "480_2"; // 640 × 480 @ 30fps

let rtc = {
  localAudioTrack: null, // Keep track of local audio track
  localVideoTrack: null, // Keep track of local video track
  localScreenTrack: null, // Keep track of local screen track
  client: null, // keep track of client (through which we joined channel)
  screenClient: null, // Keep track of screen sharing client (through which we are sharing our screen) to others
};

let miniViews = []; // Keep track of mini view VIDEO streams with uid // {stream: {}, uid: " "}

let mainView = {
  stream: null, // this will be an object reference to main stream object
  uid: null, // this will be uid of main stream
}; // Keep trcak of main view stream //

var screenShareActive = false; // flag for screen share

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const TableScreen = ({
  openTableScreen,
  launchTableScreen,
  closeTableScreen,
  id,
}) => {
  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  const token = useSelector((state) => state.RTC.token);

  const table = id;

  const classes = useStyles();

  const userId = useSelector((state) => state.eventAccessToken.id);

  let options = {
    // Pass your App ID here.
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: table,
    // Pass your temp token here.
    token: token,
    // Set the user ID.
    uid: userId,
  };

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const turnOffVideo = async () => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(false);
    setVideoIsEnabled(false);
  };

  const turnOnVideo = async () => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(true);
    setVideoIsEnabled(true);
  };

  const turnOffAudio = async () => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(false);
    setAudioIsEnabled(false);
  };

  const turnOnAudio = async () => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(true);
    setAudioIsEnabled(true);
  };

  const currentChairId = useSelector(
    (state) => state.user.currentlyJoinedChair
  );

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

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xl");

  // Write logic to execute when leave button is pressed

  const leaveTable = async () => {
    // Emit a message to socket about user leaving this table
    socket.emit(
      "leaveChair",
      { chairId: currentChairId, eventId, tableId: id },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );

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

  async function startBasicCall() {
    // create client instances for camera (client) and screen share (screenClient)

    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" }); // h264 better detail at a higher motion
    rtc.screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }); // vp8 for better detail in low motion

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the remote user publishes a video track.
      if (mediaType === "video") {
        // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const remotePlayerContainer = document.createElement("div");
        // // Specify the ID of the DIV container. You can use the uid of the remote user.
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.style.borderRadius = "10px";
        remotePlayerContainer.style.background = "rgba( 255, 255, 255, 0.25 )";
        remotePlayerContainer.style.backdropFilter = "blur( 4px )";

        document
          .getElementById("table-video-layout-grid")
          .append(remotePlayerContainer);
        setGrid(
          document.getElementById("table-video-layout-grid").childElementCount
        );

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the remote user publishes an audio track.
      if (mediaType === "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }

      // Listen for the "user-unpublished" event
      rtc.client.on("user-unpublished", (user) => {
        // Get the dynamically created DIV container.
        const remotePlayerContainer = document.getElementById(user.uid);
        // Destroy the container.
        remotePlayerContainer && remotePlayerContainer.remove();

        setGrid(
          document.getElementById("table-video-layout-grid").childElementCount
        );
      });
    });

    // Join an RTC channel.

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async (uid) => {
        console.log("Joined RTC channel");

        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "high_quality_stereo",
        });
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

        console.log(rtc.localAudioTrack);
        console.log(rtc.localVideoTrack);

        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

        const localPlayerContainer = document.createElement("div");
        localPlayerContainer.id = uid;

        localPlayerContainer.style.borderRadius = "10px";
        localPlayerContainer.style.background = "rgba( 255, 255, 255, 0.25 )";
        localPlayerContainer.style.backdropFilter = "blur( 4px )";

        document
          .getElementById("table-video-layout-grid")
          .append(localPlayerContainer);

        setGrid(
          document.getElementById("table-video-layout-grid").childElementCount
        );

        rtc.localVideoTrack.play(localPlayerContainer);

        rtc.localAudioTrack.play();
      });
  }

  useEffect(() => {
    window.addEventListener("beforeunload", leaveTable);

    return () => {
      // alert("I am unloading now");
      leaveTable();
      window.removeEventListener("beforeunload", leaveTable); // remove the event handler for normal unmounting
    };
  }, []);

  return (
    <>
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
        <TableScreenBody className="px-4">
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
                1
              </span>
              <span className="ps-4">Artificial Intelligence</span>
            </div>
            <div>
              <IconButton>
                <ZoomOutMapOutlinedIcon
                  style={{ fill: "#ffffff", fontSize: "20px" }}
                />
              </IconButton>
              <IconButton>
                <CloseRoundedIcon
                  style={{ fill: "#ffffff" }}
                  id="leave-table"
                  onClick={() => {
                    // Execute logic to leave table
                    leaveTable();

                    // Execute function to close overlay screen on which table screen is being displayed
                    closeTableScreen();
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
              style={{ width: "100%", height: "100%" }}
            >
              <div
                className="session-video-layout-grid"
                id="table-video-layout-grid"
                style={{
                  display: "grid",
                  alignItems: "start",
                  gridTemplateColumns: col,
                  gridTemplateRows: row,
                  gridGap: "10px",
                  height: "100%",
                  minHeight: "65vh",
                }}
              >
                {/* Here Dynamic video containers will get injected as number of people keeps growing */}
              </div>
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
                <div className="stage-left-controls d-flex flex-row  align-items-center">
                  {/* <div className="room-no-text">Table 1</div> */}
                  <IconButton>
                    <AppsRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                  </IconButton>
                  <IconButton>
                    <ViewCompactRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                  <IconButton>
                    <AccountBoxOutlinedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                </div>

                {/* This is Mid Stage Controls */}
                <div className="" style={{ justifySelf: "center" }}>
                  <IconButton
                    onClick={() => {
                      videoIsEnabled ? turnOffVideo() : turnOnVideo();
                    }}
                    aria-label="audio"
                  >
                    {videoIsEnabled ? (
                      <VideocamRoundedIcon
                        style={{ fill: "#D3D3D3", size: "24" }}
                      />
                    ) : (
                      <VideocamOffIcon
                        style={{ fill: "#C72E2E", size: "24" }}
                      />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      audioIsEnabled ? turnOffAudio() : turnOnAudio();
                    }}
                    aria-label="audio"
                    className="mx-3"
                  >
                    {audioIsEnabled ? (
                      <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                    ) : (
                      <MicOffIcon style={{ fill: "#C72E2E", size: "24" }} />
                    )}
                  </IconButton>

                  <IconButton aria-label="share screen">
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
                {/* <div
                  className="btn-filled-h-stage end-session-btn px-3 py-2 ms-4"
                  id="leave-table"
                  style={{ maxWidth: "90px", justifySelf: "end" }}
                  
                >
                  Leave
                </div> */}
                <div className="d-flex flex-row justify-content-end">
                  <IconButton>
                    <ChatBubbleOutlineRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                  <IconButton>
                    <PeopleOutlineRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                </div>
              </div>
            </div>
            <div
              className=""
              style={{ display: "grid", gridTemplateColumns: "8fr 0.2fr" }}
            >
              <div className="table-side-drawer"></div>
              {/* <div>
                <IconButton className="ms-3">
                  <KeyboardTabRoundedIcon
                    style={{ fill: "#D3D3D3", fontSize: "17px" }}
                  />
                </IconButton>
              </div> */}
            </div>
          </div>
        </TableScreenBody>
      </Dialog>
    </>
  );
};

export default TableScreen;
