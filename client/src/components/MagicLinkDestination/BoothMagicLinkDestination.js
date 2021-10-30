import React, { useEffect } from "react";
import styled from "styled-components";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import AvatarGroup from "@mui/material/AvatarGroup";
import dateFormat from "dateformat";
import BluemeetLOGO from "./../../assets/Logo/Bluemeet_LOGO_official.svg";
import AvatarMenu from "./../AvatarMenu";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  fetchExhibitorRegistrationInfo,
  generateEventAccessToken,
  logInMagicLinkUser,
  navigationIndexForHostingPlatform,
} from "./../../actions";
import Loader from "./../Loader";
import { Link } from "react-router-dom";

const Paper = styled.div`
  height: auto;
  background-color: #2f9bf3;
  text-align: center;
`;

const PaperEnded = styled.div`
  height: auto;
  background-color: #f33f2f;
  text-align: center;
`;

const NormalText = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #ffffff;
`;

const AttractiveText = styled.a`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #e2d40e;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    color: #212121;
  }
`;

const StaticBanner = () => {
  return (
    <>
      <Paper className="py-2">
        <NormalText>Looks like you don't have account on Bluemeet.</NormalText>{" "}
        <AttractiveText>Please create account to get access</AttractiveText>
      </Paper>
    </>
  );
};

const EndedStaticBanner = () => {
  return (
    <>
      <PaperEnded className="py-2">
        <NormalText>This event has already ended.</NormalText>{" "}
        <AttractiveText>Take me home</AttractiveText>
      </PaperEnded>
    </>
  );
};

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

const renderSpeakers = (speakers) => {
  return speakers.map((speaker) => {
    return (
      <Avatar
        alt={speaker.firstName}
        src={
          speaker.image.startsWith("https://")
            ? speaker.image
            : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`
        }
      />
    );
  });
};

const BoothMagicLinkDestination = () => {
  let eventStatus = 0;
  // Get event details and display on page.
  // Get attendee || speaker || exhibitor logged in and when clicked on join event or waiting room please set event access token.

  const params = useParams();
  const dispatch = useDispatch();

  const registrationId = params.registrationId;

  const { isSignedIn } = useSelector((state) => state.auth);

  const { eventDetails, userId, userEmail, userRole, userIsOnBluemeet } =
    useSelector((state) => state.magicLink);

  useEffect(() => {
    dispatch(fetchExhibitorRegistrationInfo(registrationId));
  }, []);

  if (!eventDetails || !userRole) {
    return <Loader />;
  }

  if (eventDetails) {
    if (eventDetails.status === "Upcoming") {
      eventStatus = 0;
    }
    if (
      eventDetails.status === "Started" ||
      eventDetails.status === "Resumed" ||
      eventDetails.status === "Paused"
    ) {
      eventStatus = 1;
    }
    if (eventDetails.status === "Ended") {
      eventStatus = 2;
    }
  }

  return (
    <>
      {!userIsOnBluemeet ? <StaticBanner></StaticBanner> : <></>}
      {eventDetails.status === "Ended" ? (
        <EndedStaticBanner></EndedStaticBanner>
      ) : (
        <></>
      )}
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
              src={
                eventDetails.image.startsWith("https://")
                  ? eventDetails.image
                  : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${eventDetails.image}`
              }
            ></EventPoster>
            <div className="d-flex flex-row align-items-center">
              <Avatar
                src={Faker.image.avatar()} // ! TODO => Fix issue with community image
                // src={eventDetails.communityLogo.startsWith("https://") ? eventDetails.communityLogo : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${eventDetails.communityLogo}` }
                alt={eventDetails.communityName}
                variant="rounded"
                className="me-3"
              />
              <div>
                <HostedBy className="mb-1">Hosted by</HostedBy>
                <CommunityName>{eventDetails.communityName}</CommunityName>
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
              {dateFormat(eventDetails.startTime, "ddd, mmm dS, yy")} {"  "} -{" "}
              {"  "} {dateFormat(eventDetails.endTime, "ddd, mmm dS, yy")}
            </EventTimeline>
            {/* Event speakers */}
            <Heading className="mb-3">Speakers</Heading>
            <div className="d-flex flex-row align-items-center justify-content-start mb-5">
              <AvatarGroup max={4}>
                {renderSpeakers(eventDetails.speaker)}
              </AvatarGroup>
            </div>

            {/* Event not yet started announcement */}

            {(() => {
              if (!userIsOnBluemeet) {
                return (
                  <>
                    <Announcement className="mb-3">
                      Looks like you don't have a Bluemeet account. Please
                      create your account with this email {userEmail} to get
                      access.
                    </Announcement>
                    <Link to="/signup">
                      <JoinEventButton
                        className="btn btn-outline-text btn-primary"
                        style={{ width: "100%" }}
                      >
                        Create my account
                      </JoinEventButton>
                    </Link>
                  </>
                );
              } else {
                switch (eventStatus) {
                  case 0:
                    // Event has not yet Started
                    return (
                      <>
                        <Announcement className="mb-3">
                          This event has not yet started. Please join the
                          waiting room.
                        </Announcement>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                          <JoinEventButton
                            disabled
                            className="btn btn-outline-text btn-primary"
                            style={{ width: "48%" }}
                          >
                            Join event
                          </JoinEventButton>
                          <Link
                            style={{ width: "48%" }}
                            to={`/community/${eventDetails.communityId}/event/${eventDetails._id}/hosting-platform/rooms`}
                          >
                            <JoinEventButton
                              onClick={() => {
                                dispatch(logInMagicLinkUser(userId));
                                dispatch(navigationIndexForHostingPlatform(5));
                                dispatch(
                                  generateEventAccessToken(
                                    userId,
                                    userEmail,
                                    "exhibitor", // attendee || speaker || exhibitor || organiser ||  moderator ||  host
                                  )
                                );
                              }}
                              className="btn btn-outline-text btn-outline-primary"
                              style={{ width: "100%" }}
                            >
                              Go to waiting room
                            </JoinEventButton>
                          </Link>
                        </div>
                      </>
                    );

                  case 1:
                    // Event has started or resumed or paused
                    return (
                      <JoinEventButton
                        className="btn btn-outline-text btn-primary"
                        style={{ width: "100%" }}
                      >
                        Join event
                      </JoinEventButton>
                    );

                  case 2:
                    // Event has Ended
                    return (
                      <>
                        <Announcement className="mb-3">
                          This event is already ended.
                        </Announcement>
                        <JoinEventButton
                          className="btn btn-outline-text btn-primary"
                          style={{ width: "100%" }}
                        >
                          Take me home
                        </JoinEventButton>
                      </>
                    );

                  default:
                    console.log(eventStatus);
                    break;
                }
              }
            })()}
            {/* Join button */}
          </div>
        </Grid>
      </div>
    </>
  );
};

export default BoothMagicLinkDestination;
