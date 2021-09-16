/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import EventBanner from "../HelperComponents/EventBanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, fetchSessionsForUser } from "../../../actions";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import MyMeetings from "./MyMeetings";
import Reminders from "./Reminders";
import styled from 'styled-components';

// const LobbyLinkBtn = styled.div`
// color: ${props =>  props.active ? "#152d35" : "#dcc7be"}


const LobbyLinkBtn = styled.div`
  /* Color the border and text with theme.main */
  color: ${props => props.active ? "#152d35" : "#FFFFFF"};
  border-bottom: ${props => props.active ? " 2px solid #152d35" : "2px solid #FFFFFF00"};

  &:hover {
    color: #152d35;
    cursor: pointer;
  }
`;

const ThemedBackgroundButton = styled.div`
background-color: #152d35;
text-decoration: none !important;
`

const ThemedText = styled.div`
color: #152d35 !important;
font-family: "Ubuntu";
`

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
        <LobbyLinkBtn
        active={selectedTab === "agenda" ? true : false}
          onClick={() => {
            setSelectedTab("agenda");
          }}
          className={`me-5 lobby-nav-btn ${
            selectedTab === "agenda" ? "lobby-nav-btn-active" : ""
          } `}
        >
          Agenda
        </LobbyLinkBtn>
        <LobbyLinkBtn
         active={selectedTab === "myMeetings" ? true : false}
          onClick={() => {
            setSelectedTab("myMeetings");
          }}
          className={`lobby-nav-btn ${
            selectedTab === "myMeetings" ? "lobby-nav-btn-active" : ""
          } me-5`}
        >
          My Meetings
        </LobbyLinkBtn>
        <LobbyLinkBtn
         active={selectedTab === "reminders" ? true : false}
          onClick={() => {
            setSelectedTab("reminders");
          }}
          className={`lobby-nav-btn ${
            selectedTab === "reminders" ? "lobby-nav-btn-active" : ""
          }`}
        >
          Reminders
        </LobbyLinkBtn>
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
