import React from "react";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

const teamPosition = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "Community Manager", label: "Community Manager" },
  { value: "Event Host", label: "Event Host" },
];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
};

const AddNewMember = (props) => {
  return (
    <>
      <Dialog
        open={props.openAddToTeamDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="add-new-member-form px-4 py-4">
          <div className="form-heading-and-close-button mb-4">
            <div></div>
            <div className="coupon-overlay-form-headline">Add Team Members</div>
            <div
              className="overlay-form-close-button"
              onClick={props.handleCloseAddToTeamDialog}
            >
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
          <div className="mb-4 overlay-form-input-row team-form-row-3-in-1">
            <div>
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="communityName"
                aria-describedby="communityName"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label
                Forhtml="eventEndDate"
                className="form-label form-label-customized"
              >
                Select Role
              </label>
              <Select
                placeholder="Assign a role"
                styles={styles}
                menuPlacement="auto"
                options={teamPosition}
                // defaultValue={eventOptions[0]}
              />
            </div>
          </div>

          <div>
            <button
              className="btn btn-primary btn-outline-text"
              style={{ width: "100%" }}
            >
              Invite
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddNewMember;
