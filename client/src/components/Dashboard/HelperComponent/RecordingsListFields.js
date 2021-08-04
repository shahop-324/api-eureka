import React from "react";
import "./../../../assets/Sass/DataGrid.scss";

const RecordingsListFields = () => {
  return (
    <div className="registrations-list-fields-container">
      {/* <div className="registrations-edit-field">
        <div className="registrations-field-label"></div>
      </div> */}
      <div className="registrations-name-field">
        <div className="registrations-field-label mx-5">Session Name</div>
      </div>
      <div className="registrations-email-field">
        <div className="registrations-field-label">Event Name</div>
      </div>
      <div className="registrations-phone-field">
        <div className="registrations-field-label">Duration</div>
      </div>
      {/* <div className="registrations-date-field">
        <div className="registrations-field-label">Date</div>
      </div> */}
      <div className="registrations-amount-field">
        <div className="registrations-field-label">Quality</div>
      </div>
      <div className="registrations-ticket-type-field">
        <div className="registrations-field-label">Share to audience</div>
      </div>
      <div className="registrations-invoice-field">
        <div className="registrations-field-label">Download</div>
      </div>
    </div>
  );
};

export default RecordingsListFields;