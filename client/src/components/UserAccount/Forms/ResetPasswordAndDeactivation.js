import React from "react";
import ToggleSwitch from "../../ToggleSwitch";
import Ripple from "./../../ActiveStatusRipple";
import { Field, reduxForm } from "redux-form";
import { useDispatch } from "react-redux";
import { editUserPassword } from "../../../actions";
const renderError = ({ touched, error }) => {
  if (touched && error) {
    return (
      <div className="ui error message">
        <div className="header">{error}</div>
      </div>
    );
  }
};
const renderInput = ({
  type,
  placeholder,
  input,
  meta,

  classes,
}) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        {...input}
        className={classes}
      />
      {renderError(meta)}
    </div>
  );
};

const ResetPasswordAndDeactivation = (props) => {
  const { pristine, valid, submitting, handleSubmit } = props;
  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const showResults = async (formValues) => {
    // await sleep(500); // simulate server latency
    // window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  const dispatch = useDispatch();
  const onSubmit = (formValues) => {
    console.log(formValues);
    showResults(formValues);

    dispatch(editUserPassword(formValues));
  };
  return (
    <>
      <div className="user-account-edit-profile px-2 py-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <h3>Change Password</h3>
            <div class="form-group mb-4">
              <Field
                name="oldPass"
                type="password"
                classes="form-control mb-1"
                component={renderInput}
                placeholder="Old password"
              />

              <small
                id="emailHelp"
                class="form-text"
                style={{ color: "#538BF7", cursor: "pointer" }}
              >
                Forgot Password?
              </small>
            </div>

            <div class="form-group mb-4">
              <Field
                name="newPass"
                type="password"
                classes="form-control"
                component={renderInput}
                placeholder="New password (min 8 characters)"
              />
            </div>

            <div class="form-group mb-4">
              <Field
                name="confirmPass"
                type="password"
                classes="form-control"
                component={renderInput}
                placeholder="Confirm new password"
              />
            </div>

            <div className="row edit-profile-form-row my-3 d-flex flex-row justify-content-end">
              <button
                type="submit"
                className="col-3 btn btn-primary"
                style={{ textAlign: "center", backgroundColor: "#538BF7" }}
                disabled={!valid || pristine || submitting}
              >
                Save changes
              </button>
            </div>
          </div>
        </form>
        <div>
          <h3 className="mb-3">Account Deactivation</h3>
          <div className="d-flex flex-row mb-3">
            <div className="me-3">Current Status </div>
            <div className="d-flex flex-row align-items-center">
              <Ripple /> Active{" "}
            </div>
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </>
  );
};
const validate = (formValues) => {
  const errors = {};

  if (!formValues.oldPass) {
    errors.oldPass = "required";
  }

  if (!formValues.newPass) {
    errors.newPass = "required";
  } else if (formValues.newPass.length < 8) {
    errors.newPass = "password must be atleast 8 characters ";
  }

  if (!formValues.confirmPass) {
    errors.confirmPass = "required";
  } else if (formValues.newPass !== formValues.confirmPass) {
    errors.confirmPass = "new password and confirm password must be same";
  }

  return errors;
};

export default reduxForm({
  form: "resetPassswordAndDeactivationForm",
  validate,
})(ResetPasswordAndDeactivation);
