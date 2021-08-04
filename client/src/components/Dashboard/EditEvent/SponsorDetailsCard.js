import React from "react";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import "./../../../assets/Sass/DataGrid.scss";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";
import { makeStyles } from "@material-ui/core/styles";
import EditSponsor from "./FormComponents/EditSponsorsForms/EditSponsor";
import DeleteSponsor from "./FormComponents/EditSponsorsForms/deleteSponsor";
import { useDispatch } from "react-redux";
import { fetchSponsor } from "../../../actions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const SponsorDetailsCard = (props) => {
  const [open, setOpen] = React.useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDeleteSponsor = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteSponsor = () => {
    setOpenDeleteDialog(false);
  };

  const handleEditSponsor = () => {
    dispatch(fetchSponsor(props.id));
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const classes = useStyles();
  return (
    <>
      <div className="sponsors-list-fields-container">
        <div
          className="event-card-field "
          style={{
            width: "100%",
          }}
        >
          <div className="registrations-name-field">
            <div className="registrations-field-label d-flex flex-row justify-content-start">
              {/* attendee avatar and name */}
              <Avatar
                alt={props.name}
                src={props.url}
                variant="rounded"
                className={classes.large}
              />
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
            {props.organisationName}
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
            {props.website}
          </div>
        </div>
        <div
          className="event-views-field"
          style={{
            width: "100%",
          }}
        >
          <div className="event-field-label registrations-field-label">
            <div className="speaker-card-session-grid">{props.status}</div>
          </div>
        </div>

        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div onClick={() => {
              handleEditSponsor()
              dispatch(fetchSponsor(props.id));
            }}>

            <IconButton color="primary" aria-label="add to shopping cart">
              <EditRoundedIcon />
            </IconButton>
            </div>
            <div onClick={handleDeleteSponsor}>

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
      <EditSponsor open={open} handleClose={handleClose} id={props.id}/>
      <DeleteSponsor openDeleteDialog={openDeleteDialog} handleCloseDeleteSponsor={handleCloseDeleteSponsor} id={props.id}/>
    </>
  );
};

export default SponsorDetailsCard;
