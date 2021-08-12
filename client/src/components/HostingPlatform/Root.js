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
  errorTrackerForFetchEvent,
  errorTrackerForFetchingRTCToken,
  fetchEvent,
  fetchEventChats,
  fetchUserAllPersonalData,
  getRTMToken,
  navigationIndexForHostingPlatform,
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

const Root = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.RTM);

  const isEventLoading = useSelector((state) => state.event.isLoading);
  const eventError = useSelector((state) => state.event.error);

  console.log(params);

  const eventId = params.eventId;
  const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);

  const {eventName, createdBy} = useSelector((state) => state.event.eventDetails);

  const { role, id, email } = useSelector((state) => state.eventAccessToken);

  const userDetails = useSelector((state) => state.user.userDetails);

  const communityLogo = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${createdBy.image}`;

  const communityName = createdBy.name;

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

    dispatch(getRTMToken(eventId));

    socket.on("previousEventMessages", ({chats}) => {
      console.log(chats);
     dispatch(fetchEventChats(chats));
    })

    socket.on("roomChairData", ({roomChairs}) => {
      console.log(roomChairs);
      dispatch(roomsActions.FetchRoomsChairs({
        chairs: roomChairs,
      }))
    });

    socket.on("roomSessionData", ({ sessions }) => {
      console.log(sessions);
      dispatch(
        sessionActions.FetchSessionsStatus({
          sessionsStatus: sessions,
        })
      );
    });

    socket.on("updatedSession", ({ session }) => {
      console.log(session);

      dispatch(
        sessionActions.EditSession({
          session: session,
        })
      );
    });

    // dispatch(getCurrentUsers(eventId));
    console.log(eventId);
    // socket = io("http://localhost:3000");

    // dispatch(createSocket(socket));

    //console.log(socket);
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
    dispatch(fetchEvent(eventId));

    // return ()=>{
    //  socket.emit('disconnection')
    //  socket.off();
    // }
  }, [dispatch, email, eventId, id, role, userCity, userCountry, userName, userImage, userId, userDesignation, userOrganisation]);

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

  const handleLogoutClick = () => {
    // write logic for logging out here
  };

  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForHostingPlatform
  );
  currentIndex = currentIndex.toString();

  console.log(currentIndex);

  if(isLoading) {
    return (<div className="d-flex flex-row align-items-center justify-content-center" style={{width: "100vw", height: "100vh"}}> <Loader/> </div>);
  }

  if(error) {
    dispatch(errorTrackerForFetchingRTCToken());
    alert(error);
    return;
  }

  return (
    <>
      <div className="root-container-grid">
        {/* SideNav */}
        <SideNav
        communityLogo={communityLogo}
        communityName={communityName}
          socket={socket}
          activeIndex={currentIndex}
          handleLobbyClick={handleLobbyClick}
          handleSessionsClick={handleSessionsClick}
          handleNetworkingClick={handleNetworkingClick}
          handleRoomsClick={handleRoomsClick}
          handleBoothsClick={handleBoothsClick}
          handleLogoutClick={handleLogoutClick}
        />

        {/* Mid container */}
        <div style={{ height: "100vh" }}>
          <MidTopNav 
          eventName={eventName}
          />
          <div className="main-body-content-h">
            <div className="layer-3-mh py-4 px-5">
              <div style={{ maxWidth: "1360px" }}>
                {(() => {
                  switch (currentIndex) {
                    case "0":
                      return <LobbyAgenda socket={socket} />;

                    case "1":
                      return <Sessions />;

                    case "2":
                      return <Networking />;

                    case "3":
                      return <Rooms />;

                    case "4":
                      return <Booths />;

                    default:
                      return (
                        <div>You are a User visting hosting platform.</div>
                      );
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;
