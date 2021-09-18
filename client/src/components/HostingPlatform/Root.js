/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";

import SideNav from "./HelperComponents/SideNav";
import MidTopNav from "./HelperComponents/MidTopNav";

import "./Styles/root.scss";

import Sessions from "./Screens/Sessions";
import LobbyAgenda from "./Screens/LobbyAgenda";
import Networking from "./Screens/Networking";
import Rooms from "./Screens/Rooms";
import Booths from "./Screens/Booths";
import {
  createNewEventAlert,
  createNewEventMsg,
  createNewEventPoll,
  createNewSessionMsg,
  errorTrackerForFetchEvent,
  errorTrackerForFetchingRTCToken,
  fetchEvent,
  fetchEventChats,
  fetchUserAllPersonalData,
  getRTMToken,
  navigationIndexForHostingPlatform,
  updateEventPoll,
} from "../../actions/index";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import { fetchSpeaker } from "../../actions";
import socket from "./../HostingPlatform/service/socket";
import { sessionActions } from "../../reducers/sessionSlice";
import { userActions } from "../../reducers/userSlice";
import { roomsActions } from "../../reducers/roomsSlice";
import Loader from "../Loader";
import Reception from "./Screens/Reception";
import BoothArea from "./Screens/BoothArea";

import styled from "styled-components";

const RootBackground = styled.div`
  background-color: #345b63;

  min-height: 92vh;
`;

const Root = () => {
  const params = useParams();
  const dispatch = useDispatch();

  console.log(params);

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, []);

  const eventId = params.eventId;
  const communityId = params.communityId;

  const isEventLoading = useSelector((state) => state.event.isLoading);
  const eventError = useSelector((state) => state.event.error);

  const { role, id, email } = useSelector((state) => state.eventAccessToken);

  const userDetails = useSelector((state) => state.user.userDetails);

  const eventDetails = useSelector((state) => state.event.eventDetails);

  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForHostingPlatform
  );

  const speaker = useSelector((state) => {
    return state.speaker.speakers.find((speaker) => {
      return speaker.id === id;
    });
  });

  // TODO USER OR HOST

  const event = useSelector((state) => {
    return state.event.events.find((event) => {
      return event.id === eventId;
    });
  });

  console.log(speaker);
  console.log(event);

  useEffect(() => {
    return () => {
      dispatch(navigationIndexForHostingPlatform(0));
    };
  }, [dispatch]);

  const userId = userDetails._id;
  const userName = `${userDetails.firstName} ${userDetails.lastName}`;
  const userImage = userDetails.image ? userDetails.image : " ";
  const userCity = userDetails.city ? userDetails.city : "Los Angeles";
  const userCountry = userDetails.country ? userDetails.country : "USA";
  const userOrganisation = userDetails.organisation
    ? userDetails.organisation
    : "Google Inc.";
  const userDesignation = userDetails.designation
    ? userDetails.designation
    : "Vice President";

  console.log(role, id, email);

  useEffect(() => {
    socket.on("newEventMsg", ({ newMsg }) => {
      console.log(newMsg);
      dispatch(createNewEventMsg(newMsg));
    });
    socket.on("newEventAlert", ({ newAlert }) => {
      console.log(newAlert);
      dispatch(createNewEventAlert(newAlert));
    });
    socket.on("newEventPoll", ({ newPoll }) => {
      console.log(newPoll);
      dispatch(createNewEventPoll(newPoll));
    });
    socket.on("updatedEventPoll", ({ updatedPoll }) => {
      console.log(updatedPoll);
      dispatch(updateEventPoll(updatedPoll));
    });

    socket.on("newSessionMsg", ({ newMsg }) => {
      console.log(newMsg);
      dispatch(createNewSessionMsg(newMsg));
    });

    socket.on("previousEventMessages", ({ chats }) => {
      console.log(chats);
      dispatch(fetchEventChats(chats));
    });

    socket.on("roomChairData", ({ roomChairs }) => {
      console.log(roomChairs);
      dispatch(
        roomsActions.FetchRoomsChairs({
          chairs: roomChairs,
        })
      );
    });

    socket.on("roomSessionData", ({ sessions }) => {
      console.log(sessions);
      dispatch(
        sessionActions.FetchSessionsStatus({
          sessionsStatus: sessions,
        })
      );
    });

    socket.emit(
      "join",
      {
        email,
        eventId,
        userId,
        userName,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        userRole: role,
      },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );

    if (role === "speaker") {
      dispatch(fetchSpeaker(id));
    } else if (role === "audience" || role === "host") {
      dispatch(fetchUserAllPersonalData(id));
    }
  }, [
    dispatch,
    email,
    eventId,
    id,
    role,
    userCity,
    userCountry,
    userName,
    userImage,
    userId,
    userDesignation,
    userOrganisation,
  ]);

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      // console.log(users, "op12324567987652789opopopopopopoppoppoppop");
      dispatch(
        userActions.FetchPeopleInEvent({
          peopleInThisEvent: users,
        })
      );
    });
  }, [dispatch]);

  console.log(isEventLoading);

  // if (isEventLoading) {
  //   return (
  //     <div
  //       className="d-flex flex-row align-items-center justify-content-center"
  //       style={{ width: "100vw", height: "100vh" }}
  //     >
  //       {" "}
  //       <Loader />{" "}
  //     </div>
  //   );
  // }

  if (eventError) {
    alert(eventError);
    dispatch(errorTrackerForFetchEvent());
    return null;
  }

  const handleLobbyClick = () => {
    dispatch(navigationIndexForHostingPlatform(0));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
    );
  };

  const handleSessionsClick = () => {
    dispatch(navigationIndexForHostingPlatform(1));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/Sessions`
    );
  };

  const handleNetworkingClick = () => {
    dispatch(navigationIndexForHostingPlatform(2));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/networking`
    );
  };

  const handleRoomsClick = () => {
    dispatch(navigationIndexForHostingPlatform(3));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/rooms`
    );
  };

  const handleBoothsClick = () => {
    dispatch(navigationIndexForHostingPlatform(4));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/booths`
    );
  };

  const handleReceptionClick = () => {
    dispatch(navigationIndexForHostingPlatform(5));

    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/reception`
    );
  };

  const handleLogoutClick = () => {
    // write logic for logging out here
  };

  currentIndex = currentIndex.toString();

  console.log(currentIndex);

  return (
    <>
      <div className="root-container-grid">
        {/* SideNav */}
        <SideNav
          communityLogo={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${eventDetails.createdBy.image}`}
          communityName={eventDetails.createdBy.name}
          socket={socket}
          activeIndex={currentIndex}
          handleLobbyClick={handleLobbyClick}
          handleSessionsClick={handleSessionsClick}
          handleNetworkingClick={handleNetworkingClick}
          handleRoomsClick={handleRoomsClick}
          handleBoothsClick={handleBoothsClick}
          handleReceptionClick={handleReceptionClick}
          handleLogoutClick={handleLogoutClick}
        />

        {/* Mid container */}
        <div style={{ height: "100vh" }}>
          <MidTopNav eventName={eventDetails.eventName} />
          <div className="main-body-content-h">
            {/* <div className="layer-3-mh py-4 px-5">
              <div style={{ maxWidth: "1360px", margin: "0 auto" }}> */}
            {(() => {
              switch (currentIndex) {
                case "0":
                  return (
                    <RootBackground style={{ position: "relative" }}>
                      <div
                        className="opaque-layer "
                        style={{ height: "100%" }}
                      ></div>
                      <div
                        style={{ maxWidth: "1360px", margin: "0 auto" }}
                        className="py-4 px-5"
                      >
                        <LobbyAgenda socket={socket} />
                      </div>
                    </RootBackground>
                  );

                case "1":
                  return (
                    <RootBackground style={{ position: "relative" }}>
                      <div
                        className="opaque-layer "
                        style={{ height: "100%" }}
                      ></div>
                      <div
                        style={{ maxWidth: "1360px", margin: "0 auto" }}
                        className="py-4 px-5"
                      >
                        <Sessions />{" "}
                      </div>
                    </RootBackground>
                  );

                case "2":
                  return (
                    <RootBackground style={{ position: "relative" }}>
                      <div className="opaque-layer "></div>
                      <div
                        style={{ maxWidth: "1360px", margin: "0 auto" }}
                        className="py-4 px-5"
                      >
                        <Networking />{" "}
                      </div>
                    </RootBackground>
                  );
                case "3":
                  return (
                    <RootBackground style={{ position: "relative" }}>
                      <div
                        className="opaque-layer "
                        style={{ height: "100%" }}
                      ></div>
                      <div
                        style={{ maxWidth: "1360px", margin: "0 auto" }}
                        className="py-4 px-5"
                      >
                        <Rooms />{" "}
                      </div>
                    </RootBackground>
                  );

                case "4":
                  return (
                    <RootBackground style={{ position: "relative" }}>
                      <div
                        className="opaque-layer"
                        style={{ height: "100%" }}
                      ></div>
                      <div
                        style={{ maxWidth: "1360px", margin: "0 auto" }}
                        className="py-4 px-5"
                      >
                        {/* <Booths />{" "} */}
                        <BoothArea />
                      </div>
                    </RootBackground>
                  );
                case "5":
                  return <Reception />;

                default:
                  return <div>You are a User visting hosting platform.</div>;
              }
            })()}
            {/* </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;
