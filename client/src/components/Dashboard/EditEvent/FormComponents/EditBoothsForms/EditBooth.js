import React, { useEffect, useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useDispatch, useSelector, connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import { editBooth, errorTrackerForEditBooth } from "../../../../../actions";

import MultiEmailInput from "../../../MultiEmailInput";
import MultiTagInput from "../../../MultiTagInput";
import Loader from "../../../../Loader";

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
      <input
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
        rows="2"
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
    </div>
  );
};

const renderMultiEmail = ({ input, meta: { touched, error, warning } }) => {
  const className = `field ${error && touched ? "error" : ""}`;
  console.log(input);
  return (
    <div className={className}>
      <MultiEmailInput input={input} value={input.value} />
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
    </div>
  );
};

const renderMultiTags = ({ input, meta: { touched, error, warning } }) => {
  console.log(input);
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <MultiTagInput input={input} value={input.value} />
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
    </div>
  );
};

const EditBooth = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;
  const { error, isLoading } = useSelector((state) => state.booth);
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  // const imgKey = useSelector((state) => state.booth.boothDetails.image);

  // const event = useSelector((state) => {
  //   return state.event.events.find((event) => {
  //     return event.id === id;
  //   });
  // });

  const booth = useSelector((state) => {
    return state.booth.booths.find((booth) => {
      return booth._id === props.id;
    });
  });

  console.log(booth.image);

  const imgKey = booth.image;

  let imgUrl = "#";
  if (imgKey) {
    imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
  }
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(imgUrl);

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.tagline = formValues.tagline;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.emails = formValues.multiEmail;
    ModifiedFormValues.tags = formValues.multiTags;

    const groupedSocialHandles = {
      facebook: formValues.facebook,
      twitter: formValues.twitter,
      linkedIn: formValues.linkedIn,
      instagram: formValues.instagram,
      website: formValues.website,
    };

    ModifiedFormValues.socialMediaHandles = groupedSocialHandles;

    dispatch(editBooth(ModifiedFormValues, file, props.id));

    // showResults(ModifiedFormValues);
    props.handleClose();
  };

  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ width: "100%", height: "80vh" }}
      >
        {" "}
        <Loader />{" "}
      </div>
    );
  }

  if (error) {
    dispatch(errorTrackerForEditBooth());
    alert(error);
    return;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Edit Booth Details
              </div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div className="p-0 d-flex flex-row justify-content-center">
              <Avatar
                children=""
                alt={booth.name}
                src={fileToPreview}
                className={classes.large}
                variant="rounded"
              />
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
              >
                Logo
              </label>
              <input
                name="imgUpload"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="form-control"
              />
            </div>

            <div class="mb-3 overlay-form-input-row ">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Name
                </label>
                <Field
                  name="name"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="e.g. Toonly"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Tagline
              </label>
              <div class="form-group">
                <Field
                  name="tagline"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="e.g. The Simplest Drag
                  and Drop Explainer
                  Video Creator"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Description
              </label>
              <div class="form-group">
                <Field
                  name="description"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Description of this booth"
                  component={renderTextArea}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Emails
              </label>
              <div class="form-group">
                {/* <MultiEmailInput /> */}

                <Field name="multiEmail" component={renderMultiEmail} />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Tags
              </label>
              <div class="form-group">
                <Field name="multiTags" component={renderMultiTags} />
                {/* <MultiTagInput /> */}
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                LinkedIn
              </label>
              <div class="form-group">
                <Field
                  name="linkedIn"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.linkedin.com/in/johnDoe or johnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Twitter
              </label>
              <div class="form-group">
                <Field
                  name="twitter"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.twitter.com/johnDoe or johnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Facebook
              </label>
              <div class="form-group">
                <Field
                  name="facebook"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.facebook.com/johnDoe or johnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Instagram
              </label>
              <div class="form-group">
                <Field
                  name="instagram"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.instagram.com/johnDoe or johnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Website
              </label>
              <div class="form-group">
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
                type="button"
                // disabled={pristine || submitting}
                onClick={reset}
              >
                Discard
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                onClick={() => {
                  props.handleClose();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    imgUrl:
      state.booth.boothDetails && state.booth.boothDetails.image
        ? `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${state.booth.boothDetails.image}`
        : " #",
    name:
      state.booth.boothDetails && state.booth.boothDetails.name
        ? state.booth.boothDetails.name
        : "",
    tagline:
      state.booth.boothDetails && state.booth.boothDetails.tagline
        ? state.booth.boothDetails.tagline
        : "",
    description:
      state.booth.boothDetails && state.booth.boothDetails.description
        ? state.booth.boothDetails.description
        : "",
    multiEmail:
      state.booth.boothDetails && state.booth.boothDetails.emails
        ? state.booth.boothDetails.emails
        : "",

    multiTags:
      state.booth.boothDetails && state.booth.boothDetails.tags
        ? state.booth.boothDetails.tags
        : "",

    linkedIn:
      state.booth.boothDetails &&
      state.booth.boothDetails.socialMediaHandles &&
      state.booth.boothDetails.socialMediaHandles.linkedIn
        ? `www.linkedin.com/in/${state.booth.boothDetails.socialMediaHandles.linkedIn}`
        : "",

    twitter:
      state.booth.boothDetails &&
      state.booth.boothDetails.socialMediaHandles &&
      state.booth.boothDetails.socialMediaHandles.twitter
        ? `www.twitter.com/${state.booth.boothDetails.socialMediaHandles.twitter}`
        : "",

    facebook:
      state.booth.boothDetails &&
      state.booth.boothDetails.socialMediaHandles &&
      state.booth.boothDetails.socialMediaHandles.facebook
        ? `www.facebook.com/${state.booth.boothDetails.socialMediaHandles.facebook}`
        : "",

    instagram:
      state.booth.boothDetails &&
      state.booth.boothDetails.socialMediaHandles &&
      state.booth.boothDetails.socialMediaHandles.instagram
        ? `www.instagram.com/${state.booth.boothDetails.socialMediaHandles.instagram}`
        : "",

    website:
      state.booth.boothDetails &&
      state.booth.boothDetails.socialMediaHandles &&
      state.booth.boothDetails.socialMediaHandles.website
        ? `www.${state.booth.boothDetails.socialMediaHandles.website}`
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};
  console.log(formValues.name);
  if (!formValues.name) {
    errors.name = "Name is required";
  }

  if (!formValues.tagline) {
    errors.tagline = "Tagline is required";
  }

  if (!formValues.description) {
    errors.description = "Description is required";
  }
  if (!formValues.multiEmail) {
    errors.multiEmail = "Email is required";
  }
  if (
    formValues.multiEmail &&
    formValues.multiEmail.forEach((element) => {
      return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(element);
    })
  ) {
    errors.multiEmail = "Invalid Email address";
  }

  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditBoothDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditBooth)
);
