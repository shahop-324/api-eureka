import React, { useEffect, useState } from "react";
import socket from "./service/socket";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { Divider } from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

import {
  showSnackbar,
  createEventReview,
  signOut,
  toggleRatingWindow,
} from "./../../actions";

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #727272 !important;
  margin-bottom: 5px;
`;

const customIcons = {
  1: {
    icon: (
      <SentimentVeryDissatisfiedIcon
        style={{ fontSize: "32px" }}
        className="me-3"
      />
    ),
    label: "Very Dissatisfied",
  },
  2: {
    icon: (
      <SentimentDissatisfiedIcon
        style={{ fontSize: "32px" }}
        className="me-3"
      />
    ),
    label: "Dissatisfied",
  },
  3: {
    icon: (
      <SentimentSatisfiedIcon style={{ fontSize: "32px" }} className="me-3" />
    ),
    label: "Neutral",
  },
  4: {
    icon: (
      <SentimentSatisfiedAltIcon
        style={{ fontSize: "32px" }}
        className="me-3"
      />
    ),
    label: "Satisfied",
  },
  5: {
    icon: <SentimentVerySatisfiedIcon style={{ fontSize: "32px" }} />,
    label: "Very Satisfied",
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const RadioGroupRating = ({ handleChangeRating }) => {
  return (
    <Rating
      onChange={handleChangeRating}
      name="highlight-selected-only"
      defaultValue={4}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
    />
  );
};

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const ReviewContainer = styled.div`
  height: auto;
  width: 460px;
`;

const RatingComponent = ({ open, handleClose }) => {
  const [rating, setRating] = useState(4);
  const [reviewComment, setReviewComment] = useState(null);

  const { openRating } = useSelector((state) => state.event);

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  const dispatch = useDispatch();

  const theme = useTheme();
  const params = useParams();
  const eventId = params.eventId;
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [feedback, setFeedback] = useState(null);

  const handleChangeRating = (event, value) => {
    setRating(value);
  };

  const handleSubmitReview = () => {
    if (!rating) {
      dispatch(showSnackbar("info", "Please provide rating."));
      return;
    }
    if (!reviewComment) {
      dispatch(showSnackbar("info", "Please provide your feedback."));
      return;
    }
    dispatch(createEventReview({ rating, reviewComment }, eventId, userId));
    socket.emit("leaveEvent", { userId, eventId }, (error) => {
      console.log(error);
    });
    dispatch(toggleRatingWindow(false));
    window.location.href = `/user/home`;
  };

  const handleAskMeLater = () => {
    // Simply unsubscribe event and logout
    dispatch(toggleRatingWindow(false));
    socket.emit("leaveEvent", { userId, eventId }, (error) => {
      console.log(error);
    });
    dispatch(toggleRatingWindow(false));
    window.location.href = `/user/home`;
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openRating}
        aria-labelledby="responsive-dialog-title"
      >
        <>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 py-3">
            <div></div>
            <div className="coupon-overlay-form-headline">Your review</div>
          </HeaderFooter>
          <ReviewContainer className="px-4 py-3">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <RadioGroupRating
                handleChangeRating={handleChangeRating}
                className="mb-4"
              />
            </div>

            <div className="my-3">
              <Divider />
            </div>

            <FormLabel className="mb-2">Feedback</FormLabel>

            <textarea
              value={reviewComment}
              onChange={(e) => {
                setFeedback(e.target.value);
                setReviewComment(e.target.value);
              }}
              className="form-control mb-3"
              rows="3"
              placeholder="Please tell us about your event experience."
            />
            <div className="d-flex flex-row align-items-center justify-content-end">
              <button
                onClick={() => {
                  // Close dialog and logout user or take to user home
                  handleAskMeLater();
                  dispatch(toggleRatingWindow(false));
                }}
                className="btn btn-outline-dark btn-outline-text me-3"
              >
                Ask me later
              </button>
              <button
                onClick={() => {
                  // submit review and logout user or take to user home
                  handleSubmitReview();
                }}
                className="btn btn-primary btn-outline-text"
              >
                Submit
              </button>
            </div>
          </ReviewContainer>
        </>
      </Dialog>
    </>
  );
};

export default RatingComponent;
