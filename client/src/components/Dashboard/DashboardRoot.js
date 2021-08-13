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
import ErrorBoundriesDashboardOverview from "../ErrorBoundries.js/ErrorBoundriesDashboardOverview";

import ErrorBoundriesBilling from "../ErrorBoundries.js/ErrorBoundriesDashboardBilling";
import ErrorBoundriesCoupons from "../ErrorBoundries.js/ErrorBoundriesDashboardCoupons";
import ErrorBoundriesRecordings from "../ErrorBoundries.js/ErrorBoundriesDashboardRecordings";
import ErrorBoundriesRegistrations from "../ErrorBoundries.js/ErrorBoundriesDashboardRegistrations";
import ErrorBoundriesRevenueManagement from "../ErrorBoundries.js/ErrorBoundriesDashboardRevenueManagement";
import ErrorBoundriesReviews from "../ErrorBoundries.js/ErrorBoundariesDashboardReviews";
import ErrorBoundriesTeamManagement from "../ErrorBoundries.js/ErrorBoundriesDashboardTeamManagement";
import ErrorBoundriesQueries from "../ErrorBoundries.js/ErrorBoundriesDashboardQueries";
import ErrorBoundriesEventManagement from "../ErrorBoundries.js/ErrorBoundriesDashboardEventManagement";
const DashboardRoot = () => {
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

  const handleOverviewClick = () => {
    dispatch(navigationIndexForCommunityDash(0));
    history.push(`/user/${userId}/community/overview/${id}`);
  };

  const handleEventManagementClick = () => {
    dispatch(navigationIndexForCommunityDash(1));
    history.push(`/user/${userId}/community/event-management/${id}`);
  };

  const handleReviewsClick = () => {
    dispatch(navigationIndexForCommunityDash(2));
    history.push(`/user/${userId}/community/reviews/${id}`);
  };

  const handleQueriesClick = () => {
    dispatch(navigationIndexForCommunityDash(3));
    history.push(`/user/${userId}/community/queries/${id}`);
  };

  const handleRegistrationsClick = () => {
    dispatch(navigationIndexForCommunityDash(4));
    history.push(`/user/${userId}/community/registrations/${id}`);
  };

  const handleCouponsClick = () => {
    dispatch(navigationIndexForCommunityDash(5));
    history.push(`/user/${userId}/community/coupons/${id}`);
  };

  const handleRecordingsClick = () => {
    dispatch(navigationIndexForCommunityDash(6));
    history.push(`/user/${userId}/community/recordings/${id}`);
  };

  const handleBillingClick = () => {
    dispatch(navigationIndexForCommunityDash(7));
    history.push(`/user/${userId}/community/billing/${id}`);
  };

  const handleTeamManagementClick = () => {
    dispatch(navigationIndexForCommunityDash(8));
    history.push(`/user/${userId}/community/team-management/${id}`);
  };

  const handleRevenueManagementClick = () => {
    dispatch(navigationIndexForCommunityDash(9));
    history.push(`/user/${userId}/community/revenue-management/${id}`);
  };

  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForCommunityDash
  );
  currentIndex = currentIndex.toString();

  console.log(currentIndex);

  // if (error) {
  //   dispatch(errorTrackerForFetchCommunity());
  //   throw new Error(error);
  // }

  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav
          activeIndex={currentIndex}
          handleOverviewClick={handleOverviewClick}
          handleEventManagementClick={handleEventManagementClick}
          handleReviewsClick={handleReviewsClick}
          handleQueriesClick={handleQueriesClick}
          handleRegistrationsClick={handleRegistrationsClick}
          handleCouponsClick={handleCouponsClick}
          handleRecordingsClick={handleRecordingsClick}
          handleBillingClick={handleBillingClick}
          handleTeamManagementClick={handleTeamManagementClick}
          handleRevenueManagementClick={handleRevenueManagementClick}
        />
        <div className="dashboard-body">
          <div className="side-nav-container">
            <SideNav
              activeIndex={currentIndex}
              handleOverviewClick={handleOverviewClick}
              handleEventManagementClick={handleEventManagementClick}
              handleReviewsClick={handleReviewsClick}
              handleQueriesClick={handleQueriesClick}
              handleRegistrationsClick={handleRegistrationsClick}
              handleCouponsClick={handleCouponsClick}
              handleRecordingsClick={handleRecordingsClick}
              handleBillingClick={handleBillingClick}
              handleTeamManagementClick={handleTeamManagementClick}
              handleRevenueManagementClick={handleRevenueManagementClick}
            />
          </div>
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
                      <Reviews />
                    </ErrorBoundriesReviews>
                  );

                case "3":
                  return (
                    <ErrorBoundriesQueries>
                      <Queries />
                    </ErrorBoundriesQueries>
                  );

                case "4":
                  return (
                    <ErrorBoundriesRegistrations>
                      <Registrations />
                    </ErrorBoundriesRegistrations>
                  );

                case "5":
                  return (
                    <ErrorBoundriesCoupons>
                      <Coupons />
                    </ErrorBoundriesCoupons>
                  );

                case "6":
                  return (
                    <ErrorBoundriesRecordings>
                      <Recordings />
                    </ErrorBoundriesRecordings>
                  );

                case "7":
                  return (
                    <ErrorBoundriesBilling>
                      <Billing />
                    </ErrorBoundriesBilling>
                  );

                case "8":
                  return (
                    <ErrorBoundriesTeamManagement>
                      <TeamManagement />
                    </ErrorBoundriesTeamManagement>
                  );

                case "9":
                  return (
                    <ErrorBoundriesRevenueManagement>
                      <RevenueManagement />
                    </ErrorBoundriesRevenueManagement>
                  );

                default:
                  return <div>You are a community.</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;
