import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Topnav from "./HelperComponent/TopNav";
import SideNav from "./HelperComponent/SideNav";
import {
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

// this.props.navigationIndexForCommunityDash(newValue);
//     switch (newValue) {
//       case 0: {
//         history.push("/user/home");
//         break;
//       }
//       case 1: {
//         history.push("/user/events");
//         break;
//       }
//       case 2: {
//         history.push("/user/recordings");
//         break;
//       }
//       case 3: {
//         history.push("/user/profile");
//         break;
//       }
//       default: {
//         history.push("/user/home");
//         break;
//       }
//     }

const DashboardRoot = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const userId=params.userId; 
  console.log(userId);
  useEffect(() => {
    dispatch(fetchCommunity(id));
    // return () => {
    //   console.log("cleaned up okay")
    //   dispatch(navigationIndexForCommunityDash(0));
    // };
  }, [id, dispatch]);
  useEffect(()=>{
    return ()=>{

       console.log("cleaned up")
       dispatch(navigationIndexForCommunityDash(0));

      
    }


  },[dispatch])
 

  // const params = useParams();
  // const dispatch = useDispatch();
  // const id = params.id;
  // useEffect(() => {
  //   dispatch(fetchSpeakers(id),fetchSessions(id));
  // }, [dispatch]);

  //  useEffect(() => {
  //     dispatch(fetchCommunity(id));
  //   }, [dispatch]);
  // /user/${userId}/community/overview/${id}
  const handleOverviewClick = () => {
    dispatch(navigationIndexForCommunityDash(0));
    history.push(`/user/${userId}/community/overview/${id}`);
    // setActiveIndex("0");
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

  // const { currentIndex } = this.props.navigation;

  let currentIndex = useSelector(
    (state) => state.navigation.currentIndexForCommunityDash
  );
  currentIndex = currentIndex.toString();

  console.log(currentIndex);
  return (
    <>
      <div className="dashboard-position-fixed-non-scrollable-container">
        {/* TOP NAV */}
        <Topnav />
        <div className="dashboard-body">
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
          <div className="main-content-wrapper">
            {(() => {
              switch (currentIndex) {
                case "0":
                  return <Overview />;

                case "1":
                  return <EventManagement />;

                case "2":
                  return <Reviews />;

                case "3":
                  return <Queries />;

                case "4":
                  return <Registrations />;

                case "5":
                  return <Coupons />;

                case "6":
                  return <Recordings />;

                case "7":
                  return <Billing />;

                case "8":
                  return <TeamManagement />;

                case "9":
                  return <RevenueManagement />;

                // case "9":
                //   return <Feedback />; Feedback is handled in SideNav itself as its just a modal screen

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
