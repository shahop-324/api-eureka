import React from "react";

import Divider from "@material-ui/core/Divider";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Ripple from "./../../ActiveStatusRipple";
import "./../../../assets/Sass/DataGrid.scss";

import { fetchEvent, generateEventAccessToken } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Chip from "@mui/material/Chip";

const EventDetailCard = ({
  id,
  imgUrl,
  shortDescription,
  publishedStatus,
  views,
  registrations,
  status,
  visibility,
  eventName,
  communityId,
  moderators, // ids of moderators
  hosts, // ids of hosts
}) => {
  let role = "organiser"; // default role is organiser
  const dispatch = useDispatch();
  const eventId = id;

  const params = useParams();
  const userId = params.userId;
  const email = useSelector((state) => state.user.userDetails.email);

  // Check if the entering person is a host/ moderator / organiser

  if (moderators) {
    if (moderators.includes(userId)) {
      role = "moderator";
    }
  }

  if (hosts) {
    if (hosts.includes(userId)) {
      role = "host";
    }
  }

  return (
    <>
      <div
        className="events-field-value-container"
        style={{ alignItems: "center" }}
      >
        <div className="event-edit-field me-2">
          <Link
            className="event-field-label event-edit-icon "
            to={`/community/${communityId}/edit-event/${id}/event-overview`}
          >
            <IconButton>
              <EditRoundedIcon />
            </IconButton>
          </Link>
        </div>

        <div className="event-card-field">
          <div
            className="event-field-label field-label-value event-name-short-description-card"
            style={{ width: "100%" }}
          >
            <img
              src={imgUrl}
              alt="event-poster"
              style={{ width: "41%", height: "110px", borderRadius: "3px" }}
            />
            <div className="event-name-and-description-wrapper">
              <div style={{ width: "100%", textDecoration: "none" }}>
                <div className="event-name-d" style={{ fontFamily: "Inter" }}>
                  {eventName}
                </div>
              </div>
              <div style={{ width: "100%", textDecoration: "none" }}>
                <div
                  className="event-short-description-d"
                  style={{ fontFamily: "Inter" }}
                >
                  {shortDescription}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="event-visibility-field">
          <div
            className="event-field-label field-label-value"
            style={{ fontFamily: "Inter" }}
          >
            {(() => {
              switch (visibility) {
                case "Public":
                  return (
                    <Chip
                      label={visibility}
                      color="success"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );
                case "Private":
                  return (
                    <Chip
                      label={visibility}
                      color="warning"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );
                case "Hidden":
                  return (
                    <Chip
                      label={visibility}
                      color="error"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                default:
                  break;
              }
            })()}
          </div>
        </div>
        <div className="event-status-field">
          <div className="event-field-label field-label-value">
            <div className="chip-container">
              <div className="chip-text" style={{ fontFamily: "Inter" }}>
                {(() => {
                  switch (publishedStatus) {
                    case "Draft":
                      return (
                        <Chip
                          label={publishedStatus}
                          color="secondary"
                          style={{ fontWeight: "500" }}
                          variant="outlined"
                        />
                      );
                    case "Published":
                      return (
                        <Chip
                          label={publishedStatus}
                          color="success"
                          style={{ fontWeight: "500" }}
                          variant="outlined"
                        />
                      );

                    default:
                      break;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
        <div className="event-views-field">
          <div
            className="event-field-label field-label-value"
            style={{ fontFamily: "Inter" }}
          >
            {views}
          </div>
        </div>
        <div className="event-registrations-field">
          <div
            className="event-field-label field-label-value"
            style={{ fontFamily: "Inter" }}
          >
            {registrations}
          </div>
        </div>
        <div className="event-running-status-field">
          <div className="d-flex flex-row ">
            {(() => {
              switch (status) {
                case "Upcoming":
                  return (
                    <Chip
                      label={status}
                      color="warning"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                case "Started":
                  return (
                    <Chip
                      label={status}
                      color="success"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                case "Paused":
                  return (
                    <Chip
                      label={status}
                      color="primary"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                case "Resumed":
                  return (
                    <Chip
                      label={status}
                      color="secondary"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                case "Ended":
                  return (
                    <Chip
                      label={status}
                      color="error"
                      style={{ fontWeight: "500" }}
                      variant="outlined"
                    />
                  );

                default:
                  break;
              }
            })()}
          </div>
        </div>
        <div className="event-stage-field">
          <div className="event-field-label field-label-value">
            <div className="visit-stage-button">
              <Link
                onClick={() => {
                  dispatch(fetchEvent(eventId));
                }}
                to={`/compatibility-test/community/${communityId}/event/${eventId}/`}
              >
                <button
                  onClick={() => {
                    dispatch(
                      generateEventAccessToken(
                        userId,
                        email,
                        role, // organiser ||  moderator ||  host
                      )
                    );
                  }}
                  className="btn btn-outline-dark btn-outline-text event-field-label py-2"
                >
                  <VisibilityIcon
                    className="me-2"
                    style={{ fontSize: "18px" }}
                  />
                  Preview
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
    </>
  );
};

export default EventDetailCard;
