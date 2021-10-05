import React from "react";
import styled from "styled-components";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { reduxForm, Field } from "redux-form";

import Select from "react-select";

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
};

const sessionOptions = [
  { label: "Session 1", value: "Session 1" },
  { label: "Session 2", value: "Session 2" },
  { label: "Session 3", value: "Session 3" },
  { label: "Session 4", value: "Session 4" },
  { label: "Session 5", value: "Session 5" },
  { label: "Session 6", value: "Session 6" },
]; // Build a list of session options for this event

const renderReactSelect = ({
  input,
  isMulti,
  meta: { touched, error, warning },
  styles,
  menuPlacement,
  options,
  defaultValue,
  name,
}) => (
  <div>
    <div>
      <Select
        isMulti={isMulti}
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
        name={name}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
      {touched &&
        ((error && <FormError>{error}</FormError>) ||
          (warning && <FormWarning>{warning}</FormWarning>))}
    </div>
  </div>
);

const StyledInput = styled.input`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #4e4e4e;

  &:hover {
    border: #538bf7;
  }
`;

const RadioLabel = styled.span`
  font-family: "Ubuntu" !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  color: #585858 !important;
`;

const FormLabel = styled.label`
  font-family: "Ubuntu" !important;
  font-size: 0.82rem !important;
  font-weight: 500 !important;
  color: #727272 !important;
  margin-bottom: 5px;
`;

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormError = styled.div`
  font-family: "Ubuntu";
  color: red;
  font-weight: 400;
  font-size: 0.8rem;
`;

const FormWarning = styled.div`
  font-family: "Ubuntu";
  color: orange;
  font-weight: 400;
  font-size: 0.8rem;
`;

const renderInput = ({
  input,
  value,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <StyledInput
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
      />
      {touched &&
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
    </div>
  );
};

const RTMPDestination = ({ open, handleClose, handleSubmit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 py-3">
            <div></div>
            <div className="coupon-overlay-form-headline">
              Configure RTMP Destination
            </div>
            <div className="overlay-form-close-button" onClick={handleClose}>
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </HeaderFooter>

          <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
            <div
              className="px-4 py-4"
              style={{
                minHeight: "none !important",
                height: "auto !important",
                width: "600px",
                background: "#ffffff",
                boxShadow: "0px 5px 20px rgb(176 195 211 / 16%)",
                borderRadius: "20px",
              }}
            >
              <div className="mb-4 overlay-form-input-row">
                <FormLabel for="communityName">
                  RTMP server URL <span className="mandatory-field">*</span>
                </FormLabel>
                <Field
                  name="rtmpServerURL"
                  type="text"
                  classes="form-control"
                  id="exampleFormControlInput1"
                  placeholder="RTMP Server URL"
                  component={renderInput}
                />
              </div>
              <div className="mb-4 overlay-form-input-row">
                <FormLabel for="communityName">
                  RTMP stream key <span className="mandatory-field">*</span>
                </FormLabel>
                <Field
                  name="rtmpServerKey"
                  type="text"
                  classes="form-control"
                  id="exampleFormControlInput1"
                  placeholder="RTMP Stream key"
                  component={renderInput}
                />
              </div>
              <div className="mb-4 overlay-form-input-row">
                <FormLabel for="communityName">
                  Live stream page URL<span className="mandatory-field">*</span>
                </FormLabel>
                <Field
                  name="liveStreamPageURL"
                  type="text"
                  classes="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Live stream page URL"
                  component={renderInput}
                />
              </div>
              <div className="mb-4 overlay-form-input-row">
                <FormLabel for="communityName">
                  Friendly Name<span className="mandatory-field">*</span>
                </FormLabel>
                <Field
                  name="streamFriendlyName"
                  type="text"
                  classes="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Give a friendly name to identify this stream destination."
                  component={renderInput}
                />
              </div>

              <div className="mb-4 overlay-form-input-row">
                <FormLabel Forhtml="eventEndDate">
                  Select sessions to live stream
                </FormLabel>
                <Field
                  isMulti={true}
                  name="sessions"
                  placeholder="Select sessions"
                  styles={styles}
                  menuPlacement="top"
                  options={sessionOptions}
                  // create a list of all sessions in this event
                  component={renderReactSelect}
                />
              </div>

              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Create New Destination
                </button>
              </div>
            </div>
          </form>
        </>
      </Dialog>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.rtmpServerURL) {
    errors.rtmpServerURL = "RTMP Server url is required.";
  }
  if (!formValues.rtmpServerKey) {
    errors.rtmpServerKey = "RTMP Server key is required";
  }
  if (!formValues.liveStreamPageURL) {
    errors.liveStreamPageURL = "Expiry Time is required";
  }
  if (!formValues.streamFriendlyName) {
    errors.streamFriendlyName =
      "Stream friendly name for identification is required";
  }
  return errors;
};

export default reduxForm({
  form: "newRTMPDestination",
  validate,
})(RTMPDestination);
