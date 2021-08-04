import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { editSponsor } from "../../../../../actions";

import { connect } from "react-redux";

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
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

// const validate = (values) => {
//   const errors = {};

//   if (values.firstName && values.firstName.length > 15) {
//     errors.firstName = "Must be 15 characters or less";
//   }
//   if (values.lastName && values.lastName.length > 15) {
//     errors.lastName = "Must be 15 characters or less";
//   }
//   if (
//     values.email &&
//     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//   ) {
//     errors.email = "Invalid email address";
//   }

//   return errors;
// };
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
// const renderTextArea = ({
//   input,

//   meta,
//   type,
//   ariadescribedby,
//   classes,
//   placeholder,
// }) => {
//   const className = `field ${meta.error && meta.touched ? "error" : ""}`;
//   return (
//     <div className={className}>
//       <textarea
//         type={type}
//         {...input}
//         aria-describedby={ariadescribedby}
//         className={classes}
//         placeholder={placeholder}
//       />

//       {renderError(meta)}
//     </div>
//   );
// };

const renderReactSelect = ({
  isMulti,
  input,
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
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const EditSponosor = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;

  // const params = useParams();
  // const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  //   // ! call API HERE
  //  const dispatch=useDispatch()
  //    useEffect(()=>{
  //     dispatch(getAllSessionsOfParticularEvent(id))

  //    },[]);

  
  const sponsorCategoryOptions = [
    { value: "Diamond", label: "Diamond" },
    { value: "Platinum", label: "Platinum" },
    { value: "Gold", label: "Gold" },
    { value: "Bronze", label: "Bronze" },
  ];

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };
  const imgKey = useSelector((state) =>
    state.sponsor.sponsorDetails ? state.sponsor.sponsorDetails.image : false
  );

  // useSelector((state)=>{

  //      return state.booth.booths.find((booth)=>{
  //          return booth.id===

  //      })
  // })

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

    ModifiedFormValues.organisationName = formValues.organisationName;
    ModifiedFormValues.website = formValues.website;
    ModifiedFormValues.status = formValues.status.value;

    dispatch(editSponsor(ModifiedFormValues, file, props.id));

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
              <div className="coupon-overlay-form-headline">Edit sponsor</div>
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
                  Organisation Name
                </label>
                <Field
                  name="organisationName"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Google Inc."
                  component={renderInput}
                />
              </div>
            </div>

            <div class="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Select Category
              </label>
              <Field
                name="status"
                placeholder="category"
                styles={styles}
                menuPlacement="top"
                options={sponsorCategoryOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
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
                disabled={pristine || submitting}
                onClick={reset}
                className="btn btn-outline-primary btn-outline-text me-3"
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
      state.sponsor.sponsorDetails && state.sponsor.sponsorDetails.image
        ? `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${state.sponsor.sponsorDetails.image}`
        : " #",
    organisationName:
      state.sponsor.sponsorDetails &&
      state.sponsor.sponsorDetails.organisationName
        ? state.sponsor.sponsorDetails.organisationName
        : "",
    website:
      state.sponsor.sponsorDetails && state.sponsor.sponsorDetails.website
        ? state.sponsor.sponsorDetails.website
        : "",
    status:
      state.sponsor.sponsorDetails && state.sponsor.sponsorDetails.status
        ? {
            value: state.sponsor.sponsorDetails.status,
            label: state.sponsor.sponsorDetails.status,
          }
        : "",
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditSponsorDetails",
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditSponosor)
);
