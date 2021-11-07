import React from "react";
import dateFormat from "dateformat";
import { useParams } from "react-router";
import Select from "react-select";
import "./../../../../index.css";
import { connect, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { useDispatch } from "react-redux";
import {
  editEvent,
  errorTrackerForeditEvent,
  showSnackbar,
} from "../../../../actions";
import Loader from "../../../Loader";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import styled from "styled-components";

const StyledInput = styled.input`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.75rem;
  color: #4e4e4e;
`;

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #727272 !important;
`;
const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.2rem;
  font-family: "Ubuntu";
  font-weight: 600;
  color: #212121;
`;
const FormError = styled.div`
  font-family: "Ubuntu";
  color: red;
  font-weight: 400;
  font-size: 0.8rem;
`;

const FormWarning = styled.div`
  font-family: "Ubuntu";
  color: orange;
  font-weight: 400;
  font-size: 0.8rem;
`;

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
      <StyledInput
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {touched &&
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
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
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
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
        ((error && <FormError>{error}</FormError>) ||
          (warning && <FormWarning>{warning}</FormWarning>))}
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
        ((error && <FormError>{error}</FormError>) ||
          (warning && <FormWarning>{warning}</FormWarning>))}
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

// ! Give option to select from all available time zones

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
  let moderatorOptions = [];
  const communityManagers = useSelector(
    (state) => state.community.communityManagers
  );

  const { superAdminName, superAdminEmail, superAdmin } = useSelector(
    (state) => state.community.communityDetails
  );

  if (communityManagers) {
    moderatorOptions = communityManagers.map((el) => {
      return {
        value: el._id,
        label: el.firstName + " " + el.lastName + " " + `(${el.email})`,
      };
    });

    moderatorOptions.push({
      value: superAdmin,
      label: superAdminName + " " + `(${superAdminEmail})`,
    });
  }

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { error, isLoading } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  console.log(id);

  const onSubmit = (formValues) => {
    const categories = [];
    let moderators = [];

    if (formValues.moderators !== undefined) {
      for (let element of formValues.moderators) {
        moderators.push(element.value);
      }
    }

    for (let element of formValues.selectCategories) {
      categories.push(element.value);
    }

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
    ModifiedFormValues.numberOfTablesInLounge =
      formValues.numberOfTablesInLounge;
    ModifiedFormValues.moderators = moderators;

    if (!formValues.visibility) {
      dispatch(showSnackbar("warning", "Please choose event visibility."));
      return;
    }

    // There should be atleast one moderator in the event
    if (
      !(
        typeof ModifiedFormValues.moderators !== "undefined" &&
        ModifiedFormValues.moderators.length > 0
      )
    ) {
      dispatch(
        showSnackbar("warning", "There should be atleast one moderator.")
      );
      return;
    }

    if (new Date(ModifiedFormValues.startTime) <= new Date(Date.now())) {
      dispatch(
        showSnackbar("warning", "Event start Date & Time cannot be in past.")
      );
      return;
    }

    if (
      new Date(ModifiedFormValues.startTime) >=
      new Date(ModifiedFormValues.endTime)
    ) {
      dispatch(
        showSnackbar(
          "warning",
          "Event start time must be less than event end time."
        )
      );
      return;
    }
    if (
      Math.ceil(
        Math.abs(
          new Date(ModifiedFormValues.endTime) -
            new Date(ModifiedFormValues.startTime)
        ) /
          (1000 * 60 * 60 * 24)
      ) *
        1 >
      180
    ) {
      dispatch(
        showSnackbar("warning", "Max time span for an event is 180 days.")
      );
      return;
    }

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
            <div className="overlay-form-close-button" onClick={handleClose}>
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
              Edit event
            </FormLabel>
            <h5
              className={
                `overlay-sub-form-heading mb-5 ` +
                (hideFormHeading === "1" ? "hide" : "")
              }
            >
              You can edit event basic details here
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
              <FormLabel
                Forhtml="moderators"
                className="form-label form-label-customized"
              >
                Select moderators
              </FormLabel>
              <Field
                name="moderators"
                isMulti="true"
                styles={styles}
                menuPlacement="auto"
                options={moderatorOptions}
                component={renderReactSelect}
              />
            </div>
            <div className="mb-4 overlay-form-input-row">
              <FormLabel className="mb-3">Event Visibility</FormLabel>
              <div className="form-check mb-2">
                <Field
                  name="visibility"
                  className="form-check-input"
                  type="radio"
                  id="flexRadioDefault1"
                  value="Public"
                  component="input"
                />
                <label
                  className="form-check-label"
                  for="flexRadioDefault1"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                >
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
                  value="Private"
                  component="input"
                />
                <label
                  className="form-check-label"
                  for="flexRadioDefault2"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                  }}
                >
                  Private
                </label>
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row">
              <FormLabel
                for="communityName"
                className="form-label form-label-customized"
              >
                Number Of Tables in lounge
              </FormLabel>
              <Field
                name="numberOfTablesInLounge"
                type="number"
                classes="form-control"
                ariadescribedby="emailHelp"
                placeholder="100"
                component={renderInput}
              />
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

    moderators:
      state.event.eventDetails && state.event.eventDetails.moderators
        ? state.event.eventDetails.moderators.map((element) => {
            return {
              value: element._id,
              label:
                element.firstName +
                " " +
                element.lastName +
                `(${element.email})`,
            };
          })
        : null,
    visibility:
      state.event.eventDetails && state.event.eventDetails.visibility
        ? state.event.eventDetails.visibility
        : "",
    numberOfTablesInLounge:
      state.event.eventDetails &&
      state.event.eventDetails.numberOfTablesInLounge
        ? state.event.eventDetails.numberOfTablesInLounge
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};

  if (!formValues.eventName) {
    errors.eventName = "Event name is required";
  }
  if (!formValues.shortDescription) {
    errors.shortDescription = "Event description is required";
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
  if (!formValues.moderators) {
    errors.moderators = "Atleast one moderator is required";
  }
  if (formValues.numberOfTablesInLounge) {
    if (formValues.numberOfTablesInLounge < 20) {
      errors.numberOfTablesInLounge = "Minimum number of tables can be 20.";
    }
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
