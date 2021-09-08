/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import EventBanner from "../HelperComponents/EventBanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, fetchSessionsForUser } from "../../../actions";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import MyMeetings from "./MyMeetings";
import Reminders from "./Reminders";

const LobbyAgenda = () => {
  const [selectedTab, setSelectedTab] = useState("agenda");

  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    dispatch(fetchSessionsForUser(eventId));
  }, [dispatch, eventId]);

  const sessions = useSelector((state) => state.session.sessions);

  const { eventName, shortDescription, createdBy } = useSelector(
    (state) => state.event.eventDetails
  );

  console.log(sessions);

  return (
    <>
      <EventBanner
        eventName={eventName}
        shortDescription={shortDescription}
        createdBy={createdBy}
      />

      <div className="lobby-navigation-wrapper d-flex flex-row mb-4">
        <div
          onClick={() => {
            setSelectedTab("agenda");
          }}
          className={`me-5 lobby-nav-btn ${
            selectedTab === "agenda" ? "lobby-nav-btn-active" : ""
          } `}
        >
          Agenda
        </div>
        <div
          onClick={() => {
            setSelectedTab("myMeetings");
          }}
          className={`lobby-nav-btn ${
            selectedTab === "myMeetings" ? "lobby-nav-btn-active" : ""
          } me-5`}
        >
          My Meetings
        </div>
        <div
          onClick={() => {
            setSelectedTab("reminders");
          }}
          className={`lobby-nav-btn ${
            selectedTab === "reminders" ? "lobby-nav-btn-active" : ""
          }`}
        >
          Reminders
        </div>
      </div>
      {(() => {
        switch (selectedTab) {
          case "agenda":
            return <Schedule />;
          case "myMeetings":
            return <MyMeetings />;
          case "reminders":
            return <Reminders />;
          default:
            return <div>You are inside lobby.</div>;
        }
      })()}
    </>
  );
};

export default LobbyAgenda;
