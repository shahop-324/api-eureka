/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Billing.scss";
import styled from "styled-components";
import Ripple from "./../ActiveStatusRipple";
import EnterprisePlanCard from "./HelperComponent/BillingComponents/EnterprisePlanCard";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunity,
  getStripeConnectLink,
  fetchCommunityTransactions,
} from "../../actions";
import { useParams } from "react-router-dom";
import FreePlanCard from "./HelperComponent/BillingComponents/FreePlanCard";
import GrowthPlanCard from "./HelperComponent/BillingComponents/GrowthPlanCard";
import BillingHistory from "./SubComponents/BillingHistory";

const DurationSwitchBase = styled.div`
  background-color: #e0e0e08c;
  border-radius: 5px;
  height: 40px;
  width: 330px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
`;
const DurationSwitch = styled.div`
  font-size: 0.8rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: ${(props) => (props && props.active ? "#FFFFFF" : "#333333")};

  padding: 5px 10px;
  background-color: ${(props) =>
    props && props.active ? "#538BF7" : "transparent"};
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props && props.active ? "#538BF7" : "#E0E0E0"};
  }
`;

const StripeAccountCardBody = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  height: auto;
  width: 100%;
  max-width: 1460px;
`;

const NoteContainer = styled.div`
  width: 100%;
  height: auto;
  background-color: #525f7f;
  border-radius: 10px;
  border-left: 8px solid #152d35;
`;

const NoteText = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #ffffff;
`;

const Billing = () => {
  const { isStripeEnabled, verifiedStripeAccountId } = useSelector(
    (state) => state.community.communityDetails
  );

  const [duration, setDuration] = React.useState("monthly");

  const params = useParams();

  const communityId = params.id;

  const userId = params.userId;

  console.log(userId, communityId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCommunity(communityId));
    dispatch(fetchCommunityTransactions(communityId));
  }, []);

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const color = isStripeEnabled ? "#90EE7D" : "#dfe769";

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Accept Payments</div>
        </div>

        <StripeAccountCardBody
          className="px-4 mx-3 mb-4 py-4 d-flex flex-column align-items-center justify-content-center"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0px 5px 20px rgb(176 195 211 / 16%)",
            borderRadius: "20px",
          }}
        >
          {isStripeEnabled ? (
            <div className="mb-3">
              <button className="btn btn-outline-danger btn-outline-text me-3">
                Terminate connection
              </button>
              <button className="btn btn-outline-info btn-outline-text">
                Change account
              </button>
            </div>
          ) : (
            <a
              onClick={() => {
                dispatch(getStripeConnectLink(userId, communityId));
              }}
              href="#"
              className="stripe-connect slate mb-3"
            >
              <span>Connect with</span>
            </a>
          )}

          <div className="d-flex flex-row justify-content-end mb-3">
            <div className="btn-outline-text current-plan-will-renew-at me-3">
              Current status:
            </div>

            {isStripeEnabled ? (
              <div
                className="d-flex flex-row align-items-center event-field-label field-label-value"
                style={{ color: "#75BF72", fontFamily: "Ubuntu" }}
              >
                <Ripple /> Connected{" "}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "Ubuntu",
                  fontWeight: "500",
                  color: "#D64329",
                }}
              >
                Not connected
              </div>
            )}
          </div>
          <div className="d-flex flex-row justify-content-end mb-3">
            <div className="btn-outline-text current-plan-will-renew-at me-3">
              Account no:{" "}
              <span className="ms-3">
                {isStripeEnabled ? verifiedStripeAccountId : "---"}
              </span>
            </div>
          </div>

          <NoteContainer className="px-4 py-3">
            <NoteText style={{ color: color }}>
              {isStripeEnabled
                ? "Your community is connnected to stripe for secure transactions."
                : "Please connect your account with stripe for secure payments."}
            </NoteText>
          </NoteContainer>
        </StripeAccountCardBody>

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
        <div
          className="px-4 mx-3 mb-4 py-4 pb-4"
          style={{
            backgroundColor: "#ffffff",
            height: "auto",
            borderRadius: "20px",
            minHeight: "none !important",
          }}
        >
          <div>
            {/* <CurrentPlanCard /> */}

            {/* <div className="d-flex flex-row align-items-center justify-content-center">
              <DurationSwitchBase className="px-1 py-1">
                <DurationSwitch
                  onClick={() => {
                    setDuration("monthly");
                  }}
                  active={duration === "monthly" ? true : false}
                >
                  Monthly
                </DurationSwitch>
                <DurationSwitch
                  onClick={() => {
                    setDuration("yearly");
                  }}
                  active={duration === "yearly" ? true : false}
                >
                  Yearly (15% off)
                </DurationSwitch>
              </DurationSwitchBase>
            </div> */}

            <div className="pricing-cards-section pt-4">
              {/* Free Plan Goes Here */}
              {/* <FreePlanCard /> */}
              <FreePlanCard />
              {/* Basic plan goes here */}

              <GrowthPlanCard duration={duration} />
              {/* Pro Plan Goes here */}

              {/* Enterprise Plan Goes Here */}
              <EnterprisePlanCard />
            </div>

            {/* Here goes main billing related content */}
          </div>
        </div>
        {/* Here I have to use pagination */}
      </div>

      <BillingHistory open={openDrawer} handleClose={handleCloseDrawer} />
    </>
  );
};

export default Billing;
