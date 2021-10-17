import React, {useEffect} from "react";
import styled from "styled-components";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import AvatarGroup from "@mui/material/AvatarGroup";
import dateFormat from "dateformat";
import BluemeetLOGO from "./../../assets/Logo/Bluemeet_LOGO_official.svg";
import AvatarMenu from "./../AvatarMenu";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {fetchSpeakerRegistrationInfo} from "./../../actions";

const NavBar = styled.div`
  height: 7vh;
  background-color: #ffffff;
  border-bottom: 1px solid #ebebeb;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  width: 100%;
  height: 54vh;
`;

const EventPoster = styled.img`
  object-fit: contain;
  height: 40vh;
  width: 100%;
  border-radius: 10px;
  background-color: #212121;
`;

const HostedBy = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #212121;
`;

const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #212121;
`;

const CommunityName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.86rem;
  color: #525252;
`;

const EventName = styled.div`
  font-weight: 600;
  font-family: "Ubuntu";
  font-size: 1.5rem;
  color: #444444;
`;

const EventTimeline = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #686868;
`;

const JoinEventButton = styled.button`
  font-weight: 600;
  font-size: 1.2rem;
  width: 100%;
  font-family: "Ubuntu";
  color: #ffffff;
  border-radius: 15px;
`;

const Announcement = styled.div`
  font-weight: 500;
  font-size: 0.85rem;

  font-family: "Ubuntu";
  color: #db3a3a;
`;

const SpeakerMagicLinkDestination = () => {
  // Get event details and display on page.
  // Get attendee || speaker || exhibitor logged in and when clicked on join event or waiting room please set event access token.
  const params = useParams();  
  const dispatch = useDispatch();

  const registrationId = params.registrationId;

  const { isSignedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSpeakerRegistrationInfo(registrationId));
  }, []);

  return (
    <>
      <NavBar className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
        <img src={BluemeetLOGO} alt={"Bluemeet logo"} />
        {isSignedIn ? <AvatarMenu /> : <></>}
      </NavBar>

      <div
        className="container d-flex flex-row align-items-center"
        style={{ height: "93vh" }}
      >
        <Grid className="p-3">
          <div className="d-flex flex-column justify-content-center">
            <EventPoster
              className="mb-3"
              src={`https://static.wixstatic.com/media/e46278_311494821d824bb0a8d6bd7f8b7c8b8d~mv2.png/v1/fill/w_2500,h_1305,al_c/e46278_311494821d824bb0a8d6bd7f8b7c8b8d~mv2.png`}
            ></EventPoster>
            <div className="d-flex flex-row align-items-center">
              <Avatar
                src={Faker.image.avatar()}
                variant="rounded"
                className="me-3"
              />

              <div>
                <HostedBy className="mb-1">Hosted by</HostedBy>
                <CommunityName>Community Name </CommunityName>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Event Name */}
            <EventName className="mb-5">
              How to build a thriving Business from scratch.
            </EventName>
            {/* Event timeline */}
            <Heading className="mb-3">Event Timeline</Heading>
            <EventTimeline className="mb-4">
              {dateFormat(Date.now(), "ddd, mmm dS, yy")} {"  "} - {"  "}{" "}
              {dateFormat(Date.now(), "ddd, mmm dS, yy")}
            </EventTimeline>
            {/* Event speakers */}
            <Heading className="mb-3">Speakers</Heading>
            <div className="d-flex flex-row align-items-center justify-content-start mb-5">
              <AvatarGroup max={4}>
                <Avatar alt={Faker.image.avatar()} src={Faker.image.avatar()} />
                <Avatar alt={Faker.image.avatar()} src={Faker.image.avatar()} />
                <Avatar alt={Faker.image.avatar()} src={Faker.image.avatar()} />
                <Avatar alt={Faker.image.avatar()} src={Faker.image.avatar()} />
                <Avatar alt={Faker.image.avatar()} src={Faker.image.avatar()} />
              </AvatarGroup>
            </div>

            {/* Event not yet started announcement */}

            <Announcement className="mb-3">
              This event has not yet started. Please join the waiting room.
            </Announcement>

            {/* Join button */}

            <div className="d-flex flex-row align-items-center justify-content-between">
              <JoinEventButton
                disabled
                className="btn btn-outline-text btn-primary"
                style={{ width: "48%" }}
              >
                Join event
              </JoinEventButton>
              <JoinEventButton
                className="btn btn-outline-text btn-outline-primary"
                style={{ width: "48%" }}
              >
                Go to waiting room
              </JoinEventButton>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
};

export default SpeakerMagicLinkDestination;
