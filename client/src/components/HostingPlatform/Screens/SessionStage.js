/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import {
  StageBody,
  CollapseIcon,
  VideoStreamContainer,
  GalleryView,
  GridView,
  GridViewMini,
} from "./../../../components/SessionStage/Elements";

import LastPageRoundedIcon from "@material-ui/icons/LastPageRounded";
import FirstPageRoundedIcon from "@material-ui/icons/FirstPageRounded";

import PhotoBooth from "../../Elements/PhotoBooth";
import StageNavComponent from "../../SessionStage/StageNavComponent";
import StageControlsComponent from "../../SessionStage/StageControlsComponent";
import StageSideDrawerComponent from "../../SessionStage/StageSideDrawer";
import { IconButton } from "@material-ui/core";
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

import {
  errorTrackerForFetchSessionForSessionStage,
  fetchSessionForSessionStage,
  getRTCToken,
  getRTCTokenForScreenShare,
} from "../../../actions";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  client: null,
  screenClient: null,
};

const SessionStage = () => {
  const [view, setView] = useState("gallery");

  const [allStreams, setAllStreams] = useState([]);

  const [mainStream, setMainStream] = useState(null);

  const [miniStreams, setMiniStreams] = useState([]);

  const [prominentStream, setProminentStream] = useState(null);

  const [localStream, setLocalStream] = useState(null); // This is to keep track of local video track

  const [remoteStreams, setRemoteStreams] = useState([]);

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
  }

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const turnOffVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(false);
    document.getElementById(`avatar_box_${uid}`).style.display = "inline-block";
    setVideoIsEnabled(false);
  };
  const turnOnVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(true);
    document.getElementById(`avatar_box_${uid}`).style.display = "none";
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

  const { peopleInThisSession } = useSelector((state) => state.user);

  let localStream_o;

  let MainStreamId; // Keep Track of main stream id

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
    console.log("Toggle side drawer pressed");
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const handleOpenPhotoBooth = () => {
    setOpenPhotoBooth(true);
  };

  const handleClosePhotoBooth = () => {
    setOpenPhotoBooth(false);
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
    console.error(allStreams);
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
      console.log(session);

      dispatch(
        // ! TODO
        sessionActions.EditSession({
          session: session,
        })
      );
    });

    socket.on("updatedCurrentSession", ({ session }) => {
      console.log(session);

      dispatch(
        // ! TODO
        sessionActions.FetchSession({
          session: session,
        })
      );
    });

    socket.on("stageMembers", ({ stageMembers }) => {
      console.log("I recieved no. of people on stage");

      console.log(stageMembers);
      dispatch(
        // ! TODO
        stageActions.FetchStageMembers({
          stageMembers: stageMembers,
        })
      );
    });

    socket.on("sessionRoomData", ({ sessionUsers }) => {
      console.log("I recieved session room data");

      console.log(sessionUsers);
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
  };

  const startAdvancedLiveStreaming = async () => {
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    // Get client network quality
    rtc.client.on("network-quality", (stats) => {
      setDownLinkStat(stats.downlinkNetworkQuality);
      setUplinkStat(stats.uplinkNetworkQuality);
    });

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

          // Remote video track is now added to allStreams and so it will start playing

          // handleAddToAllStreams(remoteVideoTrack, uid);

          // If user was already in session then just play his video in his respective container

          if (document.getElementById(uid)) {
            remoteVideoTrack.play(uid);
          }
        }
        // If the subscribed track is audio.
        if (mediaType === "audio") {
          // Get `RemoteAudioTrack` in the `user` object.
          const remoteAudioTrack = user.audioTrack;
          // Play the audio track. No need to pass any DOM element.
          remoteAudioTrack.play();
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

        // Remote video track is now added to allStreams and so it will start playing

        handleAddToAllStreams(remoteVideoTrack, uid);
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", (user) => {
      const userId = user.uid.toString();

      console.info(`User with UID ${userId} unpublished media stream.`);
    });

    rtc.client.on("user-left", (user) => {
      const uid = user.uid.toString(); // the id of stream that just left

      if (uid.startsWith("screen")) {
        console.log("screen sharing track unpblished");
      }

      handleRemoveFromAllStreams(uid);

      console.info(`User with UID ${uid} just left the meeting.`);
    });

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        console.info("Bluemeet: Joined RTC channel");

        // If its host or speaker who just joined channel

        if (agoraRole !== "audience") {
          rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
            encoderConfig: "high_quality_stereo",
          });
          rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: "1080p_1",
          });

          // setLocalStream({ stream: rtc.localVideoTrack, uid: options.uid });

          // localStream_o = { stream: rtc.localVideoTrack, uid: options.uid };

          // MainStreamId = options.uid;

          // Set to all streams
          handleAddToAllStreams(rtc.localVideoTrack, options.uid);

          // Set to local stream
          handleChangeLocalStream(rtc.localVideoTrack, options.uid);

          await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

          console.info("publish success!");
        }
      });

    setInterval(() => {
      if (!rtc.localAudioTrack) return;
      const level = rtc.localAudioTrack.getVolumeLevel();
      // setAudioLevel(level * 100);
      setLocalVolumeLevel(level * 100);
      // console.log("local stream audio level", level);
    }, 1000);

    document.getElementById("leave-session").onclick = async function () {
      if (agoraRole === "host") {
        rtc.localAudioTrack && rtc.localAudioTrack.close();
        rtc.localVideoTrack && rtc.localVideoTrack.close();
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

  const renderLocalStream = (allStreams) => {
    console.log("render local stream fxn was fired");
    console.log(allStreams);

    if (!allStreams) return;
    const { stream, uid } = allStreams;

    if (!stream || !uid) return;
    // console.log(stream, uid);
    console.log("I reached at line 736");
    let userUID = uid;

    if (uid.startsWith("screen")) {
      userUID = userUID.slice(7);
      console.error(userUID);
      allStreams.stream.play("session-main-view-container");
    }

    if (document.getElementById(uid)) {
      allStreams.stream.play(uid);
    }

    const {
      userName,
      userImage,
      userOrganisation,
      userDesignation,
      sessionRole,
    } = peopleInThisSession.find((people) => people.userId === userUID);

    return (
      <GalleryVideoPlayer
        localStream={stream}
        role={sessionRole}
        localPlayerId={uid}
        userName={userName}
        userImage={userImage}
        userOrganisation={userOrganisation}
        userDesignation={userDesignation}
      />
    );
  };

  const renderGalleryView = (allStreams) => {
    console.log("render Gallery view  fxn was fired");
    console.log(allStreams);

    if (!allStreams) return;

    return allStreams.map((OneStream) => {
      const { stream, uid } = OneStream;

      // if (!stream || !uid) return;

      console.log("I reached at line 479");
      let userUID = uid;

      if (uid.startsWith("screen")) {
        userUID = userUID.slice(7);
        console.error(userUID);
        allStreams.stream.play("session-main-view-container");
      }

      if (document.getElementById(uid)) {
        OneStream.stream.play(uid);
      }

      const {
        userName,
        userImage,
        userOrganisation,
        userDesignation,
        sessionRole,
      } = peopleInThisSession.find((people) => people.userId === userUID);

      return (
        <GalleryVideoPlayer
          localStream={stream}
          role={sessionRole}
          localPlayerId={uid}
          userName={userName}
          userImage={userImage}
          userOrganisation={userOrganisation}
          userDesignation={userDesignation}
        />
      );
    });
  };

  const renderMainStream = (mainStream) => {
    console.log("render main stream fxn was fired");
    console.log(mainStream);

    if (!mainStream) return;
    const { stream, uid } = mainStream;

    if (!stream || !uid) return;
    // console.log(stream, uid);
    console.log("I reached at line 611 (This is render main stream)");
    let userUID = uid;

    if (uid.startsWith("screen")) {
      userUID = userUID.slice(7);
      console.error(userUID);
      mainStream.stream.play("session-main-view-container");
    }

    if (document.getElementById(uid)) {
      mainStream.stream.play(uid);
    }

    const {
      userName,
      userImage,
      userOrganisation,
      userDesignation,
      sessionRole,
    } = peopleInThisSession.find((people) => people.userId === userUID);

    return (
      <GalleryVideoPlayer
        localStream={stream}
        role={sessionRole}
        localPlayerId={uid}
        userName={userName}
        userImage={userImage}
        userOrganisation={userOrganisation}
        userDesignation={userDesignation}
      />
    );
  };

  const renderMiniStreams = (miniStreams) => {
    console.log("render mini Streams  fxn was fired");
    console.log(miniStreams);

    if (!miniStreams) return;

    return miniStreams.map((OneStream) => {
      const { stream, uid } = OneStream;

      // if (!stream || !uid) return;

      console.log("I reached at line 479");
      let userUID = uid;

      if (uid.startsWith("screen")) {
        userUID = userUID.slice(7);
        console.error(userUID);
        miniStreams.stream.play("session-main-view-container");
      }

      if (document.getElementById(uid)) {
        OneStream.stream.play(uid);
      }
      const {
        userName,
        userImage,
        userOrganisation,
        userDesignation,
        sessionRole,
      } = peopleInThisSession.find((people) => people.userId === userUID);

      return (
        <GalleryVideoPlayer
          localStream={stream}
          role={sessionRole}
          localPlayerId={uid}
          userName={userName}
          userImage={userImage}
          userOrganisation={userOrganisation}
          userDesignation={userDesignation}
        />
      );
    });
  };

  useEffect(() => {
    startAdvancedLiveStreaming();
  }, []);

  return (
    <>
      <div>
        {/* Stage Nav Goes here */}
        <StageNavComponent />

        <StageBody openSideDrawer={sideDrawerOpen}>
          <div>
            <a
              onClick={handleOpenSideDrawer}
              // data-tip={
              //   sideDrawerOpen
              //     ? "Close session activity"
              //     : "Open session activity"
              // }
              className=""
              style={{
                padding: "8px",
                backgroundColor: "#DDDDDD",
                borderRadius: "5px",
                maxWidth: "fit-content",
                position: "absolute",
                top: "10px",
                right: "20px",
                zIndex: "1",
              }}
            >
              {sideDrawerOpen ? (
                <LastPageRoundedIcon />
              ) : (
                <FirstPageRoundedIcon />
              )}
            </a>

            <div className="">
              {(() => {
                switch (view) {
                  case "gallery":
                    return (
                      <GalleryView col={col} row={row}>
                        {allStreams && renderGalleryView(allStreams)}
                      </GalleryView>
                    );
                  case "grid":
                    return (
                      <GridView>
                        {/* Render main stream here */}
                        {/* <VideoStreamContainer /> */}
                        {mainStream && renderMainStream(mainStream)}
                        <GridViewMini>
                          {/* <VideoStreamContainer /> */}
                          {miniStreams && renderMiniStreams(miniStreams)}
                          {/* Render mini views here */}
                        </GridViewMini>
                      </GridView>
                    );

                  case "spotlight":
                    return <div>This is spotlight view</div>;

                  default:
                    break;
                }
              })()}
            </div>
          </div>

          {/* Stage side drawer component goes here */}

          {sideDrawerOpen && <StageSideDrawerComponent />}
        </StageBody>

        {/* Stage Controls components */}
        <StageControlsComponent
        handleSwitchToGalleryView={handleSwitchToGalleryView}
          handleSwitchToGridView={handleSwitchToGridView}
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

      <PhotoBooth open={openPhotoBooth} handleClose={handleClosePhotoBooth} />
      <ReactTooltip place="top" type="light" effect="float" />
    </>
  );
};

export default SessionStage;
