/* eslint-disable no-unused-vars */
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { SwipeableDrawer } from "@material-ui/core";
import Select from "react-select";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {
  createTicket,
  errorTrackerForCreateTicket,
  showSnackbar,
} from "../../../../../actions";
import Loader from "../../../../Loader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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

const RadioLabel = styled.span`
  font-family: "Ubuntu" !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  color: #585858 !important;
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
  isRequired,
  isDisabled,
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
        required={isRequired}
        disabled={isDisabled}
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
  isRequired,
  isDisabled,
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
        required={isRequired}
        isRequired={isRequired}
        isDisabled={isDisabled}
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

const Note = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  color: #212121;
`;

const Small = styled.small`
  font-weight: 400;
  font-size: 0.8rem;
  color: #797979;
`;

const AddNewTicket = ({
  open,
  handleClose,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const [type, setType] = React.useState("Paid");
  const { error, isLoading } = useSelector((state) => state.ticket);
  const params = useParams();
  const id = params.id;

  const { startTime, endTime } = useSelector(
    (state) => state.event.eventDetails
  );

  const eventStartDateTime = new Date(startTime);
  const eventEndDateTime = new Date(endTime);

  const currencyOptions = [
    { value: "USD", label: "US Dollars" },
    { value: "AED", label: "United Arab Emirates Dirham" },
    { value: "AFN", label: "Afghan Afghani" },
    { value: "ALL", label: "Albanian Lek" },
    { value: "AMD", label: "Armenian Dram" },
    { value: "ANG", label: "Netherlands Antillean Guilder" },
    { value: "AOA", label: "Angolan Kwanza" },
    { value: "ARS", label: "Argentine Peso" },
    { value: "AUD", label: "Australian Dollar" },
    { value: "AWG", label: "Aruban Florin" },
    { value: "AZN", label: "Azerbaijani Manat" },
    { value: "BAM", label: "Bosnia-Herzegovina Convertible Mark" },
    { value: "BBD", label: "Bajan dollar" },
    { value: "BDT", label: "Bangladeshi Taka" },
    { value: "BGN", label: "Bulgarian Lev" },
    { value: "BIF", label: "Burundian Franc" },
    { value: "BMD", label: "Bermudan Dollar" },
    { value: "BND", label: "Brunei Dollar" },
    { value: "BOB", label: "Bolivian Boliviano" },
    { value: "BRL", label: "Brazilian Real" },
    { value: "BSD", label: "Bahamian Dollar" },
    { value: "BWP", label: "Botswanan Pula" },
    { value: "BYN", label: "Belarusian Ruble" },
    { value: "BZD", label: "Belize Dollar" },
    { value: "CAD", label: "Canadian Dollar" },
    { value: "CDF", label: "Congolese Franc" },
    { value: "CHF", label: "Swiss Franc" },
    { value: "CLP", label: "Chilean Peso" },
    { value: "CNY", label: "Chinese Yuan" },
    { value: "COP", label: "Colombian Peso" },
    { value: "CRC", label: "Costa Rican Colón" },
    { value: "CVE", label: "Cape Verdean Escudo" },
    { value: "CZK", label: "Czech Koruna" },
    { value: "DKK", label: "Danish Krone" },
    { value: "DOP", label: "Dominican Peso" },
    { value: "DZD", label: "Algerian Dinar" },
    { value: "EGP", label: "Egyptian Pound" },
    { value: "ETB", label: "Ethiopian Birr" },
    { value: "EUR", label: "Euro" },
    { value: "FJD", label: "Fijian Dollar" },
    { value: "FKP", label: "Falkland Island Pound" },
    { value: "GBP", label: "Pound sterling" },
    { value: "GEL", label: "Georgian Lari" },
    { value: "GIP", label: "Gibraltar Pound" },
    { value: "GMD", label: "Gambian dalasi" },
    { value: "GMF", label: "Grumfork" },
    { value: "GTQ", label: "Guatemalan Quetzal" },
    { value: "GYD", label: "Guyanaese Dollar" },
    { value: "HKD", label: "Hong Kong Dollar" },
    { value: "HNL", label: "Honduran Lempira" },
    { value: "HRK", label: "Croatian Kuna" },
    { value: "HTG", label: "Haitian Gourde" },
    { value: "HUF", label: "Hungarian Forint" },
    { value: "IDR", label: "Indonesian Rupiah" },
    { value: "ILS", label: "Israeli New Shekel" },
    { value: "INR", label: "Indian Rupee" },
    { value: "ISK", label: "Icelandic Króna" },
    { value: "JMD", label: "Jamaican Dollar" },
    { value: "JPY", label: "Japanese Yen" },
    { value: "KES", label: "Kenyan Shilling" },
    { value: "KGS", label: "Kyrgystani Som" },
    { value: "KHR", label: "Cambodian riel" },
    { value: "KMF", label: "Comorian franc" },
    { value: "KRW", label: "South Korean won" },
    { value: "KYD", label: "Cayman Islands Dollar " },
    { value: "KZT", label: "Kazakhstani Tenge" },
    { value: "LAK", label: "Laotian Kip" },
    { value: "LBP", label: "Lebanese pound" },
    { value: "LKR", label: "Sri Lankan Rupee" },
    { value: "LRD", label: "Liberian Dollar" },
    { value: "LSL", label: "Lesotho loti" },
    { value: "MAD", label: "Moroccan Dirham" },
    { value: "MDL", label: "Moldovan Leu" },
    { value: "MGA", label: "Malagasy Ariary" },
    { value: "MKD", label: "Macedonian Denar" },
    { value: "MMK", label: "Myanmar Kyat" },
    { value: "MNT", label: "Mongolian Tughrik" },
    { value: "MOP", label: "Macanese Pataca" },
    { value: "MUR", label: "Mauritian Rupee" },
    { value: "MVR", label: "Maldivian Rufiyaa" },
    { value: "MWK", label: "Malawian Kwacha" },
    { value: "MXN", label: "Mexican Peso" },
    { value: "MYR", label: "Malaysian Ringgit" },
    { value: "MZN", label: "Mozambican metical" },
    { value: "NAD", label: "Namibian dollar" },
    { value: "NGN", label: "Nigerian Naira" },
    { value: "NIO", label: "Nicaraguan Córdoba" },
    { value: "NOK", label: "Norwegian Krone" },
    { value: "NPR", label: "Nepalese Rupee" },
    { value: "NZD", label: "New Zealand Dollar" },
    { value: "PAB", label: "Panamanian Balboa" },
    { value: "PEN", label: "Sol" },
    { value: "PGK", label: "Papua New Guinean Kina" },
    { value: "PHP", label: "Philippine peso" },
    { value: "PKR", label: "Pakistani Rupee" },
    { value: "PLN", label: "Poland złoty" },
    { value: "PYG", label: "Paraguayan Guarani" },
    { value: "QAR", label: "Qatari Rial" },
    { value: "RON", label: "Romanian Leu" },
    { value: "RSD", label: "Serbian Dinar" },
    { value: "RUB", label: "Russian Ruble" },
    { value: "RWF", label: "Rwandan franc" },
    { value: "SAR", label: "Rial" },
    { value: "SBD", label: "Solomon Islands Dollar" },
    { value: "SCR", label: "Seychellois Rupee" },
    { value: "SEK", label: "Swedish Krona" },
    { value: "SGD", label: "Singapore Dollar" },
    { value: "SHP", label: "St. Helena Pound" },
    { value: "SLL", label: "Sierra Leonean Leone" },
    { value: "SOS", label: "Somali Shilling" },
    { value: "SRD", label: "Surinamese Dollar" },
    { value: "STD", label: "Sao Tomean Dobra" },
    { value: "SZL", label: "Swazi Lilangeni" },
    { value: "THB", label: "Thai Baht" },
    { value: "TJS", label: "Tajikistani Somoni" },
    { value: "TOP", label: "Tongan Paʻanga" },
    { value: "TRY", label: "Turkish lira" },
    { value: "TTD", label: "Trinidad & Tobago Dollar" },
    { value: "TWD", label: "New Taiwan dollar" },
    { value: "TZS", label: "Tanzanian Shilling" },
    { value: "UAH", label: "Ukrainian hryvnia" },
    { value: "UGX", label: "Ugandan Shilling" },
    { value: "UYU", label: "Uruguayan Peso" },
    { value: "UZS", label: "Uzbekistani Som" },
    { value: "VND", label: "Vietnamese dong" },
    { value: "VUV", label: "Ni-Vanuatu Vatu" },
    { value: "WST", label: "Samoan Tala" },
    { value: "XAF", label: "Central African CFA franc" },
    { value: "XCD", label: "East Caribbean Dollar" },
    { value: "XOF", label: "West African CFA franc" },
    { value: "XPF", label: "CFP Franc" },
    { value: "YER", label: "Yemeni Rial" },
    { value: "ZAR", label: "South African Rand" },
    { value: "ZMW", label: "Zambian Kwacha" },
  ];

  const dispatch = useDispatch();

  const onSubmit = (formValues) => {
    console.log(formValues);

    if (type !== "Paid") {
      formValues.price = undefined;
    }

    const ModifiedFormValues = {};

    ModifiedFormValues.type = type; // Maybe Paid, Free or Donation

    if (formValues.currency) {
      if (formValues.currency.value) {
        ModifiedFormValues.currency = formValues.currency.value;
      }
    }

    if (type === "Paid" && formValues.price) {
      ModifiedFormValues.price = formValues.price;
    }

    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;

    ModifiedFormValues.numberOfTicketAvailable =
      formValues.numberOfTicketAvailable;
    ModifiedFormValues.message = formValues.messageForAttendee;

    ModifiedFormValues.salesStartDate = formValues.startDate;
    ModifiedFormValues.salesEndDate = formValues.endDate;
    ModifiedFormValues.salesStartTime = `${formValues.startDate}T${formValues.startTime}:00Z`;
    ModifiedFormValues.salesEndTime = `${formValues.endDate}T${formValues.endTime}:00Z`;

    if (new Date(ModifiedFormValues.salesStartTime) < new Date(Date.now())) {
      // Ticket sale cannot be started in past
      dispatch(
        showSnackbar("warning", "Ticket sale cannot be started in past")
      );
      return;
    }
    if (new Date(ModifiedFormValues.salesEndTime) > eventEndDateTime) {
      // Ticket cannot be saled after event has ended
      dispatch(
        showSnackbar("warning", "Ticket cannot be saled after event has ended")
      );
      return;
    }

    if (
      new Date(ModifiedFormValues.salesStartTime) >=
      new Date(ModifiedFormValues.salesEndTime)
    ) {
      // Ticket sale start Date Time must be less than Sales end date Time.
      dispatch(
        showSnackbar(
          "warning",
          "Ticket sale end Date & Time must be greater than sale start Date & Time."
        )
      );
      return;
    }

    if (
      !(new Date(ModifiedFormValues.salesStartTime) < new Date(Date.now())) ||
      !(new Date(ModifiedFormValues.salesEndTime) > eventEndDateTime)
    ) {
      // Only in this case we can allow ticket to be created

      if (type === "Paid") {
        // Currency and amount is required
        // if (!ModifiedFormValues.currency) {
        //   dispatch(showSnackbar("warning", "Ticket currency is required"));
        // }
        if (!ModifiedFormValues.price) {
          dispatch(showSnackbar("warning", "Ticket price is required"));
        }
        if (ModifiedFormValues.price) {
          // Here we can create this ticket
          dispatch(createTicket(ModifiedFormValues, id, handleClose));
        }
      }
      if (type === "Free") {
        // Niether currency nor amount is required
        dispatch(createTicket(ModifiedFormValues, id, handleClose));
      }
      if (type === "Donation") {
        // Niether currency nor amount is required
        // Buyers can choose a fair price for ticket according to them
        dispatch(createTicket(ModifiedFormValues, id, handleClose));
      }
    }
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
    dispatch(errorTrackerForCreateTicket());
    return;
  }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer anchor="right" open={open}>
          <div style={{ maxWidth: "600px" }}>
            <HeaderFooter className="form-heading-and-close-button mb-4 pt-3 px-4">
              <div></div>
              <div className="coupon-overlay-form-headline">Add New Ticket</div>
              <div className="overlay-form-close-button" onClick={handleClose}>
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </HeaderFooter>

            {/* // ! PUT A NOTE THAT ALL Ticket fees will be charged in USD */}

            <div className="d-flex flex-row align-items-center px-4">
              <Note className="me-2">NOTE:</Note>{" "}
              <Small>All Ticket fees will be charged in USD</Small>
            </div>

            <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
              <div className="create-new-coupon-form px-4 py-4">
                <div className="mb-3 overlay-form-input-row ">
                  <div>
                    <FormLabel Forhtml="eventStartDate">Ticket Name</FormLabel>
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
                  defaultValue="Paid"
                  name="radio-buttons-group"
                >
                  <div className="mb-3 overlay-form-input-row form-row-3-in-1">
                    <div>
                      <FormControlLabel
                        value={"Paid"}
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

                <div className="mb-4 overlay-form-input-row form-row-2-in-1">
                  {/* <div>
                    <FormLabel Forhtml="eventStartDate">Currency</FormLabel>
                    <Field
                      isRequired={type === "Paid" ? true : false}
                      isDisabled={type !== "Paid" ? true : false}
                      name="currency"
                      placeholder="currency"
                      styles={styles}
                      menuPlacement="top"
                      options={currencyOptions}
                      component={renderReactSelect}
                    />
                  </div> */}
                  <div>
                    <FormLabel Forhtml="eventStartDate">
                      Price (in USD){" "}
                    </FormLabel>
                    <Field
                      isRequired={type === "Paid" ? true : false}
                      isDisabled={type !== "Paid" ? true : false}
                      name="price"
                      type="number"
                      classes="form-control"
                      ariadescribedby="emailHelp"
                      // placeholder="50"
                      component={renderInput}
                    />
                  </div>
                  <div>
                    <FormLabel for="communityName">
                      Number of ticket available
                    </FormLabel>
                    <div className="form-group">
                      <Field
                        isRequired={true}
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
                      name="startDate"
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
                      name="startTime"
                      type="time"
                      classes="form-control"
                      id="eventStartTime"
                      component={renderInput}
                    />
                  </div>
                </div>
                <div className="mb-4 overlay-form-input-row form-row-2-in-1">
                  <div>
                    <FormLabel Forhtml="eventEndDate">Sales End Date</FormLabel>
                    <Field
                      name="endDate"
                      type="date"
                      classes="form-control"
                      id="eventEndDate"
                      component={renderInput}
                    />
                  </div>
                  <div>
                    <FormLabel Forhtml="eventEndTime">Sales End Time</FormLabel>
                    <Field
                      name="endTime"
                      type="time"
                      classes="form-control"
                      id="eventEndTime"
                      component={renderInput}
                    />
                  </div>
                </div>

                <div className="mb-3 overlay-form-input-row">
                  <FormLabel for="communityName">
                    Message for attendees
                  </FormLabel>
                  <div className="form-group">
                    <Field
                      name="messageForAttendee"
                      classes="form-control"
                      ariadescribedby="emailHelp"
                      placeholder="Say thank you. This message will be sent along with the ticket."
                      component={renderTextArea}
                    />
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-outline-text"
                    style={{ width: "100%" }}
                  >
                    Add New ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.name) {
    errors.name = "Ticket name is required";
  }
  if (!formValues.description) {
    errors.description = "Ticket description is required";
  }
  if (!formValues.numberOfTicketAvailable) {
    errors.numberOfTicketAvailable = "Number of tickets available is required";
  }
  if (formValues.numberOfTicketAvailable <= 0) {
    errors.numberOfTicketAvailable =
      "Number of available tickets must be atleast 1";
  }
  if (!formValues.startDate) {
    errors.startDate = "Sales start date is required";
  }
  if (!formValues.endDate) {
    errors.endDate = "Sales end date is required";
  }
  if (!formValues.startTime) {
    errors.startTime = "Sales start time is required";
  }
  if (!formValues.endTime) {
    errors.endTime = "Sales end time is required";
  }
  if (!formValues.messageForAttendee) {
    errors.messageForAttendee = "Message for attendees is required";
  }

  return errors;
};

export default reduxForm({
  form: "newTicketAddForm",
  validate,
})(AddNewTicket);
