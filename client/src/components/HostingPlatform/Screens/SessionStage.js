/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { StageBody } from "./../../../components/SessionStage/Elements";
import StageNavComponent from "../../SessionStage/StageNavComponent";
import StageControlsComponent from "../../SessionStage/StageControlsComponent";
import StageSideDrawerComponent from "../../SessionStage/StageSideDrawer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "../service/socket";
import { userActions } from "../../../reducers/userSlice";
import { stageActions } from "../../../reducers/stageSlice";
import { sessionActions } from "../../../reducers/sessionSlice";
import AgoraRTC from "agora-rtc-sdk-ng";
import history from "../../../history";
import ReactTooltip from "react-tooltip";
import {
  showNotification,
  fetchSessionQnA,
  createSessionQnA,
  updateSessionQnA,
  fetchSessionQnAs,
  createSessionPoll,
  fetchSessionPolls,
  updateSessionPoll,
  fetchUpdatedSessionPolls,
  updateUsersInSession,
  fetchPreviousSessionChatMessages,
} from "./../../../actions";

import {
  fetchSessionForSessionStage,
  createNewSessionMsg,
  deleteSessionChat,
} from "../../../actions";
import StreamBody from "../Functions/Stage/StreamBody";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  client: null,
  screenClient: null,
};

const SessionStage = () => {
  const params = useParams();
  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  const volumeIndicators = useRef([]); // Its an array of objects {uid: uid, volume: [0-100], isSpeaking: Boolean(true | False)}

  const prominentStream = useRef();

  const nonProminentStreams = useRef([]);

  const [view, setView] = useState("gallery");

  const [allStreams, setAllStreams] = useState([]);

  const [mainStream, setMainStream] = useState(null);

  const [miniStreams, setMiniStreams] = useState([]);

  const [localStream, setLocalStream] = useState();

  const [remoteStreams, setRemoteStreams] = useState([]);

  // const users = useRef(); // Users

  // console.log(users.current);

  useEffect(() => {
    dispatch(fetchSessionQnA(sessionId));
    dispatch(fetchSessionPolls(sessionId));

    dispatch(fetchSessionForSessionStage(sessionId));

    dispatch(fetchPreviousSessionChatMessages(sessionId));

    socket.emit(
      "subscribeSession",
      {
        sessionId: sessionId,
      },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );
    socket.on("usersInSession", ({ users }) => {
      dispatch(updateUsersInSession(users));
    });

    socket.on("newSessionMsg", ({ newMsg }) => {
      dispatch(createNewSessionMsg(newMsg));
    });

    socket.on("newQnA", ({ newQnA }) => {
      dispatch(createSessionQnA(newQnA));
    });

    socket.on("upvotedQnA", ({ upvotedQnA }) => {
      dispatch(updateSessionQnA(upvotedQnA));
    });

    socket.on("downvotedQnA", ({ downvotedQnA }) => {
      dispatch(updateSessionQnA(downvotedQnA));
    });

    socket.on("answeredQnA", ({ answeredQnA }) => {
      dispatch(updateSessionQnA(answeredQnA));
    });

    socket.on("deletedQnA", ({ deletedQnA }) => {
      dispatch(showNotification("QnA has been deleted successfully!"));
      dispatch(updateSessionQnA(deletedQnA));
    });

    socket.on("sessionQnAs", ({ sessionQnAs }) => {
      dispatch(showNotification("QnA is shown on stage!"));
      dispatch(fetchSessionQnAs(sessionQnAs));
    });

    socket.on("hideQnAFromStage", ({ sessionQnAs }) => {
      dispatch(showNotification("QnA has been hidden from stage!"));
      dispatch(fetchSessionQnAs(sessionQnAs));
    });

    socket.on("newPoll", ({ createdPoll }) => {
      dispatch(showNotification("New poll created successfully!"));
      console.log(createdPoll);
      dispatch(createSessionPoll(createdPoll));
    });

    socket.on("updatedPoll", ({ updatedPoll }) => {
      dispatch(showNotification("Poll was updated successfully!"));
      console.log(updatedPoll);
      dispatch(updateSessionPoll(updatedPoll));
    });

    socket.on("sessionPolls", ({ polls }) => {
      dispatch(showNotification("Poll is shown on stage!"));
      dispatch(fetchUpdatedSessionPolls(polls));
    });

    socket.on("hidePollFromStage", ({ polls }) => {
      dispatch(showNotification("Poll has been hidden from stage!"));
      dispatch(fetchUpdatedSessionPolls(polls));
    });

    socket.on("deletedPoll", ({ deletedPoll }) => {
      console.log(deletedPoll);
      dispatch(updateSessionPoll(deletedPoll));
    });

    socket.on("deletedMsg", ({ deletedMsg }) => {
      console.log(deletedMsg);
      dispatch(deleteSessionChat(deletedMsg));
    });

    window.addEventListener("beforeunload", leaveStreaming);

    return () => {
      leaveStreaming();
    };
  }, []);

  const { sessionDetails } = useSelector((state) => state.session);

  const { peopleInThisSession } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const handleOpenSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const userId = useSelector((state) => state.eventAccessToken.id);

  const { token, screenToken } = useSelector((state) => state.RTC);

  const { sessionRole, role } = useSelector((state) => state.eventAccessToken);

  const agoraRole = sessionRole === "host" ? "host" : "audience";

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
    // startAdvancedLiveStreaming();

    startLiveStream();
  }, []);

  // navigator.mediaDevices.getUserMedia(..).then((stream) => {..});

  // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //   stream.getVideoTracks()[0].onended = () => {
  //     console.info("Screen share has ended");
  //   };
  // });

  const startLiveStream = async () => {
    AgoraRTC.setLogLevel(0);

    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    // Listen for event "user-published" explanation: Some kind of audio or video stream is published

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("Media stream was published.");

      const uid = user.uid.toString();

      // Keep track of users who are joining in and leaving => keep track of their availability, camera, audio and screen 

      console.log(user);
      console.log(mediaType);
    });

    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log(user);
      console.log(mediaType);
    });

    rtc.client.on("user-left", async (user) => {
      console.log(user);
    });

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        console.log("Bluemeet: Joined RTC Channel.");
      });

    // Check if the user who just joined is a host or audience

    if (agoraRole === "host") {
      // Create and publish local audio and video tracks

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

      await rtc.client
        .publish([rtc.localAudioTrack, rtc.localVideoTrack])
        .then(() => {
          console.info("publish success!");
        });

      setAllStreams((prev) => [
        ...prev,
        { uid: userId, audio: true, video: true, stream: rtc.localVideoTrack },
      ]);

      setLocalStream({
        uid: userId,
        audio: true,
        video: true,
        stream: rtc.localVideoTrack,
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
    }
  };

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
            <div></div>
            <StreamBody
              handleOpenSideDrawer={handleOpenSideDrawer}
              sideDrawerOpen={sideDrawerOpen}
              col={col}
              row={row}
              view={view}
              allStreams={allStreams}
              peopleInThisSession={peopleInThisSession}
            />
            {/* Stage side drawer component goes here */}
            {sideDrawerOpen && <StageSideDrawerComponent />}
          </StageBody>

          {/* Stage Controls components */}
          <StageControlsComponent />
        </div>
      </div>
      <ReactTooltip place="top" type="light" effect="float" />
    </>
  );
};

export default SessionStage;
