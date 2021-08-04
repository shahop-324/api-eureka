import React from "react";

import Select from "react-select";
import "./../../../index.css";
import { reduxForm, Field } from "redux-form";
import { useDispatch } from "react-redux";
import { createEvent } from "../../../actions";
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
        required
      />
      {renderError(meta)}
    </div>
  );
};

const renderTextArea = ({
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
      <textarea
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
      />

      {renderError(meta)}
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

const CreateNewEventForm = (props) => {
  const { handleSubmit, pristine, submitting } = props;

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const dispatch = useDispatch();

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
    dispatch(createEvent(ModifiedFormValues));

   
    props.handleClose();
  };
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
                minimumDate={Date.now()}
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
                min={Date.now()}
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
                minimumDate={Date.now()}
              />
            </div>
            <div>
              <label
                Forhtml="eventEndDate"
                class="form-label form-label-customized"
              >
                End Time
              </label>
              <Field
                name="endTime"
                type="time"
                classes="form-control"
                id="eventEndDate"
                component={renderInput}
                minimumDate={Date.now()}
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
              className={
                `btn btn-outline-primary btn-outline-text me-3 ` +
                (props.showInlineButton === "false" ? "hide" : "")
              }
            >
              Discard
            </button>
            <button
              type="submit"
              className={
                `btn btn-primary btn-outline-text ` +
                (props.showInlineButton === "false" ? "hide" : "")
              }
            >
              Save changes
            </button>
          </div>
          <div
            className={props.showBlockButton === "false" ? "hide" : ""}
            style={{ width: "100%" }}
          >
            <button
              type="submit"
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

export default reduxForm({
  form: " createNewEventForm",
})(CreateNewEventForm);

//export default CreateNewEventForm;
