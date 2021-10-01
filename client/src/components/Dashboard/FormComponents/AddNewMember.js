import React from "react";
import { IconButton } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Field, reduxForm } from "redux-form";

import Select from "react-select";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const options = [
  { value: "MP000", label: "Assign all permissons" },
  { value: "MP001", label: "Add another member" },
  { value: "MP002", label: "View Transactions" },
  { value: "MP003", label: "Create Payout Link" },
  { value: "MP004", label: "Add Speakers" },
  { value: "MP005", label: "Add Booths" },
  { value: "MP006", label: "Add Sessions" },
  { value: "MP007", label: "Add New Ticket" },
  { value: "MP008", label: "View attendees details" },
  { value: "MP009", label: "Setup RTMP & Live Streaming" },
  { value: "MP0010", label: "View analytics data" },
  { value: "MP0011", label: "Export analytics data" },
  { value: "MP0012", label: "Customize and send attendee emails" },
  { value: "MP0013", label: "Customize and send booth emails" },
  { value: "MP0014", label: "Customize and send speaker emails" },
  { value: "MP0015", label: "change networking settings" },
  { value: "MP0016", label: "Setup Integrations" },
  { value: "MP0017", label: "add sponsors" },
  { value: "MP0018", label: "Publish events" },
  { value: "MP0019", label: "Create new event" },
  { value: "MP0020", label: "Change Billing Plan" },
  { value: "MP0021", label: "Reply to users queries" },
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

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return (
      <div className="ui error message">
        <div className="header">{error}</div>
      </div>
    );
  }
};

const renderInput = ({
  input,
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {renderError(meta)}
    </div>
  );
};

const renderEventPreferences = ({
  input,
  meta: { touched, error, warning },
  name,
}) => (
  <div>
    <div>
      <Select
        isMulti
        styles={styles}
        className="basic-multi-select"
        classNamePrefix="select"
        name={name}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

const showResults = (formValues) => {
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};

const AddNewMember = ({
  open,
  handleClose,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    console.log(formValues);
    const ModifiedformValues = {};

    ModifiedformValues.email = formValues.email;

    ModifiedformValues.permissions = formValues.permissions.map((object) => {
      return object.value;
    });

    // dispatch(createNewInvitation(ModifiedformValues));
    showResults(ModifiedformValues);
  };

  return (
    <>
      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
        >
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Add New Member</div>
              <div
                onClick={() => {
                  handleClose();
                }}
              >
                <IconButton aria-label="close-drawer">
                  <CancelOutlinedIcon
                    style={{ fontSize: "26", color: "#4D4D4D" }}
                  />
                </IconButton>
              </div>
            </div>
            <div className="my-3">
              <hr />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
              <div className="side-drawer-more-details-content-section">
                <div className="row edit-profile-form-row mb-3">
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
                    >
                      E-mail
                    </label>
                    <Field
                      name="email"
                      type="email"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      placeholder="johndoe@gmail.com"
                      label="Email"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <label
                    for="communityHeadline"
                    className="form-label form-label-customized"
                  >
                    Set Permissions
                  </label>
                  <Field
                    name="permissions"
                    component={renderEventPreferences}
                    // label="Event Preferences"
                  />
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%" }}
                  disabled={pristine || submitting}
                >
                  Add New Member
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default reduxForm({
  form: "addNewMemberForm",
})(AddNewMember);
