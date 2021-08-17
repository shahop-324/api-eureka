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


import AgoraRTC from "agora-rtc-sdk-ng";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
};

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

  const token = useSelector((state) => state.RTC.token);

  const table = id;

  const classes = useStyles();

  const params = useParams();

  const eventId = params.eventId;

  let options = {
    // Pass your App ID here.
    appId: "c4e9f3e5cdf548f68d2f8417ad8a13eb",
    // appId: "4f274729f9ab45139e509eb6efba14cc",
    // Set the channel name.
    channel: table,
    // Pass your temp token here.
    token: null,
    // token: token,
    // Set the user ID.
    uid: null,
  };

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const turnOffVideo = async () => {
    await rtc.localVideoTrack.setEnabled(false);
    setVideoIsEnabled(false);
  };
  const turnOnVideo = async () => {
    await rtc.localVideoTrack.setEnabled(true);
    setVideoIsEnabled(true);
  };

  const turnOffAudio = async () => {
    await rtc.localAudioTrack.setEnabled(false);
    setAudioIsEnabled(false);
  };
  const turnOnAudio = async () => {
    await rtc.localAudioTrack.setEnabled(true);
    setAudioIsEnabled(true);
  };

  // const [appToken, setAppToken] = useState(false);
  // const [appScreenToken, setAppScreenToken] = useState(false);

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

  const userId = userDetails._id;

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  // useEffect(() => {
  //   connectToTwillioRoom(token, table);
  // }, []);

  // createLocalVideoTrack().then(track => {
  //   const localMediaContainer = document.getElementById('table-video-layout-grid');
  //   localMediaContainer.appendChild(track.attach());
  // });

  async function startBasicCall() {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

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
      });
    });

    // Join an RTC channel.
    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async (uid) => {
        console.log("Joined RTC channel");

        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
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

        console.log("publish success!");
        console.log("op");
        console.log(12345678);
      });

    

    document.getElementById("leave-table").onclick = async function () {
      // Destroy the local audio and video tracks.
      rtc.localAudioTrack.close();
      rtc.localVideoTrack.close();

      // Traverse all remote users.
      rtc.client.remoteUsers.forEach((user) => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
      });

      // Leave the channel.
      await rtc.client.leave();
    };
  }

  useEffect(() => {
    startBasicCall();
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
                <div className="room-no-text">Table 1</div>
              </div>

              {/* This is Mid Stage Controls */}
              <div
                className="stage-mid-controls"
                style={{ justifySelf: "center" }}
              >
                <IconButton
                  onClick={() => {
                    videoIsEnabled ? turnOffVideo() : turnOnVideo();
                  }}
                  aria-label="audio"
                  className={classes.margin}
                >
                  {videoIsEnabled ? (
                    <VideocamRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  ) : (
                    <VideocamOffIcon style={{ fill: "#C72E2E", size: "24" }} />
                  )}
                </IconButton>

                <IconButton
                  onClick={() => {
                    audioIsEnabled ? turnOffAudio() : turnOnAudio();
                  }}
                  aria-label="audio"
                  className={classes.margin}
                >
                  {audioIsEnabled ? (
                    <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                  ) : (
                    <MicOffIcon style={{ fill: "#C72E2E", size: "24" }} />
                  )}
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
