import React, { useState } from "react";
import "./../Signin/Signin.scss";
import LogoLight from "./../../assets/Logo/Logo_light.svg";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import RemoveRedEyeRoundedIcon from "@material-ui/icons/RemoveRedEyeRounded";
import abstract_1 from "./../../assets/abstract/abstract-1.png";
import abstract_2 from "./../../assets/abstract/abstract-2.png";
import abstract_3 from "./../../assets/abstract/abstract-3.png";
import GoogleBtn from "./../Signin/GoogleBtn";
import LinkedInBtn from "../Signin/LinkedInBtn";
import { Field, reduxForm } from "redux-form";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";

const renderInput = ({
  input,

  meta,
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
        className={`${classes} formatted-input`}
        placeholder={placeholder}
        required
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
    </div>
  );
};

const RenderPassword = ({
  input,
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
  meta: { touched, error, warning },
}) => {
  const [show, setShow] = useState(false);
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className} style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        {...input}
        aria-describedby={ariadescribedby}
        className={`${classes} formatted-input`}
        placeholder={placeholder}
        required
      />
      {show ? (
        <VisibilityOffOutlinedIcon
          onClick={() => {
            setShow(false);
          }}
          style={{
            fill: "#747474",
            position: "absolute",
            top: "11px",
            right: "10px",
          }}
        />
      ) : (
        <RemoveRedEyeOutlinedIcon
          onClick={() => {
            setShow(true);
          }}
          style={{
            fill: "#747474",
            position: "absolute",
            top: "11px",
            right: "10px",
          }}
        />
      )}
      {/* */}

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
    </div>
  );
};

const SignupNew = ({ handleSubmit }) => {
  const onSubmit = (formValues) => {
    // setSigninClicked(true);
    // console.log(formValues);
    // socket.emit("loggingInUser", {
    //   email: formValues.email,
    //   password: formValues.password,
    // });
    //dispatch(signIn(formValues));
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-left">
          <img
            src={abstract_1}
            alt="abstract"
            style={{ position: "absolute" }}
          />
          <img
            src={abstract_2}
            alt="abstract"
            style={{
              position: "absolute",
              bottom: "100px",
              left: "100px",
              height: "4%",
            }}
          />
          <img
            src={abstract_3}
            alt="abstract"
            style={{
              position: "absolute",
              bottom: "0",
              right: "100px",
              height: "33%",
            }}
          />
          <div className="auth-left-content">
            <img
              src={LogoLight}
              alt={"Bluemeet"}
              className="brand-logo mb-5"
            ></img>

            <div className="auth-hero-heading py-3 mb-4">
              The leading virtual & <br /> hybrid events platform
            </div>

            <div className="auth-highlights">
              <div className="d-flex flex-row align-items-center mb-4">
                <BubbleChartIcon
                  style={{ fill: "#538BF7", fontSize: "24px" }}
                  className="me-4"
                />
                <div className="auth-highlighted-feature">
                  Made for hosting virtual and hybrid events at any scale.
                </div>
              </div>
              <div className="d-flex flex-row align-items-center mb-4">
                <AutorenewIcon
                  style={{ fill: "#538BF7", fontSize: "24px" }}
                  className="me-4"
                />
                <div className="auth-highlighted-feature">
                  Make your event effortless and full of engagement.
                </div>
              </div>
              <div className="d-flex flex-row align-items-center mb-4">
                <RemoveRedEyeRoundedIcon
                  style={{ fill: "#538BF7", fontSize: "24px" }}
                  className="me-4"
                />
                <div className="auth-highlighted-feature">
                  Get 360 degree insights of your event.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center auth-right px-4">
          <div style={{ maxWidth: "520px" }}>
            <div className="auth-form-heading mb-5">Get Started</div>

            <div className="oauth-btns mb-5">
              <GoogleBtn />
              <LinkedInBtn />
            </div>

            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="ui form error mb-5"
              >
                  <div className="mb-4" style={{display: "grid",gridTemplateColumns: "1fr 1fr", gridGap: "24px", alignItems: "center"}}>
                  <div class="form-group">
                    <label
                      for="emailAddress"
                      className="form-label  ui-form-label"
                    >
                      First name
                    </label>
                    <Field
                      type="text"
                      classes="form-control"
                      id="emailAddress"
                      name="firstName"
                      ariadescribedby="Enter Email Address"
                      placeholder="First name"
                      component={renderInput}
                    />
                  </div>
                  <div class="form-group">
                    <label
                      for="emailAddress"
                      className="form-label  ui-form-label"
                    >
                      Last name
                    </label>
                    <Field
                      type="text"
                      classes="form-control"
                      id="emailAddress"
                      name="lastName"
                      ariadescribedby="Enter Email Address"
                      placeholder="Last name"
                      component={renderInput}
                    />
                  </div>
                      </div>
                <div className="mb-4">
                  <div class="form-group">
                    <label
                      for="emailAddress"
                      className="form-label  ui-form-label"
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
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <div class="form-group">
                    <label
                      for="UserPassword"
                      className="form-label  ui-form-label"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      classes="form-control"
                      id="UserPassword"
                      name="password"
                      ariaddescribedby="Enter Password "
                      placeholder="Enter password"
                      component={RenderPassword}
                    />
                  </div>
                </div>

                <button className="btn btn-primary ui-btn-filled">
                  Sign up
                </button>
              </form>

              <div className="form-link-text">
                {" "}
                <span className="form-text-gray">
                  Already have an account?
                </span>{" "}
                Sign in
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default reduxForm({
  form: "signInFormNew",
  // validate,
})(SignupNew);
