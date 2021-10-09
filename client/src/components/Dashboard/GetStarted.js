import React from "react";
import styled from "styled-components";
import Help from "./Checklist/help.png";
import GetStartedPNG from "./../../assets/images/getStarted.svg";
import VirtualEvent from "./../../assets/images/virtual_event.jpeg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Intro from "./../../assets/Static/1.png";
import KB from "./../../assets/Static/2.png";
import Support from "./../../assets/Static/3.png";
import SBC from "./../../assets/Static/sbcds.jpeg";
import Car from "./../../assets/Static/car.jpeg";
import Crypto from "./../../assets/Static/crypto.jpeg";
import Investing from "./../../assets/Static/investing.jpeg";
import Candid from "./../../assets/Static/candid.jpeg";
import WIT from "./../../assets/Static/wit.png";
import DevOps from "./../../assets/Static/devops.png";
import Social from "./../../assets/Static/socialsharing.jpeg";

const SectionHeading = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: #333333;
  font-family: "Ubuntu";
`;

const AttractionHeading = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333333;
  font-family: "Ubuntu";
`;

const TextSmall = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #5a5a5a;
  font-family: "Ubuntu";
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1.5fr;
  grid-gap: 24px;
`;

const CardMain = styled.div`
  height: 100%;
  height: 280px;
  background-color: #ffffff;
  border-radius: 10px;
`;

const EventPromoImageContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 7px;
`;

const HelpCard = styled.div`
  background-color: #f5f7f8;
  padding: 20px;
  height: 100%;
  border-radius: 10px;
`;

const ImgCard = styled.img`
  height: 150px;
  width: 150px;
  object-fit: contain;
  background-color: #ffffff;
  border-radius: 10px;
`;

const MainImgCard = styled.img`
  height: 240px;
  width: 240px;
  object-fit: contain;
  background-color: #ffffff;
  border-radius: 10px;
`;

const DemoEventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 32px;
`;

const DemoEventCard = styled.div`
  height: 300px;
  background-color: #ffffff;
  border-radius: 10px;
  position: relative;

  &:hover {
    background-color: #ffffff;
  }
`;

const EventImage = styled.img`
  height: 300px;
  width: 100%;
  border-radius: 10px;

  
`;

const EventTag = styled.div`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  clip-path: polygon(100% 0, 93% 50%, 100% 100%, 0 100%, 0 0);
  height: 30px;
  min-width: 125px;
  position: absolute;
  background-color: #538bf7;
  z-index: 10;
  top: 10px;
  left: -10px;

  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 0.8rem;
  text-align: center;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
`;

const EventCardName = styled.div`
  position: absolute;
  bottom: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #21212196;
  height: 40px;
  width: 100%;

  font-weight: 600;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #ffffff;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

class DemoCarousel extends React.Component {
  render() {
    return (
      <Carousel showStatus={false}>
        <div>
          <img
            src={Intro}
            style={{ borderRadius: "5px" }}
            alt={"Bluemeet Intro"}
          />
          <button className="legend btn btn-outline-text btn-outline-primary">
            Watch intro
          </button>
        </div>
        <div>
          <img
            src={KB}
            style={{ borderRadius: "5px" }}
            alt={"Knowledge Base"}
          />
          <button className="legend btn btn-outline-text btn-outline-primary">
            Visit knowledge base
          </button>
        </div>
        <div>
          <img
            src={Support}
            style={{ borderRadius: "5px" }}
            alt={"24*7 Instant support"}
          />
          <button className="legend btn btn-outline-text btn-outline-primary">
            24*7 Instant support
          </button>
        </div>
      </Carousel>
    );
  }
}

const GetStarted = () => {
  return (
    <>
      <div className="me-3">
        <div
          className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4 mb-3"
          style={{ minWidth: "1138px" }}
        >
          <SectionHeading>Getting started</SectionHeading>
        </div>
        <div className="px-4 mb-5">
          <TextSmall>
            Let's start by creating your first event on Bluemeet.
          </TextSmall>
        </div>

        <div className="px-4 mb-4" style={{ minWidth: "1138px" }}>
          <Grid>
            <CardMain className="d-flex flex-row align-items-center">
              <MainImgCard src={GetStartedPNG} className="me-3"></MainImgCard>

              <div>
                <AttractionHeading className="mb-4">
                  Your first event is just a click away!
                </AttractionHeading>
                <button className="btn btn-primary btn-outline-text">
                  Create my first event
                </button>
              </div>
            </CardMain>
            <EventPromoImageContainer className="px-4 py-3">
              <HelpCard className="d-flex flex-row align-items-center">
                <ImgCard src={Help} className="me-4"></ImgCard>
                <div>
                  <TextSmall className="mb-3">
                    Need a hand in setting up your event?{" "}
                  </TextSmall>
                  <button className="btn btn-outline-success btn-outline-text">
                    Get Help
                  </button>
                </div>
              </HelpCard>
            </EventPromoImageContainer>
          </Grid>
        </div>

        <div
          className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4 mb-3"
          style={{ minWidth: "1138px" }}
        >
          <SectionHeading style={{ fontSize: "1.1rem" }}>
            See what's possible with Bluemeet
          </SectionHeading>
        </div>
        <div className="px-4 mb-5">
          <TextSmall>
            Bluemeet can help you organise virtual and hybrid event at any scale
            and are highly customisable.
          </TextSmall>
        </div>

        <div className="px-4 pb-4 mb-3" style={{ minWidth: "1138px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gridGap: "24px",
            }}
          >
            <DemoEventsGrid>
              <DemoEventCard className="demo-event-card">
                <EventTag>Conference</EventTag>
                <EventImage src={SBC}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>SBC Digital Summit</span>
                </EventCardName>
              </DemoEventCard>
             
              <DemoEventCard className="demo-event-card">
                <EventTag>Product Launch</EventTag>
                <EventImage src={Car}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Unvieling Roadster</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Meetup</EventTag>
                <EventImage src={Crypto}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Let's Talk Crypto</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Workshop</EventTag>
                <EventImage src={Investing}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Investing & Growing</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Summit</EventTag>
                <EventImage src={WIT}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Women in tech</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Office hour</EventTag>
                <EventImage src={DevOps}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>DevOps Monthly Meetup</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Training Event</EventTag>
                <EventImage src={Social}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Social Influencing 101</span>
                </EventCardName>
              </DemoEventCard>
              <DemoEventCard className="demo-event-card">
                <EventTag>Social webinar</EventTag>
                <EventImage src={Candid}></EventImage>
                <EventCardName className="px-4 py-3">
                  <span>Candid Conversation</span>
                </EventCardName>
              </DemoEventCard>
            </DemoEventsGrid>

            <div>
              {/*  */}

              <DemoCarousel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStarted;