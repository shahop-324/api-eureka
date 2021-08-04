import React, { useState } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Billing.scss";

import BasicPlanCard from "./HelperComponent/BillingComponents/BasicsPlanCard";
import ProPlanCard from "./HelperComponent/BillingComponents/ProPlanCard";
import EnterprisePlanCard from "./HelperComponent/BillingComponents/EnterprisePlanCard";
import FreePlanCard from "./HelperComponent/BillingComponents/FreePlanCard";
import CurrentPlanCard from "./HelperComponent/BillingComponents/CurrentPlanCard";
import { SwipeableDrawer } from "@material-ui/core";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PhoneInput from "react-phone-input-2";
import { Avatar, Drawer, IconButton } from "@material-ui/core";
import BillingListFields from "./HelperComponent/BillingComponents/BillingListFields";
import BillingHistoryDetailsCard from "./HelperComponent/BillingComponents/BillingHistoryDetailsCard";

const Billing = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <div>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Billing</div>
          <div className="sec-heading-action-button d-flex flex-row">
            <button type="button" onClick={() => {
              setOpenDrawer(true);
            }} className="btn btn-primary btn-outline-text">
              Billing History
            </button>
          </div>
        </div>
        <div className="event-management-content-grid px-4 mx-3 mb-4 py-4">
          <CurrentPlanCard />

          <div className="pricing-cards-section pt-4">
            {/* Free Plan Goes Here */}
            {/* <FreePlanCard /> */}
            {/* Basic plan goes here */}
            <BasicPlanCard />
            {/* Pro Plan Goes here */}
            <ProPlanCard />
            {/* Enterprise Plan Goes Here */}
            <EnterprisePlanCard />
          </div>

          {/* Here goes main billing related content */}
        </div>
        {/* Here I have to use pagination */}
      </div>

      <React.Fragment key="right">
        <SwipeableDrawer anchor="right" open={openDrawer}>
          <div
            className="registration-more-details-right-drawer px-4 py-4"
            style={{ width: "45vw" }}
          >
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Your Billing History</div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
                }}
              >
                <IconButton aria-label="close-drawer">
                  <CancelOutlinedIcon
                    style={{ fontSize: "26", color: "#4D4D4D" }}
                  />
                </IconButton>
              </div>
            </div>
            <div className="my-3">
              <hr />
            </div>
            <BillingListFields />
            
            <div className="my-3">
              <hr />
            </div>
            <BillingHistoryDetailsCard />
            <BillingHistoryDetailsCard />
            <BillingHistoryDetailsCard />
            <BillingHistoryDetailsCard />

          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default Billing;
