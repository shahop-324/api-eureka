import React, { useEffect } from "react";
import EventCardNew from "../EventCardNew";

import { DashboardSectionHeading, EventCardsGrid } from "./Elements";

import { useDispatch, useSelector } from "react-redux";
import {
  errorTrackerForRegisteredEvents,
  fetchUserRegisteredEvents,
} from "../../actions";
import { useSnackbar } from "notistack";
import Loader from "./../Loader";
import dateFormat from "dateformat";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";

const renderRegisteredEvents = (events) => {
  return events.map((event) => {
    const startDate = dateFormat(event.startDate, "mmm dS, h:MM TT");
    const endDate = dateFormat(event.endDate, "mmm dS, h:MM TT");

    return (
      <EventCardNew
        image={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.image}`}
        key={event.id}
        eventName={event.eventName}
        minPrice={event.minTicketPrice}
        maxPrice={event.maxTicketPrice}
        id={event.id}
        communityId={
          typeof event.createdBy === String
            ? event.createdBy
            : event.createdBy.id
        }
        startDate={startDate}
        endDate={endDate}
      />
    );
  });
};

const UserAccountHomeMainBody = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { events, isLoading, error } = useSelector((state) => state.event);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserRegisteredEvents());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ height: "80vh", width: "100%" }}
      >
        <Loader />
      </div>
    );
  } else if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });

    return dispatch(errorTrackerForRegisteredEvents());
  } else if (Array.isArray(events) && events.length) {
    <div
      className="d-flex flex-row align-items-center justify-content-center"
      style={{ height: "80vh", width: "100%" }}
    >
      <Loader />
    </div>;
  }

  return (
    <div className="user-account-main-body-home-content">
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "100%" }}
      >
        <DashboardSectionHeading className="pb-4 ps-4">
          Your Upcoming Events
        </DashboardSectionHeading>

        {typeof events !== "undefined" && events.length > 0 ? (
          <EventCardsGrid>{renderRegisteredEvents(events)}</EventCardsGrid>
        ) : (
          <div
            style={{ width: "100%", height: "70vh" }}
            className="d-flex flex-row align-items-center justify-content-center"
          >
            <YouHaveNoEventComing
              msgText={"You have not yet registered in any events yet."}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountHomeMainBody;
