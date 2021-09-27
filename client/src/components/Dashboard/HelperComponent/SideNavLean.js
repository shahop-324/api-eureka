/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./../../HostingPlatform/Styles/root.scss";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import SettingsEthernetRoundedIcon from "@material-ui/icons/SettingsEthernetRounded";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";

import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

const SideNavLean = ({
  activeIndex,
  handleGettingStartedClick,
  handleEventsClick,
  handleTeamClick,
  handleVideoLibraryClick,
  handleIntegrationsClick,
  handleBillingClick,
}) => {
  console.log(activeIndex);

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
              handleGettingStartedClick();
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
              Get started
            </div>
          </div>
              {/* </a> */}

            {/* <a data-tip="Event Management" className="">   */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
              handleEventsClick();
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
              Events
            </div>
          </div>
  
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
              handleTeamClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "2" ? "active-wrapper-h" : "")
              }
            >
              <PeopleOutlineIcon
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
              Team
            </div>
          </div>
          {/* </a> */}

         

          {/* <a data-tip="Queries" className=""> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
              handleVideoLibraryClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "3" ? "active-wrapper-h" : "")
              }
            >
              <VideocamOutlinedIcon
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
              Video library
            </div>
          </div>
          

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
              handleIntegrationsClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "4" ? "active-wrapper-h" : "")
              }
            >
              <SettingsEthernetRoundedIcon
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
             Integrations
            </div>
          </div>
         
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={() => {
              handleBillingClick();
            }}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <PaymentOutlinedIcon
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
              Billing
            </div>
          </div>
          

    
        </div>
      </div>

      
    </>
  );
};

export default SideNavLean;
