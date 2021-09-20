import React, { useState } from "react";
import styled from "styled-components";

import { reduxForm, Field } from "redux-form";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import Select from "react-select";
import InvitePeopleToGroupMeet from "./InvitePeopleToGroupMeet";

const timeZoneOptions = [
  { value: "(GMT + 00:00) UTC", label: "(GMT + 00:00) UTC" },
  { value: "(GMT + 00:00) Edinburgh", label: "(GMT + 00:00) Edinburgh" },
  { value: "(GMT + 00:00) Lisbon", label: "(GMT + 00:00) Lisbon" },
  { value: "(GMT + 00:00) London", label: "(GMT + 00:00) London" },
  { value: "(GMT-10:00) Hawaii", label: "(GMT-10:00) Hawaii" },
  {
    value: "(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai",
    label: "(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai",
  },
  { value: "(GMT+5:45) Kathmandu", label: "(GMT+5:45) Kathmandu" },
];

const peopleInEvent = [
  // { value: "gu2892ojwoow2i92", label: "Shreyansh shah" },
  // { value: "278910io9929020020okeokkl", label: "Omprakash shah" },
];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.8rem",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.8rem",
  }),
};

const renderInput = ({
  input,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderTextArea = ({
  input,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <textarea
        rows="2"
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderReactSelectTimeZone = ({
  isMulti,
  input,
  meta: { touched, error, warning },
  styles,
  menuPlacement,
  options,
  defaultValue,

  name,
}) => (
  <div>
    <div>
      <Select
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
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

const FormLabel = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
  font-family: "Ubuntu";
  color: #152d35;

  margin-bottom: 6px;
`;

const SmallDescriptiveText = styled.small`
  font-weight: 400;

  font-family: "Ubuntu";
`;

const ScheduleGroupMeeting = ({ openDrawer, handleCloseDrawer }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div className="py-3 px-4">
            <div className="d-flex flex-row align-items-center mb-4">
              <div
                style={{
                  backgroundColor: "#94949436",
                  width: "fit-content",
                  borderRadius: "5px",
                }}
                className="px-2 py-1"
              >
                <ArrowBackIosRoundedIcon
                  className="chat-msg-hover-icon"
                  style={{ fontSize: "18px" }}
                  onClick={() => {
                    handleCloseDrawer();
                  }}
                />
              </div>
              <div
                className="ms-3"
                style={{
                  color: "#212121",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                Back
              </div>
            </div>

            <form className="">
              <div class="mb-4 overlay-form-input-row">
                <FormLabel>Title</FormLabel>
                <Field
                  name="eventName"
                  type="text"
                  classes="form-control"
                  id="eventName"
                  ariadescribedby="eventName"
                  component={renderInput}
                />
              </div>

              <div class="mb-4 overlay-form-input-row">
                <FormLabel>Agenda</FormLabel>
                <Field
                  name="shortDescription"
                  type="text"
                  classes="form-control"
                  id="shortDescription"
                  ariadescribedby="communityName"
                  component={renderTextArea}
                />
              </div>

              <div class="mb-4 overlay-form-input-row form-row-2-in-1">
                <div>
                  <FormLabel>Date</FormLabel>
                  <Field
                    name="startDate"
                    type="date"
                    classes="form-control"
                    id="eventStartDate"
                    minimumDate={Date.now()}
                    component={renderInput}
                  />
                </div>
                <div>
                  <FormLabel>Time</FormLabel>
                  <Field
                    name="startTime"
                    type="time"
                    classes="form-control"
                    id="eventStartTime"
                    component={renderInput}
                    min={Date.now()}
                  />
                </div>
              </div>

              <div class="mb-4 overlay-form-input-row">
                <FormLabel>Timezone</FormLabel>
                <Field
                  name="selectTimeZone"
                  styles={styles}
                  menuPlacement="auto"
                  options={timeZoneOptions}
                  defaultValue={timeZoneOptions[0]}
                  id="selectTimeZone"
                  component={renderReactSelectTimeZone}
                />
              </div>

              <div class="mb-4 overlay-form-input-row">
                <FormLabel>Participants</FormLabel>
                <SmallDescriptiveText>No one has been invited</SmallDescriptiveText>
                {/* <Field
                  name="selectTimeZone"
                  styles={styles}
                  menuPlacement="auto"
                  options={peopleInEvent}
                  defaultValue={peopleInEvent[0]}
                  id="selectTimeZone"
                  component={renderReactSelectTimeZone}
                /> */}
                <div className="d-flex flex-row align-items-center justify-content-end">
                  <button
                    style={{ width: "100%" }}
                    onClick={() => {
                      handleOpen();
                    }}
                    type="button"
                    className="btn btn-outline-dark btn-outline-text mt-3"
                  >
                    Invite people
                  </button>
                </div>
              </div>

              <div
                // className={props.showBlockButton === "false" ? "hide" : ""}
                style={{ width: "100%" }}
              >
                <button
                  type="submit"
                  // disabled={pristine || submitting}
                  className={`btn btn-primary btn-outline-text `}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>

      <InvitePeopleToGroupMeet open={open} handleClose={handleClose} />
    </>
  );
};

// export default ScheduleGroupMeeting;

export default reduxForm({
  form: "scheduleGroupMeeting",
  // validate,
})(ScheduleGroupMeeting);
