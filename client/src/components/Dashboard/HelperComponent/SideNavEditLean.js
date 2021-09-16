/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./../../HostingPlatform/Styles/root.scss";

import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";


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

const SideNavEditLean = ({
    activeIndex,
    handleAboutClick,
    handleBasicsClick,
    handleBoothsClick,
    handleNetworkingClick,
    handleSessionsClick, 
    handleSpeakersClick,
    handleSponsorsClick,
    handleTicketingClick
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
        {/* <a data-tip="Overview" className="ms-3"> */}
        <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleBasicsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "0" ? "active-wrapper-h" : "")
              }
            >
              <CategoryIcon
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
              Basics
            </div>
          </div>
              {/* </a> */}

            {/* <a data-tip="Event Management" className="">   */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleAboutClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "1" ? "active-wrapper-h" : "")
              }
            >
              <InfoRoundedIcon
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
              About Event
            </div>
          </div>
          {/* </a> */}

          
          {/* <a data-tip="Reviews" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleSessionsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "2" ? "active-wrapper-h" : "")
              }
            >
              <TrackChangesIcon
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
              Sessions
            </div>
          </div>
          {/* </a> */}

         

          {/* <a data-tip="Queries" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleSpeakersClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "3" ? "active-wrapper-h" : "")
              }
            >
              <RecordVoiceOverIcon
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
              Speakers
            </div>
          </div>
          {/* </a> */}


          


          {/* <a data-tip="Registrations" className=""> */}

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleBoothsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "4" ? "active-wrapper-h" : "")
              }
            >
              <StorefrontOutlinedIcon
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
              Booths
            </div>
          </div>
          {/* </a> */}


          


          
          {/* <a data-tip="Coupons" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleSponsorsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <PersonOutlinedIcon
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
              Sponsors
            </div>
          </div>
          {/* </a> */}

          

          
           {/* <a data-tip="Recordings" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleTicketingClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "6" ? "active-wrapper-h" : "")
              }
            >
              <ConfirmationNumberOutlinedIcon
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
              Ticketing
            </div>
          </div>
           {/* </a> */}
         




{/* <a data-tip="Integrations" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
                handleNetworkingClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "7" ? "active-wrapper-h" : "")
              }
            >
              <PeopleOutlineIcon
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
              Networking
            </div>
          </div>
{/* </a> */}





        </div>
      </div>

      {/* <ReactTooltip place="right" type="info" effect="solid" backgroundColor="#538BF7"/> */}
    </>
  );
};

export default SideNavEditLean;
