/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./../../../index.css";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import dateFormat from "dateformat";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getRTCTokenAndSession,
  setSessionRoleAndJoinSession,
} from "../../../actions";

import styled from "styled-components";
import Chip from "@mui/material/Chip";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import SetReminder from "./../Screens/Sub/SetReminder";
import SetPriority from "./../Screens/Sub/SetPriority";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const SessionDetailCardBody = styled.div`
  background-color: #152d35;
`;

const ThemedBackgroundButton = styled.div`
  background-color: #152d35;
  text-decoration: none !important;
`;

const ThemedText = styled.div`
  color: #152d35 !important;
  font-family: "Ubuntu";
`;

const SessionSpeakerCard = ({ name, headline, image }) => {
  const classes = useStyles();
  return (
    <div className="session-speaker-card d-flex flex-row align-items-center px-4 py-3">
      <Avatar
        alt={name}
        src={image}
        className={classes.large}
        variant="rounded"
      />
      <div className="mx-3">
        <div className="speaker-card-name-h">{name}</div>
        <div className="speaker-card-about-h">{headline}</div>
      </div>
    </div>
  );
};

const renderSpeakerList = (speakers) => {
  return speakers.map((speaker) => {
    return (
      <SessionSpeakerCard
        image={
          speaker.image &&
          speaker.image.startsWith("https://")
            ? speaker.image
            : `https://bluemeet.s3.us-west-1.amazonaws.com/${speaker.image}`
        }
        name={`${speaker.firstName} ${speaker.lastName}`}
        headline={speaker.headline}
      />
    );
  });
};

const SessionDetailCard = ({
  id,
  socket,
  name,
  description,
  startTime,
  duration,
  speakers,
  hosts,
}) => {
  const [openPriority, setOpenPriority] = useState(false);

  const [openReminder, setOpenReminder] = useState(false);

  const handleClosePriority = () => {
    setOpenPriority(false);
  };

  const handleCloseReminder = () => {
    setOpenReminder(false);
  };

  const dispatch = useDispatch();

  const params = useParams();
  console.log(params);

  const eventId = params.eventId;
  const communityId = params.communityId;
  const role = useSelector((state) => state.eventAccessToken.role);
  const userId = useSelector((state) => state.eventAccessToken.id);

  const userDetails = useSelector((state) => state.user.userDetails);

  const { email } = useSelector((state) => state.eventAccessToken);

  const userName = `${userDetails.firstName} ${userDetails.lastName}`;

  const userImage = userDetails.image ? userDetails.image : " ";
  const userCity = userDetails.city ? userDetails.city : "Los Angeles";
  const userCountry = userDetails.country ? userDetails.country : "USA";
  const userOrganisation = userDetails.organisation
    ? userDetails.organisation
    : "Google Inc.";
  const userDesignation = userDetails.designation
    ? userDetails.designation
    : "Vice President";

  const speaker = useSelector((state) => {
    return state.speaker.speakers.find((speaker) => {
      return speaker.id === userId;
    });
  });

  const speakerDetails = useSelector((state) => state.speaker.speakerDetails);

  const day = dateFormat(new Date(startTime), "ddd");
  const date = dateFormat(new Date(startTime), "dS mmm");
  const time = dateFormat(new Date(startTime), "h:MM TT");

  let sessionRole;
  let btnText = "Join";
  let bgColor = "#538BF7d8";

  if (role === "audience") {
    sessionRole = "audience";
  } else if (role === "host") {
    // Check if he's a host for this session or not
    if (hosts.includes(userId)) {
      sessionRole = "host";
    } else {
      sessionRole = "organiser";
    }
    // sessionRole = "host";
  } else if (role === "moderator") {
    // Check if he's a host in this session
    if (hosts.includes(userId)) {
      sessionRole = "host";
    } else {
      sessionRole = "organiser";
    }
  }
  if (role === "organiser") {
    sessionRole = "organiser"; // We are sure that organiser is the one who is in community team but not host in any session and not a moderator as well.
  } else if (role === "speaker") {
    const bool = speakers.includes(userId); // Flag which indicates if this speaker is a speaker in this session or not
    if (bool) {
      sessionRole = "host";
    } else {
      sessionRole = "speaker";
    }
  }

  if (sessionRole === "host") {
    btnText = "Backstage";
    bgColor = "#538BF7";
  }

  let roleToBeDisplayed = role;

  if (role === "audience") {
    roleToBeDisplayed = "audience";
  } else if (role === "speaker") {
    roleToBeDisplayed = "speaker";
  } else if (sessionRole === "host") {
    roleToBeDisplayed = "host";
  } else {
    roleToBeDisplayed = "organiser";
  }

  return (
    <>
      <div className="session-detail-card mb-3 px-4 py-5">
        <div>
          <div className="session-date-day-time d-flex flex-column align-items-center">
            <div className="session-day mb-2 px-3 pt-3">{day}</div>
            <div className="session-date mb-2 px-3">{date}</div>

            <ThemedText className="session-time px-3 pb-3">{time}</ThemedText>
          </div>
        </div>
        <div className="session-title-short-description-duration-and-speakers d-flex flex-column">
          <div className="d-flex flex-row align-items-center">
            <div className="session-title mb-3 me-3">{name}</div>

            <Chip
              className="mb-3"
              icon={<AddCircleOutlineRoundedIcon />}
              label="Set priority"
              variant="outlined"
              onClick={() => {
                setOpenPriority(true);
              }}
            />
          </div>

          <div className="session-running-status-container px-2 py-2 mb-3">
            <div className="session-running-status">Upcoming</div>
          </div>

          <div className="session-short-description mb-3">{description}</div>

          <div className="session-speakers-list-grid">
            {renderSpeakerList(speakers)}
          </div>
        </div>

        <div
          className={`d-flex flex-row justify-content-end align-items-start`}
        >
          <div className="d-flex flex-row justify-content-end align-items-center">
            <IconButton
              onClick={() => {
                setOpenReminder(true);
              }}
              aria-label="notification"
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
            <Link
              onClick={() => {
                // Get a RTC token
                dispatch(getRTCTokenAndSession(id, sessionRole, eventId, communityId));

                // Join session channel

                
                

                socket.emit(
                  "joinSession",
                  {
                    sessionId: id,
                    userId: userId,
                    sessionRole: sessionRole,
                    userName: userName,
                    userEmail: email,
                    userImage: userImage,
                    userCity: userCity,
                    userCountry: userCountry,
                    userOrganisation: userOrganisation,
                    userDesignation: userDesignation,
                    roleToBeDisplayed: roleToBeDisplayed,
                  },
                  (error) => {
                    if (error) {
                      alert(error);
                    }
                  }
                );

                dispatch(
                  setSessionRoleAndJoinSession(
                    sessionRole,
                    id,
                    eventId,
                    communityId
                  )
                );
              }}
              style={{ textDecoration: "none" }}
            >
              <ThemedBackgroundButton className="btn-filled-h px-4 py-3 ms-3 join-session-btn">
                {btnText}
              </ThemedBackgroundButton>
            </Link>
          </div>
        </div>
      </div>

      <SetReminder open={openReminder} handleClose={handleCloseReminder} />

      <SetPriority open={openPriority} handleClose={handleClosePriority} />
    </>
  );
};

export default SessionDetailCard;
