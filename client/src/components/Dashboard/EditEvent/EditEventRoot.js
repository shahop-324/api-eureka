/* eslint-disable no-unused-vars */
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
import {
  editEvent,
  errorTrackerForFetchParticularEventOfCommunity,
  fetchParticularEventOfCommunity,
} from "../../../actions";

import { useParams } from "react-router";
import { useEffect } from "react";
import { navigationIndexForEditEvent } from "../../../actions/index";
import ErrorBoundriesEditEventSpeakers from "../../ErrorBoundries/ErrorBoundriesEditEventSpeakers";
import ErrorBoundriesEditEventSession from "../../ErrorBoundries/ErrorBoundriesEditEventSession";

import ErrorBoundriesEditEventBooths from "../../ErrorBoundries/ErrorBoundriesEditEventBooths";
import ErrorBoundriesEditEventSponsors from "../../ErrorBoundries/ErrorBoundriesEditEventSponsors";
import ErrorBoundriesEditEventTickets from "../../ErrorBoundries/ErrorBoundriesEditEventTicketing";

import { useSnackbar } from "notistack";
import SideNavEditLean from "../HelperComponent/SideNavEditLean";
import { Chip, IconButton } from "@material-ui/core";
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { Link } from "react-router-dom";

const EditEventRoot = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const id = params.id;

  // const eventId = params.eventId;

  const communityId = params.communityId;

  const { enqueueSnackbar } = useSnackbar();

  const userId = useSelector((state) => state.user.userDetails._id);

  const { error, isLoading } = useSelector((state) => state.event);

  console.log(id);
  useEffect(() => {
    dispatch(fetchParticularEventOfCommunity(id));
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch(navigationIndexForEditEvent(0));
    };
  }, [dispatch]);

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
  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForEditEvent
  );
  currentIndex = currentIndex.toString();

  console.log(currentIndex);

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });

    return dispatch(errorTrackerForFetchParticularEventOfCommunity());
  }

  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav />
        <div className="dashboard-event-section-head py-2 pe-3">
          <div className="d-flex flex-row align-items-center">
          <Link
              to={`/user/${userId}/community/event-management/${communityId}`}
              className="me-3"
            >
              <IconButton aria-label="back" className="ms-4" >
                <ArrowBackIosRoundedIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Link>

            <button onClick={() => {
             dispatch(editEvent({publishedStatus: "Published"}, id)) 
            }} className="publish-btn-lg btn btn-outline-primary btn-outline-text" style={{fontSize: "0.8rem", maxWidth: "200px", justifySelf: "end"}}>
              Publish
            </button>
          </div>
           
            <div className="d-flex flex-row align-items-center">
            <div className="event-name-head-text me-3">Confulence Global Summit 2021</div>
            <Chip label="Upcoming" variant="outlined" style={{color: "#538BF7", border: "1px solid #538BF7"}} />
            </div>
            <button onClick={() => {
               dispatch(editEvent({publishedStatus: "Published"}, id)) 
            }} className="publish-btn-sm btn btn-outline-primary btn-outline-text" style={{fontSize: "0.8rem", maxWidth: "200px", justifySelf: "end"}}>
              Publish
            </button>
            
          </div>
        {/* Body section - left(side nav) & right(body content) */}
        <div className="dashboard-body dashboard-body-edit">
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
          <SideNavEditLean
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

          <div className="main-content-wrapper" style={{height: "83vh"}}>
            {(() => {
              switch (currentIndex) {
                case "0":
                  return <Basics />;

                case "1":
                  return <About />;

                case "2":
                  return (
                    <ErrorBoundriesEditEventSession>
                      <Sessions />
                    </ErrorBoundriesEditEventSession>
                  );

                case "3":
                  return (
                    <ErrorBoundriesEditEventSpeakers>
                      <Speakers />
                    </ErrorBoundriesEditEventSpeakers>
                  );

                case "4":
                  return (
                    <ErrorBoundriesEditEventBooths>
                      <Booths />
                    </ErrorBoundriesEditEventBooths>
                  );
                case "5":
                  return (
                    <ErrorBoundriesEditEventSponsors>
                      <Sponsors />
                    </ErrorBoundriesEditEventSponsors>
                  );
                case "6":
                  return (
                    <ErrorBoundriesEditEventTickets>
                      <Ticketing />
                    </ErrorBoundriesEditEventTickets>
                  );

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
