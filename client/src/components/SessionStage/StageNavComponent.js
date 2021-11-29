import React, { useState } from "react";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded"; // Watching group
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded"; // Live stream
import styled from "styled-components";
import Chip from "@mui/material/Chip";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import ConfirmEnd from "./LifecycleSwitch/ConfirmEnd";

import CircleIcon from "@mui/icons-material/Circle";

import {
  BrandLogo,
  ChipModified,
  SessionName,
  PeopleWatching,
  StageNav,
} from "./Elements";

import { useSelector } from "react-redux";
import α from "color-alpha";

const BtnOutlined = styled.div`
  padding: 5px 8px;

  border: 1px solid
    ${(props) =>
      props && props.color
        ? `1px solid ${α(props.color, 0.5)}`
        : "1px solid #1f545e"};

  background-color: ${(props) =>
    props && props.color ? α(props.color, 0.5) : "#1f545e"};

  color: #ffffff;

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
    background-color: transparent;
    color: #ffffff;
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

const StageNavComponent = ({ runningStatus, canPublishStream }) => {
  // NOTICE : State can be live, back or ended
  // Hosts and speakers can go to backstage anytime they want by clicking on switch to backstage button and come back to live stage if the session is in running state
  const [openConfirmEnd, setOpenConfirmEnd] = useState(false);

  const handleCloseConfirmEnd = () => {
    setOpenConfirmEnd(false);
  };

  let currentUserIsAHost = false;

  const { sessionDetails } = useSelector((state) => state.session);
  const { eventDetails } = useSelector((state) => state.event);

  const status = sessionDetails
    ? sessionDetails.runningStatus
    : "Not Yet Started";

  const streamingLive = sessionDetails.streamingLive;

  // Show live tag only if its in resumed or started state => handled

  // Show mid control live stage or backstage only when canPublishStream => handled

  // TODO Host access needs to be restricted (who can start, pause, resume or end session)

  // Show number of users watching only if its in live state

  // Show rss feed icon only when session is streamed live to other destinations

  // ! Determine if the current user is a host and place restrictions based on that
  //if the userCanPublishStream => then determine if he / she is host speaker or   attendee
  // We won't allow attendee on stage to visit backstage => only host and speakers can visit backstage.

  const { role, sessionRole } = useSelector((state) => state.eventAccessToken);

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  let hostIds = sessionDetails.host.map((el) => el._id);

  if (sessionRole === "host" && hostIds.includes(userId)) {
    currentUserIsAHost = true;
  }

  return (
    <>
      <StageNav color={eventDetails.color} className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BrandLogo className="me-3">
            <img
              src={
                eventDetails
                  ? eventDetails.createdBy
                    ? `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${eventDetails.createdBy.image}`
                    : ""
                  : ""
              }
              alt={
                eventDetails
                  ? eventDetails.createdBy
                    ? eventDetails.createdBy.name
                    : ""
                  : ""
              }
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </BrandLogo>
          <SessionName className="me-3">{sessionDetails.name}</SessionName>

          {(() => {
            switch (status) {
              case "In Progress":
                return <ChipModified>Live</ChipModified>;

              case "Ended":
                return (
                  <Chip
                    label="Ended"
                    color="warning"
                    style={{ fontWeight: "500" }}
                  />
                );

              default:
                return <ChipModified>Live</ChipModified>;
            }
          })()}
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          {currentUserIsAHost ? (
            (() => {
              switch (status) {
                case "In Progress":
                  return (
                    <BtnOutlined
                      color={eventDetails.color}
                      onClick={() => {
                        setOpenConfirmEnd(true);
                      }}
                      className="me-3"
                    >
                      <CircleRoundedIcon
                        className="me-2"
                        style={{ fontSize: "20px", color: "red" }}
                      />
                      End Session
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
          {status !== "Ended" ? (
            <>
              <PeopleWatching className="me-3">
                <PeopleOutlineRoundedIcon className="me-2" />
                {sessionDetails.people
                  ? `${sessionDetails.people.length} watching`
                  : `0 watching`}
                {/* This will be the total number of active users in this session currently */}
              </PeopleWatching>
              {sessionDetails.recording && (
                <Chip
                  className="ms-3"
                  icon={<CircleIcon style={{ color: "#CA3B3B" }} />}
                  label="REC"
                  variant="outlined"
                  style={{ color: "red", border: "1px solid red" }}
                />
              )}
            </>
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

      <ConfirmEnd open={openConfirmEnd} handleClose={handleCloseConfirmEnd} />
    </>
  );
};

export default StageNavComponent;
