/* eslint-disable no-unused-vars */
import React from "react";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";

import {  useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";

import { reduxForm, Field } from "redux-form";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { createCommunity } from "../../../actions";
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
  labelClass,
  labelFor,
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
  id,
  label,
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
        id={id}
      />
      <label class={labelClass} for={labelFor}>
        {label}
      </label>
      {renderError(meta)}
    </div>
  );
};
const renderTextArea = ({
  input,
  // labelClass,
  // labelFor,
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
  // label
}) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      {/* <label class={labelClass} for={labelFor}>{label}</label> */}
      <textarea
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />

      {/* {renderError(meta)} */}
    </div>
  );
};
const CreateNewCommunityForm = (props) => {
  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(null);
   const dispatch = useDispatch();
  //  useEffect(()=>{


  //     dispatch(getMe());



  //  })


  const {id}=useSelector((state)=>state.user.userDetails)
  const userId =id;
  const { handleSubmit, pristine, valid, submitting } = props;
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
    console.log(formValues);
    showResults(formValues);
    dispatch(createCommunity(formValues,userId));
  };

  //   const onFileChange = (event) => {
  //     console.log(event.target.files[0]);
  //     setFile(event.target.files[0]);
  //   };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  console.log(file);
  console.log(fileToPreview);

  return (
    <>
      <Dialog
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.closeHandler}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
          <div
            className="overlay-form px-4 pt-4 pb-2 d-flex flex-column align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <h2 className="overlay-form-heading">New Community</h2>
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
              <input
                className="form-control"
                name="imgUpload"
                type="file"
                accept="image/*"
                onChange={handleChange}
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

            {/* <div class="mb-4 overlay-form-input-row d-flex flex-column">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
              >
                Avatar
              </label>

              <input
              name ="imgUpload"
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
              />
              <label htmlFor="contained-button-file">
                <Button  variant="contained" color="primary" component="span">
                  Upload
                </Button>
              </label>
            </div> */}

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
                component={renderInput}
                labelclass="form-check-label form-check-label-consent"
                labelfor="communityTermsAndConditionsOfUse"
                label=" I agree to follow Evenz Terms & Conditions and agree that I am
                authorized to agree to Evenz Terms & Condtions on behalf of my
                organistion"
              />

              {/* <label
                labelclass="form-check-label form-check-label-consent"
                labelfor="communityTermsAndConditionsOfUse"
              >
                I agree to follow Evenz Terms & Conditions and agree that I am
                authorized to agree to Evenz Terms & Condtions on behalf of my
                organistion
              </label> */}
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
              {/* <label
                labelclass="form-check-label form-check-label-consent"
                labelfor="communityEmailListInclusionConsent"
              >
                I would like to recieve product updates and marketing
                communications from Evenz.
              </label> */}
            </div>

            <div class="mb-4 overlay-form-input-row d-flex flex-column">
              <button
                type="submit"
                class="btn btn-outline-primary outline-btn-text form-control"
                onClick={props.closeHandler}
                disabled={pristine || submitting || !valid}
              >
                Create New Community
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default reduxForm({
  form: "newCreatedCommunity",
})(CreateNewCommunityForm);