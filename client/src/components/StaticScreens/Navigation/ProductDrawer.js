import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import styled from "styled-components";

import CameraIndoorRoundedIcon from "@mui/icons-material/CameraIndoorRounded";
import StreamRoundedIcon from "@mui/icons-material/StreamRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";

import GamepadRoundedIcon from "@mui/icons-material/GamepadRounded";
import SettingsEthernetRoundedIcon from "@mui/icons-material/SettingsEthernetRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";

const Paper = styled.div`
  width: 100%;
  height: 450px;
  background-color: #ffffff;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
`;

const WhatsNew = styled.div`
  height: 100%;
`;

const Products = styled.div`
  height: 100%;
  border-left: 1px solid #dbdbdb;
`;

const Platform = styled.div`
  height: 100%;
`;

const WhatsNewCard = styled.div`
  height: 160px;
  width: 100%;
  border: 1px solid #dadada;
  border-radius: 10px;

  &:hover {
    background-color: #d4e3f6;
    cursor: pointer;
    border: 1px solid #d4e3f6;
  }
`;

const NavSectionHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;

const WhatsNewHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #333333;
`;

const WhatsNewParagraph = styled.p`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.75rem;
  color: #333333;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: row;

  border-radius: 10px;
  padding: 10px;
  &:hover {
    background-color: #d4e3f6;
    cursor: pointer;
  }
`;

const ProductIcon = styled.div`
  border-radius: 10px;
  border: 1px solid #152d35;
  background-color: #152d3f;
  color: #ffffff;

  height: fit-content;
`;

const ProductName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #212121;
`;

const ProductCatchLine = styled.div`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.78rem;
  color: #2c2c2c;
`;

const ProductDrawer = ({ openDrawer, handleCloseDrawer }) => {
  return (
    <>
      <React.Fragment key="top">
        <SwipeableDrawer
          anchor="top"
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
          open={openDrawer}
          disableBackdropTransition={true}
        >
          {/* <TopNav /> */}
          <Paper className="px-4 py-3 container">
            <WhatsNew className="px-3 py-3">
              <NavSectionHeading className="mb-3">What's new</NavSectionHeading>
              <WhatsNewCard className="mb-3 p-3">
                <WhatsNewHeading className="mb-3">
                  Unvieling New Bluemeet studio: Video for the enterprise
                </WhatsNewHeading>
                <WhatsNewParagraph>
                  Bluemeet is expanding our enterprise grade offering - with all
                  new bluemeet stage for hosting all purspose professional video
                  streams with an easy to use setup.
                </WhatsNewParagraph>
              </WhatsNewCard>
              <WhatsNewCard className="mb-3 p-3">
                <WhatsNewHeading className="mb-3">
                  Introducing most advanced event gamification for rich event
                  experiences
                </WhatsNewHeading>
                <WhatsNewParagraph>
                  Bluemeet is expanding beyond just a video streaming platform
                  by providing rich gamification methods to engage everyone in
                  the event.
                </WhatsNewParagraph>
              </WhatsNewCard>
            </WhatsNew>
            <Products className="px-4 py-3">
              <NavSectionHeading className="mb-5">Products</NavSectionHeading>

              <ProductCard className="mb-4">
                <ProductIcon className="p-1 me-3">
                  <StreamRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2"> Virtual venue</ProductName>
                  <ProductCatchLine>
                    Amaze your audience with your interactive events
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#4FBCEE",
                    border: "1px solid #4FBCEE",
                  }}
                >
                  <CameraIndoorRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2"> Studio</ProductName>
                  <ProductCatchLine>
                    Produce professional, high quality streams with ease.
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#6A883A",
                    border: "1px solid #6A883A",
                  }}
                >
                  <MarkEmailUnreadRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Event marketing</ProductName>
                  <ProductCatchLine>
                    Promote beautiful landing pages that drive registrations
                  </ProductCatchLine>
                </div>
              </ProductCard>
            </Products>

            <Platform className="px-4 py-3">
              <NavSectionHeading className="mb-5">Platform</NavSectionHeading>

              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#6044BE",
                    border: "1px solid #6044BE",
                  }}
                >
                  <GamepadRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">
                    Advanced gamification
                  </ProductName>
                  <ProductCatchLine>
                    Increase event enagement and ROI at same time using our
                    advance gamification tools.
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#BE44BE",
                    border: "1px solid #BE44BE",
                  }}
                >
                  <SettingsEthernetRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Integrations</ProductName>
                  <ProductCatchLine>
                    Connect bluemeet to your apps and services
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#6A883A",
                    border: "1px solid #B9B144",
                  }}
                >
                  <AdminPanelSettingsRoundedIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Security</ProductName>
                  <ProductCatchLine>
                    Protect your events with enterprise grade security
                  </ProductCatchLine>
                </div>
              </ProductCard>
            </Platform>
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ProductDrawer;
