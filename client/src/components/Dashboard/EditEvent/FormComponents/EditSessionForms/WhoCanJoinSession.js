import React from "react";
import { SwipeableDrawer, IconButton, Avatar } from "@material-ui/core";
import styled from "styled-components";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import Faker from 'faker';

const Grid = styled.div`
  width: 840px;
  background-color: #ffffff;

  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-gap: 24px;
  align-items: center;
`;

const ToggleCard = styled.div`
  background-color: #f5f5f5;

  border-radius: 10px;
  padding: 20px;

  display: grid;
  grid-template-columns: 2fr 4fr 1fr;
  grid-gap: 16px;
  align-items: center;

  height: 135px;

  &:hover {
    background-color: #c7c7c7;
  }
`;

const DisplayIcon = styled.div`
  height: 100%;
  border-radius: 50%;
  background-color: #ffffff;
  padding: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TextHeading = styled.div`
  font-size: 1rem;
  font-weight: 600;
  font-family: "Ubuntu";
  color: #212121;
`;

const TextSmall = styled.div`
  font-size: 0.78rem;
  font-weight: 400;
  font-family: "Ubuntu";
  color: #212121;
`;

const TicketContainer = styled.div`
  background-color: #f5f5f5;

  border-radius: 10px;
  padding: 20px;

  /* display: grid;
grid-template-columns: 2fr 4fr 1fr;
grid-gap: 16px; */

  height: 70vh;
`;

const PeopleContainer = styled.div`
background-color: #f5f5f5;

border-radius: 10px;
padding: 20px;

height: 70vh;

`

const TicketSelector = styled.div`
  background-color: #ffffff;
  font-size: 0.87rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #585858;

  border-radius: 10px;
  padding: 10px;
`;

const PeopleSelector = styled.div`
background-color: #ffffff;
  font-size: 0.87rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #585858;

  border-radius: 10px;
  padding: 10px;
`;

const WhoCanJoinSession = (props) => {
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
          <div className="px-4 pt-4 pb-3">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div
                className="coupon-overlay-form-headline"
                style={{ fontSize: "0.9rem" }}
              >
                Control who can join
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
          </div>

          <Grid className="px-4 pt-1 pb-4">
            {/* Ticket holders or select people */}
            <div
              className="pe-3"
              style={{ borderRight: "1px solid #D8D8D8", height: "100%" }}
            >
              <ToggleCard>
                <DisplayIcon>
                  <ConfirmationNumberIcon
                    style={{ fontSize: "2.5rem" }}
                  ></ConfirmationNumberIcon>
                </DisplayIcon>
                <div>
                  <TextHeading>Ticket holders</TextHeading>
                  <TextSmall>
                    Select the ticket types to be allowed access to the session
                  </TextSmall>
                </div>
                <KeyboardArrowRightRoundedIcon
                  style={{ justifySelf: "center" }}
                />
              </ToggleCard>
              <hr />

              <ToggleCard>
                <DisplayIcon>
                  <PeopleOutlineRoundedIcon
                    style={{ fontSize: "2.5rem" }}
                  ></PeopleOutlineRoundedIcon>
                </DisplayIcon>
                <div>
                  <TextHeading>Choose list of people</TextHeading>
                  <TextSmall>
                    Select people to be allowed access to the session
                  </TextSmall>
                </div>
                <KeyboardArrowRightRoundedIcon
                  style={{ justifySelf: "center" }}
                />
              </ToggleCard>
            </div>

            {/* Corresponding Ui */}
            <div>
              {/* <TicketContainer>
                <TextHeading style={{ fontWeight: "500", fontSize: "0.9rem" }} className="mb-4">
                  Select tickets
                </TextHeading>
                <TicketSelector className="d-flex flex-row align-items-center justify-content-between mb-3">
                    All access pass
                    <input type="checkbox" className="form-check-input" style={{height: "20px", width: "20px"}}></input>
                </TicketSelector>
                <TicketSelector className="d-flex flex-row align-items-center justify-content-between mb-3">
                    VIP Pass
                    <input type="checkbox" className="form-check-input" style={{height: "20px", width: "20px"}}></input>
                </TicketSelector>
              </TicketContainer> */}
              <PeopleContainer>
              <TextHeading style={{ fontWeight: "500", fontSize: "0.9rem" }} className="mb-4">
                  Select people (323)
                </TextHeading>

                <PeopleSelector className="d-flex flex-row align-items-center justify-content-between mb-3">
                <Avatar src={Faker.image.avatar()} />
                    {"Shreyansh shah"}
                    <input type="checkbox" className="form-check-input" style={{height: "20px", width: "20px"}}></input>
                </PeopleSelector>
                <PeopleSelector className="d-flex flex-row align-items-center justify-content-between mb-3">
                <Avatar src={Faker.image.avatar()} />
                    {Faker.name.findName()}
                    <input type="checkbox" className="form-check-input" style={{height: "20px", width: "20px"}}></input>
                </PeopleSelector>
                <PeopleSelector className="d-flex flex-row align-items-center justify-content-between mb-3">
                <Avatar src={Faker.image.avatar()} />
                    {Faker.name.findName()}
                    <input type="checkbox" className="form-check-input" style={{height: "20px", width: "20px"}}></input>
                </PeopleSelector>

                  </PeopleContainer>
              <button
                className="btn btn-primary btn-outline-text mt-5"
                style={{ width: "100%" }}
              >
                Done
              </button>
            </div>
          </Grid>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default WhoCanJoinSession;
