import React from "react";
import "./../../assets/css/style.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import LoginPNG from "./../../assets/images/Saly-3.png";
import { useDispatch } from "react-redux";
import { googleLinkClicked } from "../../actions/index";
import { signIn } from "../../actions/index";
import { reduxForm, Field } from "redux-form";
import { useSelector } from "react-redux";
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
const Signin = (props) => {
  const { isSending, error } = useSelector((state) => state.auth);
  const { handleSubmit, pristine, submitting, valid } = props;

  const dispatch = useDispatch();
  const onSubmit = (formValues) => {
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
  //  if(error)
  // {
  //   return (
  //     <section >
  //       <p>{error}</p>
  //     </section>
  //   );
  // }

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
                <div className="companyName">Evenz</div>
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
                <div className="row sign-in-heading">Sign in to Evenz</div>
                <div className="row sign-in-sub-heading">
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
                    <a href="http://localhost:3000/eureka/v1/auth/google">Login with Google</a>

                    {/* <a href="https://damp-taiga-71545.herokuapp.com/eureka/v1/auth/google">
                      Login with Google
                    </a> */}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="mb-3">
                      <div class="form-group">
                        <label for="emailAddress">Email address</label>
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
                        <label for="UserPassword">Password</label>
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
                      <div className="form-check">
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
                      </div>
                    </div>
                    <div
                      className="col"
                      style={{
                        textAlign: "end",
                        color: "#3987cb",
                        fontWeight: "bold",
                        letterSpacing: "0.2px",
                      }}
                    >
                      - Forgot Password?
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{ padding: "0 2%", marginTop: "3%" }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={pristine || submitting || !valid}
                    >
                      <span className="btn-text">Login</span>
                    </button>
                    <div
                      className="col"
                      style={{ marginTop: "4%", padding: "0" }}
                    >
                      Don't have an account?{" "}
                      <span style={{ color: "#11A1FD" }}>Get started</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default reduxForm({
  form: "signInForm",
})(Signin);
