import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Faker from "faker";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
// import { IconButton } from "@material-ui/core";

import {
  IconButton,
} from "./../../SessionStage/Elements";

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
  padding: 10px;

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
  grid-template-columns: 3fr 1.5fr;
  grid-gap: 32px;
`;

const WhatsHappeningHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #152d35;
`;

const WhatsHappeningBody = styled.div`
  /* background-color: #ffffff; */
  border-radius: 5px;
  height: 400px;
`;

const SessionPlaybackPreview = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;

  img {
    border-radius: 10px;
    width: inherit;
    max-height: 100%;
    /* max-height: 320px; */
    object-fit: cover;
  }
`;

const TransparentSponsorCardsBody = styled.div`
  height: 500px;

  display: grid;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr 1fr 1fr;
`;

const TransparentSponsorCard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    width: 60%;
    max-height: 80px;
    object-fit: contain;
  }
`;

const About = () => {
  return (
    <>
      <HostedByCard className="mb-5">
        <HostedByLeft>
          <CommunityLogo className="me-3">
            <Avatar src={Faker.image.avatar()} variant="rounded" />
          </CommunityLogo>
          <div>
            <HostedByText className="mb-2">Hosted by</HostedByText>
            <HostedByCommunityName>
              Imperial college of London
            </HostedByCommunityName>
          </div>
        </HostedByLeft>
        <HostedByRight>
          <ButtonFilledDark className="me-4">Follow</ButtonFilledDark>

          <div className="d-flex flex-row align-items-center justify-content-center">
            <SocialIconWrapper className="me-3">
              <FacebookIcon style={{ fontSize: "24px", color: "#4267B2" }} />
            </SocialIconWrapper>
            <SocialIconWrapper className="me-3">
              <LinkedInIcon style={{ fontSize: "24px", color: "#0077b5" }} />
            </SocialIconWrapper>
            <SocialIconWrapper className="me-3">
              <TwitterIcon style={{ fontSize: "24px", color: "#1DA1F2" }} />
            </SocialIconWrapper>
            <SocialIconWrapper className="me-3">
              <InstagramIcon style={{ fontSize: "24px", color: "#DD2A7B" }} />
            </SocialIconWrapper>
            <SocialIconWrapper>
              <LanguageIcon style={{ fontSize: "24px", color: "#152d35" }} />
            </SocialIconWrapper>
          </div>
        </HostedByRight>
      </HostedByCard>

      <WhatsHappeningAndSponsorGrid>
        <div className="">
          <WhatsHappeningHeading className="mb-4">
            What's happening
          </WhatsHappeningHeading>

          <WhatsHappeningBody>
            <SessionPlaybackPreview>
              <Chip
                label="Live"
                color="error"
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  zIndex: "10",
                }}
              />
              <Button
                variant="contained"
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  zIndex: "10",
                }}
              >
                Enter stage
              </Button>
              <img
                src={
                  "https://inspirationfeed.com/wp-content/uploads/2020/04/Audience-applauding-speaker-at-a-business-seminar-min.jpg"
                }
                alt="session-playback-preview"
              />
            </SessionPlaybackPreview>
          </WhatsHappeningBody>
        </div>

        <div>
          <div className="d-flex flex-row align-items-center justify-content-between mb-3">
            <WhatsHappeningHeading>Sponsors</WhatsHappeningHeading>
            <div className="d-flex flex-row align-items-center">
              <IconButton className="me-3">
                <ArrowLeftRoundedIcon />
              </IconButton>
              <IconButton>
                <ArrowRightRoundedIcon />
              </IconButton>
            </div>
          </div>
          <TransparentSponsorCardsBody>
            <TransparentSponsorCard>
              <img
                src={
                  "http://assets.stickpng.com/images/580b57fcd9996e24bc43c513.png"
                }
                alt="sponsor name"
              />
            </TransparentSponsorCard>
            <TransparentSponsorCard>
              <img
                src={"https://www.logo.wine/a/logo/SpaceX/SpaceX-Logo.wine.svg"}
                alt="sponsor name"
              />
            </TransparentSponsorCard>
            <TransparentSponsorCard>
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
                }
                alt="sponsor name"
              />
            </TransparentSponsorCard>
            <TransparentSponsorCard>
              <img
                src={
                  "https://logos-world.net/wp-content/uploads/2020/05/PayPal-Logo.png"
                }
                alt="sponsor name"
              />
            </TransparentSponsorCard>
          </TransparentSponsorCardsBody>
        </div>
      </WhatsHappeningAndSponsorGrid>
    </>
  );
};

export default About;
