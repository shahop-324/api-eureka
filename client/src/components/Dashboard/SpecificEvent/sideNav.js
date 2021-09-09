import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";

import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
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
import { Link, useParams } from "react-router-dom";

const SideNav = ({
  activeIndex,
  handleAnalyticsClick,
  handleRegistrationsClick,
  handleCustomRegistrationClick,
  handleAffiliatesClick,
  handleInterestedPeopleClick,
  handleLeadsClick,
  handleIntegrationsClick,
  handleVideoLibraryClick,
  handleBrandingClick,
  handleRecordingsClick,
  handleLiveStreamingClick,
  handleMailCampaignClick,
}) => {
  const params = useParams();

  // EVENT_ID, COMMUNITY_ID AND USER_ID
  const eventId = params.eventId;
  const communityId = params.communityId;
  const userId = params.userId;

  return (
    <>
      <div className="side-nav-wrapper py-4 pt-4">
        <div className="event-poster-name-and-status-card">
          <div className="px-3 mb-3 d-flex flex-row justify-content-between">
            <Link
              to={`/user/${userId}/community/event-management/${communityId}`}
            >
              <IconButton aria-label="back">
                <ArrowBackIosIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Link>
            <button className="btn btn-outline-primary btn-outline-text me-2">
              Publish
            </button>
          </div>

          <div className="px-4 mb-3 sidenav-poster-container">
            <img
              src="https://evenz-img-234.s3.ap-south-1.amazonaws.com/60e1c15b557681e9fc6af91e/pexels-johannes-plenio-1103970.jpg"
              alt="event-poster"
            />
          </div>
          <div className="px-4 d-flex flex-row justify-content-between">
            <div className="sidenav-event-name" style={{ fontFamily: "Inter" }}>
              The Craft Workshop
            </div>
          </div>
        </div>
        <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
          <Divider />
        </div>
        <div
          onClick={() => {
            handleAnalyticsClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "1" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "1" ? "btn-icon-active-d" : " ")
            }
          >
            <TimelineRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "1" ? "btn-text-active-d" : " ")
            }
          >
            Analytics
          </div>
        </div>
        <div
          onClick={() => {
            handleRegistrationsClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "2" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "2" ? "btn-icon-active-d" : " ")
            }
          >
            <PeopleOutlineRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "2" ? "btn-text-active-d" : " ")
            }
          >
            Registrations
          </div>
        </div>
        <div
          onClick={() => {
            handleCustomRegistrationClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "3" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "3" ? "btn-icon-active-d" : " ")
            }
          >
            <AssignmentIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "3" ? "btn-text-active-d" : " ")
            }
          >
            Custom Registration
          </div>
        </div>

        <div
          onClick={() => {
            handleAffiliatesClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "4" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "4" ? "btn-icon-active-d" : " ")
            }
          >
            <AssignmentIndIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "4" ? "btn-text-active-d" : " ")
            }
          >
            Manage Affiliates
          </div>
        </div>

        <div
          onClick={() => {
            handleInterestedPeopleClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "5" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "5" ? "btn-icon-active-d" : " ")
            }
          >
            <PersonPinCircleIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "5" ? "btn-text-active-d" : " ")
            }
          >
            Interested People
          </div>
        </div>

        <div
          onClick={() => {
            handleLeadsClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "6" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "6" ? "btn-icon-active-d" : " ")
            }
          >
            <TrendingUpIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "6" ? "btn-text-active-d" : " ")
            }
          >
            Leads
          </div>
        </div>
        <div
          onClick={() => {
            handleIntegrationsClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "7" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "7" ? "btn-icon-active-d" : " ")
            }
          >
            <SettingsEthernetIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "7" ? "btn-text-active-d" : " ")
            }
          >
            Integrations
          </div>
        </div>
        <div
          onClick={() => {
            handleVideoLibraryClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "8" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "8" ? "btn-icon-active-d" : " ")
            }
          >
            <VideocamIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "8" ? "btn-text-active-d" : " ")
            }
          >
            Video Library
          </div>
        </div>
        <div
          onClick={() => {
            handleBrandingClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "9" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "9" ? "btn-icon-active-d" : " ")
            }
          >
            <VideoLabelIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "9" ? "btn-text-active-d" : " ")
            }
          >
            Branding
          </div>
        </div>
        <div
          onClick={() => {
            handleRecordingsClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "10" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "10" ? "btn-icon-active-d" : " ")
            }
          >
            <MovieIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "10" ? "btn-text-active-d" : " ")
            }
          >
            Recordings
          </div>
        </div>
        <div
          onClick={() => {
            handleLiveStreamingClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "11" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "11" ? "btn-icon-active-d" : " ")
            }
          >
            <LiveTvIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "11" ? "btn-text-active-d" : " ")
            }
          >
            Live Streaming
          </div>
        </div>
        <div
          onClick={() => {
            handleMailCampaignClick();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (activeIndex === "12" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (activeIndex === "12" ? "btn-icon-active-d" : " ")
            }
          >
            <MailOutlineIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (activeIndex === "12" ? "btn-text-active-d" : " ")
            }
          >
            Mail Campaign
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
