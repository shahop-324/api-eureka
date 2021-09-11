import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PayPalLOGO from "./../../assets/images/paypal-logo.png";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Billing.scss";

import BasicPlanCard from "./HelperComponent/BillingComponents/BasicsPlanCard";
import ProPlanCard from "./HelperComponent/BillingComponents/ProPlanCard";
import EnterprisePlanCard from "./HelperComponent/BillingComponents/EnterprisePlanCard";

import CurrentPlanCard from "./HelperComponent/BillingComponents/CurrentPlanCard";
import { SwipeableDrawer } from "@material-ui/core";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import { IconButton } from "@material-ui/core";
import BillingListFields from "./HelperComponent/BillingComponents/BillingListFields";
import BillingHistoryDetailsCard from "./HelperComponent/BillingComponents/BillingHistoryDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { getPayPalConnectLink } from "../../actions";

let AACComponent;

const loadPaypal = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://www.paypalobjects.com/payouts/js/payouts_aac.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const showPayPalConnect = async () => {
  const res = await loadPaypal();

  if (!res) {
    alert("Paypal SDK failed to load. Are you online?");
    return;
  }

  console.log(window.paypal);

  AACComponent = window.paypal.PayoutsAAC.driver("react", {
    React,
    ReactDOM,
  });
};

showPayPalConnect();

const Billing = () => {
  const paypalSignupLink = useSelector((state) => state.paypal.link);

  const dispatch = useDispatch();

  function onboardedCallback(authCode, sharedId) {
    console.log("authCode", authCode);
    console.log("sharedId", sharedId);
    fetch("/seller-server/login-seller", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        authCode: authCode,
        sharedId: sharedId,
      }),
    }).then(function (res) {
      if (!res.ok) {
        alert("Something went wrong!");
      }
    });
  }

  useEffect(() => {
    dispatch(getPayPalConnectLink());

    const script = document.createElement("script");

    script.src =
      "https://www.sandbox.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getAuthCodeAndSharedId = (authCode, sharedId) => {
    console.log(authCode);
    console.log(sharedId);
  };

  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Accept Payments</div>
        </div>

        <div className="connect-with-paypal-section d-flex flex-row align-items-center px-4 py-4">
          <img
            src={PayPalLOGO}
            style={{ maxWidth: "200px", borderRight: "1px solid #538BF7" }}
            alt={"Paypal logo"}
            className="px-4 me-4"
          />
          {/* <div>
            <a
              rel="noreferrer"
              target="_blank"
              data-paypal-onboard-complete="onboardedCallback"
              href={`${paypalSignupLink}&displayMode=minibrowser`}
              data-paypal-button="true"
            >
              
                Connect with PayPal
              
            </a>
          </div> */}
<div style={{width: "300px"}}>

{AACComponent ? (
            <AACComponent
            // style={{width: "300px", color: "blue"}}
              merchantId="GMBMW6HSY4YXG"
              env="sandbox"
              clientId={{
                sandbox:
                  "AWulL9SIFX_aLmdGojavSIAgf9O3_ZgTyUETSYQkDjEX65WwtWddKF6D95w7nzwpnXFWFnhyRzsG9yfi",
              }}
              pageType="login"
              onLogin={(response) => {
                if (response.err) {
                  console.log(response.err);
                } else {
                  console.log(response.body.code);
                }
              }}
            />
          ) : (
            <></>
          )}
</div>
        </div>

        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Billing</div>
          <div className="sec-heading-action-button d-flex flex-row">
            <button
              type="button"
              onClick={() => {
                setOpenDrawer(true);
              }}
              className="btn btn-primary btn-outline-text"
            >
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
