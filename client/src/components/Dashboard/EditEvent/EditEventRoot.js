import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import Topnav from "../HelperComponent/TopNav";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import SideNavEdit from "../HelperComponent/SideNavEdit";

import "./../../../index.css";
import Basics from "./Basics";
import About from "./About";
import Sessions from "./Sessions";
import Speakers from "./Speakers";
import Booths from "./Booths";
import Sponsors from "./Sponsor";
import Ticketing from "./Ticketing";
import Networking from "./Networking";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import {  fetchParticularEventOfCommunity } from "../../../actions";

import { useParams } from "react-router";
import { useEffect } from "react";
import { navigationIndexForEditEvent } from "../../../actions/index";

const EditEventRoot = () => {
  const params = useParams();
  const dispatch = useDispatch();


  const id = params.id; 
    const communityId=params.communityId;

    console.log(id)
  useEffect(() => {
    dispatch(fetchParticularEventOfCommunity(id));
  }, [dispatch, id]);

  useEffect(()=>{
    return ()=>{
      dispatch(navigationIndexForEditEvent(0))
    }
  },[dispatch])

  const handleBasicsClick = () => {
    dispatch(navigationIndexForEditEvent(0));
    history.push(`/community/${communityId}/edit-event/${id}/basics`);
  };

  const handleAboutClick = () => {
    dispatch(navigationIndexForEditEvent(1));
    history.push(`/community/${communityId}/edit-event/${id}/about-event`);
  };

  const handleSessionsClick = () => {
    dispatch(navigationIndexForEditEvent(2));
    history.push(`/community/${communityId}/edit-event/${id}/sessions`);
  };

  const handleSpeakersClick = () => {
    dispatch(navigationIndexForEditEvent(3));
    history.push(`/community/${communityId}/edit-event/${id}/speakers`);
  };

  const handleBoothsClick = () => {
    dispatch(navigationIndexForEditEvent(4));
    history.push(`/community/${communityId}/edit-event/${id}/booths`);
  };

  const handleSponsorsClick = () => {
    dispatch(navigationIndexForEditEvent(5));
    history.push(`/community/${communityId}/edit-event/${id}/sponsors`);
  };

  const handleTicketingClick = () => {
    dispatch(navigationIndexForEditEvent(6));
    history.push(`/community/${communityId}/edit-event/${id}/ticketing`);
  };

  const handleNetworkingClick = () => {
    dispatch(navigationIndexForEditEvent(7));
    history.push(`/community/${communityId}/edit-event/${id}/networking`);
  };
  let currentIndex = useSelector((state) => state.navigation.currentIndexForEditEvent);
  currentIndex = currentIndex.toString();

  console.log(currentIndex);
  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav />
        {/* Body section - left(side nav) & right(body content) */}
        <div className="dashboard-body">
          <SideNavEdit
            activeIndex={currentIndex}
            handleBasicsClick={handleBasicsClick}
            handleAboutClick={handleAboutClick}
            handleSessionsClick={handleSessionsClick}
            handleSpeakersClick={handleSpeakersClick}
            handleBoothsClick={handleBoothsClick}
            handleSponsorsClick={handleSponsorsClick}
            handleTicketingClick={handleTicketingClick}
            handleNetworkingClick={handleNetworkingClick}
          />

          <div className="main-content-wrapper">
            {(() => {
              switch (currentIndex) {
                case "0":
                  return <Basics />;

                case "1":
                  return <About />;

                case "2":
                  return <Sessions />;

                case "3":
                  return <Speakers />;

                case "4":
                  return <Booths />;

                case "5":
                  return <Sponsors />;

                case "6":
                  return <Ticketing />;

                case "7":
                  return <Networking />;

                default:
                  return <div>You are a community Editing an event.</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEventRoot;
