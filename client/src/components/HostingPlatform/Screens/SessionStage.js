/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { StageBody } from "./../../../components/SessionStage/Elements";
import PhotoBooth from "../../Elements/PhotoBooth";
import StageNavComponent from "../../SessionStage/StageNavComponent";
import StageControlsComponent from "../../SessionStage/StageControlsComponent";
import StageSideDrawerComponent from "../../SessionStage/StageSideDrawer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "../service/socket";
import { userActions } from "../../../reducers/userSlice";
import { stageActions } from "../../../reducers/stageSlice";
import { sessionActions } from "../../../reducers/sessionSlice";
import GalleryVideoPlayer from "../SessionStreamingComponents.js/GalleryVideoPlayer";
import AgoraRTC from "agora-rtc-sdk-ng";
import history from "../../../history";
import ReactTooltip from "react-tooltip";

import { fetchSessionForSessionStage } from "../../../actions";
import StreamBody from "../Functions/Stage/StreamBody";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  client: null,
  screenClient: null,
};

const SessionStage = () => {
  const [volumeIndicators, setVolumeIndicators] = useState([]); // Its an array of objects {uid: uid, volume: [0-100], isSpeaking: Boolean(true | False)}

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
    setVideoStreamStat((prevArr) => {
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
    setAllStreams((prevStreams) => {
      prevStreams.push({ stream: stream, uid: uid });
      return prevStreams;
    });
  };

  const handleRemoveFromAllStreams = (uid) => {
    setAllStreams((prevStreams) => {
      return prevStreams.filter((object) => object.uid !== uid);
    });
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

  const { peopleInThisSession } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const params = useParams();

  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const [openPhotoBooth, setOpenPhotoBooth] = useState(false);

  const [uplinkStat, setUplinkStat] = useState("");
  const [downlinkStat, setDownLinkStat] = useState("");
  const [localVolumeLevel, setLocalVolumeLevel] = useState("");

  const handleOpenSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const handleOpenPhotoBooth = () => {
    setOpenPhotoBooth(true);
  };

  const handleClosePhotoBooth = () => {
    setOpenPhotoBooth(false);
  };

  const handleStopScreenShare = async () => {
    rtc.localScreenTrack && rtc.localScreenTrack.close();
    // await rtc.screenClient.unpublish(rtc.localScreenTrack);
    await rtc.screenClient.leave().then(() => {
      setView("gallery");
    });
  };

  const userId = useSelector((state) => state.eventAccessToken.id);

  const { token, screenToken } = useSelector((state) => state.RTC);

  const { sessionRole, role } = useSelector((state) => state.eventAccessToken);

  const agoraRole = sessionRole !== "audience" ? "host" : "audience";

  // Defined options for connecting to Agora RTC server

  let options = {
    // Pass your app ID here.
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: sessionId,
    // Set the user role in the channel.
    role: agoraRole,
    // Use a temp token
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

  useEffect(() => {
    handleChangeGrid();
  }, [allStreams]);

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
    dispatch(fetchSessionForSessionStage(sessionId));

    socket.on("updatedSession", ({ session }) => {
      dispatch(
        // ! TODO
        sessionActions.EditSession({
          session: session,
        })
      );
    });

    socket.on("updatedCurrentSession", ({ session }) => {
      dispatch(
        // ! TODO
        sessionActions.FetchSession({
          session: session,
        })
      );
    });

    socket.on("stageMembers", ({ stageMembers }) => {
      dispatch(
        // ! TODO
        stageActions.FetchStageMembers({
          stageMembers: stageMembers,
        })
      );
    });

    socket.on("sessionRoomData", ({ sessionUsers }) => {
      dispatch(
        // ! TODO
        userActions.FetchPeopleInSession({
          peopleInThisSession: sessionUsers,
        })
      );
    });

    window.addEventListener("beforeunload", leaveStreaming);

    return () => {
      leaveStreaming();
    };
  }, [dispatch, sessionId]);

  // This is for screen sharing purpose

  const startScreenCall = async () => {
    rtc.screenClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    rtc.client.setClientRole(options.role);

    await rtc.screenClient.join(
      options.appId,
      sessionId,
      screenToken,
      `screen_${userId}`
    );

    rtc.localScreenTrack = await AgoraRTC.createScreenVideoTrack();

    await rtc.screenClient.setClientRole("host");

    await rtc.screenClient.publish(rtc.localScreenTrack);

    rtc.localScreenTrack.on("track-ended", () => {
      // alert("screen sharing stopped");
      console.info("screen sharing stopped");

      handleStopScreenShare();
    });

    return rtc.localScreenTrack;
  };

  const startAdvancedLiveStreaming = async () => {
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    // TODO Important => Get local downlink and Uplink stat and show it to users that what is your network condition.
    // Get client network quality
    // rtc.client.on("network-quality", (stats) => {
    //   setDownLinkStat(stats.downlinkNetworkQuality);
    //   setUplinkStat(stats.uplinkNetworkQuality);
    // });
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Listen for event "user-published" explanation: Some kind of audio or video stream is published
    rtc.client.on("user-published", async (user, mediaType) => {
      console.info("some media stream was just published");

      const uid = user.uid.toString();

      if (document.getElementById(uid)) {
        console.info("Already in session!");

        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        console.info("subscribe success");

        // If the subscribed track is video.
        if (mediaType === "video") {
          // Get `RemoteVideoTrack` in the `user` object.
          const remoteVideoTrack = user.videoTrack;

          // If user was already in session then just play his video in his respective container

          if (document.getElementById(uid)) {
            remoteVideoTrack.play(uid);
          }

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
      console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;

        if (uid.startsWith("screen")) {
          // Set view to screen share mode (grid mode)

          setView("screenShare");

          // Set this screen share stream as screenStream
          setScreenStream({ uid: uid, stream: remoteVideoTrack });

          // We already have all streams maintained in allStreams

          // So adopt grid mode and then render screenStream as mainStream and rest all as mini stream
        }

        // Remote video track is now added to allStreams and so it will start playing

        if (!uid.startsWith("screen")) {
          handleAddToAllStreams(remoteVideoTrack, uid);

          handleVideoIsEnabledChange(uid, true);
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
        await rtc.screenClient.leave().then(() => {
          setView("gallery");
        });
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

      console.info(`User with UID ${userId} unpublished media stream.`);
    });

    rtc.client.on("user-left", (user) => {
      const uid = user.uid.toString(); // the id of stream that just left

      if (uid.startsWith("screen")) {
        console.log("screen sharing track unpblished");
      }

      handleRemoveFromAllStreams(uid);

      handleAudioIsEnabledChange(uid, false);

      handleVideoIsEnabledChange(uid, false);

      console.info(`User with UID ${uid} just left the meeting.`);
    });

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        console.info("Bluemeet: Joined RTC channel");

        // If its host or speaker who just joined channel

        if (agoraRole !== "audience") {
          rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            encoderConfig: {
              sampleRate: 48000,
              stereo: true,
              bitrate: 128,
            },
          });
          rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: "120p_1",
          });

          // Set to all streams
          handleAddToAllStreams(rtc.localVideoTrack, options.uid);

          // Set to local stream
          handleChangeLocalStream(rtc.localVideoTrack, options.uid);

          await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

          console.info("publish success!");

          handleVideoIsEnabledChange(options.uid, true);
          handleAudioIsEnabledChange(options.uid, true);

          turnOffAudio(options.uid);
          turnOffVideo(options.uid);
        }
      });

       // * DONE Enable dual stream mode

      rtc.client
      .enableDualStream()
      .then(() => {
        console.log("Enable Dual stream success!");
      })
      .catch((err) => {
        console.log(err);
      });

    // * Enable audioVolume indicator

    rtc.client.enableAudioVolumeIndicator();

    // * Find active speakers

    rtc.client.on("volume-indicator", (volumes) => {
      let arr = [];

      volumeIndicators.forEach((element) => {
        arr.push({
          uid: element.uid,
          volume: element.volume,
          isSpeaking: false,
        });
      });

      setVolumeIndicators(arr);

      volumes.forEach((volume) => {
        if (volume.level > 5) {
          // volume.uid.toString() is speaking
          setVolumeIndicators((prev) => {
            const filtered = prev.filter(
              (object) => object.uid !== volume.uid.toString()
            );

            filtered.push({
              uid: volume.uid.toString(),
              volume: volume.level,
              isSpeaking: true,
            });

            return filtered;
          });
        } else if (volume.level < 5) {
          // volume.uid.toString() is not speaking

          setVolumeIndicators((prev) => {
            const filtered = prev.filter(
              (object) => object.uid !== volume.uid.toString()
            );

            filtered.push({
              uid: volume.uid.toString(),
              volume: volume.level,
              isSpeaking: false,
            });

            return filtered;
          });
        }
      });

      // Find who is loudest

      if (!volumes[0]) return;

      let loudest = volumes[0].level;
      let loudestUID = volumes[0].uid;

      for (let i = 0; i < volumes.length; i++) {
        if (loudest < volumes[i].level) {
          loudest = volumes[i].level;
          loudestUID = volumes[i].uid;
        }
      }

      // Get loudest person with this UID from allStreams

      const [LoudestPerson] = allStreams.filter(
        (object) => object.uid === loudestUID
      );

      // LoudestPerson is an object {stream: (video stream) | uid: uid (user identifier)}

      // Set this as prominentStream Now

      // Now we will get to know who is loudest every 2 seconds and we will update the ui accordingly

      if (LoudestPerson) {
        if (LoudestPerson.stream && LoudestPerson.uid) {
          handleChangeProminentStream(LoudestPerson.stream, LoudestPerson.uid);
        }
      }

      // Now set all except prominent in nonProminent streams

      // nonProminent is an array of all except prominent

      const nonProminent = allStreams.filter(
        (object) => object.uid !== loudestUID
      );

      setNonProminent(nonProminent);

      // Now we can just use prominent and non prominent to render spotlight view and non screen share and not pinned view of grid mode
    });

    setInterval(() => {
      if (!rtc.localAudioTrack) return;
      const level = rtc.localAudioTrack.getVolumeLevel();
      setLocalVolumeLevel(level * 100);
    }, 2000);

    document.getElementById("leave-session").onclick = async function () {
      if (agoraRole === "host") {
        rtc.localAudioTrack && rtc.localAudioTrack.close();
        rtc.localVideoTrack && rtc.localVideoTrack.close();
      }

      if (rtc.localScreenTrack) {
        rtc.localScreenTrack.close();
      }

      if (rtc.screenClient) {
        await rtc.screenClient.leave();
      }

      // Traverse all remote users.
      rtc.client.remoteUsers.forEach((user) => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();

        // ReactDOM.unmountComponentAtNode(document.getElementById(user.uid));
      });

      // Leave the channel.
      await rtc.client.leave();
      history.push(
        `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
      );
    };
  };

  const leaveStreaming = async () => {
    if (agoraRole === "host") {
      rtc.localAudioTrack && rtc.localAudioTrack.close();
      rtc.localVideoTrack && rtc.localVideoTrack.close();
    }

    if (rtc.localScreenTrack) {
      rtc.localScreenTrack.close();
    }

    if (rtc.screenClient) {
      await rtc.screenClient.leave();
    }

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach((user) => {
      // Destroy the dynamically created DIV containers.
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
    );
  };

  useEffect(() => {
    startAdvancedLiveStreaming();
  }, []);

  // navigator.mediaDevices.getUserMedia(..).then((stream) => {..});

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    stream.getVideoTracks()[0].onended = () => {
      console.info("Screen share has ended");
    };
  });

  return (
    <>
      <div>
        {/* Stage Nav Goes here */}
        <StageNavComponent />
        <div
          id="stage-full-screen-element"
          className="d-flex flex-column align-items-center"
          style={{ height: "100%" }}
        >
          <StageBody openSideDrawer={sideDrawerOpen}>
            {/* Stream body goes here */}
            <StreamBody
              handleOpenSideDrawer={handleOpenSideDrawer}
              sideDrawerOpen={sideDrawerOpen}
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
              volumeIndicators={volumeIndicators}
              peopleInThisSession={peopleInThisSession}
            />

            {/* Stage side drawer component goes here */}

            {sideDrawerOpen && <StageSideDrawerComponent />}
          </StageBody>

          {/* Stage Controls components */}
          <StageControlsComponent
            handleStopScreenShare={handleStopScreenShare}
            handleSwitchToGalleryView={handleSwitchToGalleryView}
            handleSwitchToGridView={handleSwitchToGridView}
            handleSwitchToSpotlightView={handleSwitchToSpotlightView}
            handleOpenPhotoBooth={handleOpenPhotoBooth}
            videoIsEnabled={videoIsEnabled}
            turnOffVideo={turnOffVideo}
            turnOnVideo={turnOnVideo}
            options={options}
            audioIsEnabled={audioIsEnabled}
            turnOffAudio={turnOffAudio}
            turnOnAudio={turnOnAudio}
            screenSharingIsEnabled={screenSharingIsEnabled}
            startScreenCall={startScreenCall}
            setScreenSharingIsEnabled={setScreenSharingIsEnabled}
          />
        </div>
      </div>

      <PhotoBooth open={openPhotoBooth} handleClose={handleClosePhotoBooth} />
      <ReactTooltip place="top" type="light" effect="float" />
    </>
  );
};

export default SessionStage;
