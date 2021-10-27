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



  return (
    <>
      <div className="sessions-heading-and-search-box-wrapper-grid d-flex flex-row mb-5">
        <div className="col-3"></div>
        <div className="sessions-and-networking-body-heading col-6">
          Select Session to enter
        </div>
        <div className="col-3">
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
