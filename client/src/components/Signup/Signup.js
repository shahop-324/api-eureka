/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./../../assets/css/style.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import SignupPNG from "./../../assets/images/Saly-38.png";
import {
  errorTrackerForSignUp,
  googleLinkClicked,
  resetAuthError,
} from "../../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../actions/index";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import { reduxForm, Field } from "redux-form";
import GoogleAuth from "../GoogleAuth";
import LinkedIn from "@material-ui/icons/LinkedIn";
import LinkedinAuth from "../LinkedinAuth";

let formIsvalidated = false;

const renderInput = ({
  input,
  type,
  ariadescribedby,
  classes,
  placeholder,
  meta: { touched, error, warning },
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
          <div style={{ color: "red", fontWeight: "400" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "400" }}
            >
              {warning}
            </div>
          )))}
      {/* {renderError(meta)} */}
      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}
    </div>
  );
};

const renderInputCheckbox = ({
  input,
  type,
  ariadescribedby,
  classes,
  placeholder,
  meta: { touched, error, warning },
}) => {
  // const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
      />
      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}
    </div>
  );
};
const Signup = (props) => {
  const { error } = useSelector((state) => state.auth);

  const [signupClicked, setSignupClicked] = useState(false);

  const dispatch = useDispatch();
  const urlSearchParams = new URLSearchParams(window.location.search);

  const params = Object.fromEntries(urlSearchParams.entries());

  useEffect(() => {
    dispatch(resetAuthError());
    setSignupClicked(false);
  }, [dispatch, error]);

  const { handleSubmit } = props;
  const { referredId } = useSelector((state) => state.user);

  const onSubmit = (formValues) => {
    // e.preventDefault();
    setSignupClicked(true);

    if (referredId) {
      formValues.referralCode = referredId;
      dispatch(signUp(formValues, params.intent, params.eventId));
    } else {
      dispatch(signUp(formValues, params.intent, params.eventId));
    }
  };

  // const onClickHandle = () => {
  //   dispatch(googleLinkClicked());
  // };

  if (error) {
    dispatch(errorTrackerForSignUp());
    alert(error);
    return;
  }

  return (
    <>
      <CssBaseline />
      <div className="container-fluid page-body signup-signin-fixed">
        <div
          className="row d-flex"
          style={{ height: "100%", alignItems: "center" }}
        >
          <div className="col col-md-6 col-lg-4 col-12 signin-illustration-container d-flex">
            <div className="col illustration-card">
              <div className="row">
                <a
                  href="https://www.bluemeet.in/home"
                  className="companyName"
                  style={{ textDecoration: "none", color: "#538BF7" }}
                >
                Bluemeet
                </a>
                <div className="welcome-message mb-5">
                  Let's create your account.
                </div>
                <div className="login-illustration">
                  <img alt="login-illustration" src={SignupPNG}></img>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-6 col-lg-8 col-12 signin-form-container">
            <div className="col signin-form">
              <div className="container">
                <div className="row sign-in-heading px-2">
                  Get Started absolutely free.
                </div>
                <div className="row sign-in-sub-heading px-2">
                  Free forever. No credit card needed.
                </div>

                <GoogleAuth />

                <div className="mb-3">
                  <LinkedinAuth />
                </div>
                <div
                  className="row d-flex"
                  style={{ alignItems: "center", marginBottom: "6%" }}
                >
                  <div className="col-5">
                    <hr />
                  </div>
                  <div className="col-2 OR">OR</div>
                  <div className="col-5">
                    <hr />
                  </div>
                </div>

                <form
                  className="ui form error"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div
                    className="row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridGap: "0.6rem",
                    }}
                  >
                    <div className="">
                      <div className="form-group">
                        <label
                          for="firstName"
                          className="form-label form-label-customized"
                        >
                          First Name
                        </label>
                        <Field
                          type="text"
                          classes="form-control"
                          id="firstName"
                          name="firstName"
                          ariadescribedby="Enter First Name "
                          placeholder="John"
                          component={renderInput}
                        />
                      </div>
                    </div>
                    <div className="">
                      <div className="mb-3">
                        <div className="form-group">
                          <label
                            for="lastName"
                            className="form-label form-label-customized"
                          >
                            Last Name
                          </label>
                          <Field
                            component={renderInput}
                            type="text"
                            classes="form-control"
                            id="lastName"
                            name="lastName"
                            ariadescribedby="Enter Last Name"
                            // value={this.state.lastName}
                            placeholder="Doe"
                            //required
                            // onChange={this.onLastNameChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginBottom: "2%" }}>
                    <div className="mb-3">
                      <div className="form-group">
                        <label
                          for="emailAddress"
                          className="form-label form-label-customized"
                        >
                          Email address
                        </label>
                        <Field
                          type="email"
                          classes="form-control"
                          id="emailAddress"
                          name="email"
                          ariadescribedby="Enter Email Address"
                          placeholder="Enter Email"
                          component={renderInput}
                          // value={this.state.email}
                          // onChange={this.onEmailAddressChange}
                          //required
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="row mb-3 d-flex"
                    style={{ padding: "0 0%", alignItems: "center" }}
                  >
                    <div className="mb-3">
                      <div className="form-group">
                        <label
                          for="password"
                          className="form-label form-label-customized"
                        >
                          Password
                        </label>
                        <Field
                          type="password"
                          classes="form-control"
                          id="password"
                          name="password"
                          ariadescribedby="emailHelp"
                          placeholder="Enter password"
                          component={renderInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <Field
                          classes="form-check-input"
                          type="checkbox"
                          name="policySigned"
                          required
                          id="defaultCheck1"
                          component={renderInputCheckbox}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                          style={{
                            color: "grey",
                            fontFamily: "Inter",
                            fontSize: "0.87rem",
                          }}
                        >
                          By registering, I agree to Bluemeet{" "}
                          <span
                            className="text-link"
                            style={{
                              color: "#538BF7",
                              textDecoration: "underline",
                            }}
                          >
                            <Link
                              to="/terms-of-service"
                              style={{ textDecoration: "none" }}
                            >
                              {" "}
                              Terms of Service
                            </Link>
                          </span>{" "}
                          and{" "}
                          <span
                            className="text-link"
                            style={{
                              color: "#538BF7",
                              textDecoration: "underline",
                            }}
                          >
                            <Link
                              to="/privacy-policy"
                              style={{ textDecoration: "none" }}
                            >
                              Privacy Policy
                            </Link>
                          </span>
                          .
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    className="row"
                    style={{ padding: "0 0%", marginTop: "3%" }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={signupClicked && formIsvalidated && !error}
                    >
                      <span className="btn-text">
                        Register
                        {signupClicked && formIsvalidated && !error ? (
                          <div
                            className="spinner-border text-light spinner-border-sm ms-3"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </span>
                    </button>
                    <div
                      className="col"
                      style={{
                        marginTop: "4%",
                        padding: "0",
                        fontFamily: "Inter",
                        fontWeight: "500",
                        fontSize: "0.85rem",
                      }}
                    >
                      Already have an account?{" "}
                      <Link
                        to="/signin"
                        style={{
                          color: "#538BF7",
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = "required";
  }
  if (formValues.firstName && formValues.firstName.length > 10) {
    errors.firstName = "max 10 characters allowed";
  }
  if (!formValues.lastName) {
    errors.lastName = "required";
  }
  if (formValues.lastName && formValues.lastName.length > 10) {
    errors.lastName = "max 10 characters allowed";
  }

  if (!formValues.email) {
    errors.email = "email is required";
  }

  errors.email =
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
      ? "Invalid email address"
      : undefined;
  if (!formValues.password) {
    errors.password = "Password is required";
  }
  if (formValues.password && formValues.password.length < 8) {
    errors.password = "Password length must be greater than 8";
  }
  if (!formValues.policySigned) {
    errors.policySigned = "Required";
  }

  return errors;
};

export default reduxForm({
  form: "signUpForm",

  validate,
})(Signup);
