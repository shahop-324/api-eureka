import React from "react";
import styled from "styled-components";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Dialog, IconButton } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const CreatePollContainer = styled.div`
  height: auto; // Make it auto
  width: 480px;
  background-color: #ffffff;
`;

const Header = styled.div`
  background-color: #46525c;
`;

const CreatePollHeading = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #ebebeb;
`;

const Label = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #152d3f;
`;

const StyledInput = styled.input`
  border: 1px solid #212121;
`;

const AddMoreButton = styled.button`
  border: 1px dashed #152d35 !important;
  color: #152d35 !important;
  width: 100%;

  &:hover {
    color: #ffffff !important;
    background-color: #152d35 !important;
  }
`;

const CreateButton = styled.button`
  background-color: #152d35 !important;
  color: #ffffff !important;
  width: 100%;
  border: 1px solid #152d35 !important;
`

const CreatePoll = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <CreatePollContainer>
          <Header className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
            <CreatePollHeading>Create poll</CreatePollHeading>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CancelRoundedIcon
                style={{ color: "#EBEBEB" }}
              ></CancelRoundedIcon>
            </IconButton>
          </Header>

          <div className="px-4 py-3">
            <div className="form-group mb-4">
              <Label className="mb-2">Question</Label>

              <StyledInput
                className="form-control px-3 py-2"
                type="text"
                placeholder="How much do you like this platform?"
              ></StyledInput>
            </div>

            <div className="form-group mb-3">
              <Label className="mb-2">Option 1</Label>

              <StyledInput
                className="form-control px-3 py-2"
                type="text"
                placeholder="It's awesome"
              ></StyledInput>
            </div>
            <div className="form-group mb-3">
              <Label className="mb-2">Option 2</Label>

              <StyledInput
                className="form-control px-3 py-2"
                type="text"
                placeholder="I would recommend to all my connections"
              ></StyledInput>
            </div>
            <div className="form-group mb-3">
              <Label className="mb-2">Option 3</Label>

              <div className="d-flex flex-row align-items-center justify-content-between mb-4">
                <StyledInput
                  style={{ width: "86%" }}
                  className="form-control px-3 py-2"
                  type="text"
                  placeholder="Its potential is great"
                ></StyledInput>
                <IconButton>
                  <DeleteRoundedIcon />
                </IconButton>
              </div>

              <AddMoreButton className="btn btn-outline-text btn-outline-primary mb-4">
                {" "}
                <AddCircleOutlineRoundedIcon className="me-3" />{" "}
                <span> Add option </span>
              </AddMoreButton>

              <div className="form-group mb-4">
                <Label className="mb-2">Time limit (in min)</Label>

                <StyledInput
                  className="form-control px-3 py-2"
                  type="number"
                  min="2"
                  placeholder="5"
                ></StyledInput>
              </div>

              <CreateButton style={{width: "100%"}} className="btn btn-outline-text btn-primary">Create poll</CreateButton>
            </div>
          </div>
        </CreatePollContainer>
      </Dialog>
    </>
  );
};

export default CreatePoll;
