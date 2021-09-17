import React from "react";
import "./../Styles/sessionStreaming.scss";
import { useSelector } from "react-redux";

import {
  UserRoleTag,
  VideoStreamContainer,
  IconButton,
} from "../../SessionStage/Elements";

import Avatar from "@mui/material/Avatar";

import styled from "styled-components";

import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";

import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";

import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";

// const VideoOverlayIconBtn = styled.div`

// `

// const IconButton = styled.div`
//   padding: 7px;
//   border-radius: 10px;

//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;

//   border: 1px solid #1f545e;
//   color: #ffffff;
//   background-color: transparent;

//   &:hover {
//     cursor: pointer;

//     border: 1px solid #ffffffa9;
//     background-color: #ffffffa9;
//     color: #1f545e;
//   }
// `;

const SoundWaveAnimation = () => {
  return (
    <>
      <div className="wave-loader">
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
      </div>
    </>
  );
};

const StillSoundWave = () => {
  return (
    <>
      <div className="still-wave">
        <span className="wave-stroke-still"></span>
        <span className="wave-stroke-still"></span>
        <span className="wave-stroke-still"></span>
        <span className="wave-stroke-still"></span>
        <span className="wave-stroke-still"></span>
      </div>
    </>
  );
};

const GalleryVideoPlayer = ({
  audioStreamStat, // Its an array of objects {uid: uid, audioIsEnabled: Boolean (true | false)}
  videoStreamStat, // Its an array of objects {uid: uid, videoIsEnabled: Boolean (true | false)}
  role,
  localPlayerId,
  userName,
  userImage,
  userOrganisation,
  userDesignation,
  volumeIndicators, // array of these objects => {uid: uid, volume: [0-100], isSpeaking: Boolean(true | False)}
}) => {
  let audioIsEnabled = true;

  let videoIsEnabled = true;

  let showWave = false;

  if (volumeIndicators) {
    const [volumeData] = volumeIndicators.filter(
      (object) => object.uid === localPlayerId
    );

    if (volumeData) {
      showWave = volumeData.isSpeaking;
    }
  }

  if (audioStreamStat) {
    const audioStreamData = audioStreamStat.find(
      (element) => element.uid === localPlayerId
    );

    if (audioStreamData) {
      audioIsEnabled = audioStreamData.audioIsEnabled;
    }
  }

  if (videoStreamStat) {
    const videoStreamData = videoStreamStat.find(
      (element) => element.uid === localPlayerId
    );

    if (videoStreamData) {
      videoIsEnabled = videoStreamData.videoIsEnabled;
    }
  }

  // Now show muted icon if !audioIsEnabled & avatar if !videoIsEnabled

  const { id } = useSelector((state) => state.eventAccessToken);

  const roleSuffix = id === localPlayerId ? "(You)" : "";

  return (
    <>
      <VideoStreamContainer>
        <div id={localPlayerId} className="session-local-video-player">
          <UserRoleTag className="session-role px-3 py-1">{role}</UserRoleTag>
          {/* <div
            className="d-flex flex-row align-items-center"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              zIndex: "2",
            }}
          >
            <IconButton  className="me-4">
              <PushPinRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton >
              <ZoomOutMapRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </div> */}
          <div id={`avatar_box_${localPlayerId}`} className="avatar_box">
            {!videoIsEnabled && (
              <Avatar
                variant="rounded"
                src={userImage}
                alt={userName}
                style={{ backgroundColor: "#538BF7" }}
                sx={{ width: 72, height: 72 }}
              />
            )}
          </div>
          <div id={`user_identity_${localPlayerId}`} className="user-identity">
            <div style={{ color: "#F7F453" }}>
              {userName + " " + roleSuffix}
            </div>
            <div className="d-flex flex-row align-items-center">
              <div className="me-2">{`${userDesignation} ${userOrganisation}`}</div>
              {audioIsEnabled ? (
                showWave ? (
                  <SoundWaveAnimation />
                ) : (
                  <StillSoundWave />
                )
              ) : (
                <MicOffOutlinedIcon style={{ color: "red" }} />
              )}
            </div>
          </div>
        </div>
      </VideoStreamContainer>
    </>
  );
};

export default GalleryVideoPlayer;
