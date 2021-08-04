import React, { useEffect } from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";

import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";
import { Link } from "react-router-dom";

import CategoryIcon from "@material-ui/icons/Category";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import StorefrontOutlinedIcon from "@material-ui/icons/StorefrontOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchParticularEventOfCommunity } from "../../../actions";

const SideNavEdit = (props) => {
  const params = useParams();
  const dispatch = useDispatch();

  const id = params.id;
  const communityId = params.communityId;

  const userId = useSelector((state) => state.user.userDetails._id);
  useEffect(() => {
    dispatch(fetchParticularEventOfCommunity(id));
  }, [id, dispatch]);

  const event = useSelector((state) => {
    return state.event.events.find((event) => {
      return event.id === id;
    });
  });

  let url = " #";
  if (event) {
    url = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`;
  }

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
            <img src={url} alt="event-poster" />
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
        <div
          onClick={props.handleBasicsClick}
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
            <CategoryIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "0" ? "btn-text-active-d" : " ")
            }
          >
            Basics
          </div>
        </div>

        <div className="sidenav-group-headline ps-4 pe-4 my-4">Setup</div>

        <div
          onClick={props.handleAboutClick}
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
            <InfoRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "1" ? "btn-text-active-d" : " ")
            }
          >
            About Event
          </div>
        </div>

        <div
          onClick={props.handleSessionsClick}
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
            <TrackChangesIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "2" ? "btn-text-active-d" : " ")
            }
          >
            Sessions
          </div>
        </div>

        <div
          onClick={props.handleSpeakersClick}
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
            <RecordVoiceOverIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "3" ? "btn-text-active-d" : " ")
            }
          >
            Speakers
          </div>
        </div>

        <div
          onClick={props.handleBoothsClick}
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
            <StorefrontOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "4" ? "btn-text-active-d" : " ")
            }
          >
            Booths
          </div>
        </div>

        <div
          onClick={props.handleSponsorsClick}
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
            <PersonOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "5" ? "btn-text-active-d" : " ")
            }
          >
            Sponsors
          </div>
        </div>

        <div
          onClick={props.handleTicketingClick}
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
            <ConfirmationNumberOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "6" ? "btn-text-active-d" : " ")
            }
          >
            Ticketing
          </div>
        </div>

        <div
          onClick={props.handleNetworkingClick}
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
            <PeopleOutlineIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "7" ? "btn-text-active-d" : " ")
            }
          >
            Networking
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavEdit;
