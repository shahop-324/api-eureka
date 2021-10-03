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
import Chip from "@mui/material/Chip";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
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

import SwitchCommunity from "./SwitchCommunity";
import CommunityProfileTab from "../SubComponents/CommunityProfileTab";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import styled from "styled-components";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import Avatar from '@material-ui/core/Avatar';
// import Faker from 'faker';

const StyledInput = styled.input`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #4e4e4e;
`;

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #727272 !important;
`;
const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.2rem;
  font-family: "Ubuntu";
  font-weight: 600;
  color: #212121;
`;

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

  const [openSwitchCommunity, setOpenSwitchCommunity] = React.useState(false);

  const handleCloseSwitchCommunity = () => {
    setOpenSwitchCommunity(false);
  };

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
    imgUrl = `https://bluemeet.s3.us-west-1.amazonaws.com/${imgKey}`;
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
      <div className="row topnav-container px-3 py-2">
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
              href="https://www.bluemeet.in/home"
              style={{ textDecoration: "none", color: "#538BF7" }}
            >
              Bluemeet
            </a>
          </div>
        </div>
        <div className="col-6 right">
          <div className="icon-and-avatar-menu-wrapper d-flex flex-row align-items-center">
            <Chip
              onClick={() => {
                setOpenSwitchCommunity(true);
              }}
              clickable
              icon={<AutorenewRoundedIcon style={{ color: "#538BF7" }} />}
              label="Switch community"
              variant="outlined"
              className="me-2"
              style={{ border: "1px solid #538BF7", color: "#538BF7" }}
            />
            <div
              onClick={handleClickOpenSettings}
              className={`${classes.root} mx-2 dash-settings`}
            >
              <IconButton>
                <EditRoundedIcon style={{color: "#212121"}} />
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
        <SwipeableDrawer
          anchor="left"
          open={openDrawer}
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
        >
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
        <HeaderFooter className="px-4 pt-3 ">
          <div
            className="form-heading-and-close-button"
            style={{ width: "100%" }}
          >
            <div></div>
            <FormHeading
              className="overlay-form-heading"
              style={{ fontFamily: "Ubuntu" }}
            >
              Edit community profile
            </FormHeading>
            <div className="overlay-form-close-button">
              <IconButton
                type="button"
                aria-label="delete"
                onClick={() => {
                  setOpenSettings(false);
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
        </HeaderFooter>
        <CommunityProfileTab />
      </Dialog>
      <SwitchCommunity
        open={openSwitchCommunity}
        handleClose={handleCloseSwitchCommunity}
      />
    </>
  );
};

export default Topnav;
