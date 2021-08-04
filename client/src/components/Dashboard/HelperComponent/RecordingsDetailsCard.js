import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import FourKIcon from '@material-ui/icons/FourK';
import React from "react";

import Divider from "@material-ui/core/Divider";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import Avatar from '@material-ui/core/Avatar';

import "./../../../assets/Sass/DataGrid.scss";
import CustomizedSwitches from './ToggleSwitchForRecordingsShraing';

const RecordingsDetailsCard = () => {
  return (
    <>
      <div className="registrations-field-value-container">
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5 d-flex flex-row ">
            {/* attendee avatar and name */}
            <VideocamRoundedIcon style={{fill: "#538BF7"}}/>
            {/* <Avatar alt="Travis Howard" src={Faker.image.avatar()} /> */}
            <div className="ms-3 px-2 registration-name-styled">Safegurading PM Career</div>
          </div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label registrations-field-value-modified">
          Product Managemnet By Microsoft
            {/* attendee email */}
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* phone number */}
            2 hr 30 min
          </div>
        </div>
        <div className="registrations-ticket-type-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* Ticket Type */}
            <FourKIcon style={{fill: "#538BF7", fontSize: "32"}} />
          </div>
        </div>
        {/* <div className="registrations-date-field">
          <div className="registrations-field-label registrations-field-value-modified">
              
          </div>
        </div> */}
        <div className="registrations-amount-field">
          <div className="registrations-field-label registrations-field-value-modified">
            <CustomizedSwitches />
          </div>
        </div>
        <div className="registrations-invoice-field">
          <div className="registrations-field-label registrations-field-value-modified px-3">
            
            <CloudDownloadIcon />
            {/* clickable invoice icon */}
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
    </>
  );
};

export default RecordingsDetailsCard;
