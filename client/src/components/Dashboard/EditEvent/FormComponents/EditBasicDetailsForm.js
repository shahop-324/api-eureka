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
  { value: "Career Fair", label: "Career Fair" },
  { value: "Crypto", label: "Crypto" },
];

const timeZoneOptions = [
  {
    value: "(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai",
    label: "(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai",
  },
  { value: "(GMT + 00:00) UTC", label: "(GMT + 00:00) UTC" },
  { value: "(GMT + 00:00) Edinburgh", label: "(GMT + 00:00) Edinburgh" },
  { value: "(GMT + 00:00) Lisbon", label: "(GMT + 00:00) Lisbon" },
  { value: "(GMT + 00:00) London", label: "(GMT + 00:00) London" },
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

const EditBasicDetailsForm = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;
  const {error, isLoading} = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  console.log(id)

  const showResults = (formValues) => {
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

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

    console.log(ModifiedFormValues);
    showResults(ModifiedFormValues);
    dispatch(editEvent(ModifiedFormValues, id));

    props.openSavedChangesSnack();
  };

  if(isLoading) {
    return (<div className="d-flex flex-row align-items-center justify-content-center" style={{width: "100%", height: "80vh"}}> <Loader/> </div>);
  }

  if(error) {
    dispatch(errorTrackerForeditEvent());
    alert(error);
    return;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="create-new-event-form px-4 py-4 d-flex flex-column align-items-center">
          <h2
            className={
              `overlay-form-heading ` +
              (props.hideFormHeading === "1" ? "hide" : "")
            }
          >
            New Event
          </h2>
          <h5
            className={
              `overlay-sub-form-heading mb-5 ` +
              (props.hideFormHeading === "1" ? "hide" : "")
            }
          >
            Let's create an all new event for your community.
          </h5>
          <div class="mb-4 overlay-form-input-row">
            <label for="eventName" class="form-label form-label-customized">
              Event Name
            </label>
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
            <label
              for="shortDescription"
              class="form-label form-label-customized"
            >
              Short description
            </label>
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
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Start Date
              </label>
              <Field
                name="startDate"
                type="date"
                classes="form-control"
                id="eventStartDate"
                component={renderInput}
              />
            </div>
            <div>
              <label
                Forhtml="eventStartTime"
                class="form-label form-label-customized"
              >
                Start Time
              </label>
              <Field
                name="startTime"
                type="time"
                classes="form-control"
                id="eventStartTime"
                component={renderInput}
              />
            </div>
          </div>
          <div class="mb-4 overlay-form-input-row form-row-2-in-1">
            <div>
              <label
                Forhtml="eventEndDate"
                class="form-label form-label-customized"
              >
                End Date
              </label>
              <Field
                name="endDate"
                type="date"
                classes="form-control"
                id="eventEndDate"
                component={renderInput}
              />
            </div>
            <div>
              <label
                Forhtml="eventEndTime"
                class="form-label form-label-customized"
              >
                End Time
              </label>
              <Field
                name="endTime"
                type="time"
                classes="form-control"
                id="eventEndTime"
                component={renderInput}
              />
            </div>
          </div>
          <div class="mb-4 overlay-form-input-row">
            <label
              Forhtml="selectTimeZone"
              class="form-label form-label-customized"
            >
              Select timezone
            </label>
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
            <label
              Forhtml="selectCategories"
              class="form-label form-label-customized"
            >
              Select categories
            </label>
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
          <div class="mb-4 overlay-form-input-row">
            <p>Event Visibility</p>
            <div class="form-check mb-2">
              <Field
                name="visibility"
                class="form-check-input"
                type="radio"
                // name="flexRadioDefault"
                id="flexRadioDefault1"
                value="Public"
                // component={renderInput}
                component="input"
              />
              <label class="form-check-label" for="flexRadioDefault1">
                Public
              </label>
              <div
                id="emailHelp"
                class="form-text"
                style={{ fontSize: "13px" }}
              >
                Upgrade to a paid plan to create public events.
              </div>
            </div>
            <div class="form-check">
              <Field
                class="form-check-input"
                type="radio"
                name="visibility"
                id="flexRadioDefault2"
                // checked="true"
                value="Private"
                // component={renderInput}
                component="input"
              />
              <label class="form-check-label" for="flexRadioDefault2">
                Private
              </label>
            </div>
          </div>
          <div
            className={props.showInlineButton === "false" ? "hide" : ""}
          ></div>
          <div
            className="d-flex flex-row justify-content-end"
            style={{ width: "100%" }}
          >
            <button
              onClick={() => {
                reset();
                props.openDiscardChangesSnack();
              }}
              className={
                `btn btn-outline-primary btn-outline-text me-3 ` +
                (props.showInlineButton === "false" ? "hide" : "")
              }
              disabled={pristine || submitting}
            >
              Discard
            </button>
            <button
              type="submit"
              className={
                `btn btn-primary btn-outline-text ` +
                (props.showInlineButton === "false" ? "hide" : "")
              }
              disabled={pristine || submitting}
            >
              Save changes
            </button>
          </div>
          <div
            className={props.showBlockButton === "false" ? "hide" : ""}
            style={{ width: "100%" }}
          >
            <button
              disabled={pristine || submitting}
              className={
                `btn btn-primary btn-outline-text ` +
                (props.showBlockButton === "false" ? "hide" : "")
              }
              style={{ width: "100%" }}
            >
              Create New Event
            </button>
          </div>
        </div>
      </form>
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
