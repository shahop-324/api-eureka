/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { reset } from "redux-form";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";

import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";

import { reduxForm, Field } from "redux-form";
import { useState } from "react";
// import { useDispatch } from "react-redux";

import { createCommunity, resetCommunityError } from "../../../actions";
import { IconButton } from "@material-ui/core";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

let formIsvalidated = false;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));
// const renderError = ({ error, touched }) => {
//   if (touched && error) {
//     return (
//       <div className="ui error message">
//         <div className="header">{error}</div>
//       </div>
//     );
//   }
// };

const renderInput = ({
  input,
  labelClass,
  labelFor,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
  id,
  label,
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
        id={id}
      />
      <label class={labelClass} for={labelFor}>
        {label}
      </label>
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
      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}
    </div>
  );
};

const renderInputCheckbox = ({
  input,
  labelClass,
  labelFor,

  type,
  ariadescribedby,
  classes,
  placeholder,
  id,
  label,
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
        id={id}
        // required
      />
      <label class={labelClass} for={labelFor}>
        {label}
      </label>
      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}
    </div>
  );
};
const renderInputImage = ({
  input,

  type,

  classes,
  handleChange,
  accept,
  meta: { touched, error, warning },
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        accept={accept}
        onChange={() => input.onChange(handleChange)}
        className={classes}

        // required
      />
    </div>
  );
};

const renderTextArea = ({
  input,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <textarea
        rows="3"
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
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

      {!error && !warning
        ? (formIsvalidated = true)
        : (formIsvalidated = false)}

      {/* {renderError(meta)} */}
    </div>
  );
};
const CreateNewCommunityForm = (props) => {
  const { error } = useSelector((state) => state.community);
  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(null);

  const [createCommunityClicked, setCreateCommunityClicked] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCommunityError());
    setCreateCommunityClicked(false);
  }, [dispatch, error]);

  const { id } = useSelector((state) => state.user.userDetails);
  const userId = id;
  const { handleSubmit, pristine, reset, valid, submitting } = props;
  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [maxWidth, setMaxWidth] = React.useState("md");

  //   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const onSubmit = (formValues) => {
    setCreateCommunityClicked(true);
    console.log(formValues);
    // showResults(formValues);
    dispatch(createCommunity(formValues, file, userId));
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  console.log(file);
  console.log(fileToPreview);
  // const dispatch=useDispatch();
  return (
    <>
      <Dialog
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={props.open}
        // onClose={props.closeHandler}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
          <div
            className="overlay-form px-4 pt-4 pb-2 d-flex flex-column align-items-center"
            // style={{ minHeight: "100vh" }}
          >
            <div
              className="form-heading-and-close-button "
              style={{ width: "100%" }}
            >
              <div></div>
              <h2 className="overlay-form-heading">New Community</h2>
              <div
                className="overlay-form-close-button"
                onClick={props.closeHandler}
                // onClick={(props)=>{
                //   props.closeHandler,
                //   dispatch(reset(form:"newCreatedCommunity")),

                // }
                // }
              >
                {/* <div> */}
                <IconButton type="button" aria-label="delete" onClick={reset}>
                  <CancelRoundedIcon />
                </IconButton>
                {/* </div> */}
              </div>
            </div>
            <h5 className="overlay-sub-form-heading mb-5">
              Let's take the first step in our jouney of hosting and managing
              events.
            </h5>
            <div class="mb-4 overlay-form-input-row d-flex flex-column">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <Avatar
                    alt="Community Image"
                    src={fileToPreview}
                    className={classes.large}
                  />
                </div>
              </div>
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
              >
                Avatar
              </label>
              <Field
                classes="form-control"
                name="imgUpload"
                type="file"
                accept="image/*"
                handleChange={handleChange}
                component={renderInputImage}
              />
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Community Name
              </label>
              <Field
                name="name"
                type="text"
                classes="form-control"
                id="communityName"
                ariadescribedby="communityName"
                component={renderInput}
              />
            </div>

            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityEmail"
                class="form-label form-label-customized"
              >
                Community Email
              </label>
              <Field
                name="email"
                type="email"
                classes="form-control"
                id="communityEmail"
                ariadescribedby="communityEmail"
                component={renderInput}
              />
            </div>

            <div class="mb-4 overlay-form-input-row">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
              >
                Headline
              </label>
              <Field
                name="headline"
                type="text"
                classes="form-control"
                id="communityHeadline"
                ariadescribedby="communityHeadline"
                placeholder="e.g. '22 years of supporting entrepreneurs.'"
                component={renderTextArea}
              />
            </div>

            <div class="mb-4 form-check overlay-form-input-row">
              <Field
                name="policySigned"
                type="checkbox"
                classes="form-check-input"
                id="communityTermsAndConditionsOfUse"
                component={renderInputCheckbox}
                labelclass="form-check-label form-check-label-consent"
                labelfor="communityTermsAndConditionsOfUse"
                label=" I agree to follow Evenz Terms & Conditions and agree that I am
                authorized to agree to Evenz Terms & Condtions on behalf of my
                organistion"
              />
            </div>

            <div class="mb-4 form-check overlay-form-input-row">
              <Field
                name="subscribedToCommunityMailList"
                type="checkbox"
                classes="form-check-input"
                id="communityEmailListInclusionConsent"
                component={renderInput}
                labelclass="form-check-label form-check-label-consent"
                labelfor="communityEmailListInclusionConsent"
                label="I would like to recieve product updates and marketing
                communications from Evenz."
              />
            </div>

            <div class="mb-4 overlay-form-input-row d-flex flex-column">
              <button
                type="submit"
                class="btn btn-outline-primary outline-btn-text form-control"
                disabled={
                  createCommunityClicked &&
                  formIsvalidated &&
                  !error &&
                  (pristine || submitting || !valid)
                }
                //onClick={props.closeHandler}
                //disabled={pristine || submitting || !valid}
              >
                Create New Community
                {createCommunityClicked && formIsvalidated && !error ? (
                  <div
                    class="spinner-border text-primary spinner-border-sm ms-3"
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <div></div>
                )}
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};
  console.log(formValues.name);
  if (!formValues.name) {
    errors.name = "Name is Required";
  }

  if (!formValues.headline) {
    errors.headline = "Headline is Required";
  }

  if (!formValues.email) {
    errors.email = "Email is Required";
  }

  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid Email address";
  }

  if (!formValues.policySigned) {
    errors.policySigned = "You must sign policy";
  }

  return errors;
};

export default reduxForm({
  form: "newCreatedCommunity",
  validate,
  destoryOnUnmount: true,
})(CreateNewCommunityForm);
