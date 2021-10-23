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
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import AgoraRTC from "agora-rtc-sdk-ng";
import styled from "styled-components";
import StreamBody from "./../Functions/Lounge/StreamBody";
import { fetchTableChats, getRTCTokenForScreenShare } from "./../../../actions"; // TODO This will be used to render table chats
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Portal from "@mui/core/Portal";
import ControlReRender from "../HelperComponents/ControlReRender";
import SideComponent from "../Functions/Lounge/SideComponent";

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

  const { eventTables } = useSelector((state) => state.eventTables);

  let currentTable = eventTables.find((table) => table.tableId === id);

  const dispatch = useDispatch();

  const [audioStreamStat, setAudioStreamStat] = useState([]); // Its an array of objects {uid: uid, audioIsEnabled: Boolean (true | false)}

  const [videoStreamStat, setVideoStreamStat] = useState([]); // Its an array of objects {uid: uid, videoIsEnabled: Boolean (true | false)}

  const [view, setView] = useState("gallery");

  const [allStreams, setAllStreams] = useState([]);

  const [mainStream, setMainStream] = useState(null);

  const [miniStreams, setMiniStreams] = useState([]);

  const [prominentStream, setProminentStream] = useState(null);

  const [screenStream, setScreenStream] = useState(null);

  const [nonProminent, setNonProminent] = useState([]);

  const [localStream, setLocalStream] = useState(null); // This is to keep track of local video track

  const [remoteStreams, setRemoteStreams] = useState([]);

  const handleAudioIsEnabledChange = (uid, bool) => {
    setAudioStreamStat((prevArr) => {
      if (!prevArr) return;
      // 1. Check if there is already one entry for this uid
      const existing = prevArr.find((element) => element.uid === uid);

      if (existing) {
        // Take out every other entry and then push new entry on top of it
        // and then save that in audioStreamStat

        let filtered = prevArr.filter((element) => element.uid !== uid);

        filtered.push({ uid: uid, audioIsEnabled: bool });
        return filtered;
      } else {
        let stat = audioStreamStat;
        stat.push({ uid: uid, audioIsEnabled: bool });
        return stat;
      }
    });
  };

  const handleVideoIsEnabledChange = (uid, bool) => {
    // console.log(uid);
    setVideoStreamStat((prevArr) => {
      if (!prevArr) return;
      // 1. Check if there is already one entry for this uid
      const existing = prevArr.find((element) => element.uid === uid);

      if (existing) {
        // Take out every other entry and then push new entry on top of it
        // and then save that in videoStreamStat

        let filtered = prevArr.filter((element) => element.uid !== uid);

        filtered.push({ uid: uid, videoIsEnabled: bool });
        return filtered;
      } else {
        let stat = videoStreamStat;
        stat.push({ uid: uid, videoIsEnabled: bool });
        return stat;
      }
    });
  };

  const handleAddToAllStreams = (stream, uid) => {
    let isAlreadyInAllStreams = false;
    for (let element of allStreams) {
      if (element.uid === uid) {
        isAlreadyInAllStreams = true;
      }
    }

    if (!isAlreadyInAllStreams) {
      setAllStreams((prevStreams) => {
        prevStreams.push({ stream: stream, uid: uid });
        return prevStreams;
      });
    }
    handleChangeGrid();
  };

  const handleRemoveFromAllStreams = (uid) => {
    setAllStreams((prevStreams) => {
      return prevStreams.filter((object) => object.uid !== uid);
    });
    handleChangeGrid();
  };

  const handleChangeMainStream = (stream, uid) => {
    setMainStream({ stream: stream, uid: uid });
  };

  const handleAddToMiniStreams = (stream, uid) => {
    setMiniStreams((prevMiniStreams) =>
      prevMiniStreams.push({ stream: stream, uid: uid })
    );
  };

  const handleRemoveFromMiniStreams = (uid) => {
    setMiniStreams((prevStreams) => {
      return prevStreams.filter((object) => object.uid !== uid);
    });
  };

  const handleChangeProminentStream = (stream, uid) => {
    setProminentStream({ stream: stream, uid: uid });
  };

  const handleChangeLocalStream = (stream, uid) => {
    setLocalStream({ stream: stream, uid: uid });
  };

  const handleAddToRemoteStreams = (stream, uid) => {
    setRemoteStreams((prevStreams) => {
      return prevStreams.push({ stream: stream, uid: uid });
    });
  };

  const handleRemoveFromRemoteStreams = (uid) => {
    setRemoteStreams((prevStreams) => {
      return prevStreams.filter((object) => object.uid !== uid);
    });
  };

  const handleSwitchToGridView = () => {
    const [firstStream] = allStreams;

    // Set first stream from all streams as main stream
    handleChangeMainStream(firstStream.stream, firstStream.uid);

    // Set rest of streams from all streams as mini streams

    allStreams.forEach((element, index) => {
      if (index !== 0) {
        miniStreams.push(element);
      }
    });

    // Set view as grid now

    setView("grid");
  };

  const handleSwitchToGalleryView = () => {
    setView("gallery");
  };

  const handleSwitchToSpotlightView = () => {
    setView("spotlight");
  };

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const turnOffVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(false);

    handleVideoIsEnabledChange(uid, false);

    setVideoIsEnabled(false);
  };

  const turnOnVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(true);

    handleVideoIsEnabledChange(uid, true);

    setVideoIsEnabled(true);
  };

  const turnOffAudio = async (uid) => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(false);

    handleAudioIsEnabledChange(uid, false);

    setAudioIsEnabled(false);
  };

  const turnOnAudio = async (uid) => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(true);

    handleAudioIsEnabledChange(uid, true);

    setAudioIsEnabled(true);
  };

  const handleStopScreenShare = async () => {
    rtc.localScreenTrack && rtc.localScreenTrack.close();
    await rtc.screenClient.leave().then(() => {
      setView("gallery");
    });
  };

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

  let col = "1fr 1fr 1fr 1fr";
  let row = "1fr 1fr";

  const handleChangeGrid = () => {
    if (allStreams.length * 1 === 1) {
      col = "1fr";
      row = "1fr";
    }
    if (allStreams.length * 1 === 2) {
      col = "1fr 1fr";
      row = "1fr";
    }
    if (allStreams.length * 1 === 3) {
      col = "1fr 1fr 1fr";
      row = "1fr";
    }
  };

  if (allStreams.length * 1 === 1) {
    col = "1fr";
    row = "1fr";
  }
  if (allStreams.length * 1 === 2) {
    col = "1fr 1fr";
    row = "1fr";
  }
  if (allStreams.length * 1 === 3) {
    col = "1fr 1fr 1fr";
    row = "1fr";
  }

  useEffect(() => {
    handleChangeGrid();
  }, [allStreams.length]);

  const currentChairId = useSelector(
    (state) => state.user.currentlyJoinedChair
  );

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

  useEffect(() => {
    window.addEventListener("beforeunload", leaveTable);

    return () => {
      leaveTable();
      window.removeEventListener("beforeunload", leaveTable); // For graceful unmounting of Table component
    };
  }, []);

  // Find who are on this table currently by filtering from chairs in redux with this tableId and occupied status => take out their name, city, country, designation, organisation and userId in an array as a collection of objects

  const { chairs } = useSelector((state) => state.rooms);

  let peopleInThisRoom = [];
  let uniqueIds = [];

  for (let element of chairs) {
    if (element.tableId === table) {
      if (element.status === "Occupied") {
        if (!uniqueIds.includes(element._id)) {
          uniqueIds.push(element._id);
          peopleInThisRoom.push({
            userId: element.userId,
            userName: element.userName,
            userRole: element.userRole,
            userImage: element.userImage,
            userEmail: element.userEmail,
            userCity: element.userCity,
            userCountry: element.userCountry,
            userOrganisation: element.userOrganisation,
            userDesignation: element.userDesignation,
          });
        }
      }
    }
  }

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
      // alert("screen sharing stopped");
      // console.info("screen sharing stopped");

      handleStopScreenShare();
    });

    return rtc.localScreenTrack;
  };

  const startAdvancedLiveStreaming = async () => {
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    // Listen for event "user-published" explanation: Some kind of audio or video stream is published
    rtc.client.on("user-published", async (user, mediaType) => {
      // console.info("some media stream was just published");

      const uid = user.uid.toString();

      if (document.getElementById(uid)) {
        // console.info("Already at this table!");

        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        // console.info("subscribe success");

        // If the subscribed track is video.
        if (mediaType === "video") {
          // Get `RemoteVideoTrack` in the `user` object.
          const remoteVideoTrack = user.videoTrack;

          // If user was already in session then just play his video in his respective container

          if (document.getElementById(uid)) {
            remoteVideoTrack.play(uid);
          }

          // add to all streams if not already in all streams

          handleAddToAllStreams(remoteVideoTrack, uid);

          handleVideoIsEnabledChange(uid, true);
        }
        // If the subscribed track is audio.
        if (mediaType === "audio") {
          // Get `RemoteAudioTrack` in the `user` object.
          const remoteAudioTrack = user.audioTrack;
          // Play the audio track. No need to pass any DOM element.
          remoteAudioTrack.play();

          handleAudioIsEnabledChange(uid, true);
        }

        // Now return after this as this was existing user
        return;
      }

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      // console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        const personWhoJoined = chairs.find((person) => person.userId === uid); // Person who just unpublished his / her track

        // console.log(uid);
        // console.log(personWhoJoined);

        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;

        if (uid.startsWith("screen")) {
          // Set view to screen share mode (grid mode)

          setView("screenShare");

          // Set this screen share stream as screenStream
          setScreenStream({ uid: uid, stream: remoteVideoTrack });

          if (personWhoJoined) {
            if (personWhoJoined.userName) {
              setSnackMessage(
                `${personWhoJoined.userName} started screen sharing.`
              );
              setSeverity("info");
              setOpenSnackbar(true);
            }
          }

          // We already have all streams maintained in allStreams

          // So adopt grid mode and then render screenStream as mainStream and rest all as mini stream
        }

        // Remote video track is now added to allStreams and so it will start playing

        if (!uid.startsWith("screen")) {
          handleAddToAllStreams(remoteVideoTrack, uid);

          handleVideoIsEnabledChange(uid, true);

          if (personWhoJoined) {
            if (personWhoJoined.userName) {
              setSnackMessage(`${personWhoJoined.userName} joined this room.`);
              setSeverity("info");
              setOpenSnackbar(true);
            }
          }
        }
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();

        handleAudioIsEnabledChange(uid, true);
      }
    });

    rtc.client.on("user-unpublished", async (user, mediaType) => {
      const uid = user.uid.toString();

      if (uid.startsWith("screen")) {
        rtc.localScreenTrack && rtc.localScreenTrack.close();
        if (rtc.screenClient) {
          await rtc.screenClient.leave().then(() => {
            setView("gallery");
          });
        }

        setScreenSharingIsEnabled(false);
      }

      // 1. Manage audio muted
      if (mediaType === "audio") {
        handleAudioIsEnabledChange(uid, false);
      }

      // 2. Manage video muted
      if (mediaType === "video") {
        handleVideoIsEnabledChange(uid, false);
      }

      // console.info(`User with UID ${userId} unpublished media stream.`);
    });

    rtc.client.on("user-left", (user) => {
      const uid = user.uid.toString(); // the id of stream that just left

      const personWhoLeft = chairs.find((person) => person.userId === uid); // Person who just unpublished his / her track

      // console.log(uid);
      // console.log(personWhoLeft);

      if (uid.startsWith("screen")) {
        // console.log("screen sharing track unpblished");

        if (personWhoLeft) {
          if (personWhoLeft.userName) {
            setSnackMessage(
              `${personWhoLeft.userName} stopped screen sharing.`
            );
            setSeverity("info");
            setOpenSnackbar(true);
          }
        }
      }

      handleRemoveFromAllStreams(uid);

      handleAudioIsEnabledChange(uid, false);

      handleVideoIsEnabledChange(uid, false);

      if (personWhoLeft) {
        if (personWhoLeft.userName) {
          setSnackMessage(`${personWhoLeft.userName} just left this room.`);
          setSeverity("info");
          setOpenSnackbar(true);
        }
      }
    });

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        // console.info("Bluemeet: Joined RTC channel");

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

        // Set to all streams
        handleAddToAllStreams(rtc.localVideoTrack, options.uid);

        // Set to local stream
        handleChangeLocalStream(rtc.localVideoTrack, options.uid);

        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

        // console.info("publish success!");

        handleVideoIsEnabledChange(options.uid, true);
        handleAudioIsEnabledChange(options.uid, true);

        turnOffAudio(options.uid);
        // turnOffVideo(options.uid);
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

    document.getElementById("leave-table").onclick = async function () {
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
  };

  useEffect(() => {
    let bool = true;
    for (let element of peopleInThisRoom) {
      if (!element.userId) {
        bool = false;
      }
    }
    if (bool) {
      startAdvancedLiveStreaming();
    }
  }, []);

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    stream.getVideoTracks()[0].onended = () => {
      // console.info("Screen share has ended");
      // handleStopScreenShare();
    };
  });

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
              style={{ width: "100%", height: "100%", maxHeight: "65vh" }}
            >
              <StreamBody
                col={col}
                row={row}
                allStreams={allStreams}
                screenStream={screenStream}
                prominentStream={prominentStream}
                mainStream={mainStream}
                miniStreams={miniStreams}
                view={view}
                audioStreamStat={audioStreamStat}
                videoStreamStat={videoStreamStat}
                // volumeIndicators={volumeIndicators}
                peopleOnThisTable={peopleInThisRoom}
              />
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
                      videoIsEnabled
                        ? turnOffVideo(userId)
                        : turnOnVideo(userId);
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
                      audioIsEnabled
                        ? turnOffAudio(userId)
                        : turnOnAudio(userId);
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

                  <IconButton
                    onClick={() => {
                      if (screenSharingIsEnabled) {
                        handleStopScreenShare();
                        setScreenSharingIsEnabled(false);
                      } else {
                        dispatch(
                          getRTCTokenForScreenShare(
                            table,
                            userId,
                            startScreenCall
                          )
                        );
                        setScreenSharingIsEnabled(true);
                      }
                    }}
                    aria-label="share screen"
                  >
                    {screenSharingIsEnabled ? (
                      <ScreenShareRoundedIcon
                        style={{ fill: "#D3D3D3", size: "24" }}
                      />
                    ) : (
                      <ScreenShareRoundedIcon
                        style={{ fill: "#C72E2E", size: "24" }}
                      />
                    )}
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
              {/* <div className="table-side-drawer">

              </div> */}
              <SideComponent
                peopleInThisRoom={peopleInThisRoom}
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
