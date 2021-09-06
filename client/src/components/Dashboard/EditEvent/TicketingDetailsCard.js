import React from "react";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "./../../../assets/Sass/DataGrid.scss";

import ConfirmationNumberOutlinedIcon from "@material-ui/icons/ConfirmationNumberOutlined";
import Ripple from "../../ActiveStatusRipple";
import EditTicket from "./FormComponents/EditTicketForms/EditTicket";
import DeleteTicket from "./FormComponents/EditTicketForms/DeleteTicket";
import { fetchTicket } from "../../../actions";
import { useDispatch } from "react-redux";

const TicketingDetailsCard = (props) => {
    const [open, setOpen] = React.useState(false);

    console.log(props);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDeleteTicket = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteTicket = () => {
    setOpenDeleteDialog(false);
  };
const dispatch=useDispatch();
  const handleEditTicket = () => {
    dispatch(fetchTicket(props.id))
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const truncateText = (str, n) => {
    return str.length > n ? `${str.substring(0, n)} ...` : str;
  };

  return (
    <>
      <div className="ticketing-list-fields-container">
        <div
          className="event-card-field "
          style={{
            width: "100%",
          }}
        >
          <div className="registrations-name-field">
            <div className="registrations-field-label d-flex flex-row justify-content-start">
              {/* attendee avatar and name */}
              <ConfirmationNumberOutlinedIcon style={{ fill: "#538BF7" }} />
              <div className="ms-3 px-2 registration-name-styled">
                {/* {props.name} */}
                {truncateText(props.name, 20)}
              </div>
            </div>
          </div>
        </div>
        <div
          className="event-visibility-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            {/* {props.description} */}
            {truncateText(props.description, 35)}
          </div>
        </div>
        <div
          className="event-status-field"
          style={{
            width: "100%",
          }}
        >
          <div
            className="event-field-label registrations-field-label d-flex flex-column align-items-start"
            style={{ width: "100%" }}
          >
            {`${props.currency} ${props.price}`}
          </div>
        </div>
        <div
          className="event-views-field"
          style={{
            width: "100%",
          }}
        >
          <div className="event-field-label registrations-field-label">
            <div className="speaker-card-session-grid">{`${props.unitsAvailable} units`}</div>
          </div>
        </div>
        <div
          className="event-views-field"
          style={{
            width: "100%",
          }}
        >
          <div className="event-field-label registrations-field-label">
            <div className="speaker-card-session-grid">{`${props.unitsSold} units`}</div>
          </div>
        </div>
        <div className="event-running-status-field">
          <div
            className="d-flex flex-row mb-3"
            style={{
              width: "100%",
            }}
          >
            <div
              className="d-flex flex-row align-items-center event-field-label field-label-value"
              style={{ color: "#75BF72" }}
            >
              {props.status === "Active" ? (
                <div className="d-flex flex-row">
                  {" "}
                  <Ripple /> Active{" "}
                </div>
              ) : (
                <div>Inactive</div>
              )}
            </div>
          </div>
        </div>
        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div
              onClick={() => {
                handleEditTicket();
              }}
            >
              <IconButton color="primary" aria-label="add to shopping cart">
                <EditRoundedIcon />
              </IconButton>
            </div>
            <div
              onClick={() => {
                handleDeleteTicket();
              }}
            >
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>
      <EditTicket open={open} handleClose={handleClose} id={props.id} />
      <DeleteTicket
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteTicket={handleCloseDeleteTicket}
        id={props.id}
      />
    </>
  );
};

export default TicketingDetailsCard;
