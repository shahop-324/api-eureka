/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { StageBody } from "./../../../components/SessionStage/Elements";
import StageNavComponent from "../../SessionStage/StageNavComponent";
import StageControlsComponent from "../../SessionStage/StageControlsComponent";
import StageSideDrawerComponent from "../../SessionStage/StageSideDrawer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import socket from "../service/socket";
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
  fetchSessionForSessionStage,
  createNewSessionMsg,
  deleteSessionChat,
  updateSession,
  deleteBackstageChat,
  fetchPreviousBackstageChatMessages,
  createNewBackstageMsg,
} from "./../../../actions";

import StreamBody from "../Functions/Stage/StreamBody";
import StartingSessionCounter from "../../SessionStage/SubComponent/StartingSessionCounter";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  localScreenTrack: null,
  client: null,
  screenClient: null,
};

const NotYetStarted = styled.div`
  min-height: 80vh;
  height: 90%;
  padding: 8vh 3vw;
  border-radius: 10px;
  margin-left: 70px;
  margin-right: 70px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const ButtonStyled = styled.button`
  font-family: "Ubuntu" !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  font-size: 1.1rem !important;
  padding: 12px 20px !important;
  border-radius: 25px !important;
`;

const Text = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  font-family: "Ubuntu";
  text-align: center;
`;

const SessionStage = () => {
  const params = useParams();
  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  let userRole = "Attendee";

  // Determine if the current user is a host and place restrictions based on that

  const { userDetails } = useSelector((state) => state.user);
  const { sessionDetails } = useSelector((state) => state.session);

  const userId = userDetails._id;
  const userEmail = userDetails.email;

  const { registrations } = useSelector((state) => state.registration);

  const myRegistration = registrations.find(
    (element) => element.bookedByUser.toString() === userId
  );

  const registrationId = myRegistration._id;

  const hosts = sessionDetails.host; // Hosts for this session
  const speakers = sessionDetails.speaker; // Speakers for this session

  const hostIds = hosts.map((el) => el._id);
  const speakerEmails = speakers.map((el) => el.email);

  if (hostIds.includes(userId)) {
    //This user is a host
    // alert("This user is a host")
    userRole = "Host";
  } else if (speakerEmails.includes(userEmail)) {
    // This user is a speaker
    // alert("This user is a speaker")
    userRole = "Speaker";
  } else if (!hostIds.includes(userId) && !speakerEmails.includes(userEmail)) {
    // This user is an attendee
    // alert("This user is an attendee")
    userRole = "Attendee";
  }

  const [state, setState] = useState("live"); // State can be live or back. It will be determined in useEffect

  const [channel, setChannel] = useState(`${sessionId}-live`); // This will be the room used to join agora channel , It can be sessionIdlive or sessionIdback depanding on whether user joins livestage or backstage

  const volumeIndicators = useRef([]); // Its an array of objects {uid: uid, volume: [0-100], isSpeaking: Boolean(true | False)}

  const prominentStream = useRef();

  const localVolumeLevel = useRef();

  const nonProminentStreams = useRef([]);

  const [view, setView] = useState("gallery");

  const [canPublishStream, setCanPublishStream] = useState(false);

  const [allStreams, setAllStreams] = useState([]);

  const [mainStream, setMainStream] = useState(null);

  const [miniStreams, setMiniStreams] = useState([]);

  const [localStream, setLocalStream] = useState();

  const [remoteStreams, setRemoteStreams] = useState([]);

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  useEffect(() => {
    dispatch(fetchSessionQnA(sessionId));
    dispatch(fetchSessionPolls(sessionId));

    dispatch(fetchSessionForSessionStage(sessionId));

    dispatch(fetchPreviousSessionChatMessages(sessionId));

    dispatch(fetchPreviousBackstageChatMessages(sessionId));

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

    socket.on("updatedSession", ({ session }) => {
      dispatch(updateSession(session));
    });

    socket.on("usersInSession", ({ users }) => {
      dispatch(updateUsersInSession(users));
    });

    socket.on("newSessionMsg", ({ newMsg }) => {
      dispatch(createNewSessionMsg(newMsg));
    });

    socket.on("newBackstageMsg", ({newMsg}) => {
      dispatch(createNewBackstageMsg(newMsg));
    })

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
      dispatch(deleteSessionChat(deletedMsg));
    });

    socket.on("deleteBackstageMsg", ({deletedMsg}) => {
      dispatch(deleteBackstageChat(deletedMsg));
    })

    window.addEventListener("beforeunload", leaveStreaming);

    return () => {
      socket.emit(
        "removeMeFromSessionStage",
        {
          userId,
          userEmail,
          registrationId,
          sessionId,
          eventId,
          microphone: false,
          camera: false,
          screen: false,
          available: false,
        },
        (error) => {
          console.log(error);
        }
      );

      leaveStreaming();
    };
  }, []);

  const turnOffVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(false);

    socket.emit(
      "updateMyCameraOnSessionStage",
      {
        userId,
        registrationId,
        sessionId,
        camera: false,
      },
      (error) => {
        console.log(error);
      }
    );

    setVideoIsEnabled(false);
  };
  const turnOnVideo = async (uid) => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(true);

    socket.emit(
      "updateMyCameraOnSessionStage",
      {
        userId,
        registrationId,
        sessionId,
        camera: true,
      },
      (error) => {
        console.log(error);
      }
    );

    setVideoIsEnabled(true);
  };

  const turnOffAudio = async (uid) => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(false);

    socket.emit(
      "updateMyMicOnSessionStage",
      {
        userId,
        registrationId,
        sessionId,
        microphone: false,
      },
      (error) => {
        console.log(error);
      }
    );

    setAudioIsEnabled(false);
  };
  const turnOnAudio = async (uid) => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(true);

    socket.emit(
      "updateMyMicOnSessionStage",
      {
        userId,
        registrationId,
        sessionId,
        microphone: true,
      },
      (error) => {
        console.log(error);
      }
    );

    setAudioIsEnabled(true);
  };

  const handleSwitchToGridView = () => {
    let randomStreamIndex = Math.floor(Math.random() * allStreams.length);

    const newMainStream = allStreams[randomStreamIndex];

    // Set Random stream from all streams as main stream

    setMainStream(newMainStream);

    // Set rest of streams from all streams as mini streams

    allStreams.forEach((element, index) => {
      if (index * 1 !== randomStreamIndex * 1) {
        setMiniStreams((prev) => [...prev, element]);
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

  const runningStatus = sessionDetails.runningStatus; // Can be Started, Paused, Resumed, Ended, Not Yet Started

  const { peopleInThisSession } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const handleOpenSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const { token, screenToken } = useSelector((state) => state.RTC);

  const { sessionRole, role } = useSelector((state) => state.eventAccessToken);

  const agoraRole = sessionRole === "host" ? "host" : "audience";

  let options = {
    // Pass your app ID here.
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: channel,
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

  const leaveStreaming = async () => {
    // ! Emit mark me as leaved from session streaming if (I was able to publish stream to this channel)

    socket.emit(
      "removeMeFromSessionStage",
      {
        userId,
        userEmail,
        registrationId,
        sessionId,
        eventId,
        microphone: false,
        camera: false,
        screen: false,
        available: false,
      },
      (error) => {
        console.log(error);
      }
    );

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

  // navigator.mediaDevices.getUserMedia(..).then((stream) => {..});

  // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //   stream.getVideoTracks()[0].onended = () => {
  //     console.info("Screen share has ended");
  //   };
  // });

  const startLiveStream = async (localChannel) => {
    // alert(canPublishStream);
    if (agoraRole === "host") {
      // Only here we need to emit event markAsAvailableInSession via socket

      // alert("yes, I can publish stream");

      socket.emit(
        "markAsAvailableInSession",
        {
          userId,
          userEmail,
          registrationId,
          sessionId,
          eventId,
          microphone: false,
          camera: false,
          screen: false,
          available: true,
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // In this case we don't need to do anything
      // alert("No, I can't publish stream");
    }

    AgoraRTC.setLogLevel(0);

    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    // Set client role
    rtc.client.setClientRole(options.role);

    // Listen for event "user-published" explanation: Some kind of audio or video stream is published

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("Media stream was published.");

      // ! Here we need to maintain tracks in all Streams and remote Streams

      const uid = user.uid.toString();

      // Keep track of users who are joining in and leaving => keep track of their availability, camera, audio and screen

      console.log(user);
      console.log(mediaType);
    });

    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log(user);
      console.log(mediaType);

      // ! Call Remove from all streams
    });

    rtc.client.on("user-left", async (user) => {
      console.log(user);

      // ! Emit markThisUserAsUnavailable

      // ! Call Remove from all streams
    });
    console.log(options.appId, localChannel, options.token, options.uid);
    await rtc.client
      .join(options.appId, localChannel, options.token, options.uid)
      .then(async () => {
        console.log("Bluemeet: Joined RTC Channel.");
      })
      .catch((error) => {
        console.log(error);
      });

    // * Enable dual stream mode

    rtc.client
      .enableDualStream()
      .then(() => {
        console.log("Enable Dual stream success!");
      })
      .catch((err) => {
        console.log(err);
      });

    // Everyone will join channel and will have listners set to listen for other events in stream

    // Allow to publish media stream if permitted

    // * Find active speakers

    rtc.client.on("volume-indicator", (volumes) => {
      volumeIndicators.current = volumeIndicators.current.map((element) => {
        return {
          uid: element.uid,
          volume: element.volume,
          isSpeaking: false,
        };
      });

      volumes.forEach((volume) => {
        if (volume.level > 5) {
          // volume.uid.toString() is speaking

          volumeIndicators.current = volumeIndicators.current.map((object) =>
            object.uid.toString() !== volume.uid.toString()
              ? object
              : {
                  uid: volume.uid.toString(),
                  volume: volume.level,
                  isSpeaking: true,
                }
          );
        } else if (volume.level < 5) {
          // volume.uid.toString() is not speaking

          volumeIndicators.current = volumeIndicators.current.map((object) =>
            object.uid.toString() !== volume.uid.toString()
              ? object
              : {
                  uid: volume.uid.toString(),
                  volume: volume.level,
                  isSpeaking: false,
                }
          );
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
          prominentStream.current = LoudestPerson;
        }
      }

      // Now set all except prominent in nonProminent streams

      // nonProminent is an array of all except prominent

      nonProminentStreams.current = allStreams.filter(
        (object) => object.uid !== loudestUID
      );

      // Now we can just use prominent and non prominent to render spotlight view and non screen share and not pinned view of grid mode
    });
  };

  const unMuteMyVideo = async () => {
    // * Run this function when user starts video for the first time after joining in

    // Create and publish local audio and video tracks

    // Create and publish local video track

    // TODO Here is our opportunity to set preffered camera device to create local video track

    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: "1080p_2",
    });

    await rtc.client.publish([rtc.localVideoTrack]).then(() => {
      console.info("Video track published successfully!");

      socket.emit(
        "updateMyCameraOnSessionStage",
        {
          userId,
          registrationId,
          sessionId,
          camera: true,
        },
        (error) => {
          console.log(error);
        }
      );
    });

    setAllStreams((prev) => [
      ...prev,
      { uid: userId, stream: rtc.localVideoTrack },
    ]);

    setLocalStream({
      uid: userId,
      stream: rtc.localVideoTrack,
    });
  };

  const unMuteMyAudio = async () => {
    // * Run this function when user unmutes for the first time after joining in
    // Create and publish local audio track

    // TODO Here is our opportunity to set preffered microphone to create local audio track

    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: {
        sampleRate: 48000,
        stereo: true,
        bitrate: 128,
      },
    });

    await rtc.client.publish([rtc.localAudioTrack]).then(() => {
      console.log("Audio published successfully!");

      socket.emit(
        "updateMyMicOnSessionStage",
        {
          userId,
          registrationId,
          sessionId,
          microphone: true,
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  // * User will join with preferred camera and mic and will have their camera and microphone in muted state initially always

  // ? Imp Fxn => To remove from all possible maintained streams when user unpublishes video stream

  const RemoveFromAllStreams = (uid) => {
    // 1.) All streams
    setAllStreams((prev) => prev.filter((element) => element.uid !== uid)); // This will remove stream that just left from all streams
    //2.) Main stream
    if (mainStream.uid === uid) {
      // If the user who just left was in main stream then we have replaced that with a random stream from all streams
      setMainStream(allStreams[Math.floor(Math.random() * allStreams.length)]);
    }
    // 3.) Mini streams
    setMiniStreams((prev) => prev.filter((element) => element.uid !== uid)); // This will remove stream that just left from mini streams
    // 4.) Remote streams
    setRemoteStreams((prev) => prev.filter((element) => element.uid !== uid)); // This will remove stream that just left from remote streams
    // 5.) Prominent stream
    prominentStream.current =
      allStreams[Math.floor(Math.random() * allStreams.length)]; // We will assign a random stream from all streams to prominent stream
    // 6.) Non prominent stream
    nonProminentStreams.current = nonProminentStreams.current.filter(
      (element) => element.uid !== uid
    ); // This will remove stream that just left from nonProminentStream
  };

  setInterval(() => {
    if (!rtc.localAudioTrack) return;
    const level = rtc.localAudioTrack.getVolumeLevel();
    localVolumeLevel.current(level * 100);
  }, 1000);

  useEffect(() => {
    // startAdvancedLiveStreaming();
    let localChannel = `${sessionId}-live`;

    if (agoraRole === "host") {
      setCanPublishStream(true); // We will manipulate this variable to allow audience to come on stage

      if (runningStatus === "Started" || runningStatus === "Resumed") {
        // Session is live
        setState("live");
        setChannel(`${sessionId}-live`);
      }
      if (runningStatus === "Paused" || runningStatus === "Not Yet Started") {
        // Session is not not live
        socket.emit( // ! Subscribe to session backstage
          "subscribeBackstage",
          {
            sessionId: sessionId,
          },
          (error) => {
            if (error) {
              alert(error);
            }
          }
        );
        setState("back");
        setChannel(`${sessionId}-back`);
        localChannel = `${sessionId}-back`;
        // alert("We have setted channel as backstage");
      }
      if (runningStatus === "Ended") {
        // Session has already ended
        setState("ended");
        // No channel will be needed in this case as user won't join any agora channel here
      }
    } else {
      if (runningStatus !== "Ended") {
        // take to live stage
        setState("live");
        setChannel(`${sessionId}-live`);
      }
      if (runningStatus === "Ended") {
        setState("ended");
        // No channel will be needed in this case as user won't join any agora channel here
      }
    }

    if (runningStatus !== "Ended") {
      startLiveStream(localChannel);
    }

    // startLiveStream();
  }, []);

  return (
    <>
      <div style={{position: "relative"}}>
        {/* <StartingSessionCounter /> */}
        {/* Stage Nav Goes here */}
        <StageNavComponent
        state={state}
          runningStatus={runningStatus}
          canPublishStream={canPublishStream}
        />
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
              view={view}
              allStreams={allStreams}
              peopleInThisSession={peopleInThisSession}
              runningStatus={runningStatus}
              canPublishStream={canPublishStream}
            />
            {/* Stage side drawer component goes here */}
            {sideDrawerOpen && (
              <StageSideDrawerComponent
              state={state}
                runningStatus={runningStatus}
                canPublishStream={canPublishStream}
              />
            )}
          </StageBody>

          {/* Stage Controls components */}
          <StageControlsComponent
            leaveStreaming={leaveStreaming}
            runningStatus={runningStatus}
            canPublishStream={canPublishStream}
          />
        </div>
      </div>
      <ReactTooltip place="top" type="light" effect="float" />
    </>
  );
};

export default SessionStage;
