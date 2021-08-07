import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import { connect, useDispatch } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { editTicket } from "../../../../../actions";

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
const EditTicket = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const currencyOptions = [
    { value: "USD", label: "US Dollars" },
    { value: "AED", label: "United Arab Emirates Dirham" },
    { value: "INR", label: "Indian Rupees" },
    { value: "BMD", label: "Bermudan Dollar equals" },
    { value: "CAD", label: "Canadian Dollar" },
  ];

  const venueAreaOptions = [
    { value: "Sessions", label: "Sessions" },
    { value: "Speed Networking", label: "Speed Networking" },
    { value: "Group Based Networking", label: "Group Based Networking" },
    { value: "Social Lounge", label: "Social Lounge" },
    { value: "Booths", label: "Booths" },
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    console.log(formValues);

    const accessibleAreas = formValues.venueAreasAccessible.map(
      (area) => area.value
    );
    console.log("accessible areas", accessibleAreas);

    const ModifiedFormValues = {};

    ModifiedFormValues.currency = formValues.currency.value;
    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.price = formValues.price;
    ModifiedFormValues.shareRecording = formValues.shareRecording;
    ModifiedFormValues.numberOfTicketAvailable =
      formValues.numberOfTicketAvailable;
    ModifiedFormValues.venueAreasAccessible = accessibleAreas;

    console.log(ModifiedFormValues);

    dispatch(editTicket(ModifiedFormValues, props.id));

    showResults(ModifiedFormValues);
    props.handleClose();
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <form className="ui from error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Edit This Ticket
              </div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div class="mb-3 overlay-form-input-row ">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Ticket Name
                </label>
                <Field
                  name="name"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="All access pass"
                  component={renderInput}
                />
              </div>
            </div>

            <div class="mb-4 overlay-form-input-row">
              <label
                Forhtml="eventEndDate"
                class="form-label form-label-customized"
              >
                Short Description
              </label>
              <Field
                name="description"
                type="textarea"
                classes="form-control"
                id="exampleFormControlInput1"
                placeholder="Include all access to networking zone, expos, sessions and recordings"
                component={renderTextArea}
              />
            </div>

            <div class="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Currency
                </label>
                <Field
                  name="currency"
                  placeholder="currency"
                  styles={styles}
                  menuPlacement="top"
                  options={currencyOptions}
                  // defaultValue={eventOptions[0]}
                  component={renderReactSelect}
                />
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Price
                </label>
                <Field
                  name="price"
                  type="number"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="50"
                  component={renderInput}
                />
              </div>
            </div>

            <div class="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Select Available Venue Areas
              </label>
              <Field
                name="venueAreasAccessible"
                isMulti
                placeholder="venue areas"
                styles={styles}
                menuPlacement="top"
                options={venueAreaOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Number of ticket available
              </label>
              <div class="form-group">
                <Field
                  name="numberOfTicketAvailable"
                  type="number"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="50"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="form-check d-flex flex-row mb-3">
              <Field
                name="shareRecording"
                type="checkbox"
                classes="form-check-input me-3 pb-1"
                component={renderInput}
              />
              <label
                for="communityName"
                class="form-label form-label-customized"
                style={{ marginBottom: "0", alignSelf: "center" }}
              >
                Share Recordings
              </label>
            </div>

            <div
              style={{ width: "100%" }}
              className="d-flex flex-row justify-content-end"
            >
              <button
                disabled={pristine || submitting}
                onClick={reset}
                className="btn btn-outline-primary btn-outline-text me-3"
              >
                Discard
              </button>

              <button
                type="submit"
                // disabled={pristine || submitting}
                className="btn btn-primary btn-outline-text"
                onClick={() => {
                  props.handleClose();
                }}
              >
                Save Changes
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
    name:
      state.ticket.ticketDetails && state.ticket.ticketDetails.name
        ? state.ticket.ticketDetails.name
        : "",
    description:
      state.ticket.ticketDetails && state.ticket.ticketDetails.description
        ? state.ticket.ticketDetails.description
        : "",
    price:
      state.ticket.ticketDetails && state.ticket.ticketDetails.price
        ? state.ticket.ticketDetails.price
        : "",
    numberOfTicketAvailable:
      state.ticket.ticketDetails &&
      state.ticket.ticketDetails.numberOfTicketAvailable
        ? state.ticket.ticketDetails.numberOfTicketAvailable
        : "",
    shareRecording:
      state.ticket.ticketDetails && state.ticket.ticketDetails.shareRecording
        ? state.ticket.ticketDetails.shareRecording
        : "",
    currency:
      state.ticket.ticketDetails && state.ticket.ticketDetails.currency
        ? {
            label: state.ticket.ticketDetails.currency,
            value: state.ticket.ticketDetails.currency,
          }
        : "",
    venueAreasAccessible:
      state.ticket.ticketDetails &&
      state.ticket.ticketDetails.venueAreasAccessible
        ? state.ticket.ticketDetails.venueAreasAccessible.map((element) => {
            return {
              value: element,
              label: element,
            };
          })
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};

  if (!formValues.name) {
    errors.name = "Ticket name is required";
  }
  if (!formValues.description) {
    errors.description = "Ticket description is required";
  }
  if (!formValues.currency) {
    errors.currency = "Currency is required";
  }
  if (!formValues.price) {
    errors.price = "Ticket price is required";
  }
  if (!formValues.venueAreasAccessible) {
    errors.venueAreasAccessible = "Accessible venue areas is required";
  }
  if (!formValues.numberOfTicketAvailable) {
    errors.numberOfTicketAvailable = "Number of tickets available is required";
  }
  if (!formValues.shareRecording) {
    errors.shareRecording = "Recording sharing permission is required";
  }

  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditticektDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditTicket)
);
