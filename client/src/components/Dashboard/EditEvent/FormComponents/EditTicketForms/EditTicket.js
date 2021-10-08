import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { SwipeableDrawer } from "@material-ui/core";
import Select from "react-select";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { connect, useDispatch, useSelector } from "react-redux";
import { reduxForm, Field, Form } from "redux-form";
import { editTicket, errorTrackerForEditTicket } from "../../../../../actions";
import Loader from "../../../../Loader";
import dateFormat from "dateformat";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import styled from "styled-components";

const ticketVisibilityOptions = [
  { value: "Public", label: "Public" },
  { value: "Hidden", label: "Hidden" },
  { value: "Private", label: "Private" },
];

const StyledInput = styled.input`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #4e4e4e;
`;
const StyledTextArea = styled.textarea`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
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

const RadioLabel = styled.span`
  font-family: "Ubuntu" !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  color: #585858 !important;
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
        ((error && <FormError className="my-1">{error}</FormError>) ||
          (warning && <FormWarning className="my-1">{warning}</FormWarning>))}
    </div>
  </div>
);
const EditTicket = ({
  open,
  handleClose,
  handleSubmit,
  pristine,
  submitting,
  reset,
  id,
}) => {
  const { detailError, isLoadingDetail, ticketDetails } = useSelector(
    (state) => state.ticket
  );

  const [type, setType] = React.useState(
    ticketDetails ? ticketDetails.type : "Paid"
  );

  const currencyOptions = [
    // { value: "USD", label: "US Dollars" },
    // { value: "AED", label: "United Arab Emirates Dirham" },
    { value: "INR", label: "Indian Rupees" },
    // { value: "BMD", label: "Bermudan Dollar equals" },
    // { value: "CAD", label: "Canadian Dollar" },
  ];

  const venueAreaOptions = [
    { value: "Sessions", label: "Sessions" },
    { value: "Speed Networking", label: "Speed Networking" },
    { value: "Group Based Networking", label: "Group Based Networking" },
    { value: "Social Lounge", label: "Social Lounge" },
    { value: "Booths", label: "Booths" },
  ];

  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    console.log(formValues);

    const accessibleAreas = formValues.venueAreasAccessible.map(
      (area) => area.value
    );
    console.log("accessible areas", accessibleAreas);
    const ModifiedFormValues = {};

    ModifiedFormValues.currency = formValues.currency.value;
    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.type = type;
    ModifiedFormValues.price = formValues.price;
    // ModifiedFormValues.shareRecording = formValues.shareRecording;
    ModifiedFormValues.numberOfTicketAvailable =
      formValues.numberOfTicketAvailable;
    ModifiedFormValues.venueAreasAccessible = accessibleAreas;
    ModifiedFormValues.visibility = formValues.visibility.value;
    ModifiedFormValues.message = formValues.message;
    ModifiedFormValues.salesStartDate = formValues.salesStartDate;
    ModifiedFormValues.salesEndDate = formValues.salesEndDate;
    ModifiedFormValues.salesStartTime = `${formValues.startDate}T${formValues.salesStartTime}:00Z`;
    ModifiedFormValues.salesEndTime = `${formValues.endDate}T${formValues.salesEndTime}:00Z`;

    // console.log(ModifiedFormValues);

    dispatch(editTicket(ModifiedFormValues, id, handleClose));

    // showResults(ModifiedFormValues);
    // handleClose();
  };

  if (detailError) {
    dispatch(errorTrackerForEditTicket());
    // alert(detailError);
    return null;
  }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={open}
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
            <div style={{ maxWidth: "600px" }}>
              <HeaderFooter className="form-heading-and-close-button mb-4 pt-3 px-4">
                <div></div>
                <div className="coupon-overlay-form-headline">
                  Edit This Ticket
                </div>
                <div
                  className="overlay-form-close-button"
                  onClick={handleClose}
                >
                  <IconButton aria-label="delete">
                    <CancelRoundedIcon />
                  </IconButton>
                </div>
              </HeaderFooter>
              <form className="ui from error" onSubmit={handleSubmit(onSubmit)}>
                <div className="create-new-coupon-form px-4 py-4">
                  <div className="mb-3 overlay-form-input-row ">
                    <div>
                      <FormLabel Forhtml="eventStartDate">
                        Ticket Name
                      </FormLabel>
                      <Field
                        name="name"
                        type="text"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="All access pass"
                        component={renderInput}
                      />
                    </div>
                  </div>
                  <div className="mb-4 overlay-form-input-row">
                    <FormLabel Forhtml="eventEndDate">
                      Short Description
                    </FormLabel>
                    <Field
                      name="description"
                      type="textarea"
                      classes="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Include all access to networking zone, expos, sessions and recordings"
                      component={renderTextArea}
                    />
                  </div>

                  <FormLabel Forhtml="eventStartDate">Type</FormLabel>
                  <RadioGroup
                    aria-label="ticket-type"
                    defaultValue={type}
                    name="radio-buttons-group"
                  >
                    <div className="mb-3 overlay-form-input-row form-row-3-in-1">
                      <div>
                        <FormControlLabel
                          value="Paid"
                          control={
                            <Radio
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            />
                          }
                          label=""
                        />
                        <RadioLabel>Paid</RadioLabel>
                      </div>
                      <div>
                        <FormControlLabel
                          value="Free"
                          control={
                            <Radio
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            />
                          }
                          label=""
                        />
                        <RadioLabel>Free</RadioLabel>
                      </div>
                      <div>
                        <FormControlLabel
                          value="Donation"
                          control={
                            <Radio
                              onChange={(e) => {
                                setType(e.target.value);
                              }}
                            />
                          }
                          label=""
                        />
                        <RadioLabel>Donation</RadioLabel>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="mb-4 overlay-form-input-row form-row-3-in-1">
                    <div>
                      <FormLabel Forhtml="eventStartDate">Currency</FormLabel>
                      <Field
                        name="currency"
                        placeholder="currency"
                        styles={styles}
                        menuPlacement="top"
                        options={currencyOptions}
                        component={renderReactSelect}
                      />
                    </div>
                    <div>
                      <FormLabel Forhtml="eventStartDate">Price</FormLabel>
                      <Field
                        name="price"
                        type="number"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="50"
                        component={renderInput}
                      />
                    </div>
                    <div>
                      <FormLabel for="communityName">
                        Number of ticket available
                      </FormLabel>
                      <div className="form-group">
                        <Field
                          name="numberOfTicketAvailable"
                          type="number"
                          classes="form-control"
                          ariadescribedby="emailHelp"
                          placeholder="50"
                          component={renderInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 overlay-form-input-row form-row-2-in-1">
                    <div>
                      <FormLabel Forhtml="eventStartDate">
                        Sales Start Date
                      </FormLabel>
                      <Field
                        name="salesStartDate"
                        type="date"
                        classes="form-control"
                        id="eventStartDate"
                        component={renderInput}
                      />
                    </div>
                    <div>
                      <FormLabel Forhtml="eventStartTime">
                        Sales Start Time
                      </FormLabel>
                      <Field
                        name="salesStartTime"
                        type="time"
                        classes="form-control"
                        id="eventStartTime"
                        component={renderInput}
                      />
                    </div>
                  </div>

                  <div className="mb-4 overlay-form-input-row form-row-2-in-1">
                    <div>
                      <FormLabel Forhtml="eventEndDate">
                        Sales End Date
                      </FormLabel>
                      <Field
                        name="salesEndDate"
                        type="date"
                        classes="form-control"
                        id="eventEndDate"
                        component={renderInput}
                      />
                    </div>
                    <div>
                      <FormLabel Forhtml="eventEndTime">
                        Sales End Time
                      </FormLabel>
                      <Field
                        name="salesEndTime"
                        type="time"
                        classes="form-control"
                        id="eventEndTime"
                        component={renderInput}
                      />
                    </div>
                  </div>
                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel for="communityName">
                      Select Available Venue Areas
                    </FormLabel>
                    <Field
                      name="venueAreasAccessible"
                      isMulti
                      placeholder="venue areas"
                      styles={styles}
                      menuPlacement="top"
                      options={venueAreaOptions}
                      component={renderReactSelect}
                    />
                  </div>
                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel for="communityName">Visibility</FormLabel>
                    <Field
                      name="visibility"
                      placeholder="Ticket visibility"
                      styles={styles}
                      menuPlacement="top"
                      options={ticketVisibilityOptions}
                      component={renderReactSelect}
                    />
                  </div>
                  <div className="mb-3 overlay-form-input-row">
                    <FormLabel for="communityName">
                      Message for attendees
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        name="message"
                        classes="form-control"
                        ariadescribedby="emailHelp"
                        placeholder="Say thank you. This message will be sent along with the ticket."
                        component={renderTextArea}
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
                      // disabled={pristine || submitting}
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    name:
      state.ticket.ticketDetails && state.ticket.ticketDetails.name
        ? state.ticket.ticketDetails.name
        : "",
    description:
      state.ticket.ticketDetails && state.ticket.ticketDetails.description
        ? state.ticket.ticketDetails.description
        : "",

    price:
      state.ticket.ticketDetails && state.ticket.ticketDetails.price
        ? state.ticket.ticketDetails.price
        : "",
    numberOfTicketAvailable:
      state.ticket.ticketDetails &&
      state.ticket.ticketDetails.numberOfTicketAvailable
        ? state.ticket.ticketDetails.numberOfTicketAvailable
        : "",
    // shareRecording:
    //   state.ticket.ticketDetails && state.ticket.ticketDetails.shareRecording
    //     ? state.ticket.ticketDetails.shareRecording
    //     : "",
    currency:
      state.ticket.ticketDetails && state.ticket.ticketDetails.currency
        ? {
            label: state.ticket.ticketDetails.currency,
            value: state.ticket.ticketDetails.currency,
          }
        : "",
    venueAreasAccessible:
      state.ticket.ticketDetails &&
      state.ticket.ticketDetails.venueAreasAccessible
        ? state.ticket.ticketDetails.venueAreasAccessible.map((element) => {
            return {
              value: element,
              label: element,
            };
          })
        : "",
    visibility:
      state.ticket.ticketDetails && state.ticket.ticketDetails.visibility
        ? {
            value: state.ticket.ticketDetails.visibility,
            label: state.ticket.ticketDetails.visibility,
          }
        : "",
    salesStartDate:
      state.ticket.ticketDetails && state.ticket.ticketDetails.salesStartDate
        ? dateFormat(
            new Date(state.ticket.ticketDetails.salesStartDate),
            "yyyy-mm-dd"
          )
        : "",
    salesStartTime:
      state.ticket.ticketDetails && state.ticket.ticketDetails.salesStartTime
        ? dateFormat(
            new Date(state.ticket.ticketDetails.salesStartTime),
            "HH:MM"
          )
        : "",
    salesEndDate:
      state.ticket.ticketDetails && state.ticket.ticketDetails.salesEndDate
        ? dateFormat(
            new Date(state.ticket.ticketDetails.salesEndDate),
            "yyyy-mm-dd"
          )
        : "",
    salesEndTime:
      state.ticket.ticketDetails && state.ticket.ticketDetails.salesEndTime
        ? dateFormat(new Date(state.ticket.ticketDetails.salesEndTime), "HH:MM")
        : "",
    message:
      state.ticket.ticketDetails && state.ticket.ticketDetails.message
        ? state.ticket.ticketDetails.message
        : "",
  },
});

const validate = (formValues) => {
  const errors = {};

  if (!formValues.name) {
    errors.name = "Ticket name is required";
  }
  if (!formValues.description) {
    errors.description = "Ticket description is required";
  }
  if (!formValues.currency) {
    errors.currency = "Currency is required";
  }
  if (!formValues.price) {
    errors.price = "Ticket price is required";
  }
  if (formValues.price < 100) {
    errors.price = "Minimum ticket price can be Rs. 100";
  }
  // if (!formValues.venueAreasAccessible) {
  //   errors.venueAreasAccessible = "Accessible venue areas is required";
  // }
  if (!formValues.numberOfTicketAvailable) {
    errors.numberOfTicketAvailable = "Number of tickets available is required";
  }
  return errors;
};

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditticektDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditTicket)
);
