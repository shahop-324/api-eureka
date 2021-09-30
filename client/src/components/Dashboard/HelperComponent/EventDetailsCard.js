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
}) => {
  const dispatch = useDispatch();
  const eventId = id;
  console.log(eventId);

  const params = useParams();
  const userId = params.userId;
  const email = useSelector((state) => state.user.userDetails.email);
  console.log(userId);

  return (
    <>
      <div className="events-field-value-container">
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
              <Link
                to={`/user/${userId}/community/${communityId}/event/${eventId}/analytics`}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <div className="event-name-d" style={{ fontFamily: "Inter" }}>
                  {eventName}
                </div>
              </Link>
              <Link
                to={`/user/${userId}/community/${communityId}/event/${eventId}/pre-analytics`}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <div
                  className="event-short-description-d"
                  style={{ fontFamily: "Inter" }}
                >
                  {shortDescription}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="event-visibility-field">
          <div
            className="event-field-label field-label-value"
            style={{ fontFamily: "Inter" }}
          >
            {visibility}
          </div>
        </div>
        <div className="event-status-field">
          <div className="event-field-label field-label-value">
            <div className="chip-container">
              <div className="chip-text" style={{ fontFamily: "Inter" }}>
                {publishedStatus}
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
          <div className="d-flex flex-row mb-3">
            {status === "active" ? (
              <div
                className="d-flex flex-row align-items-center event-field-label field-label-value"
                style={{ color: "#75BF72", fontFamily: "Inter" }}
              >
                <Ripple /> Active{" "}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  color: "#D64329",
                }}
              >
                Inactive
              </div>
            )}
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
                  // disabled
                  onClick={() => {
                    dispatch(
                      generateEventAccessToken(
                        userId,
                        email,
                        "host",
                        eventId,
                        communityId
                      )
                    );
                  }}
                  className="btn btn-primary event-field-label py-2"
                  style={{ color: "#ffffff" }}
                >
                  Visit
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
