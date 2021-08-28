import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import Topnav from "../HelperComponent/TopNav";
import "./../../../assets/Sass/EditEvent/Basics.scss";

import "./../../../index.css";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import { fetchParticularEventOfCommunity } from "../../../actions";

import { useParams } from "react-router";
import { useEffect } from "react";
import { navigationIndexForSpecificEvent } from "../../../actions/index";
import SideNav from "./sideNav";
import Registrations from "./Pages/Registrations";
import Queries from "./Pages/Queries";
import Reviews from "./Pages/Reviews";
import EventAnalytics from "./Pages/Analytics";
import Affiliate from "./Pages/Affiliate";
import InterestedPeople from "./Pages/InterestedPeople";
import Leads from "./Pages/Leads";
import CheckIns from "./Pages/CheckIns";
import MailCampaign from "./Pages/MailCampaign";
import ErrorBoundriesRegistrations from "../../ErrorBoundries/ErrorBoundriesRegistrations";

/* <Link to={`/user/${userId}/community/${communityId}/event/${eventId}`} style={{width: "100%"}}> 
            </Link> */

const SpecificEventRoot = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const eventId = params.eventId;
  const communityId = params.communityId;
  const userId = params.userId;

  console.log(eventId);
  useEffect(() => {
    dispatch(fetchParticularEventOfCommunity(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    return () => {
      dispatch(navigationIndexForSpecificEvent(1));
    };
  }, [dispatch]);

  const handleEditEventClick = () => {
    history.push(`/community/${communityId}/edit-event/${eventId}/basics`);
  };

  const handlePreAnalyticsClick = () => {
    dispatch(navigationIndexForSpecificEvent(1));
    // /user/${userId}/community/${communityId}/event/${eventId}
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/pre-analytics`
    );
  };

  const handleRegistrationsClick = () => {
    dispatch(navigationIndexForSpecificEvent(2));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/registrations`
    );
  };

  const handleQueriesClick = () => {
    dispatch(navigationIndexForSpecificEvent(3));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/queries`
    );
  };

  const handleReviewsClick = () => {
    dispatch(navigationIndexForSpecificEvent(4));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/reviews`
    );
  };

  const handlePostAnalyticsClick = () => {
    dispatch(navigationIndexForSpecificEvent(5));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/post-analytics`
    );
  };

  const handlePollsClick = () => {
    dispatch(navigationIndexForSpecificEvent(6));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/polls`
    );
  };

  const handleStageCustomisationClick = () => {
    dispatch(navigationIndexForSpecificEvent(7));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/stage-customisation`
    );
  };

  const handleUploadedContentClick = () => {
    dispatch(navigationIndexForSpecificEvent(8));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/uploaded-content`
    );
  };
  const handleRTMPAndLiveStreamingClick = () => {
    dispatch(navigationIndexForSpecificEvent(9));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/rtmp-and-live-streaming`
    );
  };
  const handleIntegrationsClick = () => {
    dispatch(navigationIndexForSpecificEvent(10));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/integrations`
    );
  };
  const handleEmailCustomisationClick = () => {
    dispatch(navigationIndexForSpecificEvent(11));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/email-customisation`
    );
  };
  const handleSecurityChecksClick = () => {
    dispatch(navigationIndexForSpecificEvent(12));
    history.push(
      `/user/${userId}/community/${communityId}/event/${eventId}/security-checks`
    );
  };
  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForSpecificEvent
  );
  currentIndex = currentIndex.toString();

  console.log(currentIndex);
  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav />
        {/* Body section - left(side nav) & right(body content) */}
        <div className="dashboard-body">
          <SideNav
            activeIndex={currentIndex}
            handleEditEventClick={handleEditEventClick}
            handlePreAnalyticsClick={handlePreAnalyticsClick}
            handleRegistrationsClick={handleRegistrationsClick}
            handleQueriesClick={handleQueriesClick}
            handleReviewsClick={handleReviewsClick}
            handlePostAnalyticsClick={handlePostAnalyticsClick}
            handlePollsClick={handlePollsClick}
            handleStageCustomisationClick={handleStageCustomisationClick}
            handleUploadedContentClick={handleUploadedContentClick}
            handleRTMPAndLiveStreamingClick={handleRTMPAndLiveStreamingClick}
            handleIntegrationsClick={handleIntegrationsClick}
            handleEmailCustomisationClick={handleEmailCustomisationClick}
            handleSecurityChecksClick={handleSecurityChecksClick}
          />

          <div className="main-content-wrapper">
            {(() => {
              switch (currentIndex) {
                case "1":
                  return <EventAnalytics />;

                case "2":
                  return (
                    <ErrorBoundriesRegistrations>
                      <Registrations />
                    </ErrorBoundriesRegistrations>
                  );

                case "3":
                  return <Queries />;

                case "4":
                  return <Reviews />;

                case "5":
                  return <Affiliate />;

                case "6":
                  return <InterestedPeople />;

                case "7":
                  return <Leads />;

                case "8":
                  return <CheckIns />;

                case "9":
                  return <MailCampaign />;

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

export default SpecificEventRoot;
