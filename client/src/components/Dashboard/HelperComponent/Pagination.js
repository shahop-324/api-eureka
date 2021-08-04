import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
  showingText: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "0.9rem",
    lineHeight: "1rem",
    /* identical to box height, or 129% */

    color: "#757575",
  },
}));

const options = [
  { value: "6", label: "6" },
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

function BasicPagination() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/* <Pagination count={10} /> */}
      <Pagination count={10} color="primary" />
      {/* <Pagination count={10} color="secondary" />
      <Pagination count={10} disabled /> */}
    </div>
  );
}

export default function CustomPagination() {
  const classes = useStyles();
  return (
    <div className="pagination-row px-4 my-3 d-flex justify-content-between align-items-center">
      <div
        className="showing-n-per-page-wrapper d-flex flex-row align-items-center"
        style={{ minWidth: "245px" }}
      >
        <div className={`${classes.showingText} me-3`}>Showing</div>
        <div style={{ width: "40%" }}>
          <Select
            menuPlacement="top"
            options={options}
            defaultValue={options[1]}
          />
        </div>
        <div className={`${classes.showingText} ms-3`}>of 350</div>
      </div>
      <div className="basic-pagination-wrapper d-flex flex-row align-items-center">
        <BasicPagination />
      </div>
    </div>
  );
}
