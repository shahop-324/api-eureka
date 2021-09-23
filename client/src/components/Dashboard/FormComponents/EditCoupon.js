import React from "react";

import IconButton from "@material-ui/core/IconButton";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import Select from "react-select";
import dateFormat from "dateformat";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { reduxForm, Field } from "redux-form";
import { connect, useDispatch, useSelector } from "react-redux";
import { editCoupon, errorTrackerForEditCoupon } from "../../../actions";
import Loader from "./../../Loader";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let eventOptions = [];

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
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
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

const renderReactSelect = ({
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
      isDisabled={true}
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

const EditCoupon = (props) => {
  const events = useSelector((state) => state.event.events);

  if (events) {
    eventOptions = events.map((event) => {
      return {
        label: event.eventName,
        value: event._id,
      };
    });
  }

  const {detailError, isLoadingDetail} = useSelector((state) => state.coupon);
  const { handleSubmit, pristine, submitting, reset } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const onSubmit = (formValues) => {
    console.log(formValues);
   
    const ModifiedFormValues = {};
    ModifiedFormValues.discountForEventId = formValues.eventName.value;
    ModifiedFormValues.validTillDate = formValues.expiryDate;
    ModifiedFormValues.validTillTime = `${formValues.expiryDate}T${formValues.expiryTime}:00Z`;
    ModifiedFormValues.discountPercentage = formValues.discountPercentage;
    ModifiedFormValues.discountCode = formValues.couponCode;
    ModifiedFormValues.maxNumOfDiscountPermitted =
      formValues.numberOfDiscountsAvailable;

    
    // showResults(ModifiedFormValues);
    dispatch(editCoupon(ModifiedFormValues, props.id));
    props.handleClose();
    window.location.reload();
    
  };

  if (detailError) {
    dispatch(errorTrackerForEditCoupon());
    alert(detailError);
    return null;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        {isLoadingDetail ? <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ width: "100%", height: "100%" }}
      >
        {" "}
        <Loader />{" "}
      </div> :  <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Edit this coupon
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
            <div className="mb-4 overlay-form-input-row">
              <label
                Forhtml="eventEndDate"
                className="form-label form-label-customized"
              >
                Select Event
              </label>
              <Field
                name="eventName"
                placeholder="Select the event"
                styles={styles}
                menuPlacement="auto"
                options={eventOptions}
                component={renderReactSelect}
              />
            </div>
            <div className="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Expiry Date
                </label>
                <Field
                  name="expiryDate"
                  type="date"
                  value="2021-07-21"
                  classes="form-control"
                  component={renderInput}
                />
                {/* <input type="date" className="form-control" /> */}
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Expiry Time
                </label>
                <Field
                  name="expiryTime"
                  type="time"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Discount Percentage
              </label>
              <Field
                name="discountPercentage"
                type="number"
                classes="form-control"
                ariadescribedby="emailHelp"
                placeholder="50"
                component={renderInput}
              />
              {/* <input
              type="number"
              className="form-control"
              id="communityName"
              aria-describedby="communityName"
            /> */}
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Coupon code
              </label>

              <Field
                name="couponCode"
                type="text"
                classes="form-control"
                id="exampleFormControlInput1"
                placeholder="HAPPY50"
                component={renderInput}
              />
            </div>

            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Number Of Discounts Available
              </label>
              <Field
                name="numberOfDiscountsAvailable"
                type="number"
                classes="form-control"
                ariadescribedby="emailHelp"
                placeholder="100"
                component={renderInput}
              />
            </div>
            <div
              style={{ width: "100%" }}
              className="d-flex flex-row justify-content-end"
            >
              <button
                className="btn btn-outline-primary btn-outline-text me-3"
                onClick={reset}
                disabled={pristine || submitting}
                style={{textAlign: "center"}}
              >
                Discard
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{textAlign: "center"}}
                onClick={() => {
                  props.handleClose();
                  setState({
                    open: true,
                    vertical: "top",
                    horizontal: "center",
                  });
                }}
                // disabled={pristine || submitting}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form> }
        
      </Dialog>
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            Coupon updated successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    eventName:
      state.coupon.couponDetails &&
      state.coupon.couponDetails.discountForEventId &&
      state.coupon.couponDetails.discountForEventId.eventName
        ? {
            label: state.coupon.couponDetails.discountForEventId.eventName,
            value: state.coupon.couponDetails.discountForEventId.eventName,
          }
        : "",
        expiryDate:
      state.coupon.couponDetails && state.coupon.couponDetails.validTillDate
        ? dateFormat(new Date(state.coupon.couponDetails.validTillDate), "yyyy-mm-dd")
        : "",
        expiryTime:
      state.coupon.couponDetails && state.coupon.couponDetails.validTillTime
        ? dateFormat(new Date(state.coupon.couponDetails.validTillTime), "HH:MM")
        : "",
    discountPercentage:
      state.coupon.couponDetails &&
      state.coupon.couponDetails.discountPercentage
        ? state.coupon.couponDetails.discountPercentage
        : "",

        couponCode:
      state.coupon.couponDetails &&
      state.coupon.couponDetails.discountCode
        ? state.coupon.couponDetails.discountCode
        : "",

        numberOfDiscountsAvailable:
      state.coupon.couponDetails &&
      state.coupon.couponDetails.maxNumOfDiscountPermitted
        ? state.coupon.couponDetails.maxNumOfDiscountPermitted
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};
  
  if (!formValues.eventName) {
    errors.eventName = "Event name is required";
  }
  if (!formValues.expiryDate) {
    errors.expiryDate = "Expiry Date is required";
  }
  if (!formValues.expiryTime) {
    errors.expiryTime = "Expiry Time is required";
  }
  if (!formValues.discountPercentage) {
    errors.discountPercentage = "Discount percentage is required";
  }
  if (!formValues.couponCode) {
    errors.couponCode = "Coupon code is required";
  }
  if (!formValues.numberOfDiscountsAvailable) {
    errors.numberOfDiscountsAvailable = "Number of discounts available is required";
  }
  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditCouponDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditCoupon)
);
