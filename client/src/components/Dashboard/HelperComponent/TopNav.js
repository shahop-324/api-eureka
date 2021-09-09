/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import AvatarMenu from "./../../AvatarMenu";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import {
  Avatar,
  Dialog,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SideNav from "./SideNav";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { Field, reduxForm } from "redux-form";
import { connect, useSelector } from "react-redux";
import SettingsVerticalTabs from "../SubComponents/SettingsVerticalTabs";
// import Avatar from '@material-ui/core/Avatar';
// import Faker from 'faker';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   flexGrow: 1,
  //   backgroundColor: theme.palette.background.paper,
  //   width: "100%",
  //   display: "flex",
  //   minHeight: "76.5vh",
  // },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  // tabs: {
  //   borderRight: `1px solid ${theme.palette.divider}`,
  // },
}));

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return (
      <div className="ui error message">
        <div className="header">{error}</div>
      </div>
    );
  }
};

const Topnav = ({
  activeIndex,
  handleOverviewClick,
  handleEventManagementClick,
  handleReviewsClick,
  handleQueriesClick,
  handleRegistrationsClick,
  handleCouponsClick,
  handleRecordingsClick,
  handleIntegrationsClick,
  handleBillingClick,
  handleTeamManagementClick,
  handleRevenueManagementClick,
  handleSubmit,
  pristine,
  reset,
  submitting,
}) => {
  const [openSettings, setOpenSettings] = React.useState(false);

  const handleClickOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const classes = useStyles();

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const { userDetails } = useSelector((state) => state.user);
  let imgKey;
  if (userDetails) {
    imgKey = userDetails.image;
  }

  let imgUrl;
  if (imgKey && !imgKey.startsWith("https://lh3.googleusercontent.com")) {
    imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
  } else {
    imgUrl = imgKey;
  }

  const onSubmit = (formValues) => {
    // setEditProfileClicked(true);
    // console.log(formValues);
    // const ModifiedFormValues = {};
    // ModifiedFormValues.firstName = formValues.firstName;
    // ModifiedFormValues.lastName = formValues.lastName;
    // ModifiedFormValues.headline = formValues.headline;
    // ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    // ModifiedFormValues.email = formValues.email;
    // const groupedSocialHandles = {
    //   facebook: formValues.facebook,
    //   twitter: formValues.twitter,
    //   linkedin: formValues.linkedin,
    // };
    // ModifiedFormValues.socialMediaHandles = groupedSocialHandles;
    // const modifiedInterests = [];
    // if (formValues.interests) {
    //   for (let element of formValues.interests) {
    //     modifiedInterests.push(element.value);
    //   }
    // }
    // ModifiedFormValues.interests = modifiedInterests;
    // console.log(ModifiedFormValues);
    // console.log(file);
    // dispatch(editUser(ModifiedFormValues, file));
  };

  return (
    <>
      <div className="row topnav-container px-3">
        <div className="col-6 left">
          <div
            className="brand-logo-text d-flex flex-row align-items-center"
            style={{ fontFamily: "Inter" }}
          >
            {/* <div className="me-3 dash-root-menu">
              <MenuRoundedIcon
                onClick={() => {
                  setOpenDrawer(true);
                }}
                // style={{display: "none"}}
              />
            </div> */}
            <a
              href="https://www.evenz.in/home"
              style={{ textDecoration: "none", color: "#538BF7" }}
            >
              Evenz
            </a>
          </div>
        </div>
        <div className="col-6 right">
          <div className="icon-and-avatar-menu-wrapper d-flex flex-row align-items-center">
            {/* <div className={`${classes.root} mx-2 whats-new-btn`}>
              <div
                className="btn-outline-text px-2 py-2 whats-new-button"
                style={{
                  backgroundColor: "#C7C7C72D",
                  borderRadius: "5px",
                  fontSize: "13px",
                }}
              >
                What's New
              </div>
            </div> */}
            {/* <div className={`${classes.root} mx-2 dash-notification`}>
              <Badge badgeContent={4} color="secondary">
                <NotificationsNoneIcon />
              </Badge>
            </div> */}

            <div
              onClick={handleClickOpenSettings}
              className={`${classes.root} mx-2 dash-settings`}
            >
              <IconButton>
                <SettingsIcon />
              </IconButton>
            </div>
            <div
              className="dashboard-avatar-menu mx-2 d-flex flex-row align-items-center"
              style={{ padding: "0" }}
            >
              <AvatarMenu />
              {/* <Avatar alt="Travis Howard" src={Faker.image.avatar()} /> */}
            </div>
          </div>
        </div>
      </div>

      <React.Fragment key="left">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="left" open={openDrawer}>
          <div
            className="registration-more-details-right-drawer py-4"
            style={{ minWidth: "18.18vw" }}
          >
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading"></div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
                }}
              >
                <div className="pe-3">
                  <IconButton aria-label="close-drawer">
                    <CancelOutlinedIcon
                      style={{ fontSize: "26", color: "#4D4D4D" }}
                    />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="my-3"></div>
            <SideNav
              activeIndex={activeIndex}
              handleOverviewClick={handleOverviewClick}
              handleEventManagementClick={handleEventManagementClick}
              handleReviewsClick={handleReviewsClick}
              handleQueriesClick={handleQueriesClick}
              handleRegistrationsClick={handleRegistrationsClick}
              handleCouponsClick={handleCouponsClick}
              handleRecordingsClick={handleRecordingsClick}
              handleIntegrationsClick={handleIntegrationsClick}
              handleBillingClick={handleBillingClick}
              handleTeamManagementClick={handleTeamManagementClick}
              handleRevenueManagementClick={handleRevenueManagementClick}
              handleCloseDrawer={handleCloseDrawer}
            />
          </div>
        </SwipeableDrawer>
      </React.Fragment>

      <Dialog
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={openSettings}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="d-flex flex-row align-items-center justify-content-between p-3 px-5" style={{borderBottom: "1px solid #B6B6B6"}}>
            <div style={{fontWeight: "500", color: "#212121", fontFamily: "Inter"}}>Settings</div>
            <div style={{ justifySelf: "end" }}>
                <IconButton
                  onClick={handleCloseSettings}
                  style={{ width: "fit-content" }}
                  aria-label="delete"
                >
                  <HighlightOffRoundedIcon />
                </IconButton>
              </div>
        </div>
        <SettingsVerticalTabs />
      </Dialog>
    </>
  );
};

export default Topnav;