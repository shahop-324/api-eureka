import React from "react";
import styled from "styled-components";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CurrentPlanCard from "./HelperComponent/BillingComponents/CurrentPlanCard";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import LiveTvRoundedIcon from "@mui/icons-material/LiveTvRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import DraftsRoundedIcon from "@mui/icons-material/DraftsRounded";
import RadialChart from "./ChartComponents/RadialChart";
import RedeemCode from "./SubComponents/AddOns/RedeemCode";
import BuyExtraRegistrations from "./SubComponents/AddOns/BuyExtraRegistrations";
import BuyExtraStreamingHours from "./SubComponents/AddOns/BuyExtraStreamingHours";
import BuyExtraCloudStorage from "./SubComponents/AddOns/BuyExtraCloudStorage";
import BuyExtraEmails from "./SubComponents/AddOns/BuyExtraEmails";
import BuyExtraOrganiser from "./SubComponents/AddOns/BuyExtraOrganiser";
import { useSelector } from "react-redux";

const SectionHeading = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: #555555;
  font-family: "Ubuntu";
`;

const AddOnsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;

  background-color: #ffffff;
  min-height: 400px;
  border-radius: 10px;
`;

const CurrentPlanContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
`;

const AddOnCard = styled.div`
  height: 160px;
  background: rgba(228, 228, 228, 0.05);

  backdrop-filter: blur(1px);
  border: 1px solid #eeeeee;
  border-radius: 10px;

  &:hover {
    box-shadow: 0 8px 32px 0 rgb(195 197 219 / 37%);
    cursor: pointer;
  }
`;

const IconWrapper = styled.div`
  border-radius: 50%;
  padding: 12px;
  background-color: #dadada;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const AddOnHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;

const AddOnSubheading = styled.div`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.87rem;
  color: #686868;
`;
const AddOnPrice = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.93rem;
  color: #5c94d4;
`;

const AddOnsAndPlan = () => {
  const [openRedeem, setOpenRedeem] = React.useState(false);
  const [openRegistrations, setOpenRegistrations] = React.useState(false);
  const [openOrganisers, setOpenOrganisers] = React.useState(false);
  const [openStreaming, setOpenStreaming] = React.useState(false);
  const [openEmailCredit, setOpenEmailCredit] = React.useState(false);
  const [openCloudStorage, setOpenCloudStorage] = React.useState(false);

  const { communityDetails } = useSelector((state) => state.community);

  const codesApplied = communityDetails.codesApplied.length;

  const remainingMaxCodes = 3 - codesApplied * 1;

  const handleCloseRedeem = () => {
    setOpenRedeem(false);
  };

  const handleCloseRegistrations = () => {
    setOpenRegistrations(false);
  };

  const handleCloseStreaming = () => {
    setOpenStreaming(false);
  };

  const handleCloseOrganisers = () => {
    setOpenOrganisers(false);
  };

  const handleCloseEmailCredit = () => {
    setOpenEmailCredit(false);
  };

  const handleCloseCloudStorage = () => {
    setOpenCloudStorage(false);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <SectionHeading>Current Plan and Usage</SectionHeading>
          <button
            type="button"
            onClick={() => {
              setOpenRedeem(true);
            }}
            className="btn btn-success btn-outline-text"
          >
            Redeem AppSumo Code ({remainingMaxCodes} Remaining)
          </button>
        </div>

        <CurrentPlanContainer className="mx-4 px-4 pt-4 pb-1 mb-4">
          <CurrentPlanCard />
        </CurrentPlanContainer>

        <CurrentPlanContainer className="mx-4 px-4 pt-4 pb-1 mb-4">
          {/* Plan Limit Radial Indicators Row */}
          <div className="plan-limit-indicator-row mb-4">
            {/* Radial Indicator 1 */}
            <div className="registrations-in-period p-0 px-4 d-flex flex-row align-items-center">
              <div className="radial-chart-container me-3">
                <div className="percentage-label">50%</div>
                <RadialChart value="50" />
              </div>

              <div className="limit-value-and-heading-conatiner">
                <div className="consumed-value">
                  50 <span className="limit-value-small-text"> / 100</span>
                </div>
                <div className="limit-heading">Registrations</div>
              </div>
            </div>

            {/* Radial Indicator 2 */}
            <div className="streaming-hours p-0 px-4 d-flex flex-row align-items-center">
              <div className="radial-chart-container me-3">
                <div className="percentage-label">30%</div>
                <RadialChart value="30" />
              </div>

              <div className="limit-value-and-heading-conatiner">
                <div className="consumed-value">
                  21.6 hrs{" "}
                  <span className="limit-value-small-text"> / 72 Hrs</span>
                </div>
                <div className="limit-heading">Streaming</div>
              </div>
            </div>
            <div className="streaming-hours p-0 px-4 d-flex flex-row align-items-center">
              <div className="radial-chart-container me-3">
                <div className="percentage-label">30%</div>
                <RadialChart value="30" />
              </div>

              <div className="limit-value-and-heading-conatiner">
                <div className="consumed-value">
                  2 <span className="limit-value-small-text"> / 5</span>
                </div>
                <div className="limit-heading">Team members</div>
              </div>
            </div>
            <div className="streaming-hours p-0 px-4 d-flex flex-row align-items-center">
              <div className="radial-chart-container me-3">
                <div className="percentage-label">30%</div>
                <RadialChart value="30" />
              </div>

              <div className="limit-value-and-heading-conatiner">
                <div className="consumed-value">
                  1230{" "}
                  <span className="limit-value-small-text">
                    {" "}
                    / 2500 Available
                  </span>
                </div>
                <div className="limit-heading">Emails</div>
              </div>
            </div>
            <div className="streaming-hours p-0 px-4 d-flex flex-row align-items-center">
              <div className="radial-chart-container me-3">
                <div className="percentage-label">30%</div>
                <RadialChart value="30" />
              </div>

              <div className="limit-value-and-heading-conatiner">
                <div className="consumed-value">
                  6.2 GB{" "}
                  <span className="limit-value-small-text"> / 35 GB</span>
                </div>
                <div className="limit-heading">Cloud storage</div>
              </div>
            </div>
          </div>
        </CurrentPlanContainer>

        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pb-4">
          <SectionHeading>Add ons</SectionHeading>
        </div>

        <AddOnsContainer className="mx-4 px-4 py-4 mb-4">
          <AddOnCard className="p-4 d-flex flex-row">
            <IconWrapper className="me-4">
              <GroupRoundedIcon style={{ fontSize: "28px" }} />
            </IconWrapper>
            <div style={{ width: "100%" }}>
              <AddOnHeading className="mb-2">Additional attendees</AddOnHeading>
              <AddOnSubheading className="mb-4">
                Get more registration beyond plan limit
              </AddOnSubheading>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <AddOnPrice>$1.00 / Registrant</AddOnPrice>
                <button
                  onClick={() => {
                    setOpenRegistrations(true);
                  }}
                  className="btn btn-outline-text btn-outline-primary"
                >
                  Buy
                </button>
              </div>
            </div>
          </AddOnCard>
          <AddOnCard className="p-4 d-flex flex-row">
            <IconWrapper className="me-4">
              <AdminPanelSettingsRoundedIcon style={{ fontSize: "28px" }} />
            </IconWrapper>
            <div style={{ width: "100%" }}>
              <AddOnHeading className="mb-2">
                Additional organisers
              </AddOnHeading>
              <AddOnSubheading className="mb-4">
                Get more team members beyond plan limit
              </AddOnSubheading>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <AddOnPrice>$49.99 / Organiser per month</AddOnPrice>
                <button
                  onClick={() => {
                    setOpenOrganisers(true);
                  }}
                  className="btn btn-outline-text btn-outline-primary"
                >
                  Buy
                </button>
              </div>
            </div>
          </AddOnCard>
          <AddOnCard className="p-4 d-flex flex-row">
            <IconWrapper className="me-4">
              <LiveTvRoundedIcon style={{ fontSize: "28px" }} />
            </IconWrapper>
            <div style={{ width: "100%" }}>
              <AddOnHeading className="mb-2">
                Additional Streaming hours
              </AddOnHeading>
              <AddOnSubheading className="mb-4">
                Get more streaming limit beyond current plan
              </AddOnSubheading>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <AddOnPrice>$35.99 / per hour</AddOnPrice>
                <button
                  onClick={() => {
                    setOpenStreaming(true);
                  }}
                  className="btn btn-outline-text btn-outline-primary"
                >
                  Buy
                </button>
              </div>
            </div>
          </AddOnCard>
          <AddOnCard className="p-4 d-flex flex-row">
            <IconWrapper className="me-4">
              <DraftsRoundedIcon style={{ fontSize: "28px" }} />
            </IconWrapper>
            <div style={{ width: "100%" }}>
              <AddOnHeading className="mb-2">Additional Emails</AddOnHeading>
              <AddOnSubheading className="mb-4">
                Send more promotional or announcemnets to attendees, speakers
                and booth exhibitors.
              </AddOnSubheading>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <AddOnPrice>$10.99 / 1000 mails</AddOnPrice>
                <button
                  onClick={() => {
                    setOpenEmailCredit(true);
                  }}
                  className="btn btn-outline-text btn-outline-primary"
                >
                  Buy
                </button>
              </div>
            </div>
          </AddOnCard>
          <AddOnCard className="p-4 d-flex flex-row">
            <IconWrapper className="me-4">
              <CloudDoneRoundedIcon style={{ fontSize: "28px" }} />
            </IconWrapper>
            <div style={{ width: "100%" }}>
              <AddOnHeading className="mb-2">
                Additional cloud storage
              </AddOnHeading>
              <AddOnSubheading className="mb-4">
                Upload more videos to play in session or manage more session
                recordings
              </AddOnSubheading>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <AddOnPrice>$15.99 / 10GB cloud storage per month</AddOnPrice>
                <button
                  onClick={() => {
                    setOpenCloudStorage(true);
                  }}
                  className="btn btn-outline-text btn-outline-primary"
                >
                  Buy
                </button>
              </div>
            </div>
          </AddOnCard>
        </AddOnsContainer>
      </div>

      <RedeemCode open={openRedeem} handleClose={handleCloseRedeem} />
      <BuyExtraRegistrations
        open={openRegistrations}
        handleClose={handleCloseRegistrations}
      />
      <BuyExtraStreamingHours
        open={openStreaming}
        handleClose={handleCloseStreaming}
      />
      <BuyExtraCloudStorage
        open={openCloudStorage}
        handleClose={handleCloseCloudStorage}
      />
      <BuyExtraEmails
        open={openEmailCredit}
        handleClose={handleCloseEmailCredit}
      />
      <BuyExtraOrganiser
        open={openOrganisers}
        handleClose={handleCloseOrganisers}
      />
    </>
  );
};

export default AddOnsAndPlan;
