/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import { Avatar, SwipeableDrawer } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {
  editSpeaker,
  errorTrackerForEditSpeaker,
  fetchParticularSpeakerOfEvent,
} from "../../../../../actions";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Loader from "../../../../Loader";

import styled from "styled-components";

const StyledInput = styled.input`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #4e4e4e;

  &:hover {
    border: #538bf7;
  }
`;
const StyledTextArea = styled.textarea`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #4e4e4e;
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

const FormHeading = styled.div`
  font-size: 1.2rem;
  font-family: "Ubuntu";
  font-weight: 600;
  color: #212121;
`;

const FormSubHeading = styled.div`
  font-size: 0.87rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: #424242;
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    minHeight: "76.5vh",
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const renderInput = ({
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
      <StyledInput
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {touched &&
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
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
      <StyledTextArea
        rows="2"
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />

      {touched &&
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
    </div>
  );
};

const renderReactSelect = ({
  input,
  meta: { touched, error, warning },
  styles,
  menuPlacement,
  options,
  defaultValue,

  firstName,
}) => (
  <div>
    <div>
      <Select
        isMulti
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
        firstName={firstName}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
    </div>
  </div>
);
const EditSpeakerForm = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;

  const { detailError, isLoadingDetail } = useSelector(
    (state) => state.speaker
  );

  const params = useParams();
  const id = params.id;

  const dispatch = useDispatch();

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const speaker = useSelector((state) => {
    return state.speaker.speakers.find((speaker) => {
      return speaker._id === props.id;
    });
  });
  const imgKey = speaker.image;
  let imgUrl = " #";
  if (imgKey) {
    imgUrl = `https://bluemeet.s3.us-west-1.amazonaws.com/${imgKey}`;
  }

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(imgUrl);

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.headline = formValues.headline;
    ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    ModifiedFormValues.email = formValues.email;
    ModifiedFormValues.organisation = formValues.organisation;

    const groupedSocialHandles = {
      facebook: formValues.facebook,
      twitter: formValues.twitter,
      linkedin: formValues.linkedin,
    };

    ModifiedFormValues.socialMediaHandles = groupedSocialHandles;

    const modifiedSessions = [];
    if (formValues.sessions) {
      for (let element of formValues.sessions) {
        modifiedSessions.push(element.value);
      }
    }
    ModifiedFormValues.sessions = modifiedSessions;

    console.log(ModifiedFormValues);

    setState({ vertical: "top", horizontal: "center", open: true });
    dispatch(editSpeaker(ModifiedFormValues, file, props.id));
    console.log(file);
  };

  if (detailError) {
    dispatch(errorTrackerForEditSpeaker());
    alert(detailError);
    return null;
  }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={props.open}
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
        >
          {isLoadingDetail ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ width: "100%", height: "100%" }}
            >
              {" "}
              <Loader />{" "}
            </div>
          ) : (
            <>
              <HeaderFooter className="form-heading-and-close-button mb-4 px-4 pt-3">
                <div></div>
                <div className="coupon-overlay-form-headline">Edit Speaker</div>
                <div
                  className="overlay-form-close-button"
                  onClick={props.handleClose}
                >
                  <IconButton aria-label="delete">
                    <CancelRoundedIcon />
                  </IconButton>
                </div>
              </HeaderFooter>
              <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
                <div
                  className="create-new-coupon-form px-4 py-4"
                  style={{ minHeight: "100vh" }}
                >
                  <div className="p-0 d-flex flex-row justify-content-center">
                    <Avatar
                      children=""
                      alt="Travis Howard"
                      src={fileToPreview}
                      variant="rounded"
                      className={classes.large}
                    />
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityHeadline"
                      className="form-label form-label-customized"
                    >
                      Avatar
                    </FormLabel>
                    <input
                      name="imgUpload"
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3 overlay-form-input-row form-row-2-in-1">
                    <div>
                      <FormLabel
                        Forhtml="eventStartDate"
                        className="form-label form-label-customized"
                      >
                        First Name
                      </FormLabel>
                      <Field
                        name="firstName"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="John"
                        component={renderInput}
                      />
                    </div>
                    <div>
                      <FormLabel
                        Forhtml="eventStartDate"
                        className="form-label form-label-customized"
                      >
                        Last Name
                      </FormLabel>
                      <Field
                        name="lastName"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="Doe"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      Forhtml="eventStartDate"
                      className="form-label form-label-customized"
                    >
                      Organisation
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="organisation"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        // placeholder="CEO of App Brewery"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      Forhtml="eventStartDate"
                      className="form-label form-label-customized"
                    >
                      Bio
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="bio"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        // placeholder="Hi there! I am here"
                        component={renderTextArea}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      Forhtml="eventStartDate"
                      className="form-label form-label-customized"
                    >
                      Email
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="email"
                        type="email"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="johndoe@gmail.com"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityName"
                      className="form-label form-label-customized"
                    >
                      Select Sessions
                    </FormLabel>
                    <Field
                      name="sessions"
                      isMulti
                      placeholder="Select sessions"
                      styles={styles}
                      menuPlacement="top"
                      component={renderReactSelect}
                    />
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityName"
                      className="form-label form-label-customized"
                    >
                      Linkedin
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="linkedin"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="www.linkedIn.com/in/JohnDoe/ or JohnDoe"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityName"
                      className="form-label form-label-customized"
                    >
                      Facebook
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="facebook"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="www.facebook.com/in/JohnDoe/ or JohnDoe"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityName"
                      className="form-label form-label-customized"
                    >
                      Twitter
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="twitter"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="www.twitter.com/in/JohnDoe/ or JohnDoe"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel
                      for="communityName"
                      className="form-label form-label-customized"
                    >
                      Website
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="website"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="www.myDomain.com"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div
                    style={{ width: "100%" }}
                    className="d-flex flex-row justify-content-end"
                  >
                    <button
                      className="btn btn-outline-primary btn-outline-text me-3"
                      onClick={reset}
                    >
                      Discard
                    </button>

                    <button
                      type="submit"
                      disabled={pristine || submitting}
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        props.handleClose();
                        setState({
                          open: true,
                          vertical: "top",
                          horizontal: "center",
                        });
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </SwipeableDrawer>
      </React.Fragment>
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            Speaker info updated successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    imgUrl:
      state.speaker.speakerDetails && state.speaker.speakerDetails.image
        ? `https://bluemeet.s3.us-west-1.amazonaws.com/${state.speaker.speakerDetails.image}`
        : " #",
    firstName:
      state.speaker.speakerDetails && state.speaker.speakerDetails.firstName
        ? state.speaker.speakerDetails.firstName
        : "",
    lastName:
      state.speaker.speakerDetails && state.speaker.speakerDetails.lastName
        ? state.speaker.speakerDetails.lastName
        : "",
    email:
      state.speaker.speakerDetails && state.speaker.speakerDetails.email
        ? state.speaker.speakerDetails.email
        : "",
    bio:
      state.speaker.speakerDetails && state.speaker.speakerDetails.bio
        ? state.speaker.speakerDetails.bio
        : "",
    organisation:
      state.speaker.speakerDetails && state.speaker.speakerDetails.organisation
        ? state.speaker.speakerDetails.organisation
        : "",
    facebook:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.socialMediaHandles &&
      state.speaker.speakerDetails.socialMediaHandles.facebook
        ? state.speaker.speakerDetails.socialMediaHandles.facebook
        : "",
    twitter:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.socialMediaHandles &&
      state.speaker.speakerDetails.socialMediaHandles.twitter
        ? state.speaker.speakerDetails.socialMediaHandles.twitter
        : "",
    linkedin:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.socialMediaHandles &&
      state.speaker.speakerDetails.socialMediaHandles.linkedin
        ? state.speaker.speakerDetails.socialMediaHandles.linkedin
        : "",
    website:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.socialMediaHandles &&
      state.speaker.speakerDetails.socialMediaHandles.website
        ? state.speaker.speakerDetails.socialMediaHandles.website
        : "",
    sessions:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.sessions !== 0 &&
      state.speaker.speakerDetails.sessions.map((element) => {
        return {
          value: element.id,
          label: element.name,
        };
      }),
  },
});

const validate = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = "Required";
  }

  if (!formValues.lastName) {
    errors.lastName = "Required";
  }

  if (!formValues.email) {
    errors.email = "email is required";
  }

  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid Email address";
  }

  if (!formValues.organisation) {
    errors.organisation = "Organisation is required";
  }
  if (!formValues.headline) {
    errors.headline = "Headline is required";
  }

  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditSpeakerDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditSpeakerForm)
);
