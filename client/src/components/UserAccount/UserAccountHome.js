/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import "./../../assets/css/hiddenScroll.css";
import { CssBaseline, IconButton } from "@material-ui/core";
import "./../../assets/css/UserAccountStyle.css";
import CenteredTabs from "./UserAccountCenteredTabBar";
import UserAccountSideNav from "./UserAccountSideNav";
import UserAccountHomeMainBody from "./UserAccountHomeMainBodyComponent";
import UserAccountEventsMainBody from "./UserAccountEventsMainBody";
import UserAccountProfileMainBody from "./UserAccountProfileMainBody";
import UserAccountRecordings from "./UserAccountRecordings";
import { fetchUserAllPersonalData } from "../../actions/index";
import { navigationIndex } from "../../actions/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../history";
import Loader from "../Loader";
import UserAccountReviews from "./UserAccountReviews";
import UserAccountQueries from "./UserAccountQueries";
import styled from "styled-components";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Badge from "@mui/material/Badge";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";

import { Dropdown } from "semantic-ui-react";
import AvatarMenu from "./../AvatarMenu";

import {
  NotificationPaper,
  NotificationBody,
  NotificationHeadline,
  AvatarMenuListItem,
  TimeAgoText,
} from "./Elements";

import HelpSideDrawer from "../HelpSideDrawer";
import WhatsNew from "../WhatsNew";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

const trigger = (
  <span>
    <Avatar src={Faker.image.avatar()} className="mb-3" variant="rounded" />
  </span>
);

const BtnOutlinedWithIcon = styled.div`
  border: 1px solid #152d35;
  color: #152d35;
  padding: 8px 16px;
  border-radius: 10px;

  font-size: 0.8rem;
  font-family: "Ubuntu";
  font-weight: 500;

  &:hover {
    background-color: #152d35;
    color: #dcc7be;
    cursor: pointer;
  }
`;

const UserAccountHome = () => {
  const { isLoading } = useSelector((state) => state.user);

  const [openHelp, setOpenHelp] = useState(false);

  const [openWhatsNew, setOpenWhatsNew] = useState(false);

  const handleCloseWhatsNew = () => {
    setOpenWhatsNew(false);
  };

  const handleCloseHelp = () => {
    setOpenHelp(false);
  };

  const dispatch = useDispatch();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  useEffect(() => {
    console.log(params.code);
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
      case 4: {
        history.push("/user/reviews");
        break;
      }
      case 5: {
        history.push("/user/queries");
        break;
      }
      default: {
        // history.push("/user/home");
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
    </>
  );
};

export default UserAccountHome;
