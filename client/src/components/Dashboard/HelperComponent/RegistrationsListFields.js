import React from "react";
import "./../../../assets/Sass/DataGrid.scss";

const RegistrationsListFields = () => {
  return (
    <div className="registrations-list-fields-container">
     
      <div className="registrations-name-field">
        <div className="registrations-field-label mx-5">Name</div>
      </div>
      <div className="registrations-email-field">
        <div className="registrations-field-label">Email</div>
      </div>
      <div className="registrations-phone-field">
        <div className="registrations-field-label">Phone Number</div>
      </div>
      
      <div className="registrations-amount-field">
        <div className="registrations-field-label">Amount</div>
      </div>
      <div className="registrations-ticket-type-field">
        <div className="registrations-field-label">Ticket Type</div>
      </div>
      <div className="registrations-invoice-field">
        <div className="registrations-field-label">Invoice</div>
      </div>
    </div>
  );
};

export default RegistrationsListFields;
