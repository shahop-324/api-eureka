import React from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Faker from "faker";
import Chip from "@mui/material/Chip";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Button } from "@material-ui/core";
import { IconButton } from "./../../SessionStage/Elements";

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
const TierFiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;
const TierSixGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;
const TierSevenGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
`;
const TierEightGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  min-height: 130px;
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
              <div>
                <Chip
                  label="Live"
                  color="error"
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: "10",
                    fontWeight: "500",
                  }}
                />

                <img
                  src={
                    "https://inspirationfeed.com/wp-content/uploads/2020/04/Audience-applauding-speaker-at-a-business-seminar-min.jpg"
                  }
                  alt="session-playback-preview"
                />
              </div>

              <div className="p-3">
                <SessionName className="mb-3">Welcome session</SessionName>
                <SessionDescription className="mb-4">
                  In this ssession you will get to uncover secrets of how and
                  why to start a business. This session will have a panel
                  discussion by prominent founders and business leaders.
                </SessionDescription>

                <SubHeading className="mb-3">Speakers</SubHeading>

                <div className="d-flex flex-row align-items-center justify-content-start mb-4">
                  <AvatarGroup max={5}>
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                  </AvatarGroup>
                </div>

                <SubHeading className="mb-3">Attendees</SubHeading>

                <div className="d-flex flex-row align-items-center justify-content-start mb-4">
                  <AvatarGroup max={5}>
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                    <Avatar
                      alt={Faker.name.findName()}
                      src={Faker.image.avatar()}
                    />
                  </AvatarGroup>
                </div>
                <button
                  className="btn btn-outline-text btn-primary"
                  style={{
                    width: "100%",
                  }}
                >
                  Enter stage
                </button>
              </div>
            </SessionPlaybackPreview>
          </WhatsHappeningBody>
        </div>
      </WhatsHappeningAndSponsorGrid>

      <div className="py-4">
        <WhatsHappeningHeading className="mb-4">
          Our partners
        </WhatsHappeningHeading>

        <SponsorTitle className="mb-3">Platinum</SponsorTitle>

        <TierOneGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
            }
          />
          <SponsorCard
            src={
              "http://media.corporate-ir.net/media_files/IROL/17/176060/Oct18/Amazon%20logo.PNG"
            }
          />
          <SponsorCard
            src={
              "https://logos-world.net/wp-content/uploads/2020/04/Facebook-Logo.png"
            }
          />
          <SponsorCard
            src={
              "https://cdn.corporate.walmart.com/dims4/WMT/c2bbbe9/2147483647/strip/true/crop/2389x930+0+0/resize/1446x563!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2Fd6%2Fe7%2F48e91bac4a8ca8f22985b3682370%2Fwalmart-logos-lockupwtag-horiz-blu-rgb.png"
            }
          />
          <SponsorCard
            src={
              "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png"
            }
          />
          <SponsorCard
            src={
              "https://www.zoho.com/sites/default/files/ogimage/zoho-logo.png"
            }
          />
        </TierOneGrid>

        <SponsorTitle className="mb-3">Media partners</SponsorTitle>

        <TierTwoGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CNBC_logo.svg/2560px-CNBC_logo.svg.png"
            }
          />
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/commons/d/db/Forbes_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://assets-global.website-files.com/5ae98eec19474ec4b00cd02a/5bee83f7a69edda26bc5b891_YourStory_Logo-New-01.png"
            }
          />
          <SponsorCard
            src={
              "https://1000logos.net/wp-content/uploads/2017/04/New-York-Times-logo.png"
            }
          />
        </TierTwoGrid>

        <SponsorTitle className="mb-3">Swag partners</SponsorTitle>

        <TierThreeGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierThreeGrid>

        <SponsorTitle className="mb-3">Gold partners</SponsorTitle>

        <TierFourGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierFourGrid>
        <SponsorTitle className="mb-3">Gold partners</SponsorTitle>

        <TierFiveGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierFiveGrid>
        <SponsorTitle className="mb-3">Gold partners</SponsorTitle>

        <TierSixGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierSixGrid>
        <SponsorTitle className="mb-3">Gold partners</SponsorTitle>

        <TierSevenGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierSevenGrid>
        <SponsorTitle className="mb-3">Gold partners</SponsorTitle>

        <TierEightGrid className="mb-5">
          <SponsorCard
            src={
              "https://upload.wikimedia.org/wikipedia/en/1/18/Airtel_logo.svg"
            }
          />
          <SponsorCard src={"https://static.toiimg.com/photo/57268146.cms"} />
          <SponsorCard src={"https://static.toiimg.com/photo/47529300.cms"} />
          <SponsorCard
            src={
              "https://www.titan.co.in/wps/wcm/connect/titan/ae6812fe-6bf7-40b0-99f9-96648df12dbc/TITAN+Logo+new.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80OO8010QKMQAAEP2004-ae6812fe-6bf7-40b0-99f9-96648df12dbc-mFEw0vR"
            }
          />
          <SponsorCard
            src={
              "https://teeandco.lk/media/mgs_brand/1/4/14d4ec6a45ba3271650c22fbe9fa15bc_1.jpg"
            }
          />
        </TierEightGrid>
      </div>
    </>
  );
};

export default About;
