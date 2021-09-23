import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import { reduxForm, Field } from "redux-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createCoupon } from "./../../../actions";

let eventOptions = [];

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
  value,
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

const renderReactSelect = ({
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

const AddNewCoupon = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { handleSubmit } = props;
  const dispatch = useDispatch();

  const events = useSelector((state) => state.event.events);

  if (events) {
    eventOptions = events.map((event) => {
      return {
        label: event.eventName,
        value: event._id,
      };
    });
  }

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};
    ModifiedFormValues.discountForEventId = formValues.eventName.value;
    ModifiedFormValues.validTillDate = formValues.expiryDate;
    ModifiedFormValues.validTillTime = `${formValues.expiryDate}T${formValues.expiryTime}:00Z`;
    ModifiedFormValues.discountPercentage = formValues.discountPercentage;
    ModifiedFormValues.discountCode = formValues.couponCode;
    ModifiedFormValues.maxNumOfDiscountPermitted =
    formValues.numberOfDiscountsAvailable;

    // showResults(ModifiedFormValues);
    dispatch(createCoupon(ModifiedFormValues));
    props.handleClose();
    window.location.reload();
  };

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
              <div className="coupon-overlay-form-headline">
                Create a coupon
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
            <div class="mb-4 overlay-form-input-row">
              <label
                Forhtml="eventEndDate"
                class="form-label form-label-customized"
              >
                Select Event
              </label>
              <Field
                name="eventName"
                placeholder="Select the event"
                styles={styles}
                menuPlacement="auto"
                options={eventOptions}
                component={renderReactSelect}
              />
            </div>
            <div class="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Expiry Date
                </label>
                <Field
                  name="expiryDate"
                  type="date"
                  value="2021-07-21"
                  classes="form-control"
                  component={renderInput}
                />
                {/* <input type="date" class="form-control" /> */}
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Expiry Time
                </label>
                <Field
                  name="expiryTime"
                  type="time"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Discount Percentage
              </label>
              <Field
                name="discountPercentage"
                type="number"
                classes="form-control"
                ariadescribedby="emailHelp"
                placeholder="50"
                component={renderInput}
              />
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Coupon code
              </label>

              <Field
                name="couponCode"
                type="text"
                classes="form-control"
                id="exampleFormControlInput1"
                placeholder="HAPPY50"
                component={renderInput}
              />
            </div>

            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Number Of Discounts Available
              </label>
              <Field
                name="numberOfDiscountsAvailable"
                type="number"
                classes="form-control"
                ariadescribedby="emailHelp"
                placeholder="100"
                component={renderInput}
              />
            </div>
            <div style={{ width: "100%" }}>
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%", textAlign: "center" }}
                // disabled={pristine || submitting}
              >
                Create New Coupon
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

  if (!formValues.eventName) {
    errors.eventName = "Event name is required";
  }
  if (!formValues.expiryDate) {
    errors.expiryDate = "Expiry Date is required";
  }
  if (!formValues.expiryTime) {
    errors.expiryTime = "Expiry Time is required";
  }
  if (!formValues.discountPercentage) {
    errors.discountPercentage = "Discount percentage is required";
  }
  if (!formValues.couponCode) {
    errors.couponCode = "Coupon code is required";
  }
  if (!formValues.numberOfDiscountsAvailable) {
    errors.numberOfDiscountsAvailable =
      "Number of discounts available is required";
  }
  return errors;
};

export default reduxForm({
  form: "newCouponForm",
  validate,
})(AddNewCoupon);
