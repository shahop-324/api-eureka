import React, { useEffect, useState } from "react";
import "./../Styles/root.scss";
import "./../Styles/sessions.scss";
import SessionDetailCardsList from "../HelperComponents/SessionDetailCardsList";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  errorTrackerForFetchSessionsForUser,
  fetchSessionsForUser,
} from "../../../actions";

import socket from "./../service/socket";
import Loader from "../../Loader";
import { Dropdown } from "semantic-ui-react";
import SessionsFilter from "./Sub/SessionsFilter";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

import Chip from "@mui/material/Chip";
import Select from "react-select";
import Stack from "@mui/material/Stack";

const Search = styled("div")(({ theme }) => ({
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
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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

const Sessions = () => {
  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const { error, isLoading } = useSelector((state) => state.session);

  const role = useSelector((state) => state.eventAccessToken.role);
  const id = useSelector((state) => state.eventAccessToken.id);

  const sessions = useSelector((state) => state.session.sessions);

  const params = useParams();

  const eventId = params.eventId;
  const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchSessionsForUser(eventId));
  }, [dispatch, eventId]);

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

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  const handleCancel = (event, picker) => {
    picker.element.val("");
    // search_params.delete("startDate");
    // search_params.delete("endDate");
    // url.search = search_params.toString();
    // let new_url = url.toString();
    // const len = new_url.split("?")[0].length;

    // const result = new_url.substring(len);
    // if (result === "") {
    //   history.push("/search-events/");
    // } else {
    //   history.push(result);
    // }
  };

  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY/MM/DD") +
        " - " +
        picker.endDate.format("YYYY/MM/DD")
    );
    const dateRange = event.target.value;

    const dateArray = dateRange.split("-");
    // search_params.set("startDate", dateArray[0]);
    // search_params.set("endDate", dateArray[1]);
    // url.search = search_params.toString();
    // let new_url = url.toString();
    // const len = new_url.split("?")[0].length;

    // const result = new_url.substring(len);

    // if (result === "") {
    //   history.push("/search-events/");
    // } else {
    //   history.push(result);
    // }
  };

  return (
    <>
      <div className="sessions-heading-and-search-box-wrapper-grid d-flex flex-row mb-5">
        <div className="col-8">
          <div className="schedule-filter-grid">
            <Select options={[]} placeholder="Speakers" />{" "}
            <Select options={[]} placeholder="tracks" />
            <Chip
              style={{ width: "fit-content", justifySelf: "end" }}
              label="Clear filters"
              variant="outlined"
              onClick={handleClick}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className="col-4 ms-4">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </div>
      </div>

      <Stack direction="row" spacing={1} className="mb-4">
        <Chip label="Clickable" onClick={handleClick} />
        <Chip label="Clickable" variant="outlined" onClick={handleClick} />
        <Chip label="Clickable" variant="outlined" onClick={handleClick} />
        <Chip label="Clickable" variant="outlined" onClick={handleClick} />
        <Chip label="Clickable" variant="outlined" onClick={handleClick} />
        <Chip label="Clickable" variant="outlined" onClick={handleClick} />
      </Stack>

      <SessionDetailCardsList
        sessions={sessions}
        socket={socket}
        id={id}
        role={role}
        eventId={eventId}
        communityId={communityId}
      />

      <SessionsFilter open={openFilter} handleClose={handleCloseFilter} />
    </>
  );
};

export default Sessions;
