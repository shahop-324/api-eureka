import React, { useEffect, useState } from "react";
import "./../../assets/css/style.css";
import "./../../assets/css/googleBtn.scss";
import CssBaseline from "@material-ui/core/CssBaseline";
import LoginPNG from "./../../assets/images/Saly-3.png";
import { useDispatch } from "react-redux";
import { errorTrackerForSignIn, googleLinkClicked, resetAuthError } from "../../actions/index";
import { signIn } from "../../actions/index";
import { reduxForm, Field } from "redux-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../Footer";

let formIsvalidated = false;

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
      {/* {renderError(meta)} */}
      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}

      
    </div>
  );
};
const Signin = (props) => {
  const { error } = useSelector((state) => state.auth);
  const { isSending } = useSelector((state) => state.auth);
  const { handleSubmit} = props;

  const [signinClicked, setSigninClicked] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthError());
    setSigninClicked(false);
  }, [dispatch, error]);

  const onSubmit = (formValues) => {
    setSigninClicked(true);
    console.log(formValues);

    dispatch(signIn(formValues));
  };

  const onClickHandle = () => {
    dispatch(googleLinkClicked());
  };

  if (isSending) {
    return (
      <section>
        <p>Sending...</p>
      </section>
    );
  }

  if(error) {
    dispatch(errorTrackerForSignIn());
    alert(error);
    return;
  }

  return (
    <>
      <CssBaseline />
      <div className="container-fluid page-body">
        <div
          className="row d-flex"
          style={{ height: "100%", alignItems: "center" }}
        >
          <div className="col col-md-6 col-lg-4 col-12 signin-illustration-container d-flex">
            <div className="col illustration-card">
              <div className="row">
                <a
                  href="https://www.evenz.in/home"
                  className="companyName"
                  style={{ textDecoration: "none", color: "#538BF7" }}
                >
                  {" "}
                  <div>Evenz</div>
                </a>
                <div className="welcome-message">Hi, Welcome Back</div>
                <div className="login-illustration">
                  <img alt="login-illustration" src={LoginPNG}></img>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-6 col-lg-8 col-12 signin-form-container">
            <div className="col signin-form">
              <div className="container">
                <div className="row sign-in-heading px-2">Sign in to Evenz</div>
                <div className="row sign-in-sub-heading px-2">
                  Enter your details below.
                </div>
                <div
                  className="row d-flex"
                  style={{
                    justifyContent: "space-between",
                    marginBottom: "4%",
                  }}
                >
                  <div onClick={onClickHandle}>
                    {/* <a href="https://damp-taiga-71545.herokuapp.com/eureka/v1/auth/google">Login with Google</a> */}

                    {/* <a href="https://damp-taiga-71545.herokuapp.com/eureka/v1/auth/google">
                      Login with Google
                    </a> */}

                    <button
                      type="button"
                      className="btn btn-light py-2"
                      style={{ width: "100%" }}
                    >
                      <div className="google-btn-container d-flex flex-row align-items-center justify-content-center">
                        <img
                          class=""
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt="google-signin"
                        />
                        <div className="sign-in-with-google-text ms-4">
                          Sign in with google
                        </div>
                      </div>
                    </button>
                  </div>
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
                <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="mb-3">
                      <div class="form-group">
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
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="mb-3">
                      <div class="form-group">
                        <label
                          for="UserPassword"
                          className="form-label form-label-customized"
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
                          component={renderInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="row mb-3 d-flex"
                    style={{ padding: "0 0%", alignItems: "center" }}
                  >
                    <div className="col">
                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Remember Me
                        </label>
                      </div> */}
                    </div>

                    <div
                      className="col"
                      style={{
                        textAlign: "end",
                        color: "#538BF7",
                        fontWeight: "bold",
                        letterSpacing: "0.2px",
                        textDecoration: "none",
                      }}
                    >
                      <Link
                        to="/forgot-password"
                        style={{ textDecoration: "none" }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{ padding: "0 2%", marginTop: "3%" }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={signinClicked && formIsvalidated && !error}
                    >
                      <span className="btn-text" >
                        Login
                        {signinClicked && formIsvalidated && !error ?   <div
                          class="spinner-border text-light spinner-border-sm"
                          role="status"
                        >
                          <span class="sr-only">Loading...</span>
                        </div> : <div></div> }
                      </span>
                    </button>
                    <div
                      className="col"
                      style={{
                        marginTop: "4%",
                        padding: "0",
                        fontFamily: "Inter",
                        fontWeight: "600",
                      }}
                    >
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        style={{ color: "#538BF7", textDecoration: "none" }}
                      >
                        Get started
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

  

  if (!formValues.email) {
    errors.email = "email is required";
  }

  errors.email =
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
      ? "Invalid email address"
      : undefined;
  if (!formValues.password) {
    errors.password = "password is required";
  }
  if (formValues.password&&formValues.password.length<8) {
    errors.password = "password length must be greater than 8";
  }
  



  return errors;
};

export default reduxForm({
  form: "signInForm",
  validate
})(Signin);
