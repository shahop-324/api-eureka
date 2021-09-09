import React from "react";
import "./../../HostingPlatform/Styles/root.scss";

import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import PersonPinCircleIcon from "@material-ui/icons/PersonPinCircle";
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet";
import VideocamIcon from "@material-ui/icons/Videocam";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import MovieIcon from "@material-ui/icons/Movie";
import AssignmentIcon from "@material-ui/icons/Assignment";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import SettingsEthernetRoundedIcon from "@material-ui/icons/SettingsEthernetRounded";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import FeedbackOutlinedIcon from "@material-ui/icons/FeedbackOutlined";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "@material-ui/core";

const SideNavLean = ({
    activeIndex, 
    handleCloseDrawer,
    handleOverviewClick,
    handleEventManagementClick,
    handleReviewsClick,
    handleQueriesClick,
    handleRegistrationsClick,
    handleCouponsClick,
    handleIntegrationsClick,
    handleBillingClick,
    handleTeamManagementClick,
}) => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const params = useParams();

  console.log(activeIndex);
  const dispatch = useDispatch();

  // EVENT_ID, COMMUNITY_ID AND USER_ID
  const eventId = params.eventId;
  const communityId = params.communityId;
  const userId = params.userId;
  return (
    <>
      {/* className="" */}
      <div
        className="h-side-nav lean-side-nav lean-nav-wrapper px-3 pb-4"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="main-icon-btn-container py-4">
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleOverviewClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "0" ? "active-wrapper-h" : "")
              }
            >
              <HomeOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "0" ? "icon-btn-active-h" : "")
                }
              />

              {/* <img src={InfoDeskPNG} alt="reception-desk" /> */}
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "0" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Dashboard
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleEventManagementClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "1" ? "active-wrapper-h" : "")
              }
            >
              <PieChartOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "1" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "1" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Event Management
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleReviewsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "2" ? "active-wrapper-h" : "")
              }
            >
              <RateReviewOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "2" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "2" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Reviews
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleQueriesClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "3" ? "active-wrapper-h" : "")
              }
            >
              <AssignmentIndIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "3" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "3" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Queries
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleRegistrationsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "4" ? "active-wrapper-h" : "")
              }
            >
              <HowToRegOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "4" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "4" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Registrations
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleCouponsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <LocalOfferOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "5" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "5" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Coupons
            </div>
          </div>
          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleRecordingsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "6" ? "active-wrapper-h" : "")
              }
            >
              <VideocamOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "6" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "6" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Recordings
            </div>
          </div> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleIntegrationsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "7" ? "active-wrapper-h" : "")
              }
            >
              <SettingsEthernetRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "7" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "7" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Integrations
            </div>
          </div>
          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleSchedulerClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "8" ? "active-wrapper-h" : "")
              }
            >
              <ScheduleRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "8" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "8" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Scheduler
            </div>
          </div> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleBillingClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "9" ? "active-wrapper-h" : "")
              }
            >
              <PaymentOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "9" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "9" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Billing
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3 pb-5"
            onClick={() => {
                handleTeamManagementClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "10" ? "active-wrapper-h" : "")
              }
            >
              <PeopleOutlinedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "10" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "10" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Team Management
            </div>
          </div>
          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3 pb-4"
            onClick={() => {
                handleRevenueManagementClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "11" ? "active-wrapper-h" : "")
              }
            >
              <AttachMoneyRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "11" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "11" ? "icon-btn-text-active-h" : "")
              }
              style={{ textAlign: "center" }}
            >
              Payouts
            </div>
          </div> */}

          


    

          
        </div>
      </div>
    </>
  );
};

export default SideNavLean;
