import React, { useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import { Dropdown } from "semantic-ui-react";
import ScheduleGroupMeeting from "./Sub/ScheduleGroupMeeting";
import MyMeetingsFilter from "./Sub/MyMeetingsFilter";

import styled from "styled-components";
import MyMeetingCard from "./Sub/MyMeetingCard";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    color: "#ffffff",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    color: "#ffffff",
    backgroundColor: alpha(theme.palette.common.black, 0.22),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
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

const ButtonFilledDark = styled.div`
  align-self: center;
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  background-color: #152d35;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    color: #152d35;
    background-color: transparent;
    cursor: pointer;
  }
`;

const MyMeetings = () => {
  const [open, setOpen] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const classes = useStyles();

  return (
    <>
      <div className="session-btn-and-filter-search-wrapper d-flex flex-row justify-content-between mb-5">
        <div className="search-box-and-filter-icon-btn-w d-flex flex-row">
          <Dropdown
            icon="filter"
            floating
            button
            className="icon"
            onClick={() => {
              setOpenFilter(true);
            }}
          ></Dropdown>
          <div className={classes.search}>
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
            />
          </div>
        </div>

        <div className="all-and-my-sessions-w d-flex flex-row align-items-center">
          {/* <button
            onClick={() => {
              handleOpen();
            }}
            className="btn btn-primary btn-outline-text me-4"
          >
            Create New Meet
          </button> */}
          <ButtonFilledDark
            onClick={() => {
              handleOpen();
            }}
          >
            Create new meet
          </ButtonFilledDark>
        </div>
      </div>

{/* // ! Show this when no meetings are scheduled */}

      {/* <div
        style={{ width: "300px", marginLeft: "auto", marginRight: "auto" }}
        className="my-5"
      >
        <NoMeetingsFoundMsg className="mb-3">No scheduleded meetings found</NoMeetingsFoundMsg>

        <div>
          <ButtonOutlinedDark
            onClick={() => {
              handleOpen();
            }}
          >
            Create new meet
          </ButtonOutlinedDark>
        </div>
      </div> */}

      {/* // ! Show this when meetings are scheduled */}

      <MyMeetingCard />

      <ScheduleGroupMeeting
        openDrawer={open}
        handleCloseDrawer={handleCloseDrawer}
      />

      <MyMeetingsFilter open={openFilter} handleClose={handleCloseFilter} />
    </>
  );
};

export default MyMeetings;
