import React from "react";
import "./../../../../assets/Sass/DataGrid.scss";
import dateFormat from "dateformat";
import Faker from "faker";
import Chip from "@mui/material/Chip";

const PayoutHistoryDetailsCard = ({
  type,
  planName,
  currency,
  price,
  transactionId,
  purchasedBy,
  timestamp,
}) => {
  return (
    <div
      className="registrations-list-fields-container mb-4"
      style={{ gridTemplateColumns: "1fr 1.2fr 1fr 1.5fr 2fr 2fr" }}
    >
      <div className="registrations-name-field">
        <div className="registrations-field-label">
          {/* Payout Id */}
          <span>7jui82ijiouiUJKH</span>
        </div>
      </div>
      <div className="registrations-name-field">
        <div className="registrations-field-label">
          {Faker.internet.email()}
        </div>
      </div>
      <div className="registrations-email-field">
        <div className="registrations-field-label">
          {dateFormat(Date.now(), "mmm dS, yyyy, h:MM TT")}
        </div>
      </div>
      <div className="registrations-phone-field">
        <div className="registrations-field-label">
          {dateFormat(Date.now(), "mmm dS, yyyy, h:MM TT")}
        </div>
      </div>
      <div className="registrations-phone-field">
        <div className="registrations-field-label">
          {/* Status */}
          <Chip label="Processing" color="primary" variant="outlined" />
        </div>
      </div>
      <div className="registrations-amount-field">
        <div className="registrations-field-label">
          {"$500"}
          {/* Amount */}
        </div>
      </div>
    </div>
  );
};

export default PayoutHistoryDetailsCard;
