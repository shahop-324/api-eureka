import React, { useEffect } from "react";
// import EventCard from "../EventCard";
import { useSelector, useDispatch } from "react-redux";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";
import { errorTrackerForMadeJustForYou, madeJustForYou } from "../../actions";
import dateFormat from "dateformat";
import Loader from "../Loader";
import { useSnackbar } from "notistack";

import {
  DashboardSectionHeading,
  EventCardsGrid,
  EventCardWrapper,
  EventCardImg,
  EventCardEventName,
  EventCardEventTimeLine,
  EventCardEventPriceRange,
} from "./Elements";

import Fab from "@material-ui/core/Fab";
import FavoriteIcon from "@material-ui/icons/Favorite";

const EventCard = () => {
  return (
    <>
      <EventCardWrapper>
        <div className="favourite-icon">
          <Fab
            aria-label="like"
            style={{
              position: "absolute",
              right: "10px",
              top: "90px",
              zIndex: "90",
            }}
            size="small"
          >
            <FavoriteIcon className="favourite-icon" />
          </Fab>
        </div>
        <EventCardImg
          src={
            "https://images.unsplash.com/photo-1511578314322-379afb476865?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZXZlbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
          }
        ></EventCardImg>
        <div className="px-3 py-3">
          <EventCardEventName className="mb-4">
            Secure sites using ssl
          </EventCardEventName>
          <EventCardEventTimeLine className="mb-4">
            10 Feb 2021 - 12 Mar 2022
          </EventCardEventTimeLine>
          <EventCardEventPriceRange>$10.0 to $100.00</EventCardEventPriceRange>
        </div>
      </EventCardWrapper>
    </>
  );
};

const UserAccountEventsMainBody = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(madeJustForYou());
  // }, [dispatch]);
  // const { events, isLoading, error } = useSelector((state) => state.event);
  // console.log(events);

  // if (error) {
  //   enqueueSnackbar(error, {
  //     variant: "error",
  //   });
  //   return dispatch(errorTrackerForMadeJustForYou());
  // }

  const renderSuggestedEventsList = (events) => {
    if (events.length !== 0) {
      return events.map((event) => {
        const now = new Date(event.startDate);
        const formatedDate = dateFormat(now, "mmm dS, h:MM TT");

        const end = new Date(event.endDate);
        const formatedEndDate = dateFormat(end, "mmm dS, h:MM TT");

        const startTime = dateFormat(event.startTime, "mmm dS, h:MM TT");
        const endTime = dateFormat(event.endTime, "mmm dS, h:MM TT");

        return (
          <EventCard
            image={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.image}`}
            date={formatedDate}
            id={event.id}
            eventName={event.eventName}
            minPrice={event.minTicketPrice}
            maxPrice={event.maxTicketPrice}
            endDate={formatedEndDate}
            startTime={startTime}
            endTime={endTime}
            rating={(event.communityRating * 1).toFixed(1)}
            communityId={
              typeof event.createdBy === String
                ? event.createdBy
                : event.createdBy.id
            }
          />
        );
      });
    }
  };

  return (
    <div
      className="user-account-main-body-home-content"
      style={{ height: "100%" }}
    >
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "100%" }}
      >
        <DashboardSectionHeading className="pb-4 ps-4">
          Exclusive events for you
        </DashboardSectionHeading>
        <div
          style={{ height: "100%" }}
          // className="d-flex flex-row justify-content-center align-items-center"
        >
          {/* {typeof events !== "undefined" && events.length > 0 ? (
            <div className="user-account-events-event-card-grid px-2 py-2">
              {isLoading ? (
                <div
                  className="d-flex flex-row align-items-center justify-content-center"
                  style={{ height: "100%", width: "80vw" }}
                >
                  <Loader />
                </div>
              ) : (
                renderSuggestedEventsList(events)
              )}
            </div>
          ) : (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100%" }}
            >
              <YouHaveNoEventComing
                msgText="Looks like there are no great matches for you"
                style={{ maxWidth: "400px" }}
              />
            </div>
          )} */}

          <EventCardsGrid>
            <EventCard></EventCard>
            <EventCard></EventCard>
            <EventCard></EventCard>
            <EventCard></EventCard> <EventCard></EventCard>{" "}
            <EventCard></EventCard> <EventCard></EventCard>
          </EventCardsGrid>
        </div>
      </div>
    </div>
  );
};

export default UserAccountEventsMainBody;
