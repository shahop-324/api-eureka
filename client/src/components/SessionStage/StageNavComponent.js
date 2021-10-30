import React, { useState, useEffect } from "react";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded"; // Pause
import StopRoundedIcon from "@material-ui/icons/StopRounded"; // Stop
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded"; // Watching group
import HomeRoundedIcon from "@material-ui/icons/HomeRounded"; // Live Stage
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded"; // Live stream
import styled from "styled-components";
import Chip from "@mui/material/Chip";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ConfirmStart from "./LifecycleSwitch/ConfirmStart";
import ConfirmPause from "./LifecycleSwitch/ConfirmPause";
import ConfirmResume from "./LifecycleSwitch/ConfirmResume";
import ConfirmEnd from "./LifecycleSwitch/ConfirmEnd";

import {
  BrandLogo,
  ChipModified,
  SessionName,
  PeopleWatching,
  StageNav,
} from "./Elements";

import { useSelector } from "react-redux";

const BtnFilled = styled.div`
  background-color: #345b63;
  padding: 5px 8px;

  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;
  color: #dcc7be;
  max-width: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid transparent;

  -webkit-border-radius: 46px;
  border-radius: 46px;

  &:hover {
    background-color: transparent;
    cursor: pointer;
    border: 1px solid #345b63;

    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 46px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
`;

const BtnOutlined = styled.div`
  padding: 5px 8px;
  background-color: transparent;
  border: 1px solid #345b63;

  color: #dcc7be;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: #1f545e;
    color: #ffffff;
  }
`;

const IconButton = styled.div`
  padding: 8px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;

  color: #152d35;

  &:hover {
    border: 1px solid #ffffff;
    background-color: transparent;
    color: #ffffff;
    cursor: pointer;
  }
`;

const IconButtonStatic = styled.div`
  padding: 8px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
`;

const StageNavComponent = ({ runningStatus, canPublishStream, state }) => {
  // NOTICE : State can be live, back or ended
  // Hosts and speakers can go to backstage anytime they want by clicking on switch to backstage button and come back to live stage if the session is in running state

  const [openConfirmStart, setOpenConfirmStart] = useState(false);
  const [openConfirmPause, setOpenConfirmPause] = useState(false);
  const [openConfirmResume, setOpenConfirmResume] = useState(false);
  const [openConfirmEnd, setOpenConfirmEnd] = useState(false);

  const handleCloseConfirmStart = () => {
    setOpenConfirmStart(false);
  };

  const handleCloseConfirmPause = () => {
    setOpenConfirmPause(false);
  };

  const handleCloseConfirmResume = () => {
    setOpenConfirmResume(false);
  };

  const handleCloseConfirmEnd = () => {
    setOpenConfirmEnd(false);
  };

  let sessionHasEnded = false;

  let currentUserIsAHost = false;
  let currentUserIsASpeaker = false;
  let currentUserIsAnAttendeeOnStage = false;
  let currentUserIsAnAttendee = false;

  const { userDetails } = useSelector((state) => state.user);

  const { sessionDetails } = useSelector((state) => state.session);

  const status = sessionDetails
    ? sessionDetails.runningStatus
    : "Not Yet Started";

  const streamingLive = sessionDetails.streamingLive;

  const img = userDetails.image
    ? userDetails.image.startsWith("https://")
      ? userDetails.image
      : `https://bluemeet.s3.us-west-1.amazonaws.com/${userDetails.image}`
    : "#";

  // Show live tag only if its in resumed or started state => handled

  // Show mid control live stage or backstage only when canPublishStream => handled

  // TODO Host access needs to be restricted (who can start, pause, resume or end session)

  // Show number of users watching only if its in live state

  // Show rss feed icon only when session is streamed live to other destinations

  // ! Determine if the current user is a host and place restrictions based on that
  //if the userCanPublishStream => then determine if he / she is host speaker or   attendee
  // We won't allow attendee on stage to visit backstage => only host and speakers can visit backstage.

  const userId = userDetails._id;
  const userEmail = userDetails.email;

  const hosts = sessionDetails.host; // Hosts for this session
  const speakers = sessionDetails.speaker; // Speakers for this session

  const hostIds = hosts.map((el) => el._id);
  const speakerEmails = speakers.map((el) => el.email);

  if (hostIds.includes(userId)) {
    //This user is a host
    currentUserIsAHost = true;
  } else if (speakerEmails.includes(userEmail)) {
    // This user is a speaker
    currentUserIsASpeaker = true;
  } else if (
    canPublishStream &&
    !hostIds.includes(userId) &&
    !speakerEmails.includes(userEmail)
  ) {
    // This user is an attendee invited on stage
    currentUserIsAnAttendeeOnStage = true;
  } else {
    currentUserIsAnAttendee = true;
  }

  if (runningStatus === "Ended") {
    sessionHasEnded = true;
  }

  return (
    <>
      <StageNav className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BrandLogo className="me-3" />
          <SessionName className="me-3">
            Annual Founder Q&A with community
          </SessionName>

          {(() => {
            switch (status) {
              case "Not Yet Started":
                return (
                  <Chip
                    label="Not yet started"
                    color="secondary"
                    style={{ fontWeight: "500" }}
                  />
                );

              case "Started":
                return <ChipModified>Live</ChipModified>;

              case "Resumed":
                return <ChipModified>Live</ChipModified>;

              case "Paused":
                return (
                  <Chip
                    label="Paused"
                    color="primary"
                    style={{ fontWeight: "500" }}
                  />
                );

              case "Ended":
                return (
                  <Chip
                    label="Ended"
                    color="warning"
                    style={{ fontWeight: "500" }}
                  />
                );

              default:
                break;
            }
          })()}
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          {currentUserIsAHost ? (
            (() => {
              switch (status) {
                case "Not Yet Started":
                  return (
                    <BtnOutlined
                      onClick={() => {
                        setOpenConfirmStart(true);
                      }}
                      className="me-3"
                    >
                      <CircleRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      Start session
                    </BtnOutlined>
                  );

                case "Paused":
                  return (
                    <BtnOutlined onClick={() => {
                      setOpenConfirmResume(true);
                    }} className="me-3">
                      <PlayArrowRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      Resume
                    </BtnOutlined>
                  );

                case "Started":
                  return (
                    <BtnOutlined onClick={() => {
                      setOpenConfirmPause(true);
                    }} className="me-3">
                      <PauseRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      Take break
                    </BtnOutlined>
                  );

                case "Resumed":
                  return (
                    <BtnOutlined onClick={() => {
                      setOpenConfirmPause(true);
                    }} className="me-3">
                      <PauseRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      Take break
                    </BtnOutlined>
                  );

                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}

          {canPublishStream &&
          (currentUserIsAHost || currentUserIsASpeaker) &&
          !sessionHasEnded ? (
            (() => {
              switch (state) {
                case "live":
                  return (
                    <BtnFilled className="me-3">
                      You are on Live stage
                    </BtnFilled>
                  );

                case "back":
                  return (
                    <BtnFilled className="me-3">You are on Backstage</BtnFilled>
                  );

                case "ended":
                  break;

                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}

          {currentUserIsAHost ? (
            (() => {
              switch (status) {
                case "Started":
                  return (
                    <BtnOutlined onClick={() => {
                      setOpenConfirmEnd(true);
                    }}>
                      <StopRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      End session
                    </BtnOutlined>
                  );

                case "Resumed":
                  return (
                    <BtnOutlined onClick={() => {
                      setOpenConfirmEnd(true);
                    }}>
                      <StopRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      />
                      End session
                    </BtnOutlined>
                  );

                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}
        </div>

        <div className="d-flex flex-row align-items-center justify-content-end">
          {status === "Started" || status === "Resumed" ? (
            <PeopleWatching>
              <PeopleOutlineRoundedIcon className="me-2" />
              2,340 watching
              {/* This will be the total number of active users in this session currently */}
            </PeopleWatching>
          ) : (
            <></>
          )}

          {/* // This streaming live variable will indicate if session is being live streamed */}

          {streamingLive ? (
            <IconButtonStatic className="ms-3">
              <RssFeedRoundedIcon style={{ color: "red" }} />
            </IconButtonStatic>
          ) : (
            <></>
          )}
        </div>
      </StageNav>
      <ConfirmStart
        open={openConfirmStart}
        handleClose={handleCloseConfirmStart}
      />
      <ConfirmPause
        open={openConfirmPause}
        handleClose={handleCloseConfirmPause}
      />
      <ConfirmResume
        open={openConfirmResume}
        handleClose={handleCloseConfirmResume}
      />
      <ConfirmEnd open={openConfirmEnd} handleClose={handleCloseConfirmEnd} />
    </>
  );
};

export default StageNavComponent;
