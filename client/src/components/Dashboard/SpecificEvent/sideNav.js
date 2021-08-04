import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";

import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";

import history from "./../../../history";

import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import LiveHelpOutlinedIcon from "@material-ui/icons/LiveHelpOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import VideoLabelOutlinedIcon from "@material-ui/icons/VideoLabelOutlined";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import SettingsEthernetOutlinedIcon from "@material-ui/icons/SettingsEthernetOutlined";
import DraftsOutlinedIcon from "@material-ui/icons/DraftsOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import { Link, useParams } from "react-router-dom";

const SideNav = (props) => {
  const params = useParams();

  const eventId = params.eventId;
  const communityId = params.communityId;
  const userId = params.userId;

  return (
    <>
      <div className="side-nav-wrapper py-4 pt-4">
        <div className="event-poster-name-and-status-card">
          <div className="px-3 mb-3 d-flex flex-row justify-content-between">
            <IconButton aria-label="back">
              <ArrowBackIosIcon style={{ fontSize: 18 }} />
            </IconButton>
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
            <div className="sidenav-event-name">The Craft Workshop</div>
            <div className=" px-3 py-2 user-registration-status-chip">
              Draft
            </div>
          </div>
        </div>
        <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
          <Divider />
        </div>
        <Link
          to={`/community/${communityId}/edit-event/${eventId}/basics`}
          style={{ textDecoration: "none" }}
        >
          <div
            className={
              `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
              (props.activeIndex === "0" ? "btn-active-d" : " ")
            }
          >
            <div
              className={
                "mx-3 sidenav-icon " +
                (props.activeIndex === "0" ? "btn-icon-active-d" : " ")
              }
            >
              <EditRoundedIcon style={{ fontSize: 26 }} />
            </div>
            <div
              className={
                `mx-3 button-text-dashboard-sidenav ` +
                (props.activeIndex === "0" ? "btn-text-active-d" : " ")
              }
            >
              Edit event
            </div>
          </div>
        </Link>

        <div
          onClick={props.handlePreAnalyticsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "1" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "1" ? "btn-icon-active-d" : " ")
            }
          >
            <TimelineRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "1" ? "btn-text-active-d" : " ")
            }
          >
            Pre Analytics
          </div>
        </div>

        <div
          onClick={props.handleRegistrationsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "2" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "2" ? "btn-icon-active-d" : " ")
            }
          >
            <PeopleOutlineRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "2" ? "btn-text-active-d" : " ")
            }
          >
            Registrations
          </div>
        </div>

        <div
          onClick={props.handleQueriesClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "3" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "3" ? "btn-icon-active-d" : " ")
            }
          >
            <LiveHelpOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "3" ? "btn-text-active-d" : " ")
            }
          >
            Queries
          </div>
        </div>

        <div
          onClick={props.handleReviewsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "4" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "4" ? "btn-icon-active-d" : " ")
            }
          >
            <RateReviewOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "4" ? "btn-text-active-d" : " ")
            }
          >
            Reviews
          </div>
        </div>

        <div
          onClick={props.handlePostAnalyticsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "5" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "5" ? "btn-icon-active-d" : " ")
            }
          >
            <PieChartOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "5" ? "btn-text-active-d" : " ")
            }
          >
            Post Analytics
          </div>
        </div>

        <div
          onClick={props.handlePollsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "6" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "6" ? "btn-icon-active-d" : " ")
            }
          >
            <AssessmentOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "6" ? "btn-text-active-d" : " ")
            }
          >
            Polls
          </div>
        </div>

        <div
          onClick={props.handleStageCustomisationClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "7" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "7" ? "btn-icon-active-d" : " ")
            }
          >
            <VideoLabelOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "7" ? "btn-text-active-d" : " ")
            }
          >
            Stage customisation
          </div>
        </div>

        <div
          onClick={props.handleUploadedContentClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "8" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "8" ? "btn-icon-active-d" : " ")
            }
          >
            <CloudUploadOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "8" ? "btn-text-active-d" : " ")
            }
          >
            Uploaded content
          </div>
        </div>

        <div
          onClick={props.handleRTMPAndLiveStreamingClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "9" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "9" ? "btn-icon-active-d" : " ")
            }
          >
            <LiveTvOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "9" ? "btn-text-active-d" : " ")
            }
          >
            RTMP & Live Streaming
          </div>
        </div>

        <div
          onClick={props.handleIntegrationsClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "10" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "10" ? "btn-icon-active-d" : " ")
            }
          >
            <SettingsEthernetOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "10" ? "btn-text-active-d" : " ")
            }
          >
            Integrations
          </div>
        </div>

        <div
          onClick={props.handleEmailCustomisationClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "11" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "11" ? "btn-icon-active-d" : " ")
            }
          >
            <DraftsOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "11" ? "btn-text-active-d" : " ")
            }
          >
            Email customisation
          </div>
        </div>

        <div
          onClick={props.handleSecurityChecksClick}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "12" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "12" ? "btn-icon-active-d" : " ")
            }
          >
            <VerifiedUserOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "12" ? "btn-text-active-d" : " ")
            }
          >
            Security checks
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
