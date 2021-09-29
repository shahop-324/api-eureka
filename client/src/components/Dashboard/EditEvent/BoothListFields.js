import React from "react";
import Divider from "@material-ui/core/Divider";
import './../../../assets/Sass/DataGrid.scss';

const BoothsListFields = () => {
  return (
      <>
    <div className="session-list-fields-container" style={{gridTemplateColumns: "1fr 4fr 3.5fr 2.5fr 3fr", alignItems: "center"}}>
      <div className="event-card-field">
        <div className="event-field-label" style={{width: '100%'}}>Order</div>
      </div>
      <div className="event-visibility-field">
        <div className="event-field-label" style={{width: '100%'}}>Name</div>
      </div>
      <div className="event-status-field">
        <div className="event-field-label" style={{width: '100%'}}>Email</div>
      </div>
      <div className="event-views-field">
        <div className="event-field-label" style={{width: '100%'}}>Tags</div>
      </div>
      <div className="event-registrations-field">
        <div className="event-field-label" style={{width: '100%'}}>Actions</div>
      </div>
    </div>
    <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
    </>
    
  );
};

export default BoothsListFields;
