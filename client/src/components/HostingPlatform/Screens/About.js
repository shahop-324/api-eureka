import React, { useEffect, useState } from "react";
import socket from "./../service/socket";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useDispatch, useSelector } from "react-redux";
import NoContent from "../NoContent";
import NoSession from "./../../../assets/images/NoSession.svg";
import NoSposnors from "./../../../assets/images/NoSponsor.svg";
import {
  fetchCommunity,
  getHighlightedSessions,
  setSessionRoleAndJoinSession,
  getRTCTokenAndSession,
} from "../../../actions";
import { useParams } from "react-router";

const HostedByCard = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
  align-items: center;

  /* border: 1px solid #152d35; */
`;

const HostedByLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HostedByRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
`;

const CommunityLogo = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  align-self: center;
  justify-self: center;
  text-align: center;
`;

const SocialIconWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid transparent;

  align-self: center;
  justify-self: center;
  text-align: center;

  &:hover {
    border: 1px solid #fff;
    background-color: transparent;
    cursor: pointer;
  }
`;
const HostedByText = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.95rem;
  color: #152d35;
`;
const HostedByCommunityName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #ffffff;
`;

const ButtonFilledDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  background-color: #152d35;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    color: #152d35;
    background-color: transparent;
    cursor: pointer;
  }
`;

const WhatsHappeningAndSponsorGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
`;

const WhatsHappeningHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #152d35;
`;

const WhatsHappeningBody = styled.div`
  border-radius: 5px;
  height: 400px;
  margin-bottom: 40px;
`;

const SessionPlaybackPreview = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  height: 420px;
  background-color: #cecfcf;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 3fr 1.5fr;
  border-radius: 15px;

  img {
    border-radius: 10px;
    width: 100%;
    max-height: 400px;
  }
`;

const SessionName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #212121;
`;

const SessionDescription = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #5c5c5c;
`;

const SubHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #152d35;
`;

const SponsorTitle = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #152d35;
`;

const SponsorCard = styled.img`
  padding: 10px 20px;
  object-fit: contain;
  border-radius: 10px;
  border: 3px solid #152d35;
  background-color: #e6e6e6;
  height: 120px;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);

    cursor: pointer;
  }
`;

const TierOneGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;

const TierTwoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;

const TierThreeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;
const TierFourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;

const SessionComponent = ({ session }) => {
  const params = useParams();

  const eventId = params.eventId;
  const communityId = params.communityId;

  const dispatch = useDispatch();

  const [channel, setChannel] = useState(`${session._id}`); // Channel to join => defaults to live

  const { eventDetails } = useSelector((state) => state.event);
  const { userDetails } = useSelector((state) => state.user);

  const userEmail = userDetails.email; // User email
  const userId = userDetails._id; // User Id

  const speakerEmails = eventDetails.speaker.map((element) => element.email);

  const hostIds = eventDetails.hosts.map((element) => element._id);

  const { role } = useSelector((state) => state.eventAccessToken); // Possible values => "speaker" || "attendee" || "organiser" || "exhibitor"

  let sessionRole;

  if (role === "organiser" || role === "speaker") {
    if (hostIds.includes(userId) || speakerEmails.includes(userEmail)) {
      // Set role as host for this session
      sessionRole = "host";
    } else {
      sessionRole = "audience";
    }
  } else {
    sessionRole = "audience";
  }

  const agoraRole = sessionRole === "host" ? "host" : "audience";

  let sessionStatus = "Upcoming";

  if (new Date(session.startTime) > new Date(Date.now())) {
    sessionStatus = "Upcoming";
  }
  if (
    new Date(session.startTime) <= new Date(Date.now()) &&
    new Date(session.endTime) >= new Date(Date.now())
  ) {
    sessionStatus = "Ongoing";
  }
  if (new Date(session.endTime) < new Date(Date.now())) {
    sessionStatus = "Ended";
  }
  if (session.runningStatus === "Ended") {
    sessionStatus = "Ended";
  }

  return (
    <>
      <WhatsHappeningBody>
        <SessionPlaybackPreview>
          <div>
            <img
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${session.preview}`}
              alt="session-playback-preview"
            />
          </div>

          <div className="d-flex flex-column justify-content-between p-3">
            <div>
              <div className="d-flex flex-row align-items-center mb-3">
                <SessionName className="me-3">{session.name}</SessionName>
                <div>
                  {(() => {
                    switch (sessionStatus) {
                      case "Upcoming":
                        return (
                          <div className="session-running-status-container px-2 py-2">
                            <div
                              className="session-running-status"
                              style={{ fontWeight: "500" }}
                            >
                              Upcoming
                            </div>
                          </div>
                        );

                      case "Ongoing":
                        return (
                          <div
                            className="session-running-status-container px-2 py-2"
                            style={{ backgroundColor: "#A78B10" }}
                          >
                            <div
                              className="session-running-status"
                              style={{
                                backgroundColor: "#A78B10",
                                fontWeight: "500",
                              }}
                            >
                              Ongoing
                            </div>
                          </div>
                        );

                      case "Ended":
                        return (
                          <div
                            className="session-running-status-container px-2 py-2"
                            style={{ backgroundColor: "#A72E10" }}
                          >
                            <div
                              className="session-running-status"
                              style={{
                                backgroundColor: "#A72E10",
                                fontWeight: "500",
                              }}
                            >
                              Ended
                            </div>
                          </div>
                        );

                      default:
                        break;
                    }
                  })()}
                </div>
              </div>
              <SessionDescription className="mb-4">
                {session.description}
              </SessionDescription>

              <SubHeading className="mb-3">Speakers</SubHeading>

              <div className="d-flex flex-row align-items-center justify-content-start mb-4">
                <AvatarGroup max={5}>
                  {typeof session.speaker !== "undefined" &&
                  session.speaker.length > 0 ? (
                    renderSpeakers(session.speaker)
                  ) : (
                    <Chip
                      label="No speaker assigned"
                      color="primary"
                      style={{ fontWeight: "500" }}
                    />
                  )}
                </AvatarGroup>
              </div>

              <SubHeading className="mb-3">Attendees</SubHeading>

              <div className="d-flex flex-row align-items-center justify-content-start mb-4">
                <AvatarGroup max={5}>
                  {typeof session.people !== "undefined" &&
                  session.people.length > 0 ? (
                    renderAttendees(session.people)
                  ) : (
                    <Chip
                      label="Be the first to attend"
                      color="primary"
                      style={{ fontWeight: "500" }}
                    />
                  )}
                </AvatarGroup>
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  // alert(channel)
                  dispatch(
                    getRTCTokenAndSession(
                      session._id,
                      channel,
                      sessionRole,
                      eventId,
                      communityId
                    )
                  );

                  // Join session channel

                  socket.emit(
                    "joinSession",
                    {
                      sessionId: session._id,
                      userId: userId,
                      sessionRole: sessionRole,
                      userName: `${userDetails.firstName} ${userDetails.lastName}`,
                      userEmail: userDetails.email,
                      userImage: userDetails.image,
                      userCity: userDetails.city,
                      userCountry: userDetails.country,
                      userOrganisation: userDetails.organisation,
                      userDesignation: userDetails.designation,
                      roleToBeDisplayed: role,
                    },
                    (error) => {
                      if (error) {
                        alert(error);
                      }
                    }
                  );

                  dispatch(setSessionRoleAndJoinSession(sessionRole));
                }}
                className="btn btn-outline-text btn-primary"
                style={{
                  width: "100%",
                }}
              >
                Join
              </button>
            </div>
          </div>
        </SessionPlaybackPreview>
      </WhatsHappeningBody>
    </>
  );
};

const renderHisghlightedSessions = (sessions) => {
  return sessions.map((session) => {
    return (
      <>
        <SessionComponent session={session} />
      </>
    );
  });
};

const renderSpeakers = (speakers) => {
  console.log(speakers, "This is the speakers array");
  return speakers.map((speaker) => {
    return (
      <Avatar
        alt={speaker.name}
        src={
          speaker.image
            ? speaker.image.startsWith("https://")
              ? speaker.image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`
            : ""
        }
      />
    );
  });
};

const renderAttendees = (attendees) => {
  return attendees.map((attendee) => {
    return (
      <Avatar
        alt={attendee.firstName}
        src={
          attendee.image
            ? attendee.image.startsWith("https://")
              ? attendee.image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${attendee.image}`
            : ""
        }
      />
    );
  });
};

// Diamond || Platinum || Gold || Bronze

const PlatinumSponsors = (sponsors) => {
  return sponsors.map((sponsor) => {
    if (sponsor.status !== "Platinum") return;
    return (
      <a href={`//${sponsor.website}`} target="_blank" rel="noreferrer">
        <SponsorCard
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${sponsor.image}`}
        />
      </a>
    );
  });
};

const DiamondSponsors = (sponsors) => {
  return sponsors.map((sponsor) => {
    if (sponsor.status !== "Diamond") return;
    return (
      <a href={`//${sponsor.website}`} target="_blank" rel="noreferrer">
        <SponsorCard
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${sponsor.image}`}
        />
      </a>
    );
  });
};

const GoldSponsors = (sponsors) => {
  return sponsors.map((sponsor) => {
    if (sponsor.status !== "Gold") return;
    return (
      <a href={`//${sponsor.website}`} target="_blank" rel="noreferrer">
        <SponsorCard
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${sponsor.image}`}
        />
      </a>
    );
  });
};

const BronzeSponsors = (sponsors) => {
  return sponsors.map((sponsor) => {
    if (sponsor.status !== "Bronze") return;
    return (
      <a href={`//${sponsor.website}`} target="_blank" rel="noreferrer">
        <SponsorCard
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${sponsor.image}`}
        />
      </a>
    );
  });
};

const About = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventId = params.eventId;
  const communityId = params.communityId;

  const { communityDetails } = useSelector((state) => state.community);
  const { eventDetails } = useSelector((state) => state.event);
  const { sessions, highlightedSessions } = useSelector(
    (state) => state.session
  );
  const { sponsors } = useSelector((state) => state.sponsor);

  // fetch all sessions on this page

  useEffect(() => {
    dispatch(getHighlightedSessions(eventId));
    dispatch(fetchCommunity(communityId));
  }, [dispatch, eventId]);

  if (!communityDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HostedByCard className="mb-5">
        <HostedByLeft>
          <CommunityLogo className="me-3">
            <Avatar
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${communityDetails.image}`}
              variant="rounded"
              style={{ height: "3rem", width: "3rem" }}
            />
          </CommunityLogo>
          <div>
            <HostedByText className="mb-2">Hosted by</HostedByText>
            <HostedByCommunityName>
              {communityDetails.name}
            </HostedByCommunityName>
          </div>
        </HostedByLeft>
        {communityDetails.socialMediaHandles ? (
          <HostedByRight>
            <div className="d-flex flex-row align-items-center justify-content-center">
              {communityDetails.socialMediaHandles.facebook ? (
                <a
                  href={`//${communityDetails.socialMediaHandles.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIconWrapper className="me-3">
                    <FacebookIcon
                      style={{ fontSize: "24px", color: "#4267B2" }}
                    />
                  </SocialIconWrapper>
                </a>
              ) : (
                <></>
              )}

              {communityDetails.socialMediaHandles.linkedin ? (
                <a
                  href={`//${communityDetails.socialMediaHandles.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIconWrapper className="me-3">
                    <LinkedInIcon
                      style={{ fontSize: "24px", color: "#0077b5" }}
                    />
                  </SocialIconWrapper>
                </a>
              ) : (
                <></>
              )}

              {communityDetails.socialMediaHandles.twitter ? (
                <a
                  href={`//${communityDetails.socialMediaHandles.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIconWrapper className="me-3">
                    <TwitterIcon
                      style={{ fontSize: "24px", color: "#1DA1F2" }}
                    />
                  </SocialIconWrapper>
                </a>
              ) : (
                <></>
              )}

              {communityDetails.socialMediaHandles.website ? (
                <a
                  href={`//${communityDetails.socialMediaHandles.website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIconWrapper>
                    <LanguageIcon
                      style={{ fontSize: "24px", color: "#152d35" }}
                    />
                  </SocialIconWrapper>
                </a>
              ) : (
                <></>
              )}
            </div>
          </HostedByRight>
        ) : (
          <></>
        )}
      </HostedByCard>

      <WhatsHappeningAndSponsorGrid>
        <div className="">
          <WhatsHappeningHeading className="mb-4">
            What's happening
          </WhatsHappeningHeading>

          {typeof highlightedSessions !== "undefined" &&
          highlightedSessions.length > 0 ? (
            <>{renderHisghlightedSessions(highlightedSessions)}</>
          ) : (
            <>
              <NoContent
                className="mb-4"
                Image={NoSession}
                Msg={"There is nothing happening in this event right now."}
              />
            </>
          )}
        </div>
      </WhatsHappeningAndSponsorGrid>

      <div className="py-4">
        <WhatsHappeningHeading className="mb-4">
          Our partners
        </WhatsHappeningHeading>

        {typeof eventDetails.sponsors !== "undefined" &&
        eventDetails.sponsors.length > 0 ? (
          <>
            <SponsorTitle className="mb-3">Platinum</SponsorTitle>

            <TierOneGrid className="mb-5">
              {PlatinumSponsors(sponsors)}
            </TierOneGrid>

            <SponsorTitle className="mb-3">Diamond</SponsorTitle>

            <TierTwoGrid className="mb-5">
              {DiamondSponsors(sponsors)}
            </TierTwoGrid>

            <SponsorTitle className="mb-3">Gold</SponsorTitle>

            <TierThreeGrid className="mb-5">
              {GoldSponsors(sponsors)}
            </TierThreeGrid>

            <SponsorTitle className="mb-3">Bronze</SponsorTitle>

            <TierFourGrid className="mb-5">
              {BronzeSponsors(sponsors)}
            </TierFourGrid>
          </>
        ) : (
          <>
            <NoContent
              className="mb-4"
              Image={NoSposnors}
              Msg={"There are no sponsors yet."}
            />
          </>
        )}
      </div>
    </>
  );
};

export default About;
