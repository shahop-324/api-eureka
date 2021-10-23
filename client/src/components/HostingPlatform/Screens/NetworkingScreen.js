import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Avatar, Dialog, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  setNetworkingRoom,
  setOpenAudioVideoSettings,
  setScheduleMeetingUserId,
  setOpenScheduleMeeting,
} from "./../../../actions";
import socket from "./../service/socket";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import MainChatComponent from "./Sub/NetworkingChat/MainChatComponent";
import { useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Portal from "@mui/core/Portal";
import MicOffIcon from "@material-ui/icons/MicOff";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  grid-gap: 24px !important;
  border-top: 1px solid #2c2c2c;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const VideoElement = styled.div`
  border-radius: 15px;
  background-color: #757575;
  height: 100%;
  position: relative;
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

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);

  const { id } = useSelector((state) => state.eventAccessToken);
  const eventId = params.eventId;

  const { matchedWith, networkingRoom } = useSelector(
    (state) => state.networking
  );

  const { token } = useSelector((state) => state.RTC);

  useEffect(() => {
    console.log("We entered into useEffect");
    if (open) {
      startAdvancedLiveStreaming();
    }
  }, [open]);

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

  const [localStream, setLocalStream] = useState(null); // This is to keep track of local video track

  const [remoteStream, setRemoteStream] = useState(null);

  const { userDetails } = useSelector((state) => state.user);

  // Generate agora token when user joins the networking room

  let options = {
    // Pass your app ID here.
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: networkingRoom,
    // Set the user role in the channel.
    role: "host",
    // Use server generated token
    token: token,
    // Uid
    uid: id,
  };

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

  const startAdvancedLiveStreaming = async () => {
    console.info("Start streaming fxn was called.");
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    rtc.client.on("user-published", async (user, mediaType) => {
      const uid = user.uid.toString();

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      // console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;

        // Set to remote stream
        setRemoteStream({ stream: remoteVideoTrack, uid: uid });

        const remotePlayer = document.getElementById(matchedWith._id);
        remoteVideoTrack.play(remotePlayer);
      }
      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", async (user, mediaType) => {
      const uid = user.uid.toString();

      // 1. Manage audio muted
      if (mediaType === "audio") {
        if (uid !== id) {
          // Remote user unpublished audio
        }
      }

      // 2. Manage video muted
      if (mediaType === "video") {
        if (uid !== id) {
          // Remote user unpublished video
          setRemoteStream(null);
        }
      }
    });

    rtc.client.on("user-left", (user) => {
      const uid = user.uid.toString(); // the id of stream that just left

      // Here this uid will be of the person on other side (i.e., matchedWith)

      // 1. Set remote stream to null
      setRemoteStream(null);
      // 2. Display message that the other person has left the networking room.

      setSnackMessage(
        `${matchedWith.firstName + " " + matchedWith.lastName} left networking.`
      );
      setSeverity("info");
      setOpenSnackbar(true);
    });

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        console.info("Bluemeet: Joined RTC channel");

        // Define audio and video quality

        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 128,
          },
        });
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "1080p_2",
        });

        // Set to local stream
        setLocalStream({ stream: rtc.localVideoTrack, uid: options.uid });

        const localPlayer = document.getElementById(id);
        rtc.localVideoTrack.play(localPlayer);

        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
      });

    // * DONE Enable dual stream mode

    rtc.client
      .enableDualStream()
      .then(() => {
        // console.log("Enable Dual stream success!");
      })
      .catch((err) => {
        // console.log(err);
      });

    document.getElementById("leave-networking").onclick = async function () {
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
      // dispatch(setMatchedWith(null));

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
  };

  return (
    <>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        aria-labelledby="responsive-dialog-title"
        style={{
          width: "1333px",
          maxWidth: "1600px",
          minWidth: "1333px",
          height: "100vh",
          margin: "0 auto 0 auto",
        }}
      >
        <NetworkingTableBody>
          <UpperSection className="mx-4 py-3">
            <VideoGrid className="py-3 px-3">
              <div style={{ borderRadius: "15px" }}>
                <VideoElement id={matchedWith ? matchedWith._id : "#"}>
                  {!remoteStream && matchedWith ? (
                    <div
                      style={{ height: "100%", width: "100%" }}
                      className="d-flex flex-row align-items-center justify-content-center"
                    >
                      <Avatar
                        variant="rounded"
                        src={matchedWith.firstName + " " + matchedWith.lastName}
                        alt={
                          matchedWith.image
                            ? matchedWith.image.startsWith("https://")
                              ? matchedWith.image
                              : `https://bluemeet.s3.us-west-1.amazonaws.com/${matchedWith.image}`
                            : "#"
                        }
                        style={{
                          backgroundColor: "#538BF7",
                          height: "6rem",
                          width: "6rem",
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  {matchedWith ? (
                    <div
                      className="user-identity"
                      style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "15px",
                        zIndex: "10000000",
                      }}
                    >
                      <div
                        className="d-flex flex-row align-items-center"
                        style={{ color: "#F7F453" }}
                      >
                        <div className="me-2">
                          {" "}
                          {matchedWith.firstName +
                            " " +
                            matchedWith.lastName}{" "}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </VideoElement>
              </div>

              <div style={{ borderRadius: "15px" }}>
                <VideoElement id={id}>
                  {!localStream && !videoIsEnabled ? (
                    <div
                      style={{ height: "100%", width: "100%" }}
                      className="d-flex flex-row align-items-center justify-content-center"
                    >
                      <Avatar
                        variant="rounded"
                        src={userDetails.firstName + " " + userDetails.lastName}
                        alt={
                          userDetails.image
                            ? userDetails.image.startsWith("https://")
                              ? userDetails.image
                              : `https://bluemeet.s3.us-west-1.amazonaws.com/${userDetails.image}`
                            : "#"
                        }
                        style={{
                          backgroundColor: "#538BF7",
                          height: "6rem",
                          width: "6rem",
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}

                  <div
                    className="user-identity"
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      left: "15px",
                      zIndex: "10000000",
                    }}
                  >
                    <div
                      className="d-flex flex-row align-items-center"
                      style={{ color: "#F7F453" }}
                    >
                      <div className="me-2">
                        {" "}
                        {userDetails.firstName +
                          " " +
                          userDetails.lastName +
                          " " +
                          "(YOU)"}{" "}
                      </div>
                    </div>
                  </div>
                </VideoElement>
              </div>
            </VideoGrid>
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
                  <VideocamOffIcon style={{ fill: "#C72E2E", size: "24" }} />
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
              <IconButton onClick={() => {
                dispatch(setOpenAudioVideoSettings(true));
              }}>
                <SettingsIcon style={{ color: "#ffffff" }} />
              </IconButton>
              <IconButton onClick={() => {
                dispatch(setScheduleMeetingUserId(matchedWith._id))
                dispatch(setOpenScheduleMeeting(true));
              }}>
                <CalendarTodayIcon style={{ color: "#ffffff" }} />
              </IconButton>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end">
              <button className="btn btn-outline-text btn-primary px-4">
                Connect
              </button>
              <button className="btn btn-outline-text btn-outline-primary px-4 ms-3">
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
