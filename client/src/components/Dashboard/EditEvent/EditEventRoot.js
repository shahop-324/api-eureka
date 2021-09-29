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
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { Link } from "react-router-dom";

import EventOverview from "./Overview";
import EventEntryAndParticipants from "./EventEntryAndParticipants";

import Recordings from "./../Recordings";
import Integrations from "./../SpecificEvent/Pages/Integrations";
import Affiliates from "./../SpecificEvent/Pages/Affiliate";
import Reviews from "./../Reviews";
import Coupons from "./../Coupons";
import Tracking from "./Tracking";
import EventSchedule from "./EventSchedule";

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

  const handleEventOverviewClick = () => {
    dispatch(navigationIndexForEditEvent(0));
    history.push(`/community/${communityId}/edit-event/${id}/event-overview`);
  };
  const handleEventEntryAndParticipantsClick = () => {
    dispatch(navigationIndexForEditEvent(1));
    history.push(
      `/community/${communityId}/edit-event/${id}/event-entry-and-participants`
    );
  };
  const handleScheduleClick = () => {
    dispatch(navigationIndexForEditEvent(2));
    history.push(
      `/community/${communityId}/edit-event/${id}/schedule`
    );
  };

  const handleSessionsClick = () => {
    dispatch(navigationIndexForEditEvent(3));
    history.push(`/community/${communityId}/edit-event/${id}/sessions`);
  };

  const handleSpeakersClick = () => {
    dispatch(navigationIndexForEditEvent(4));
    history.push(`/community/${communityId}/edit-event/${id}/speakers`);
  };

  const handleBoothsClick = () => {
    dispatch(navigationIndexForEditEvent(5));
    history.push(`/community/${communityId}/edit-event/${id}/booths`);
  };

  const handleSponsorsClick = () => {
    dispatch(navigationIndexForEditEvent(6));
    history.push(`/community/${communityId}/edit-event/${id}/sponsors`);
  };

  const handleTicketingClick = () => {
    dispatch(navigationIndexForEditEvent(7));
    history.push(`/community/${communityId}/edit-event/${id}/ticketing`);
  };

  const handleReceptionSettingsClick = () => {
    dispatch(navigationIndexForEditEvent(8));
    history.push(
      `/community/${communityId}/edit-event/${id}/reception-settings`
    );
  };
  const handleVideosClick = () => {
    dispatch(navigationIndexForEditEvent(9));
    history.push(`/community/${communityId}/edit-event/${id}/videos`);
  };
  const handleStageVibesClick = () => {
    dispatch(navigationIndexForEditEvent(10));
    history.push(`/community/${communityId}/edit-event/${id}/stage-vibes`);
  };
  const handleRecordingClick = () => {
    dispatch(navigationIndexForEditEvent(11));
    history.push(`/community/${communityId}/edit-event/${id}/recording`);
  };
  const handleAnalyticsClick = () => {
    dispatch(navigationIndexForEditEvent(12));
    history.push(`/community/${communityId}/edit-event/${id}/analytics`);
  };
  const handleLiveStreamingClick = () => {
    dispatch(navigationIndexForEditEvent(13));
    history.push(`/community/${communityId}/edit-event/${id}/live-stream`);
  };
  const handleIntegrationsClick = () => {
    dispatch(navigationIndexForEditEvent(14));
    history.push(`/community/${communityId}/edit-event/${id}/integrations`);
  };
  const handleCouponsClick = () => {
    dispatch(navigationIndexForEditEvent(15));
    history.push(`/community/${communityId}/edit-event/${id}/coupons`);
  };
  const handleMailingClick = () => {
    dispatch(navigationIndexForEditEvent(16));
    history.push(`/community/${communityId}/edit-event/${id}/mailing`);
  };
  const handleAffliateClick = () => {
    dispatch(navigationIndexForEditEvent(17));
    history.push(`/community/${communityId}/edit-event/${id}/affiliates`);
  };
  const handleReviewsClick = () => {
    dispatch(navigationIndexForEditEvent(18));
    history.push(`/community/${communityId}/edit-event/${id}/reviews`);
  };
  const handleTrackingClick = () => {
    dispatch(navigationIndexForEditEvent(19));
    history.push(`/community/${communityId}/edit-event/${id}/tracking`);
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
              <IconButton aria-label="back" className="ms-4">
                <ArrowBackIosRoundedIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Link>

            {/* <button onClick={() => {
             dispatch(editEvent({publishedStatus: "Published"}, id)) 
            }} className="publish-btn-lg btn btn-outline-primary btn-outline-text" style={{fontSize: "0.8rem", maxWidth: "200px", justifySelf: "end"}}>
              Publish
            </button> */}
          </div>

          <div className="d-flex flex-row align-items-center">
            <div className="event-name-head-text me-3">
              Confulence Global Summit 2021
            </div>
            <Chip
              label="Upcoming"
              variant="outlined"
              style={{ color: "#538BF7", border: "1px solid #538BF7" }}
            />
          </div>
          <div className="d-flex flex-row align-items-center justify-content-end me-3">
            <button className="btn btn-outline-dark btn-outline-text me-3">
              More actions
            </button>
            <button className="btn btn-primary btn-outline-text">
              View event
            </button>
            {/* <button
              onClick={() => {
                dispatch(editEvent({ publishedStatus: "Published" }, id));
              }}
              className="publish-btn-sm btn btn-outline-primary btn-outline-text"
              style={{
                fontSize: "0.8rem",
                maxWidth: "200px",
                justifySelf: "end",
              }}
            >
              Publish
            </button> */}
          </div>
        </div>
        {/* Body section - left(side nav) & right(body content) */}
        <div className="dashboard-body dashboard-body-edit">
          <SideNavEdit
            activeIndex={currentIndex}
            handleEventOverviewClick={handleEventOverviewClick}
            handleEventEntryAndParticipantsClick={
              handleEventEntryAndParticipantsClick
            }
            handleScheduleClick={handleScheduleClick}
            handleSessionsClick={handleSessionsClick}
            handleSpeakersClick={handleSpeakersClick}
            handleBoothsClick={handleBoothsClick}
            handleSponsorsClick={handleSponsorsClick}
            handleTicketingClick={handleTicketingClick}
            handleReceptionSettingsClick={handleReceptionSettingsClick}
            handleVideosClick={handleVideosClick}
            handleStageVibesClick={handleStageVibesClick}
            handleLiveStreamingClick={handleLiveStreamingClick}
            handleRecordingClick={handleRecordingClick}
            handleAnalyticsClick={handleAnalyticsClick}
            handleIntegrationsClick={handleIntegrationsClick}
            handleCouponsClick={handleCouponsClick}
            handleAffliateClick={handleAffliateClick}
            handleMailingClick={handleMailingClick}
            handleReviewsClick={handleReviewsClick}
            handleTrackingClick={handleTrackingClick}
          />
          <SideNavEditLean
            activeIndex={currentIndex}
            handleEventOverviewClick={handleEventOverviewClick}
            handleEventEntryAndParticipantsClick={
              handleEventEntryAndParticipantsClick
            }
            handleScheduleClick={handleScheduleClick}
            handleSessionsClick={handleSessionsClick}
            handleSpeakersClick={handleSpeakersClick}
            handleBoothsClick={handleBoothsClick}
            handleSponsorsClick={handleSponsorsClick}
            handleTicketingClick={handleTicketingClick}
            handleReceptionSettingsClick={handleReceptionSettingsClick}
            handleVideosClick={handleVideosClick}
            handleStageVibesClick={handleStageVibesClick}
            handleLiveStreamingClick={handleLiveStreamingClick}
            handleRecordingClick={handleRecordingClick}
            handleAnalyticsClick={handleAnalyticsClick}
            handleIntegrationsClick={handleIntegrationsClick}
            handleCouponsClick={handleCouponsClick}
            handleAffliateClick={handleAffliateClick}
            handleMailingClick={handleMailingClick}
            handleReviewsClick={handleReviewsClick}
            handleTrackingClick={handleTrackingClick}
          />

          <div className="main-content-wrapper" style={{ height: "83vh" }}>
            {(() => {
              switch (currentIndex) {
                case "0":
                  return <EventOverview />;

                case "1":
                  return <EventEntryAndParticipants />;

                case "2":
                  return <EventSchedule />;

                case "3":
                  return (
                    <ErrorBoundriesEditEventSession>
                      <Sessions />
                    </ErrorBoundriesEditEventSession>
                  );

                case "4":
                  return (
                    <ErrorBoundriesEditEventSpeakers>
                      <Speakers />
                    </ErrorBoundriesEditEventSpeakers>
                  );

                case "5":
                  return (
                    <ErrorBoundriesEditEventBooths>
                      <Booths />
                    </ErrorBoundriesEditEventBooths>
                  );
                case "6":
                  return (
                    <ErrorBoundriesEditEventSponsors>
                      <Sponsors />
                    </ErrorBoundriesEditEventSponsors>
                  );
                case "7":
                  return (
                    <ErrorBoundriesEditEventTickets>
                      <Ticketing />
                    </ErrorBoundriesEditEventTickets>
                  );

                case "8":
                  return <div>This is for reception settings</div>;
                case "9":
                  return <div>Videos</div>;
                case "10":
                  return <div>Stage vibes</div>;
                case "11":
                  return <Recordings />;
                case "12":
                  return <div>Analytics</div>;
                case "13":
                  return <div>Live stream</div>;
                case "14":
                  return <Integrations />;
                case "15":
                  return <Coupons />;
                case "16":
                  return <div>Mailing</div>;
                case "17":
                  return <Affiliates />;
                case "18":
                  return <Reviews />;
                case "19":
                  return <Tracking />;

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
