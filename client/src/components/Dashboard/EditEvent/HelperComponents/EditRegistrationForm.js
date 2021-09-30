import React from "react";
import styled from "styled-components";
import { SwipeableDrawer, IconButton, Divider } from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import Switch from "@mui/material/Switch";

import Select from "react-select";

const EventRegInfoSelector = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1fr 5fr;
  grid-gap: 16px;
  align-items: center;

  background-color: #f5f5f5;
  width: fit-content;
  border-radius: 10px;
  padding: 7px 15px;
`;

const RuleHeading = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const TicketTypeOptions = [];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.9rem",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.8rem",
  }),
};

const Paper = styled.div`
  width: 768px;
  background-color: #ffffff;
`;

const Heading = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const TextSmall = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.77rem;
  color: #646464;
`;

const InfoTableGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 6fr 1fr 1fr;
  grid-gap: 16px;
  align-items: center;
`;

const InfoLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #424242;
`;

const EventRegistrationFormListFields = () => {
  return (
    <>
      <InfoTableGrid>
        <div></div>
        <Heading>Include</Heading>
        <Heading>Require</Heading>
      </InfoTableGrid>
    </>
  );
};

const EventRegistrationFormFieldValues = ({ InputLabel }) => {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  return (
    <>
      <InfoTableGrid>
        <InfoLabel>{InputLabel}</InfoLabel>
        <Heading>
          <Switch {...label} defaultChecked />
        </Heading>
        <Heading>
          <Switch {...label} defaultChecked />
        </Heading>
      </InfoTableGrid>

      <Divider className="my-2"></Divider>
    </>
  );
};

const EditRegistraionForm = ({ open, handleClose }) => {
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
          <Paper className="p-4">
            <div className="form-heading-and-close-button mb-4 d-flex flex-row align-items-center justify-content-between">
              <div>
                <div className="coupon-overlay-form-headline mb-2">
                  Set information to collect
                </div>

                <TextSmall>
                  {" "}
                  We collect name, email address, city, country, organisation
                  and designation by default.
                </TextSmall>
              </div>
              <div className="overlay-form-close-button" onClick={handleClose}>
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <Heading className="mb-3">Collect information from</Heading>

            <FormControl component="fieldset" className="mb-3">
              <RadioGroup
                aria-label="gender"
                defaultValue="using2FA"
                name="radio-buttons-group"
              >
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <EventRegInfoSelector className="mb-4 me-3">
                    <FormControlLabel
                      value="everyone"
                      control={<Radio />}
                      label=""
                    />
                    <PeopleOutlineIcon />

                    <div>
                      <RuleHeading>From everyone</RuleHeading>
                    </div>
                  </EventRegInfoSelector>

                  <EventRegInfoSelector className="mb-4">
                    <FormControlLabel
                      value="specificTicket"
                      control={<Radio />}
                      label=""
                    />
                    <ConfirmationNumberIcon />

                    <div>
                      <RuleHeading>Specific Ticket Types</RuleHeading>
                    </div>
                  </EventRegInfoSelector>
                </div>
              </RadioGroup>
            </FormControl>

            <Heading className="mb-2">Select ticket types</Heading>
            <Select
              className="mb-5"
              isMulti
              defaultValue={TicketTypeOptions[0]}
              styles={styles}
              menuPlacement={"bottom"}
              options={TicketTypeOptions}
            />

            <EventRegistrationFormListFields className="mb-5"></EventRegistrationFormListFields>
            <EventRegistrationFormFieldValues
              InputLabel={"Prefix (Mr, Mrs, etc.,)"}
            />
            <EventRegistrationFormFieldValues InputLabel={"First Name"} />
            <EventRegistrationFormFieldValues InputLabel={"Last Name"} />
            <EventRegistrationFormFieldValues InputLabel={"Suffix"} />
            <EventRegistrationFormFieldValues InputLabel={"Email address"} />
            <EventRegistrationFormFieldValues InputLabel={"Organisation"} />
            <EventRegistrationFormFieldValues InputLabel={"Designation"} />
            <EventRegistrationFormFieldValues InputLabel={"City"} />
            <EventRegistrationFormFieldValues InputLabel={"Country"} />
            <EventRegistrationFormFieldValues InputLabel={"Home Phone"} />
            <EventRegistrationFormFieldValues InputLabel={"Cell Phone"} />
            <EventRegistrationFormFieldValues InputLabel={"Home Address"} />
            <EventRegistrationFormFieldValues InputLabel={"Shipping Address"} />
            <EventRegistrationFormFieldValues InputLabel={"Job Title"} />
            <EventRegistrationFormFieldValues InputLabel={"Work Address"} />
            <EventRegistrationFormFieldValues InputLabel={"Work Phone"} />
            <EventRegistrationFormFieldValues InputLabel={"Website"} />
            <EventRegistrationFormFieldValues InputLabel={"Blog"} />
            <EventRegistrationFormFieldValues InputLabel={"Gender"} />
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default EditRegistraionForm;
