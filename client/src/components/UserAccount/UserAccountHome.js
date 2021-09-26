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

import AvatarMenu from "../AvatarMenu";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import Badge from "@mui/material/Badge";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";

import { Dropdown, Icon } from "semantic-ui-react";

import {
  NotificationPaper,
  NotificationBody,
  NotificationHeadline,
  TimeAgoText,
} from "./Elements";
import HelpSideDrawer from "../HelpSideDrawer";
import WhatsNew from "../WhatsNew";

const trigger = (
  <span>
    <Avatar />
  </span>
);

const WelcomeNotification = () => {
  return (
    <>
      <NotificationPaper>
        <Avatar src={Faker.image.avatar()} variant="rounded" />
        <div>
          <NotificationHeadline className="mb-2">
            Welcome to bluemeet!
          </NotificationHeadline>
          <NotificationBody style={{ wordWrap: "break-word", width: "130px" }}>
            Discover ways to use BlueMeet 
          </NotificationBody>
        </div>
      </NotificationPaper>
    </>
  );
};

const options = [
  {
    key: "user",
    text: (
      <span>
        Signed in as <strong>Bob Smith</strong>
      </span>
    ),
    disabled: true,
  },
  { key: "profile", text: "Your Profile" },
  { key: "stars", text: "Your Stars" },
  { key: "explore", text: "Explore" },
  { key: "integrations", text: "Integrations" },
  { key: "help", text: "Help" },
  { key: "settings", text: "Settings" },
  { key: "sign-out", text: "Sign Out" },
];

const DropdownTriggerExample = () => (
  <div className="mx-3">
    <Dropdown
      icon={null}
      trigger={trigger}
      options={options}
      direction="left"
    />
  </div>
);

const notificationOptions = [
  {
    key: "welcome",
    text: <WelcomeNotification />,
  },
  {
    key: "welcome",
    text: <WelcomeNotification />,
  },
  {
    key: "welcome",
    text: <WelcomeNotification />,
  },
  
];

const notificationTrigger = (
  <IconButton className="me-2">
    <Badge badgeContent={4} color="primary">
      <NotificationsNoneRoundedIcon />
    </Badge>
  </IconButton>
);

const NotificationsTrigger = () => {
  return (
    <>
      <Dropdown
        icon={null}
        trigger={notificationTrigger}
        options={notificationOptions}
        direction="left"
      />
    </>
  );
};

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
  }

  const handleCloseHelp = () => {
    setOpenHelp(false);
  }

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
                <IconButton onClick={() => {
                  setOpenHelp(true)
                }} className="me-2">
                  <HelpOutlineRoundedIcon />
                </IconButton>
                <NotificationsTrigger />

                <BtnOutlinedWithIcon onClick={() => {
                  setOpenWhatsNew(true);
                }}>
                  {/* <ExploreRoundedIcon className="me-3" /> */}
                  What's new
                </BtnOutlinedWithIcon>

                <DropdownTriggerExample />

                {/* <div className="ms-3">
                  <AvatarMenu />
                </div> */}
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
      <HelpSideDrawer openHelp={openHelp} handleCloseHelp={handleCloseHelp}/>
      <WhatsNew openWhatsNew={openWhatsNew} handleCloseWhatsNew={handleCloseWhatsNew} />
    </>
  );
};

export default UserAccountHome;
