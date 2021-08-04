import React from "react";
import "./../../../../assets/Sass/DataGrid.scss";

const BillingHistoryDetailsCard = () => {
  return (
    <div
      className="registrations-list-fields-container mb-4"
      style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
    >
      <div className="registrations-name-field">
        <div className="registrations-field-label mx-5">Basics</div>
      </div>
      <div className="registrations-email-field">
        <div className="registrations-field-label">INR 7459</div>
      </div>
      <div className="registrations-phone-field">
        <div className="registrations-field-label">22 July 2021, 10:40 PM</div>
      </div>
      <div className="registrations-amount-field">
        <div className="registrations-field-label">HUQJ_81y1uuj8jkKK</div>
      </div>
    </div>
  );
};

export default BillingHistoryDetailsCard;
