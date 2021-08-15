import React from "react";
import { CssBaseline } from "@material-ui/core";
import UserAccountNav from "./UserAccountNav";
import "./../../assets/css/UserAccountStyle.css";
import CenteredTabs from "./UserAccountCenteredTabBar";
import UserAccountSideNav from "./UserAccountSideNav";
import UserAccountHomeMainBody from "./UserAccountHomeMainBodyComponent";
import UserAccountEventsMainBody from "./UserAccountEventsMainBody";
import UserAccountProfileMainBody from "./UserAccountProfileMainBody";
import UserAccountRecordings from "./UserAccountRecordings";
import {
  errorTrackerForPersonalData,
  fetchUserAllPersonalData
} from "../../actions/index";
import { navigationIndex } from "../../actions/index";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import Loader from "../Loader";
import UserAccountReviews from "./UserAccountReviews";
import UserAccountQueries from "./UserAccountQueries";
const UserAccountHome = () => {
  const { isLoading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserAllPersonalData());
  }, [dispatch]);
  useEffect(() => {
    return () => {
      console.log("cleaned up");
      dispatch(navigationIndex(0));
    };
  }, [dispatch]);
  const handleChange = (event, newValue) => {
    dispatch(navigationIndex(newValue));
    switch (newValue) {
      case 0: {
        history.push("/user/home");
        break;
      }
      case 1: {
        history.push("/user/events");
        break;
      }
      case 2: {
        history.push("/user/recordings");
        break;
      }
      case 3: {
        history.push("/user/profile");
        break;
      }
      default: {
        // history.push("/user/home");
        break;
      }
    }
  };

  const { currentIndex } = useSelector((state) => state.navigation);

  if (error) {
    dispatch(errorTrackerForPersonalData());
    alert(error);
    return;
  }

  return (
    <>
      <CssBaseline />

      {/* {error && handleError(error)} */}

      {isLoading ? (
        <div
          className="d-flex flex-row justify-content-center align-items-center"
          style={{ width: "100vw", height: "100vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div
          className="container-fluid page-user-account"
          style={{
            paddingLeft: "0",
            paddingRight: "0",

            overflow: "scroll",
            width: "auto",
          }}
        >
          <UserAccountNav  />
          <div className="user-account-body">
            <UserAccountSideNav />
            <div
              className="user-account-main-body"
              style={{ minWidth: "1024px", overflow: "visible" }}
            >
              <div className="user-account-centered-tab-navigation mb-4">
                <CenteredTabs
                  activeIndex={currentIndex}
                  handleChange={handleChange}
                />
              </div>
              {(() => {
                switch (currentIndex) {
                  case 0:
                    return <UserAccountHomeMainBody />;

                  case 1:
                    return <UserAccountEventsMainBody />;

                  case 2:
                    return <UserAccountRecordings />;

                  case 3:
                    return <UserAccountProfileMainBody />;
                  case 4:
                    return <UserAccountReviews />;
                  case 5:
                    return <UserAccountQueries />;

                  default:
                    return <div>You are a User.</div>;
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAccountHome;
