/* eslint-disable no-unused-vars */
import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Topnav from "./HelperComponent/TopNav";
import SideNav from "./HelperComponent/SideNav";
import {
  errorTrackerForFetchCommunity,
  fetchCommunity,
  navigationIndexForCommunityDash,
} from "../../actions/index";
import Overview from "./Overview";
import EventManagement from "./EventManagement";
import Reviews from "./Reviews";
import Queries from "./Queries";
import Registrations from "./Registrations";
import Coupons from "./Coupons";
import Recordings from "./Recordings";
import Billing from "./Billing";
import TeamManagement from "./TeamManagement";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import { useParams } from "react-router";
import { useEffect } from "react";
import RevenueManagement from "./RevenueManagement";

import ErrorBoundriesDashboardOverview from "../ErrorBoundries/ErrorBoundriesDashboardOverview";

import ErrorBoundriesBilling from "../ErrorBoundries/ErrorBoundriesDashboardBilling";
import ErrorBoundriesCoupons from "../ErrorBoundries/ErrorBoundriesDashboardCoupons";
import ErrorBoundriesRecordings from "../ErrorBoundries/ErrorBoundriesDashboardRecordings";
import ErrorBoundriesRegistrations from "../ErrorBoundries/ErrorBoundriesDashboardRegistrations";
import ErrorBoundriesRevenueManagement from "../ErrorBoundries/ErrorBoundriesDashboardRevenueManagement";
import ErrorBoundriesReviews from "../ErrorBoundries/ErrorBoundariesDashboardReviews";
import ErrorBoundriesTeamManagement from "../ErrorBoundries/ErrorBoundriesDashboardTeamManagement";
import ErrorBoundriesQueries from "../ErrorBoundries/ErrorBoundriesDashboardQueries";
import ErrorBoundriesEventManagement from "../ErrorBoundries/ErrorBoundriesDashboardEventManagement";

import ErrorBoundary from "../ErrorBoundries/ErrorBoundriesDashboardOverview";
import Integrations from "./Integrations";
import Scheduler from "./Scheduler";
import SideNavLean from "./HelperComponent/SideNavLean";

const DashboardRoot = () => {
  console.log(window.paypal);

  const params = useParams();

  const { error, isLoading } = useSelector((state) => state.community);

  const dispatch = useDispatch();
  const id = params.id;
  const userId = params.userId;
  console.log(userId);
  useEffect(() => {
    dispatch(fetchCommunity(id));
  }, [id, dispatch]);
  useEffect(() => {
    return () => {
      console.log("cleaned up");
      dispatch(navigationIndexForCommunityDash(0));
    };
  }, [dispatch]);

  const handleGettingStartedClick = () => {
    dispatch(navigationIndexForCommunityDash(0));
    history.push(`/user/${userId}/community/getting-started/${id}`);
  };

  const handleEventsClick = () => {
    console.log("handle event was clicked");
    dispatch(navigationIndexForCommunityDash(1));
    history.push(
      `/user/${userId}/community/event-management/${id}/?limit=5&page=1`
    );
  };

  const handleTeamClick = () => {
    dispatch(navigationIndexForCommunityDash(2));
    history.push(`/user/${userId}/community/team/${id}`);
  };

  const handleVideoLibraryClick = () => {
    dispatch(navigationIndexForCommunityDash(3));
    history.push(`/user/${userId}/community/video-library/${id}`);
  };

  const handleIntegrationsClick = () => {
    dispatch(navigationIndexForCommunityDash(4));
    history.push(`/user/${userId}/community/integrations/${id}`);
  };

  const handleSnapClick = () => {
    dispatch(navigationIndexForCommunityDash(5));
    history.push(`/user/${userId}/community/snap/${id}`);
  };
  const handleTrackingClick = () => {
    dispatch(navigationIndexForCommunityDash(6));
    history.push(`/user/${userId}/community/tracking/${id}`);
  };

  const handleBillingClick = () => {
    dispatch(navigationIndexForCommunityDash(7));
    history.push(`/user/${userId}/community/billing/${id}`);
  };

  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForCommunityDash
  );
  currentIndex = currentIndex.toString();

  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav />
        <div className="dashboard-body">
          {/* <div className="side-nav-container"> */}
          <SideNav
            activeIndex={currentIndex}
            handleGettingStartedClick={handleGettingStartedClick}
            handleEventsClick={handleEventsClick}
            handleTeamClick={handleTeamClick}
            handleVideoLibraryClick={handleVideoLibraryClick}
            handleIntegrationsClick={handleIntegrationsClick}
            handleBillingClick={handleBillingClick}
            handleSnapClick={handleSnapClick}
            handleTrackingClick={handleTrackingClick}
          />
          <SideNavLean
            activeIndex={currentIndex}
            handleGettingStartedClick={handleGettingStartedClick}
            handleEventsClick={handleEventsClick}
            handleTeamClick={handleTeamClick}
            handleVideoLibraryClick={handleVideoLibraryClick}
            handleIntegrationsClick={handleIntegrationsClick}
            handleBillingClick={handleBillingClick}
            handleSnapClick={handleSnapClick}
            handleTrackingClick={handleTrackingClick}
          />

          <div className="main-content-wrapper" style={{ minHeight: "90vh" }}>
            {(() => {
              switch (currentIndex) {
                case "0":
                  return (
                    <ErrorBoundriesDashboardOverview>
                      <Overview />
                    </ErrorBoundriesDashboardOverview>
                  );

                case "1":
                  return (
                    <ErrorBoundriesEventManagement>
                      <EventManagement />
                    </ErrorBoundriesEventManagement>
                  );

                case "2":
                  return (
                    <ErrorBoundriesReviews>
                      <TeamManagement />
                    </ErrorBoundriesReviews>
                  );

                case "3":
                  return (
                    <ErrorBoundriesQueries>
                      {/* <div>This is video library</div> */}
                      <Registrations />
                      {/* <VideoLibrary /> */}
                    </ErrorBoundriesQueries>
                  );

                case "4":
                  return (
                    <ErrorBoundriesRegistrations>
                      <Integrations />
                    </ErrorBoundriesRegistrations>
                  );

                case "5":
                  return (
                    <ErrorBoundriesCoupons>
                      <div>Snap</div>
                    </ErrorBoundriesCoupons>
                  );
                case "6":
                  return (
                    <ErrorBoundriesCoupons>
                      <div>Tracking</div>
                    </ErrorBoundriesCoupons>
                  );

                case "7":
                  return (
                    <ErrorBoundriesCoupons>
                      <Billing />
                    </ErrorBoundriesCoupons>
                  );

                default:
                  return <div>This is community management dashboard.</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;
