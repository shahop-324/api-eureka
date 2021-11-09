/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
          speaker.image && speaker.image.startsWith("https://")
            ? speaker.image
            : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`
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
  runningStatus,
}) => {
  const [openPriority, setOpenPriority] = useState(false);

  const [openReminder, setOpenReminder] = useState(false);
  const [channel, setChannel] = useState(`${id}-live`);

  const userEmail = useSelector((state) => state.user.userDetails.email);

  const speakerEmails = speakers.map((element) => element.email);

  const handleClosePriority = () => {
    setOpenPriority(false);
  };

  const handleCloseReminder = () => {
    setOpenReminder(false);
  };

  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;
  const communityId = params.communityId;
  const role = useSelector((state) => state.eventAccessToken.role);
  const userId = useSelector((state) => state.eventAccessToken.id);

  const userDetails = useSelector((state) => state.user.userDetails);

  const { email } = useSelector((state) => state.eventAccessToken);

  const userName = `${userDetails.firstName} ${userDetails.lastName}`;

  const userImage = userDetails.image;
  const userCity = userDetails.city;
  const userCountry = userDetails.country;
  const userOrganisation = userDetails.organisation;
  const userDesignation = userDetails.designation;

  const day = dateFormat(new Date(startTime), "ddd");
  const date = dateFormat(new Date(startTime), "dS mmm");
  const time = dateFormat(new Date(startTime), "h:MM TT");

  let sessionRole;
  let btnText = "Join";
  let bgColor = "#538BF7d8";

  if (role === "host" || role === "speaker") {
    if (hosts.includes(userId) || speakerEmails.includes(userEmail)) {
      // Set role as host for this session
      sessionRole = "host";
      // alert('This is case 11')
    } else {
      sessionRole = "audience";
      // alert('This is case 12')
    }
  } else {
    sessionRole = "audience";
    // alert('This is case 21')
  }

  if (role === "host") {
    sessionRole = "host";
  }

  if (sessionRole === "host") {
    btnText = "Backstage";
    bgColor = "#538BF7";
  }

  const agoraRole = sessionRole === "host" ? "host" : "audience";

  useEffect(() => {
    if (agoraRole === "host") {
      if (runningStatus === "Started" || runningStatus === "Resumed") {
        // alert(1)
        // Session is live
        setChannel(`${id}-live`);
      }
      if (runningStatus === "Paused" || runningStatus === "Not Yet Started") {
        // Session is not live
        setChannel(`${id}-back`);
        // alert(2)
      }
      if (runningStatus === "Ended") {
        // Session has already ended
        // No channel will be needed in this case as user won't join any agora channel here
        // alert(3)
      }
    } else {
      if (runningStatus !== "Ended") {
        // take to live stage
        setChannel(`${id}-live`);
        // alert(4)
      }
      if (runningStatus === "Ended") {
        // No channel will be needed in this case as user won't join any agora channel here
        // alert(5)
      }
    }
  }, []);

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
            <div
              onClick={() => {
                // Get a RTC token

                // alert(channel)
                dispatch(
                  getRTCTokenAndSession(
                    id,
                    channel,
                    sessionRole,
                    eventId,
                    communityId
                  )
                );

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
                    roleToBeDisplayed: role,
                  },
                  (error) => {
                    if (error) {
                      alert(error);
                    }
                  }
                );

                dispatch(setSessionRoleAndJoinSession(sessionRole));
              }}
              style={{ textDecoration: "none" }}
            >
              <ThemedBackgroundButton className="btn-filled-h px-4 py-3 ms-3 join-session-btn">
                {btnText}
              </ThemedBackgroundButton>
            </div>
          </div>
        </div>
      </div>

      <SetReminder open={openReminder} handleClose={handleCloseReminder} />

      <SetPriority open={openPriority} handleClose={handleClosePriority} />
    </>
  );
};

export default SessionDetailCard;
