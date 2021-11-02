/* eslint-disable no-unused-vars */
import React from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Link } from "react-router-dom";
import "./../assets/css/CardStyle.scss";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavouriteEvents,
  fetchEvent,
  removeFromFavouriteEvents,
} from "../actions";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";
import Fab from "@material-ui/core/Fab";
import FavoriteIcon from "@material-ui/icons/Favorite";
import history from "./../history";

const SpeakersHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
  font-size: 0.8rem;
`;

const RatingPaper = styled.div`
  background-color: #152d35 !important;
`;

const renderSpeakers = (speakers) => {
  if (!speakers) return;
  return speakers.map((speaker) => {
    return (
      <Avatar
        alt={speaker.name}
        src={
          speaker.image.startsWith("https://")
            ? speaker.image
            : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`
        }
      />
    );
  });
};

const EventCard = ({
  showSpeakers,
  image,
  id,
  eventName,
  minPrice,
  maxPrice,
  showBtn,
  communityId,
  rating,
  startTime,
  isFavourite,
  speakers,
  magic_link,
}) => {
  const dispatch = useDispatch();
  const showLiked = isFavourite;

  console.log(showBtn);
  const displayJoinBtn = showBtn ? "block" : "none";
  return (
    <div className="event-card-main">
      <div
        className="event-card-img-container"
        style={{ position: "relative" }}
      >
        <Link
          onClick={() => dispatch(fetchEvent(id))}
          to={`/event-landing-page/${id}/${communityId}`}
        >
          <img src={image} className="poster-img" alt="event-poster" style={{maxHeight: "200px"}} />
        </Link>
      </div>
      <div className="event-card-text-info d-flex flex-column justfy-content-between px-4 py-4">
        <div className="event-card-name-main mb-3">
          {" "}
          <Link
            onClick={() => dispatch(fetchEvent(id))}
            to={`/event-Landing-page/${id}/${communityId}`}
            style={{
              textTransform: "capitalize",
              textDecoration: "none",
              color: "#353535",
              fontWeight: "600",
              fontFamily: "ubuntu",
              fontSize: "1rem",
            }}
          >
            {eventName}
          </Link>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div
            className="event-card-date-main mb-3"
            style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1b2653" }}
          >
            {startTime} <span style={{ fontWeight: "600" }}></span>
          </div>

          {/* // TODO Show event speakers here */}

          {!displayJoinBtn ? (
            <RatingPaper
              className="rating-indicator d-flex flex-row align-items-center ps-1 pe-2 py-2"
              style={{ fontSize: "0.8rem" }}
            >
              <StarRateRoundedIcon
                style={{ fontSize: "1rem" }}
                className="me-1"
              />
              {rating.toFixed(1)}
            </RatingPaper>
          ) : (
            <></>
          )}
        </div>

        {showSpeakers &&
        typeof speakers !== "undefined" &&
        speakers.length > 0 ? (
          <div className="d-flex flex-column align-items-start justify-content-start mb-3">
            <SpeakersHeading style={{ textAlign: "left" }} className="mb-3">
              Speakers
            </SpeakersHeading>
            <AvatarGroup max={4}>{renderSpeakers(speakers)}</AvatarGroup>
          </div>
        ) : (
          <></>
        )}

        <div
          className="event-card-price-main mb-2"
          style={{ fontWeight: "600", fontSize: "0.9rem" }}
        >
          {console.log(minPrice)}
          {minPrice && `$ ${minPrice} - `} Upto ${maxPrice}
        </div>
        <div className="d-flex flex-row justify-content-end align-items-center">
          <a href={`${magic_link}`} target="_blank" rel="noreferrer">
            <button
              type="button"
              className="btn btn-outline-primary btn-outline-text"
              style={{
                display: displayJoinBtn,
                textDecoration: "none !important",
              }}
            >
              Join Event
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
