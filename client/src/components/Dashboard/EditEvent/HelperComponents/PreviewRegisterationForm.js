import React from "react";
import styled from "styled-components";
import { SwipeableDrawer, IconButton, Avatar } from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

const Paper = styled.div`
  width: 868px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const FormLabel = styled.label`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.78rem;
  color: #363636;
`;

const StyledInput = styled.input`
  font-family: "Ubuntu" !important;
  font-weight: 500 !important;
  font-size: 0.82rem !important;
  color: #4b4b4b !important;

  &:hover {
    border: 1px solid #538bf7;
  }
`;

const AttendeeCard = styled.div`
  border-radius: 10px;
  padding: 20px;
  background-color: #2C2C2C;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AttendeeName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.87rem;
  color: #ffffff;
`;

const PreviewRegistrationForm = ({ open, handleClose }) => {
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
            <div className="form-heading-and-close-button mb-4 d-flex flex-row  justify-content-between">
              <div>
                <div className="coupon-overlay-form-headline mb-2">Preview</div>

                <TextSmall className="mb-3">
                  {" "}
                  Note: Email address of the participant is collected by
                  default.
                </TextSmall>
                <TextSmall>
                  {" "}
                  Participant will have to fill up the following form.
                </TextSmall>
              </div>
              <div className="overlay-form-close-button" onClick={handleClose}>
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <Grid>
              <form>
                <div class="form-group mb-4">
                  <FormLabel for="exampleInputEmail1" className="mb-1">
                    Name
                  </FormLabel>
                  <StyledInput
                    disabled={true}
                    type="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter name"
                  />
                </div>
                <div class="form-group mb-4">
                  <FormLabel for="exampleInputEmail1" className="mb-1">
                    Organisation
                  </FormLabel>
                  <StyledInput
                    disabled={true}
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter organisation"
                  />
                </div>
                <div class="form-group mb-4">
                  <FormLabel for="exampleInputEmail1" className="mb-1">
                    Designation
                  </FormLabel>
                  <StyledInput
                    disabled={true}
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter designation"
                  />
                </div>
                <div class="form-group mb-4">
                  <FormLabel for="exampleInputEmail1" className="mb-1">
                    City
                  </FormLabel>
                  <StyledInput
                    disabled={true}
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter city"
                  />
                </div>
                <div class="form-group mb-4">
                  <FormLabel for="exampleInputEmail1" className="mb-1">
                    Country
                  </FormLabel>
                  <StyledInput
                    disabled={true}
                    type="text"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter country"
                  />
                </div>

                <button
                  className="btn btn-primary btn-outline-text disabled"
                  style={{ width: "100%" }}
                >
                  Proceed to checkout
                </button>
              </form>

              <div className="p-5">
                <div className="coupon-overlay-form-headline mb-3">
                  Attendee Card
                </div>
                <TextSmall className="mb-4">
                  People in the event will see <br /> attendee info as below.
                </TextSmall>

                <AttendeeCard>
                  <Avatar src={null} variant="rounded" className="me-3" />
                  <div>
                    <AttendeeName className="mb-1">Attendee Name</AttendeeName>
                    <TextSmall className="mb-1">
                      Designation, Organisation
                    </TextSmall>
                    <TextSmall>City, Country</TextSmall>
                  </div>
                </AttendeeCard>
              </div>
            </Grid>
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default PreviewRegistrationForm;
