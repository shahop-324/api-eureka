import React from "react";
import "./../../assets/css/style.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import SignupPNG from "./../../assets/images/Saly-38.png";
import { googleLinkClicked } from "../../actions/index";
import { connect } from "react-redux";
import { signUp } from "../../actions/index";
class Signup extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    policySigned: true,
  };

  onFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value });
  };
  onLastNameChange = (e) => {
    this.setState({ lastName: e.target.value });
  };
  onEmailAddressChange = (e) => {
    this.setState({ email: e.target.value });
  };
  onPasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };
  onPrivacyPolicyChange = (e) => {
    this.setState({ policySigned: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.props.signUp(this.state);
  };
  onClickHandle=()=>{
    this.props.googleLinkClicked()
   
 }
  render() {
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
                  <div className="companyName">Evenz</div>
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
                  <div className="row sign-in-heading">
                    Get Started absolutely free.
                  </div>
                  <div className="row sign-in-sub-heading">
                    Free forever. No credit card needed.
                  </div>
                  <div className="row d-flex flex-row justify-content-center">
                    <button type="button" onClick={this.onClickHandle}>
                      <a href="/eureka/v1/auth/google">Sign In with Google</a>
                    </button>
                  </div>

                  {/*  */}
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
                    onSubmit={this.onSubmit}
                    // action="/eureka/v1/users/signup"
                    // method="post"
                  >
                    <div className="row">
                      <div className="col-6">
                        <div class="form-group">
                          <label for="firstName">First Name</label>
                          <input
                            type="text"
                            class="form-control"
                            id="firstName"
                            value={this.state.firstName}
                            name="firstName"
                            aria-describedby="Enter First Name "
                            placeholder="John"
                            required
                            onChange={this.onFirstNameChange}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <div class="form-group">
                            <label for="lastName">Last Name</label>
                            <input
                              type="text"
                              class="form-control"
                              id="lastName"
                              name="lastName"
                              aria-describedby="Enter Last Name"
                              value={this.state.lastName}
                              placeholder="Doe"
                              required
                              onChange={this.onLastNameChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row" style={{ marginBottom: "2%" }}>
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
                    <div
                      className="row mb-3 d-flex"
                      style={{ padding: "0 0%", alignItems: "center" }}
                    >
                      <div className="mb-3">
                        <div class="form-group">
                          <label for="password">Password</label>
                          <input
                            type="password"
                            class="form-control"
                            id="password"
                            name="password"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            required
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value={this.state.policySigned}
                            name="policySigned"
                            required
                            id="defaultCheck1"
                            checked
                            onChange={this.onPrivacyPolicyChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckChecked"
                            style={{ color: "grey" }}
                          >
                            By registering, I agree to Evenz{" "}
                            <span
                              className="text-link"
                              style={{
                                color: "#538BF7",
                                textDecoration: "underline",
                              }}
                            >
                              Terms of Service
                            </span>{" "}
                            and{" "}
                            <span
                              className="text-link"
                              style={{
                                color: "#538BF7",
                                textDecoration: "underline",
                              }}
                            >
                              Privacy Policy
                            </span>
                            .
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ padding: "0 2%", marginTop: "3%" }}
                    >
                      <div className="row">
                        <button type="submit" class="btn btn-primary">
                          Register
                        </button>
                      </div>
                    </div>
                  </form>
                  <div
                    className="col"
                    style={{ marginTop: "4%", padding: "0" }}
                  >
                    Already have an account?{" "}
                    <span style={{ color: "#11A1FD" }}>Login</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default connect(null, { signUp,googleLinkClicked })(Signup);
