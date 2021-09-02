import React, { useState } from "react";

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
  fetchUserAllPersonalData,
  MailChimpAuth,
} from "../../actions/index";
import { navigationIndex } from "../../actions/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import Loader from "../Loader";
import UserAccountReviews from "./UserAccountReviews";
import UserAccountQueries from "./UserAccountQueries";
import Tour from "reactour";
import ErrorBoundriesUserAccountSideNav from "../ErrorBoundries/ErrorBoundriesUserAccountSideNav";
import ErrorBoundriesUserAccountEventsMainBody from "../ErrorBoundries/ErrorBoundriesUserAccountEventsMainBody";
import GlobalSnackbar from "../GlobalSnackbar";
const { REACT_APP_MY_ENV } = process.env;
const steps = [
  {
    selector: ".first-step-user-section",
    content: "This is my first Step",
  },
  // ...
];

const UserAccountHome = () => {
  const { isLoading, error } = useSelector((state) => state.user);
  const { isCommunityLoading } = useSelector((state) => state.community);
  const [isTourOpen, setIsTourOpen] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    history.push("/user/home/");
    // window.location.href = REACT_APP_MY_ENV
    //   ? "http://localhost:3001/user/home"
    //   : "https://www.evenz.in/user/home";

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params.code);
    dispatch(fetchUserAllPersonalData());
    // dispatch(MailChimpAuth(params.code));
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
        history.push("/user/home/");
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
    // alert(error);
    // return null;
  }

  return (
    <>
      <CssBaseline />
      <GlobalSnackbar feedbackMsg={"Successfully signed in!"} severity={"success"}/>
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
          className="first-step-user-section container-fluid page-user-account"
          style={{
            paddingLeft: "0",
            paddingRight: "0",

            overflow: "scroll",
            width: "auto",
          }}
        >
          <UserAccountNav />
          <div className="user-account-body">
            <ErrorBoundriesUserAccountSideNav>
              <UserAccountSideNav className="first-step-user-section" />
            </ErrorBoundriesUserAccountSideNav>

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
                    return (
                      <ErrorBoundriesUserAccountEventsMainBody>
                        <UserAccountEventsMainBody />
                      </ErrorBoundriesUserAccountEventsMainBody>
                    );

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

      {/* <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      /> */}
    </>
  );
};

export default UserAccountHome;
