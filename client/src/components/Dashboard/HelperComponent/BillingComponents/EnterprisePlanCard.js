import React from "react";

import "./../../../../assets/Sass/Billing.scss";
import { Divider } from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PhoneInput from "react-phone-input-2";
import {  IconButton } from "@material-ui/core";


import { Field } from "redux-form";
import Select from "react-select";

import { reduxForm } from "redux-form";

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

// const validate = (values) => {
//   const errors = {};

//   if (values.firstName && values.firstName.length > 15) {
//     errors.firstName = "Must be 15 characters or less";
//   }
//   if (values.lastName && values.lastName.length > 15) {
//     errors.lastName = "Must be 15 characters or less";
//   }
//   if (
//     values.email &&
//     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//   ) {
//     errors.email = "Invalid email address";
//   }

//   return errors;
// };

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
      />
      {renderError(meta)}
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
        // value={state.phone}
        //   onChange={phone => setState({ phone })}
        {...input}
        type={type}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
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
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const showResults = (formValues) => {
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};
const onSubmit = (formValues) => {
  console.log(formValues);

  // dispatch(editUser(ModifiedFormValues, file));
  showResults(formValues);
  alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};

const EnterprisePlanCard = (props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const { handleSubmit, pristine, submitting } = props;
  return (
    <>
      <div className="pricing-plan-card p-4">
        <div className="pricing-plan-name mb-3">Enterprise</div>
        <div className="d-flex flex-row align-items-center">
          <div className="original-plan--reduced-price-value me-1">
            Talk to Us.
          </div>
        </div>
        <div className="my-4">
          <Divider />
        </div>
        <div className="plan-features-offered-list" style={{height: "773px"}}>
        <div
            className="plan-feature-text mb-4"
            style={{ fontWeight: "600", fontSize: "0.9rem" }}
          >
            Everything in Growth, and
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">15 organizer included</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
             Upto 100k registrations included
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
             Upto 1 Million Email credits / month
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
             Advanced promotinal and marketing tools
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
              Full access to Bluemeet Platform (Reception, Live stage, Networking and
              Social lounge, Booths, Sponsors, Photobooth.)
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">Customisable hours of streaming</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">Reception customisation</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
              Hybrid ready
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">Sponsor showcase and shoutouts</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
              Advanced gamification{" "}
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
              SSO and advanced security options{" "}
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">
              Advanced networking capabilities{" "}
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">Unlimited session duration</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">Unlimited Events</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">24*7 one-on-one support</div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-4">
              {/* <CheckRoundedIcon style={{ fontSize: "18" }} /> */}
            </div>
            <div className="plan-feature-text px-2">& much more...</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpenDrawer(true);
          }}
          className="btn btn-primary btn-outline-text mt-3"
          style={{ width: "100%", marginTop: "80px" }}
        >
          Schedule a demo
        </button>
      </div>

      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer} onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Let's Schedule a meet</div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
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
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
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

                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
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
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
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
                    className="form-label form-label-customized"
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
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
                    >
                      Company
                    </label>
                    <Field
                      name="headline"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      aria-describedby="emailHelp"
                      label="Headline"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
                    >
                      Job Title
                    </label>
                    <Field
                      name="headline"
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
                    className="form-label form-label-customized"
                  >
                    Select Your Region
                  </label>
                  <Field
                    name="interests"
                    component={renderEventPreferences}
                    label="Event Preferences"
                  />
                </div>
              </div>

              <div className="mb-4 overlay-form-input-row">
              <label
                    for="communityHeadline"
                    className="form-label form-label-customized"
                  >
                    Are you an event agency ?
                  </label>
           
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
                Yes
              </label>
              
            </div>
            <div className="form-check">
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
                No
              </label>
            </div>
          </div>

              <div className="row">
                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      // value={this.state.policySigned}
                      name="policySigned"
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

export default reduxForm({
  form: "scheduleAMeetForEnterprisePlan",
})(EnterprisePlanCard);
