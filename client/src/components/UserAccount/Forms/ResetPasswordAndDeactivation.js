import React from "react";
import { Field, reduxForm } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import { editUserPassword, errorTrackerForEditUser } from "../../../actions";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

import {DashboardSectionHeading, FormLabel, Input,FormValidationFailed,
  FormValidationWarning,} from "./../Elements";


const renderInputOldPass = ({
  type,
  placeholder,
  input,
  meta: { touched, error, warning },

  classes,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <Input
        type={type}
        placeholder={placeholder}
        {...input}
        className={classes}
        required
      />
      {touched &&
        ((error && (
          <FormValidationFailed className="my-1">
            {error}
          </FormValidationFailed>
        )) ||
          (warning && (
            <FormValidationWarning
              className="my-1"
            >
              {warning}
            </FormValidationWarning>
          )))}
    </div>
  );
};
const renderInput = ({
  type,
  placeholder,
  input,
  meta: { touched, error, warning },

  classes,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <Input
        type={type}
        placeholder={placeholder}
        {...input}
        className={classes}
      />
      {touched &&
        ((error && (
          <FormValidationFailed style={{ color: "red", fontWeight: "400" }} className="my-1">
            {error}
          </FormValidationFailed>
        )) ||
          (warning && (
            <FormValidationWarning
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "400" }}
            >
              {warning}
            </FormValidationWarning>
          )))}
    </div>
  );
};

const ResetPasswordAndDeactivation = (props) => {

  const { error } = useSelector((state) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const { pristine, valid, submitting, handleSubmit } = props;

  const dispatch = useDispatch();
  const onSubmit = (formValues) => {
    dispatch(editUserPassword(formValues));
  };

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });
    return dispatch(errorTrackerForEditUser());
  }

  return (
    <>
      <div className="user-account-edit-profile px-2 py-2">
        <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
          <div className="mb-5">
            <DashboardSectionHeading className=" mb-3">Change Password</DashboardSectionHeading>
            <div className="form-group mb-4">
              <Field
                name="oldPass"
                type="password"
                classes="form-control mb-1"
                component={renderInputOldPass}
                placeholder="Old password"
              />

              <small
                id="emailHelp"
                className="form-text"
                style={{
                  color: "#538BF7",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontFamily: "Inter",
                }}
              >
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </small>
            </div>

            <div className="form-group mb-4">
              <Field
                name="newPass"
                type="password"
                classes="form-control"
                component={renderInput}
                placeholder="New password (min 8 characters)"
              />
            </div>

            <div className="form-group mb-4">
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
        {/* <div>
          <h3 className="mb-3">Account Deactivation</h3>
          <div className="d-flex flex-row mb-3">
            <div className="me-3">Current Status </div>
            <div className="d-flex flex-row align-items-center">
              <Ripple /> Active{" "}
            </div>
          </div>
          <ToggleSwitch />
        </div> */}
      </div>
    </>
  );
};
const validate = (formValues) => {
  const errors = {};

  if (!formValues.oldPass) {
    errors.oldPass = "Required";
  }

  if (!formValues.newPass) {
    errors.newPass = "Required";
  } else if (formValues.newPass.length < 8) {
    errors.newPass = "password must be atleast 8 characters ";
  }

  if (!formValues.confirmPass) {
    errors.confirmPass = "Required";
  } else if (formValues.newPass !== formValues.confirmPass) {
    errors.confirmPass = "new password and confirm password must be same";
  }

  return errors;
};

export default reduxForm({
  form: "resetPassswordAndDeactivationForm",
  validate,
})(ResetPasswordAndDeactivation);
