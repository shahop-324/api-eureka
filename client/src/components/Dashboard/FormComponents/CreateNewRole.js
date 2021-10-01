import React from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Divider from "@material-ui/core/Divider";

const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.3rem;
  color: #212121;
`;
const SubHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #212121;
`;

const FormLabel = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #494949;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateNewRole = ({ open, handleClose }) => {
  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#538BF7" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create New Role
            </Typography>
            <button
              onClick={() => {
                // setOpenPreview(true)
              }}
              className="btn btn-light btn-outline-text me-3"
            >
              <span> Create role </span>
            </button>
          </Toolbar>
        </AppBar>
        <div className="container py-4">
          <Heading className="mb-5">Role information</Heading>

          <div className="mb-4">
            <FormLabel className="mb-1">Role Title</FormLabel>
            <input
              type="text"
              placeholder="Give this role a suitable title"
              className="form-control"
            ></input>
          </div>
          <SubHeading className="mb-4">Permissions</SubHeading>
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Create new event"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add new members"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remove members (except super admin)"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Edit event basic details (Name, Timeline, Timezone, Visibility, tags)."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Edit event description."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Start event"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="End event"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Publish event"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit agenda"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit speakers"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit booths"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit sponsors"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit tickets"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit coupons"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add & edit affiliates"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage google analytics and facebook pixel settings."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add attendees via CSV or manually"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set up event entry rules."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set up event registration form."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set up reception."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage venue customisation."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage stage vibes."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Edit Community profile."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage access to various activities in agenda."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage stripe payout"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage billing."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Add videos to library."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="View and download various reports."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set up integrations."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Manage session recordings."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Send Mails to Attendees."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Send Mails to Speakers."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Send Mails to Exhibitors."
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Customize tables at venue"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Customize booths at venue"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set up live stream."
            />
          </FormGroup>
        </div>
      </Dialog>
    </>
  );
};

export default CreateNewRole;
