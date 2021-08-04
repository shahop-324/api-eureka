import React from "react";
import "./../../assets/css/style.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import LoginPNG from "./../../assets/images/Saly-22.png";

import { signIn } from "../../actions/index";

import { connect } from "react-redux";
class SignInForEventRegistration extends React.Component {
  state = { email: "", password: "" };

  onSubmit = (e) => {
    e.preventDefault();
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params.intent);
    this.props.signIn(
      this.state,
      params.intent,
      this.props.match.params.eventId
    );
  };

  onEmailAddressChange = (e) => {
    this.setState({ email: e.target.value });
  };
  onPasswordChange = (e) => {
    e.preventDefault();

    this.setState({ password: e.target.value });
  };

  render() {
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
                  <div className="welcome-message mb-5">
                    You are almost there!
                  </div>
                  <div className="login-illustration">
                    <img alt="login-illustration" src={LoginPNG}></img>
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-lg-8 col-12 signin-form-container">
              <div className="col signin-form">
                <div className="container">
                  <div className="row sign-in-heading">
                    Sign in to Evenz to register
                  </div>
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
                    <li>
                      <a href="/eureka/v1/auth/google">Login with Google</a>
                    </li>
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
                  <form onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="mb-3">
                        <div class="form-group">
                          <label for="emailAddress">Email address</label>
                          <input
                            type="email"
                            class="form-control"
                            id="emailAddress"
                            name="email"
                            aria-describedby="Enter Email Address"
                            placeholder="Enter Email"
                            value={this.state.email}
                            onChange={this.onEmailAddressChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="mb-3">
                        <div class="form-group">
                          <label for="UserPassword">Password</label>
                          <input
                            type="password"
                            class="form-control"
                            id="UserPassword"
                            name="UserPassword"
                            aria-describedby="Enter Password "
                            placeholder="Enter password"
                            required
                            value={this.state.password}
                            onChange={this.onPasswordChange}
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
                      <button type="submit" className="btn btn-primary">
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
  }
}

export default connect(null, { signIn })(SignInForEventRegistration);