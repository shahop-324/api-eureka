import React from "react";
import Divider from "@material-ui/core/Divider";
import "./../../../../../../assets/Sass/DataGrid.scss";

const ReportsDownloadHistoryListFields = () => {
  return (
      <>
    <div className="session-list-fields-container" style={{gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr 2fr 1fr", gridGap: "16px"}}>
      <div className="event-card-field">
        <div className="event-field-label" style={{width: '100%'}}>Title</div>
      </div>
      <div className="event-visibility-field">
        <div className="event-field-label" style={{width: '100%'}}>Type</div>
      </div>
      <div className="event-visibility-field">
        <div className="event-field-label" style={{width: '100%'}}>Time stamp</div>
      </div>
      <div className="event-registrations-field">
        <div className="event-field-label" style={{width: '100%'}}>Last updated at</div>
      </div>
      <div className="event-registrations-field">
        <div className="event-field-label" style={{width: '100%'}}>Status</div>
      </div>
      <div className="event-registrations-field">
        <div className="event-field-label" style={{width: '100%'}}>Status</div>
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

export default ReportsDownloadHistoryListFields;
