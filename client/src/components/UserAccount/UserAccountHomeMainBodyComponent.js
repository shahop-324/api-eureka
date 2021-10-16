import React, { useEffect } from "react";
import EventCard from "../EventCard";
import { DashboardSectionHeading, EventCardsGrid } from "./Elements";
import { useDispatch, useSelector } from "react-redux";
import {
  errorTrackerForRegisteredEvents,
  fetchUserRegisteredEvents,
  getUserRegistrations
} from "../../actions";
import Loader from "./../Loader";
import dateFormat from "dateformat";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";

const renderRegisteredEvents = (events, registrations) => {
  return events.map((event) => {
    const startTime = dateFormat(event.startTime, "mmm dS, h:MM TT");
    let magic_link;

    for (let element of registrations) {
      if (element.bookedForEventId.toString() === event._id.toString()) {
        magic_link = element.magic_link;
      }
    }

    return (
      <EventCard
        image={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.image}`}
        key={event.id}
        eventName={event.eventName}
        minPrice={event.minTicketPrice}
        maxPrice={event.maxTicketPrice}
        id={event.id}
        communityId={event.communityId}
        startTime={startTime}
        showBtn={true}
        speakers={event.speaker}
        // TODO show commuity rating on thier events cards
        rating={4.0}
        magic_link={magic_link}
      />
    );
  });
};

const UserAccountHomeMainBody = () => {
  const { events, isLoading, error } = useSelector((state) => state.event);
  const { registrations } = useSelector((state) => state.registration);

  const uniqueEventIds = []; // No duplicates allowed
  const uniqueEventRegistrations = []; // No duplicated allowed
  const formattedEvents = []; // * Each unique events document  => pass to list render
  const formattedRegistrations = []; // * Each unique events registartion document => pass to list render

  // At this point we will have array of all unique events

  if (typeof events !== "undefined" && events.length) {
    for (let element of events) {
      if (!uniqueEventIds.includes(element._id)) {
        uniqueEventIds.push(element._id);

        formattedEvents.push(element);
      }
    }
  }

  if (typeof registrations !== "undefined" && registrations.length) {
    for (let element of registrations) {
      if (!uniqueEventRegistrations.includes(element.bookedForEventId)) {
        uniqueEventRegistrations.push(element.bookedForEventId);

        formattedRegistrations.push(element);
      }
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserRegisteredEvents());
    dispatch(getUserRegistrations())
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

        {typeof formattedEvents !== "undefined" &&
        formattedEvents.length > 0 ? (
          <EventCardsGrid>
            {renderRegisteredEvents(formattedEvents, formattedRegistrations)}
          </EventCardsGrid>
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
