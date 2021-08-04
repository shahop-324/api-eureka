import React from "react";
import "./../../assets/css/style.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useDispatch } from "react-redux";
import { googleLinkClicked } from "../../actions/index";
import { signIn } from "../../actions/index";
import { reduxForm, Field } from "redux-form";
import { useSelector } from "react-redux";
import "./newSignin.css";
import "./googleBtn.scss";

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

const SigninSignupFormSwitch = () => {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");

  signUpButton.addEventListener("click", () =>
    container.classList.add("right-panel-active")
  );

  signInButton.addEventListener("click", () =>
    container.classList.remove("right-panel-active")
  );
};

const NewSignin = (props) => {
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

  return (
    <>
      <CssBaseline />
      <div className="container-fluid page-body">
        <div
          className="row d-flex align-items-center justify-content-center"
          style={{ height: "100vh", alignItems: "center" }}
        >
          <div class="container-op" id="container">
            <div class="form-container sign-up-container">
              <form action="#">
                <h1>Create Account</h1>
                <div class="social-container">
                  <link
                    rel="stylesheet"
                    type="text/css"
                    href="//fonts.googleapis.com/css?family=Open+Sans"
                  />

                  <div class="google-btn">
                    <div class="google-icon-wrapper">
                      <img
                        class="google-icon"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="google-signin"
                      />
                    </div>
                    <p class="btn-text">
                      <b>Sign in with google</b>
                    </p>
                  </div>
                </div>
                <span>or use your email for registration</span>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign Up</button>
              </form>
            </div>
            <div class="form-container sign-in-container">
              <form action="#">
                <h1>Sign in</h1>
                <div class="google-btn my-4">
                    <div class="google-icon-wrapper">
                      <img
                        class="pt-2"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="google-signin"
                      />
                    </div>
                    <p class="btn-text">
                      <b>Sign in with google</b>
                    </p>
                  </div>
                <span>or use your account</span>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="#">Forgot your password?</a>
                <button>Sign In</button>
              </form>
            </div>
            <div class="overlay-container">
              <div class="overlay">
                <div class="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p>
                    To keep connected with us please login with your personal
                    info
                  </p>
                  <button
                    class="ghost"
                    id="signIn"
                    onClick={() => {
                      const container = document.getElementById("container");

                      container.classList.remove("right-panel-active");
                    }}
                  >
                    Sign In
                  </button>
                </div>
                <div class="overlay-panel overlay-right">
                  <h1>Hello, Friend!</h1>
                  <p>Enter your personal details and start journey with us</p>
                  <button
                    class="ghost"
                    id="signUp"
                    onClick={() => {
                      const container = document.getElementById("container");

                      container.classList.add("right-panel-active");
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {/* {SigninSignupFormSwitch()} */}
        </div>
      </div>
    </>
  );
};

export default reduxForm({
  form: "signInForm",
})(NewSignin);
