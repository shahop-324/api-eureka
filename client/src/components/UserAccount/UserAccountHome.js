/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import "./../../assets/css/hiddenScroll.css";
import { CssBaseline } from "@material-ui/core";
import "./../../assets/css/UserAccountStyle.css";
import CenteredTabs from "./UserAccountCenteredTabBar";
import UserAccountSideNav from "./UserAccountSideNav";
import UserAccountHomeMainBody from "./UserAccountHomeMainBodyComponent";
import UserAccountEventsMainBody from "./UserAccountEventsMainBody";
import UserAccountConnections from "./UserAccountConnections";
import UserAccountProfileMainBody from "./UserAccountProfileMainBody";
import { fetchUserAllPersonalData } from "../../actions/index";
import { navigationIndex } from "../../actions/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import Loader from "../Loader";
import AvatarMenu from "./../AvatarMenu";
import HelpSideDrawer from "../HelpSideDrawer";
import WhatsNew from "../WhatsNew";
import ConfirmCommunityMail from "./Helper/ConfirmCommunityMail";

const UserAccountHome = () => {
  const dispatch = useDispatch();

  const { openCommunityVerificationNotice } = useSelector(
    (state) => state.user
  );

  const { isLoading } = useSelector((state) => state.user);

  const [openHelp, setOpenHelp] = useState(false);

  const [openWhatsNew, setOpenWhatsNew] = useState(false);

  const handleCloseWhatsNew = () => {
    setOpenWhatsNew(false);
  };

  const handleCloseHelp = () => {
    setOpenHelp(false);
  };

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  useEffect(() => {
    console.log(params.code);
    dispatch(fetchUserAllPersonalData());
  }, [dispatch]);

  useEffect(() => {
    return () => {
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
        history.push("/user/connections");
        break;
      }
      case 3: {
        history.push("/user/profile");
        break;
      }
      case 4: {
        history.push("/user/reviews");
        break;
      }
      case 5: {
        history.push("/user/queries");
        break;
      }
      default: {
        break;
      }
    }
  };

  const { currentIndex } = useSelector((state) => state.navigation);

  return (
    <>
      <CssBaseline />

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
            overflow: "auto",
            width: "auto",
          }}
        >
          {/* <UserAccountNav /> */}
          <div className="user-account-body">
            <UserAccountSideNav className="first-step-user-section" />
            <div
              className="user-account-main-body"
              style={{
                minWidth: "1024px",
                overflow: "visible",
                position: "relative",
              }}
            >
              <div className="opaque-layer" style={{ height: "100%" }}></div>
              <div className="d-flex flex-row align-items-center justify-content-end py-2 px-2">
                <div className="ms-3">
                  <AvatarMenu />
                </div>
              </div>
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
                    return <UserAccountConnections />;

                  case 3:
                    return <UserAccountProfileMainBody />;

                  default:
                    return <div>You are a User.</div>;
                }
              })()}
            </div>
          </div>
        </div>
      )}
      <HelpSideDrawer openHelp={openHelp} handleCloseHelp={handleCloseHelp} />
      <WhatsNew
        openWhatsNew={openWhatsNew}
        handleCloseWhatsNew={handleCloseWhatsNew}
      />
      <ConfirmCommunityMail open={openCommunityVerificationNotice} />
    </>
  );
};

export default UserAccountHome;
