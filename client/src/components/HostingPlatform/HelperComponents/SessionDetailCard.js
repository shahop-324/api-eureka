import React from "react";
import "./../../../index.css";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";
import dateFormat from "dateformat";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setSessionRoleAndJoinSession } from "../../../actions";

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

const SessionSpeakerCard = ({ name, headline }) => {
  const classes = useStyles();
  return (
    <div className="session-speaker-card d-flex flex-row align-items-center px-4 py-3">
      <Avatar
        alt="Travis Howard"
        src={Faker.image.avatar()}
        className={classes.large}
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
}) => {
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

  const day = dateFormat(new Date(startTime), "ddd");
  const date = dateFormat(new Date(startTime), "dS mmm");
  const time = dateFormat(new Date(startTime), "h:MM TT");

  let sessionRole;
  let btnText = "Join";
  let bgColor = "#538BF7d8";

  if (role === "audience") {
    sessionRole = "audience";
  } else if (role === "host") {
    sessionRole = "host";
  } else if (role === "speaker") {
    const bool = speaker.sessions.includes(id);
    if (bool) {
      sessionRole = "speaker";
    } else {
      sessionRole = "attendee";
    }
  }

  if (sessionRole === "speaker" || sessionRole === "host") {
    btnText = "Backstage";
    bgColor = "#538BF7";
  }

  return (
    <>
      <div className="session-detail-card mb-3 px-4 py-5">
        <div>
          <div className="session-date-day-time d-flex flex-column align-items-center">
            <div className="session-day mb-2 px-3 pt-3">{day}</div>
            <div className="session-date mb-2 px-3">{date}</div>

            <div className="session-time px-3 pb-3">{time}</div>
          </div>
        </div>
        <div className="session-title-short-description-duration-and-speakers d-flex flex-column">
          <div className="session-title mb-3">{name}</div>
          <div className="session-duration px-5 py-3 mb-3">30 Min</div>

          <div className="session-short-description mb-3">{description}</div>

          <div className="session-speakers-list-grid">
            {renderSpeakerList(speakers)}
          </div>
        </div>

        <div
          className={`d-flex flex-row justify-content-end align-items-start`}
        >
          <div className="d-flex flex-row justify-content-end align-items-center">
            <IconButton aria-label="notification">
              <NotificationsNoneOutlinedIcon />
            </IconButton>
            <Link
              to={`/community/${communityId}/event/${eventId}/hosting-platform/session/${id}`}
              onClick={() => {
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
              className="btn-filled-h px-4 py-3 ms-3 join-session-btn"
              style={{ backgroundColor: bgColor }}
            >
              {btnText}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionDetailCard;