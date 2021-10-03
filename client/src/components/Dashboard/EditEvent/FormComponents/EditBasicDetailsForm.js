import React from "react";
import dateFormat from "dateformat";
import { useParams } from "react-router";
import Select from "react-select";
import "./../../../../index.css";
import { connect, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { useDispatch } from "react-redux";
import { editEvent, errorTrackerForeditEvent } from "../../../../actions";
import Loader from "../../../Loader";
import { useSnackbar } from "notistack";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { IconButton } from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import styled from 'styled-components';

const StyledInput = styled.input`
font-weight: 500;
font-family: "Ubuntu";
font-size: 0.8rem;
color: #4E4E4E;
`

const FormLabel = styled.label`
font-family: "Ubuntu" !important;
font-size: 0.82rem !important;
font-weight: 500 !important;
color: #727272 !important;
`
const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
font-size: 1.2rem;
font-family: "Ubuntu";
font-weight: 600;
color: #212121;
`

const FormSubHeading = styled.div`
font-size: 0.87rem;
font-family: "Ubuntu";
font-weight: 500;
color: #424242;
`

const FormError = styled.div`
font-family: "Ubuntu";
color: red;
font-weight: 400;
font-size: 0.8rem;
`

const FormWarning = styled.div`
font-family: "Ubuntu";
color: orange;
font-weight: 400;
font-size: 0.8rem;
`

const renderInput = ({
  input,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
  open,
  handleClose,
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

const renderReactSelect = ({
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
        isMulti={isMulti}
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

const options = [
  { value: "Technology", label: "Technology" },
  { value: "Education", label: "Education" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Professional Development", label: "Professional Development" },
  { value: "Arts and crafts", label: "Arts and crafts" },
  {
    value: "Business & Enterpreneurship",
    label: "Business & Enterpreneurship",
  },
  { value: "Job Search", label: "Job Search" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health" },
  { value: "Crypto", label: "Crypto" },
  { value: "Web Security", label: "Web Security" },
];

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

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
};

const EditBasicDetailsForm = ({
  handleSubmit,
  pristine,
  submitting,
  reset,
  hideFormHeading,
  showBlockButton,
  showInlineButton,
  open,
  handleClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { error, isLoading } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  console.log(id);

  const onSubmit = (formValues) => {
    const categories = [];

    for (let element of formValues.selectCategories) {
      categories.push(element.value);
    }

    console.log(categories);

    const ModifiedFormValues = {};
    ModifiedFormValues.eventName = formValues.eventName;
    ModifiedFormValues.shortDescription = formValues.shortDescription;
    ModifiedFormValues.startDate = formValues.startDate;
    ModifiedFormValues.endDate = formValues.endDate;
    ModifiedFormValues.startTime = `${formValues.startDate}T${formValues.startTime}:00Z`;
    ModifiedFormValues.endTime = `${formValues.endDate}T${formValues.endTime}:00Z`;
    ModifiedFormValues.Timezone = formValues.selectTimeZone.value;
    ModifiedFormValues.categories = categories;
    ModifiedFormValues.visibility = formValues.visibility;

    dispatch(editEvent(ModifiedFormValues, id));
    handleClose();
  };

  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ width: "100%", height: "80vh" }}
      >
        {" "}
        <Loader />{" "}
      </div>
    );
  }

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });
    return dispatch(errorTrackerForeditEvent());
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <HeaderFooter className="px-4 pt-3 pb-2">
          <div
            className="form-heading-and-close-button"
            style={{ width: "100%" }}
          >
            <div></div>
            <FormHeading
              className="overlay-form-heading"
              style={{ fontFamily: "Ubuntu" }}
            >
              Edit Event
            </FormHeading>
            <div
              className="overlay-form-close-button"
              onClick={handleClose}
            >
             
              <IconButton
                type="button"
                aria-label="delete"
                onClick={handleClose}
              >
                <CancelRoundedIcon />
              </IconButton>
              
            </div>
          </div>
          
          </HeaderFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-event-form px-4 py-4 d-flex flex-column align-items-center">
            <FormLabel
              className={
                `overlay-form-heading ` +
                (hideFormHeading === "1" ? "hide" : "")
              }
            >
              New Event
            </FormLabel>
            <h5
              className={
                `overlay-sub-form-heading mb-5 ` +
                (hideFormHeading === "1" ? "hide" : "")
              }
            >
              Let's create an all new event for your community.
            </h5>
            <div className="mb-4 overlay-form-input-row">
              <FormLabel
                for="eventName"
                className="form-label form-label-customized"
              >
                Event Name
              </FormLabel>
              <Field
                name="eventName"
                type="text"
                classes="form-control"
                id="eventName"
                ariadescribedby="eventName"
                component={renderInput}
              />
            </div>

            <div className="mb-4 overlay-form-input-row">
              <FormLabel
                for="shortDescription"
                className="form-label form-label-customized"
              >
                Short description
              </FormLabel>
              <Field
                name="shortDescription"
                type="text"
                classes="form-control"
                id="shortDescription"
                ariadescribedby="communityName"
                component={renderTextArea}
              />
            </div>
            <div className="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <FormLabel
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Start Date
                </FormLabel>
                <Field
                  name="startDate"
                  type="date"
                  classes="form-control"
                  id="eventStartDate"
                  component={renderInput}
                />
              </div>
              <div>
                <FormLabel
                  Forhtml="eventStartTime"
                  className="form-label form-label-customized"
                >
                  Start Time
                </FormLabel>
                <Field
                  name="startTime"
                  type="time"
                  classes="form-control"
                  id="eventStartTime"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <FormLabel
                  Forhtml="eventEndDate"
                  className="form-label form-label-customized"
                >
                  End Date
                </FormLabel>
                <Field
                  name="endDate"
                  type="date"
                  classes="form-control"
                  id="eventEndDate"
                  component={renderInput}
                />
              </div>
              <div>
                <FormLabel
                  Forhtml="eventEndTime"
                  className="form-label form-label-customized"
                >
                  End Time
                </FormLabel>
                <Field
                  name="endTime"
                  type="time"
                  classes="form-control"
                  id="eventEndTime"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row">
              <FormLabel
                Forhtml="selectTimeZone"
                className="form-label form-label-customized"
              >
                Select timezone
              </FormLabel>
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
            <div className="mb-4 overlay-form-input-row">
              <FormLabel
                Forhtml="selectCategories"
                className="form-label form-label-customized"
              >
                Select categories
              </FormLabel>
              <Field
                name="selectCategories"
                isMulti="true"
                styles={styles}
                menuPlacement="auto"
                options={options}
                defaultValue={options[0]}
                component={renderReactSelect}
              />
            </div>
           
            <div className="mb-4 overlay-form-input-row">
              <FormLabel>Event Visibility</FormLabel>
              <div className="form-check mb-2">
                <Field
                  name="visibility"
                  className="form-check-input"
                  type="radio"
                  // name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value="Public"
                  // component={renderInput}
                  component="input"
                />
                <label className="form-check-label" for="flexRadioDefault1">
                  Public
                </label>
                <div
                  id="emailHelp"
                  className="form-text"
                  style={{ fontSize: "13px" }}
                >
                  Upgrade to a paid plan to create public events.
                </div>
              </div>
              <div className="form-check mb-2">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="visibility"
                  id="flexRadioDefault2"
                  // checked="true"
                  value="Private"
                  // component={renderInput}
                  component="input"
                />
                <label className="form-check-label" for="flexRadioDefault2">
                  Private
                </label>
              </div>
              <div className="form-check">
                <Field
                  className="form-check-input"
                  type="radio"
                  name="visibility"
                  id="flexRadioDefault2"
                  // checked="true"
                  value="Hidden"
                  // component={renderInput}
                  component="input"
                />
                <label className="form-check-label" for="flexRadioDefault2">
                  Hidden
                </label>
              </div>
            </div>
            <div className={showInlineButton === "false" ? "hide" : ""}></div>
            <div
              className="d-flex flex-row justify-content-end"
              style={{ width: "100%" }}
            >
              <button
                onClick={() => {
                  reset();
                }}
                className={
                  `btn btn-outline-primary btn-outline-text me-3 ` +
                  (showInlineButton === "false" ? "hide" : "")
                }
                disabled={pristine || submitting}
              >
                Discard
              </button>
              <button
                type="submit"
                className={
                  `btn btn-primary btn-outline-text ` +
                  (showInlineButton === "false" ? "hide" : "")
                }
                disabled={pristine || submitting}
              >
                Save changes
              </button>
            </div>
            <div
              className={showBlockButton === "false" ? "hide" : ""}
              style={{ width: "100%" }}
            >
              <button
                disabled={pristine || submitting}
                className={
                  `btn btn-primary btn-outline-text ` +
                  (showBlockButton === "false" ? "hide" : "")
                }
                style={{ width: "100%" }}
              >
                Create New Event
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    eventName:
      state.event.eventDetails && state.event.eventDetails.eventName
        ? state.event.eventDetails.eventName
        : "",
    shortDescription:
      state.event.eventDetails && state.event.eventDetails.shortDescription
        ? state.event.eventDetails.shortDescription
        : "",

    startDate:
      state.event.eventDetails && state.event.eventDetails.startDate
        ? dateFormat(new Date(state.event.eventDetails.startDate), "yyyy-mm-dd")
        : "",
    startTime:
      state.event.eventDetails && state.event.eventDetails.startTime
        ? dateFormat(new Date(state.event.eventDetails.startTime), "HH:MM")
        : "",
    endDate:
      state.event.eventDetails && state.event.eventDetails.endDate
        ? dateFormat(new Date(state.event.eventDetails.endDate), "yyyy-mm-dd")
        : "",
    endTime:
      state.event.eventDetails && state.event.eventDetails.endTime
        ? dateFormat(new Date(state.event.eventDetails.endTime), "HH:MM")
        : "",
    selectTimeZone: state.event.eventDetails
      ? {
          value: state.event.eventDetails.Timezone,
          label: state.event.eventDetails.Timezone,
        }
      : { value: "(GMT + 00:00) UTC", label: "(GMT + 00:00) UTC" },
    selectCategories: state.event.eventDetails
      ? state.event.eventDetails.categories.map((element) => {
          return {
            value: element,
            label: element,
          };
        })
      : null,
    visibility:
      state.event.eventDetails && state.event.eventDetails.visibility
        ? state.event.eventDetails.visibility
        : "",
    service:
      state.event.eventDetails && state.event.eventDetails.service
        ? state.event.eventDetails.service
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};

  if (!formValues.eventName) {
    errors.eventName = "Event name is required";
  }
  if (!formValues.shortDescription) {
    errors.description = "Event description is required";
  }
  if (!formValues.startDate) {
    errors.startDate = "Start Date is required";
  }
  if (!formValues.startTime) {
    errors.startTime = "Start Time is required";
  }
  if (!formValues.endDate) {
    errors.endDate = "End Date is required";
  }
  if (!formValues.endTime) {
    errors.endTime = "End Time is required";
  }
  if (!formValues.selectTimeZone) {
    errors.selectTimeZone = "Timezone is required";
  }
  if (!formValues.selectCategories) {
    errors.selectCategories = "Categories is required";
  }
  if (!formValues.visibility) {
    errors.visibility = "Event visibility is required";
  }
  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditBasicDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditBasicDetailsForm)
);
