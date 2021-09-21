import React, { useState } from "react";
import "./../Styles/sessionStreaming.scss";
import { useSelector } from "react-redux";

import {
  UserRoleTag,
  VideoStreamContainer,
  IconButton,
  PersonInfoPopUp,
  PersonName,
  ViewCompleteProfileBtn,
  PersonOrgDesignation,
} from "../../SessionStage/Elements";

import Avatar from "@mui/material/Avatar";

import styled from "styled-components";

import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";

import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";

import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon

import { Popup } from "semantic-ui-react";
import PersonProfile from "../PersonProfile";

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
  const [open, setOpen] = useState(false);

  const handleCloseProfile = () => {
    setOpen(false);
  };

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
          <div id={`avatar_box_${localPlayerId}`} className="avatar_box">
            {!videoIsEnabled && (
              <Avatar
                variant="rounded"
                src={userImage}
                alt={userName}
                style={{ backgroundColor: "#538BF7" }}
                // sx={{ width: "72px", height: "72px" }}
              />
            )}
          </div>
          <Popup
            hoverable={true}
            content={
              <PersonInfoPopUp>
                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns: "0.75fr 4fr 1fr",
                    gridGap: "16px",
                  }}
                  className="mb-3"
                >
                  <Avatar
                    src={userImage}
                    alt={userName}
                    variant="rounded"
                    className="me-3"
                  />
                  <div>
                    <PersonName className="mb-1">{userName}</PersonName>
                    <PersonOrgDesignation>{`${userDesignation}, ${userOrganisation}`}</PersonOrgDesignation>
                  </div>

                  <UserRoleTag>{role}</UserRoleTag>
                  <div></div>

                  <div className="d-flex flex-row align-items-center">
                    <IconButton className="me-3">
                      <VideocamRoundedIcon
                        style={{ fontSize: "16px", color: "green" }}
                      />
                    </IconButton>
                    <IconButton className="me-3">
                      <MicNoneRoundedIcon
                        style={{ fontSize: "16px", color: "green" }}
                      />
                    </IconButton>
                    <IconButton className="me-3">
                      <ScreenShareRoundedIcon
                        style={{ fontSize: "16px", color: "green" }}
                      />
                    </IconButton>
                  </div>
                </div>

                <div>
                  <ViewCompleteProfileBtn
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    View complete profile
                  </ViewCompleteProfileBtn>
                </div>
              </PersonInfoPopUp>
            }
            trigger={
              <div
                id={`user_identity_${localPlayerId}`}
                className="user-identity"
              >
                <div
                  className="d-flex flex-row align-items-center"
                  style={{ color: "#F7F453" }}
                >
                  <div className="me-2"> {userName + " " + roleSuffix} </div>
                  {audioIsEnabled ? (
                    showWave ? (
                      <SoundWaveAnimation />
                    ) : (
                      <StillSoundWave />
                    )
                  ) : (
                    <MicOffOutlinedIcon style={{ color: "#DA1E1E" }} />
                  )}
                </div>
              </div>
            }
          />
        </div>
      </VideoStreamContainer>
      <PersonProfile
        open={open}
        handleClose={handleCloseProfile}
        userImage={userImage}
        userName={userName}
        userOrganisation={userOrganisation}
        userDesignation={userDesignation}
      />
    </>
  );
};

export default GalleryVideoPlayer;