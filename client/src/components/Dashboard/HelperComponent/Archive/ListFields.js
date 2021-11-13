import React from "react";
import './../../../../assets/Sass/DataGrid.scss';

const ArchiveListFields = () => {
  return (
    <div className="events-list-fields-container" style={{display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"}}>
      <div className="event-card-field ">
        <div className="event-field-label ms-3">Event</div>
      </div>
      <div className="event-visibility-field">
        <div className="event-field-label">Visibility</div>
      </div>
      <div className="event-status-field">
        <div className="event-field-label">Status</div>
      </div>
      <div className="event-registrations-field">
        <div className="event-field-label">Registrations</div>
      </div>
      <div className="event-stage-field">
        <div className="event-field-label">Unarchive</div>
      </div>
    </div>
  );
};

export default ArchiveListFields;
