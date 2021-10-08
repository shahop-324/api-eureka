import React from "react";
import Divider from "@material-ui/core/Divider";
import "./../../../../../assets/Sass/DataGrid.scss";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";

import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded"; // Download report
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded"; // Update report
import CircleRoundedIcon from "@mui/icons-material/CircleRounded"; // Dot indicator
import PieChartRoundedIcon from "@mui/icons-material/PieChartRounded"; // Analytics Icon

import PersonRoundedIcon from '@mui/icons-material/PersonRounded'; // Attendee

import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'; // Mail icon

import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'; // Edit mode

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'; // Preview

import SendRoundedIcon from '@mui/icons-material/SendRounded'; // Send

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'; // Delete

import dateFormat from "dateformat";

import Faker from "faker";

const ListFieldText = styled.div`
  font-family: "Ubuntu";
  font-size: 0.83rem;
  font-weight: 500;
  color: #535353;
`;

const EventReportIconBox = styled.div`
  padding: 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props && props.color ? props.color : "#538BF7"};
  color: #ffffff;
`;

const now = Date.now();

const EmailDetailsCard = () => {
  return (
    <>
      <div
        className="session-list-fields-container"
        style={{
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
            gridGap: "16px",
            alignItems: "center",
          }}
      >
        <div className="">
          <ListFieldText className="" style={{ width: "100%" }}>
            {/* Title */}
            <div className="d-flex flex-row align-items-center">
              <EventReportIconBox className="me-3">
                <MailOutlineOutlinedIcon />
              </EventReportIconBox>
              Event Chat Report
            </div>
          </ListFieldText>
        </div>
        <div className="">
          <ListFieldText className="" style={{ width: "100%" }}>
            New Speakers Line up
          </ListFieldText>
        </div>
        
        <div className="">
          <ListFieldText className="" style={{ width: "100%" }}>
            {/* Email status */}
            <div className="d-flex flex-row align-items-center">
              <CircleRoundedIcon
                style={{ fontSize: "10px", color: "#21C760" }}
                className="me-2"
              />
              <span>Sent</span>
            </div>
          </ListFieldText>
        </div>
        <div className="">
          <ListFieldText className="" style={{ width: "100%" }}>
            {/* Last update */}
            {dateFormat(now)}
          </ListFieldText>
        </div>
        

        <div className="">
          <ListFieldText className="" style={{ width: "100%" }}>
            <div className="d-flex flex-row align-items-center">
              <IconButton className="">
                <ModeEditOutlineRoundedIcon
                  style={{ fontSize: "21px", color: "#538BF7" }}
                />
              </IconButton>
              <IconButton className="">
                <VisibilityRoundedIcon
                  style={{ fontSize: "21px", color: "#A9C317" }}
                />
              </IconButton>
              <IconButton className="">
                <SendRoundedIcon
                  style={{ fontSize: "21px", color: "#9217C3" }}
                />
              </IconButton>
              <IconButton className="">
                <DeleteRoundedIcon
                  style={{ fontSize: "21px", color: "#C31717" }}
                />
              </IconButton>
            </div>
          </ListFieldText>
        </div>
      </div>
      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
    </>
  );
};

export default EmailDetailsCard;
