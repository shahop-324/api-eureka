import React from "react";
import VerticalTabs from "./UserAccountVerticalTabs";

import {
  DashboardSectionHeading,
  EventCardsGrid,
  EventCardWrapper,
  EventCardImg,
  EventCardEventName,
  EventCardEventTimeLine,
  EventCardEventPriceRange,
} from "./Elements";

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

const UserAccountHomeMainBody = () => {
  //   const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //   const { signInSucceded } = useSelector((state) => state.auth);

  //   if (signInSucceded) {
  //     enqueueSnackbar("Signed in successfully 🥳 !", {
  //       variant: "success",
  //     });
  //   }

  return (
    <div className="user-account-main-body-home-content">
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "100%" }}
      >
        <DashboardSectionHeading className="pb-4 ps-4">
          Your Upcoming Events
        </DashboardSectionHeading>
        {/* <VerticalTabs /> */}

        <EventCardsGrid>
          <EventCard></EventCard>
          <EventCard></EventCard>
          <EventCard></EventCard>
          <EventCard></EventCard> <EventCard></EventCard>{" "}
          <EventCard></EventCard> <EventCard></EventCard>
        </EventCardsGrid>
      </div>
    </div>
  );
};

export default UserAccountHomeMainBody;
