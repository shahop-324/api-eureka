/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import EventBanner from "../HelperComponents/EventBanner";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, fetchSessionsForUser } from "../../../actions";
import { useParams } from "react-router-dom";
import Schedule from "./Schedule";
import MyMeetings from "./MyMeetings";
import Reminders from "./Reminders";
import About from './About';
import styled from 'styled-components';
import Speakers from "./Sub/Speakers";
import Hosts from "./Sub/Hosts";

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

const CustomHorizontalTabWarpper = styled.div`
  min-width: 500px;
  height: auto;
  border-radius: 10px;
  background-color: #345b63;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const CustomTabButton = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  color: #fff;
  align-self: center;

  text-align: center;
  padding: 6px 12px;
  background-color: ${(props) =>
    props.active && props.active ? "#152d35" : "#345b63"};
  border-radius: 10px;
  border: 1px solid transparent;

  &:hover {
    /* border: 1px solid #fff; */
    background-color: #A0A0A057;
    cursor: pointer;
  }
`;

const LobbyAgenda = () => {
  const [selectedTab, setSelectedTab] = useState("about");

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

<CustomHorizontalTabWarpper className="px-3 mb-4">
        <CustomTabButton
          active={selectedTab === "about" ? true : false}
          onClick={() => {
            setSelectedTab("about");
          }}
        >
          About
        </CustomTabButton>
        <CustomTabButton
          active={selectedTab === "myMeetings" ? true : false}
          onClick={() => {
            setSelectedTab("myMeetings");
          }}
        >
          My meetings
        </CustomTabButton>
        <CustomTabButton
          active={selectedTab === "speakers" ? true : false}
          onClick={() => {
            setSelectedTab("speakers");
          }}
        >
          Speakers
        </CustomTabButton>
        <CustomTabButton
          active={selectedTab === "hosts" ? true : false}
          onClick={() => {
            setSelectedTab("hosts");
          }}
        >
          Hosts
        </CustomTabButton>
        
      </CustomHorizontalTabWarpper>

      {/* <div className="lobby-navigation-wrapper d-flex flex-row mb-4">
        <LobbyLinkBtn
        active={selectedTab === "about" ? true : false}
          onClick={() => {
            setSelectedTab("about");
          }}
          className={`me-5 lobby-nav-btn ${
            selectedTab === "about" ? "lobby-nav-btn-active" : ""
          } `}
        >
          About
        </LobbyLinkBtn>
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
      </div> */}
      {(() => {
        switch (selectedTab) {
          case "about": 
          return <About />;
         
          case "myMeetings":
            return <MyMeetings />;
          case "speakers":
            return <Speakers />;
          case "hosts":
            return <Hosts />;
          default:
            return <div>You are inside lobby.</div>;
        }
      })()}
    </>
  );
};

export default LobbyAgenda;
