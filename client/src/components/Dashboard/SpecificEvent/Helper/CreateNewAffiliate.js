import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import { reduxForm, Field } from "redux-form";
import { useDispatch } from "react-redux";
import { addNewAffiliate, createCoupon } from "./../../../../actions";
import { useParams } from "react-router-dom";
import validator from 'validator';

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

const CreateNewAffiliate = (props) => {
  const theme = useTheme();

  const params = useParams();

  const eventId = params.eventId;

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { handleSubmit } = props;
  const dispatch = useDispatch();

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.email = formValues.email;
    ModifiedFormValues.commisionValue = formValues.commisionValue;
    ModifiedFormValues.eventId = eventId;

    showResults(ModifiedFormValues);
    dispatch(addNewAffiliate(ModifiedFormValues));
    // props.handleClose();
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
          <div
            className="create-new-coupon-form px-4 py-4"
            style={{ minHeight: "auto" }}
          >
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Add new affiliate
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

            <div class="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="affiliateFirstName"
                  class="form-label form-label-customized"
                >
                  First Name
                </label>
                <Field
                  name="firstName"
                  type="text"
                  classes="form-control"
                  component={renderInput}
                />
                {/* <input type="date" class="form-control" /> */}
              </div>
              <div>
                <label
                  Forhtml="affiliateLastName"
                  class="form-label form-label-customized"
                >
                  Last Name
                </label>
                <Field
                  name="lastName"
                  type="text"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                for="affiliateEmail"
                class="form-label form-label-customized"
              >
                Email
              </label>
              <Field
                name="email"
                type="email"
                classes="form-control"
                ariadescribedby="emailHelp"
                component={renderInput}
              />
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                for="affliateCommisionValue"
                class="form-label form-label-customized"
              >
                Commision Value
              </label>

              <Field
                name="commisionValue"
                type="number"
                classes="form-control"
                id="exampleFormControlInput1"
                component={renderInput}
              />
              <small style={{ fontFamily: "Inter" }}>
                This indicates total commision in percent
              </small>
            </div>

            <div style={{ width: "100%" }}>
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%", textAlign: "center" }}
                // disabled={pristine || submitting}
              >
                Add new affiliate
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

  if (!formValues.firstName) {
    errors.firstName = "First Name is required";
  }
  if (!formValues.lastName) {
    errors.lastName = "Last Name is required";
  }
  if (!formValues.email) {
    errors.email = "Email is required";
  }
  if(formValues.email && !validator.isEmail(formValues.email)) {
    errors.email = "Invalid email";
  }
  if (!formValues.commisionValue) {
    errors.commisionValue = "Commision Value is required";
  }
  if (formValues.commisionValue && formValues.commisionValue <=0 ) {
    errors.commisionValue = "Commision Value must be greater than 0";
  }
  if (formValues.commisionValue && formValues.commisionValue > 99 ) {
    errors.commisionValue = "Commision Value must be less than 99";
  }
  return errors;
};

export default reduxForm({
  form: "createNewAffiliateForm",
    validate,
})(CreateNewAffiliate);
