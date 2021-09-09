/* eslint-disable no-unused-vars */
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {
  createTicket,
  errorTrackerForCreateTicket,
} from "../../../../../actions";
import Loader from "../../../../Loader";

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
  </div>
);
const AddNewTicket = (props) => {
  const { handleSubmit, pristine, submitting } = props;
  const { error, isLoading } = useSelector((state) => state.ticket);
  const params = useParams();
  const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const currencyOptions = [
    // { value: "USD", label: "US Dollars" },
    // { value: "AED", label: "United Arab Emirates Dirham" },
    { value: "INR", label: "Indian Rupees" },
    // { value: "BMD", label: "Bermudan Dollar equals" },
    // { value: "CAD", label: "Canadian Dollar" },
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

    // const accessibleAreas = formValues.venueAreasAccessible.map(
    //   (area) => area.value
    // );
    // console.log("accessible areas", accessibleAreas);

    const ModifiedFormValues = {};

    ModifiedFormValues.currency = formValues.currency.value;
    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.price = formValues.price;
    // ModifiedFormValues.shareRecording = formValues.shareRecording;
    ModifiedFormValues.numberOfTicketAvailable =
      formValues.numberOfTicketAvailable;
    ModifiedFormValues.venueAreasAccessible = [];

    console.log(ModifiedFormValues);

    dispatch(createTicket(ModifiedFormValues, id));

    // showResults(formValues);
    props.handleClose();
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
    dispatch(errorTrackerForCreateTicket());
    alert(error);
    return;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">Add New Ticket</div>
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

            {/* <div class="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Select Available Venue Areas
              </label>
              <Field
              disabled
                name="venueAreasAccessible"
                isMulti
                placeholder="venue areas"
                styles={styles}
                menuPlacement="top"
                options={venueAreaOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div> */}

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

            {/* <div className="form-check d-flex flex-row mb-3">
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
            </div> */}

            <div style={{ width: "100%" }}>
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%" }}
                // disabled={pristine || submitting}
              >
                Add New ticket
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

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
  // if (formValues.price < 100) {
  //   errors.price = "Minimum ticket price can be Rs. 100";
  // }
  // if (!formValues.venueAreasAccessible) {
  //   errors.venueAreasAccessible = "Accessible venue areas is required";
  // }
  if (!formValues.numberOfTicketAvailable) {
    errors.numberOfTicketAvailable = "Number of tickets available is required";
  }
  return errors;
};

export default reduxForm({
  form: "newTicketAddForm",
  validate,
})(AddNewTicket);
