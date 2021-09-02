import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PhoneInput from "react-phone-input-2";
import { IconButton } from "@material-ui/core";
import Select from "react-select";

import { Field } from "redux-form";
import { reduxForm } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import { createDemoRequest, errorTrackerForCreateDemo } from "../../../actions";
import GlobalSnackbar from "../../GlobalSnackbar";
import { useState } from "react";
import { useSnackbar } from "notistack";

const options = [
  { value: "RGe_0001", label: "Asia" },
  { value: "RGe_0002", label: "Africa" },
  { value: "RGe_0003", label: "North America" },
  { value: "RGe_0004", label: "South America" },
  { value: "RGe_0005", label: "Europe" },
  { value: "RGe_0006", label: "Australia" },
  { value: "RGe_0007", label: "Antarctica" },
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

const renderPhoneInput = ({
  input,
  meta: { touched, error, warning },
  label,
  type,
}) => (
  <div>
    <div>
      <PhoneInput
        inputStyle={{
          paddingLeft: "50px",
        }}
        inputProps={{
          enableSearch: true,
        }}
        country={"us"}
        {...input}
        type={type}
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

const renderEventPreferences = ({
  input,
  meta: { touched, error, warning },
  name,
}) => (
  <div>
    <div>
      <Select
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

const showResults = (formValues) => {
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};

const RequestDemo = ({
  handleCloseRequestDemo,
  openDemoForm,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { error, isLoading, succeded } = useSelector((state) => state.demo);

  const [hasError, sethasError] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.email = formValues.email;
    ModifiedFormValues.companyName = formValues.companyName;
    ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    ModifiedFormValues.jobTitle = formValues.jobTitle;
    ModifiedFormValues.isAnEventAgency = formValues.eventAgency;
    ModifiedFormValues.region = formValues.region.label;

    dispatch(createDemoRequest(ModifiedFormValues));
    // showResults(ModifiedFormValues);
  };

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });
    return dispatch(errorTrackerForCreateDemo());
  }
  if (succeded) {
    enqueueSnackbar("Demo request recieved successfully!", {
      variant: "success",
    });
  }

  return (
    <>
      {/* {hasError ? <GlobalSnackbar severity={"error"} feedbackMsg={error}/> : null} */}
      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDemoForm}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Let's Schedule a meet</div>
              <div
                onClick={() => {
                  handleCloseRequestDemo();
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
                <div
                  className="row edit-profile-form-row mb-3"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridGap: "24px",
                  }}
                >
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      First name
                    </label>

                    <Field
                      name="firstName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="First Name"
                    />
                  </div>

                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Last name
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="Last Name"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Work E-mail
                    </label>
                    <Field
                      name="email"
                      type="email"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="Email"
                    />
                  </div>
                </div>

                <div
                  className="row edit-profile-form-row mb-3"
                  style={{ width: "100%" }}
                >
                  <label
                    for="communityHeadline"
                    class="form-label form-label-customized"
                  >
                    contact Number
                  </label>
                  <Field
                    name="phoneNumber"
                    component={renderPhoneInput}
                    type="number"
                  />
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Company
                    </label>
                    <Field
                      name="companyName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      aria-describedby="emailHelp"
                      label="Headline"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Job Title
                    </label>
                    <Field
                      name="jobTitle"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      aria-describedby="emailHelp"
                      label="Headline"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <label
                    for="communityHeadline"
                    class="form-label form-label-customized"
                  >
                    Select Your Region
                  </label>
                  <Field
                    name="region"
                    component={renderEventPreferences}
                    label="Event Preferences"
                  />
                </div>
              </div>

              <div class="mb-4 overlay-form-input-row">
                <label
                  for="communityHeadline"
                  class="form-label form-label-customized"
                >
                  Are you an event agency ?
                </label>

                <div class="form-check mb-2">
                  <Field
                    name="eventAgency"
                    class="form-check-input"
                    type="radio"
                    // name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="true"
                    // component={renderInput}
                    component="input"
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div class="form-check">
                  <Field
                    class="form-check-input"
                    type="radio"
                    name="eventAgency"
                    id="flexRadioDefault2"
                    // checked="true"
                    value="false"
                    // component={renderInput}
                    component="input"
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    No
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      // value={this.state.policySigned}
                      name="signinToMailList"
                      required
                      id="defaultCheck1"
                      checked
                      // onChange={this.onPrivacyPolicyChange}
                    />
                    <label
                      className="form-check-label btn-outline-text mb-3"
                      htmlFor="flexCheckChecked"
                      style={{ color: "grey", fontSize: "13px" }}
                    >
                      By registering, I agree to recieve product updates and
                      marketing communications from Evenz.
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%" }}
                  disabled={pristine || submitting}
                  onClick={() => {
                    handleCloseRequestDemo();
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = "Required";
  }
  if (!formValues.lastName) {
    errors.lastName = "Required";
  }
  if (!formValues.email) {
    errors.email = "Email is required";
  }
  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid email address";
  }
  if (!formValues.phoneNumber) {
    errors.phoneNumber = "Contact no. is required";
  }
  if (!formValues.companyName) {
    errors.companyName = "Associated company or organisation is required";
  }
  if (!formValues.jobTitle) {
    errors.jobTitle = "Job title is required";
  }
  if (!formValues.region) {
    errors.region = "Region is required";
  }
  if (!formValues.eventAgency) {
    errors.eventAgency = "Required";
  }

  return errors;
};

export default reduxForm({
  form: "requestDemoForm",
  validate,
})(RequestDemo);
