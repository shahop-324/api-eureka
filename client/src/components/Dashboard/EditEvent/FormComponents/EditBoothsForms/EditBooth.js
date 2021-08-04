import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useDispatch, useSelector, connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import MultiTagsInput from "../../../../MultiTagsInput";
import { editBooth } from "../../../../../actions";

import MultiEmailInput from "../../../MultiEmailInput";
import MultiTagInput from "../../../MultiTagInput";

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

const validate = (values) => {
  const errors = {};

  if (values.firstName && values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }
  if (values.lastName && values.lastName.length > 15) {
    errors.lastName = "Must be 15 characters or less";
  }
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  return errors;
};
// const warn = values => {
//   const warnings = {}
//   if (values.age < 19) {
//     warnings.age = 'Hmm, you seem a bit young...'
//   }
//   return warnings
// }
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
      />
      {renderError(meta)}
    </div>
  );
};

const renderTextArea = ({
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
      <textarea
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />

      {renderError(meta)}
    </div>
  );
};

const renderMultiEmail = ({ input, meta }) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  console.log(input);
  return (
    <div className={className}>
      <MultiEmailInput input={input} value={input.value} />
      {renderError(meta)}
    </div>
  );
};

const renderMultiTags = ({ input, meta }) => {
  console.log(input);
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      <MultiTagInput input={input} value={input.value} />
      {renderError(meta)}
    </div>
  );
};

const EditBooth = (props) => {
  const { handleSubmit, pristine, submitting, valid, reset } = props;

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  //   // ! call API HERE
  //  const dispatch=useDispatch()
  //    useEffect(()=>{
  //     dispatch(getAllSessionsOfParticularEvent(id))

  //    },[]);

  const sessions = useSelector((state) => state.session.sessions);

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };
   
  const imgKey = useSelector((state) => state.booth.boothDetails ? state.booth.boothDetails.image : false);

  let imgUrl = " #";
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

    showResults(ModifiedFormValues);
    props.handleClose();
  };

  

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
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
                alt="Travis Howard"
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
                disabled={pristine || submitting}
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

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditBoothDetails",
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditBooth)
);
