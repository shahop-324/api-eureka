import React from "react";
import Faker from "faker";
import Divider from "@material-ui/core/Divider";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Ripple from "./../../ActiveStatusRipple";
import "./../../../assets/Sass/DataGrid.scss";
import history from "../../../history";
import {
  fetchParticularEventOfCommunity,
  generateEventAccessToken,
} from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// import { useDispatch } from "react-redux";
// import { fetchParticularEventOfCommunity } from "../../../actions";
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
  //  const handleEventEditClick = () => {

  //   dispatch(fetchParticularEventOfCommunity(communityId,id))

  // // //  // history.push(`/community/edit-event/${id}/basics`);

  //  };

  return (
    <>
      <div className="events-field-value-container">
        <div className="event-edit-field">
          <Link
            className="event-field-label event-edit-icon ms-3"
            to={`/community/${communityId}/edit-event/${id}/basics`}
          >
            <EditRoundedIcon />
          </Link>
        </div>

        <div className="event-card-field">
          <div
            className="event-field-label field-label-value event-name-short-description-card"
            style={{ width: "100%" }}
          >
            {/* /user/:userId/community/:communityId/event/:eventId */}
            {/* <Link to={`/user/${userId}/community/${communityId}/event/${eventId}`} style={{width: "100%"}}> 
            </Link> */}

            <img
              src={imgUrl}
              alt="event-poster"
              style={{ width: "41%", height: "110px", borderRadius: "2px" }}
            />
            <div className="event-name-and-description-wrapper">
              <Link
                to={`/user/${userId}/community/${communityId}/event/${eventId}/pre-analytics`}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <div className="event-name-d">{eventName}</div>
              </Link>
              <Link
                to={`/user/${userId}/community/${communityId}/event/${eventId}/pre-analytics`}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <div className="event-short-description-d">
                  {shortDescription}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="event-visibility-field">
          <div className="event-field-label field-label-value">
            {visibility}
          </div>
        </div>
        <div className="event-status-field">
          <div className="event-field-label field-label-value">
            <div className="chip-container">
              <div className="chip-text">{publishedStatus}</div>
            </div>
          </div>
        </div>
        <div className="event-views-field">
          <div className="event-field-label field-label-value">{views}</div>
        </div>
        <div className="event-registrations-field">
          <div className="event-field-label field-label-value">
            {registrations}
          </div>
        </div>
        <div className="event-running-status-field">
          <div className="d-flex flex-row mb-3">
            {status === "active" ? (
              <div
                className="d-flex flex-row align-items-center event-field-label field-label-value"
                style={{ color: "#75BF72" }}
              >
                <Ripple /> Active{" "}
              </div>
            ) : (
              <div>Inactive</div>
            )}
          </div>
        </div>
        <div className="event-stage-field">
          <div className="event-field-label field-label-value">
            <div className="visit-stage-button">
              <Link
                to={`/community/${communityId}/event/${eventId}/hosting-platform/lobby`}
              >
                <button
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
                  className="btn btn-primary event-field-label"
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
