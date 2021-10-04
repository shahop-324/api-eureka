import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ReceiptOutlinedIcon from "@material-ui/icons/ReceiptOutlined";
import Avatar from "@material-ui/core/Avatar";
import "./../../../../../assets/Sass/Registrations.scss";

import "./../../../../../assets/Sass/DataGrid.scss";
import { useDispatch } from "react-redux";
import Faker from 'faker';

import VisibilityIcon from '@mui/icons-material/Visibility';
import MailIcon from '@mui/icons-material/Mail';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PreviewParticipant from "../../HelperComponents/PreviewParticipant";

const ParticipantsDetailsCard = ({
  handleSeeMoreDetails,
  id,
  key,
  userImgURL,
  userName,
  userEmail,
  eventName,
  userContact,
  amount,
  currency,
  ticketType,
  preOrPostEventSale,
  transactionId,
  razorpayPayId,
  orderId,
}) => {

const dispatch = useDispatch();

const [open, setOpen] = useState(false);

const handleClose = () => {
  setOpen(false);
}
  return (
    <>
      <div className="registrations-field-value-container" style={{gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr"}}>
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5 d-flex flex-row ">
            {/* attendee avatar and name */}
            <Avatar alt={Faker.name.findName()} src={Faker.image.avatar()} variant="rounded" />
            <div className="ms-3 px-2 registration-name-styled">{Faker.name.findName()}</div>
          </div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {Faker.internet.email()}
            {/* attendee email */}
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* Ticket type */}
            Early bird
          </div>
        </div>
        <div className="registrations-ticket-type-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* Added via */}
            Invitation
          </div>
        </div>
        <div className="registrations-amount-field">
          <div className="registrations-field-label registrations-field-value-modified">
          <div onClick={() => {
              setOpen(true)
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <VisibilityIcon style={{color: "#A4C513"}} />
              </IconButton>
            </div>
            <div onClick={() => {
              alert("Email invitation sent!")
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <MailIcon style={{color: "#1351C5"}} />
              </IconButton>
            </div>
            <div onClick={() => {
              alert("Invitation Link copied to clipboard!")
            }}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <ContentCopyIcon style={{color: "#A113C5"}} />
              </IconButton>
            </div>
          </div>
        </div>
        
      </div>
      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
      <PreviewParticipant open={open} handleClose={handleClose} />
    </>
  );
};

export default ParticipantsDetailsCard;
