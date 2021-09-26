import React, { useState } from "react";
import VerticalTabsProfile from "./UserAccountVerticalTabsProfile";
import {
  CustomHorizontalTabWarpper,
  CustomTabButton,
  FormLabel,
  EventCardsGrid,
  EventCardWrapper,
  EventCardImg,
  EventCardEventName,
  EventCardEventTimeLine,
  EventCardEventPriceRange,
} from "./Elements";

import EditProfileForm from "./Forms/EditProfileForm";
import EditNotificationSettings from "./Forms/EditNotificationSettings";
import UserBookedTickets from "./Forms/UserBookedTickets";
import ResetPasswordAndDeactivation from "./Forms/ResetPasswordAndDeactivation";

import Fab from "@material-ui/core/Fab";
import FavoriteIcon from "@material-ui/icons/Favorite";
// import { useSnackbar } from "notistack";

const EventCard = () => {
  return (
    <>
      <EventCardWrapper>
        <div className="favourite-icon">
          <Fab
            aria-label="like"
            style={{
              position: "absolute",
              right: "10px",
              top: "90px",
              zIndex: "90",
            }}
            size="small"
          >
            <FavoriteIcon className="favourite-icon" />
          </Fab>
        </div>
        <EventCardImg
          src={
            "https://images.unsplash.com/photo-1511578314322-379afb476865?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZXZlbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
          }
        ></EventCardImg>
        <div className="px-3 py-3">
          <EventCardEventName className="mb-4">
            Secure sites using ssl
          </EventCardEventName>
          <EventCardEventTimeLine className="mb-4">
            10 Feb 2021 - 12 Mar 2022
          </EventCardEventTimeLine>
          <EventCardEventPriceRange>$10.0 to $100.00</EventCardEventPriceRange>
        </div>
      </EventCardWrapper>
    </>
  );
};

const UserAccountProfileMainBody = () => {
  const [selectedTab, setSelectedTab] = useState("myprofile");

  return (
    <>
      <div
        className="user-account-main-body-home-content pt-3 px-4"
        style={{ overflow: "auto", height: "85vh", width: "100% !important" }}
      >
        {/* <VerticalTabsProfile /> */}
        <CustomHorizontalTabWarpper
          className=" mb-4"
          style={{ maxWidth: "500px" }}
        >
          <CustomTabButton
            active={selectedTab === "myprofile" ? true : false}
            onClick={() => {
              setSelectedTab("myprofile");
            }}
          >
            My profile
          </CustomTabButton>
          <CustomTabButton
            active={selectedTab === "settings" ? true : false}
            onClick={() => {
              setSelectedTab("settings");
            }}
          >
            Settings
          </CustomTabButton>
          <CustomTabButton
            active={selectedTab === "favourites" ? true : false}
            onClick={() => {
              setSelectedTab("favourites");
            }}
          >
            Favourites
          </CustomTabButton>
        </CustomHorizontalTabWarpper>

        <div className="my-3 pt-3">
          {(() => {
            switch (selectedTab) {
              case "myprofile":
                return (
                  <div
                    className="d-flex flex-row align-items-center justify-content-center"
                    style={{ width: "100%", margin: "0 auto !important" }}
                  >
                    {" "}
                    <EditProfileForm />{" "}
                  </div>
                );

              case "settings":
                return (
                  <>
                    <div
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{ width: "100%", margin: "0 auto !important" }}
                    >
                      <EditNotificationSettings />
                      <ResetPasswordAndDeactivation />
                    </div>
                  </>
                );
               
              case "favourites":
                return (
                  <>

<EventCardsGrid>
          <EventCard></EventCard>
          <EventCard></EventCard>
          <EventCard></EventCard>
          <EventCard></EventCard> <EventCard></EventCard>{" "}
          <EventCard></EventCard> <EventCard></EventCard>
        </EventCardsGrid>

                  </>
                )
                break;

              default:
                break;
            }
          })()}
        </div>
      </div>
    </>
  );
};

export default UserAccountProfileMainBody;
