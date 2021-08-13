import React from "react";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import AvatarMenu from "./../../AvatarMenu";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import { IconButton, SwipeableDrawer } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SideNav from "./SideNav";
// import Avatar from '@material-ui/core/Avatar';
// import Faker from 'faker';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const Topnav = ({
  activeIndex,
  handleOverviewClick,
  handleEventManagementClick,
  handleReviewsClick,
  handleQueriesClick,
  handleRegistrationsClick,
  handleCouponsClick,
  handleRecordingsClick,
  handleBillingClick,
  handleTeamManagementClick,
  handleRevenueManagementClick,
}) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const classes = useStyles();

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  }
  return (
    <>
      <div className="row topnav-container px-3">
        <div className="col-6 left">
          <div
            className="brand-logo-text d-flex flex-row align-items-center"
            style={{ fontFamily: "Inter" }}
          >
            <div className="me-3 dash-root-menu">
              <MenuRoundedIcon
                onClick={() => {
                  setOpenDrawer(true);
                }}
                // style={{display: "none"}}
              />
            </div>
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
            <div className={`${classes.root} mx-2 whats-new-btn`}>
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
            </div>
            <div className={`${classes.root} mx-2 dash-notification`}>
              <Badge badgeContent={4} color="secondary">
                <NotificationsNoneIcon />
              </Badge>
            </div>

            <div className={`${classes.root} mx-2 dash-settings`}>
              <SettingsIcon />
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
        <SwipeableDrawer anchor="left" open={openDrawer} >
          <div className="registration-more-details-right-drawer py-4" style={{minWidth: "18.18vw"}}>
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
              handleBillingClick={handleBillingClick}
              handleTeamManagementClick={handleTeamManagementClick}
              handleRevenueManagementClick={handleRevenueManagementClick}
              handleCloseDrawer={handleCloseDrawer}
            />
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default Topnav;
