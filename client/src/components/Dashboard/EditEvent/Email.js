import React from "react";
import styled from "styled-components";
import { makeStyles, alpha } from "@material-ui/core";

import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import EmailListFields from "./GridComponents/Email/ListFields";
import EmailDetailsCard from "./GridComponents/Email/DetailsCard";
import CreateMail from "./SubComponent/CreateEmail";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const TextSmall = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #585858;
  font-size: 0.75rem;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Email = () => {
  const classes = useStyles();

  const [openCreateMail, setOpenCreateMail] = React.useState(false);

  const handleOpenCreateMail = () => {
    setOpenCreateMail(true);
  };

  const handleCloseCreateMail = () => {
    setOpenCreateMail(false);
  };

  return (
    <>
      <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4">
        <SectionHeading className="mb-2">Email</SectionHeading>

        <div className="drop-selector d-flex flex-row justify-content-end">
          <div
            className={`${classes.search} me-3`}
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              // onChange={(e) => setTerm(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary btn-outline-text"
            onClick={handleOpenCreateMail}
          >
            {/*  Mail icon here */}
            <MailOutlineOutlinedIcon
              className="me-2"
              style={{ color: "#ffffff", fontSize: "20px" }}
            />
            Create Mail
          </button>
        </div>
      </div>
      <TextSmall className="px-4 pt-2 mb-4">
        Create personalised emails and messages for your attendees at any stage
        of your event.
      </TextSmall>

      <div className="session-content-grid px-3 mb-4">
        <div className="basic-form-left-white px-4 py-4">
          <EmailListFields />
          <EmailDetailsCard />
          <EmailDetailsCard />
          <EmailDetailsCard />
        </div>
      </div>
      <CreateMail open={openCreateMail} handleClose={handleCloseCreateMail} />
    </>
  );
};

export default Email;
