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

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
};

function BasicPagination({ numOfPages, limit, handlePageChange }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/* <Pagination count={10} /> */}
      <Pagination
        count={10}
        color="primary"
        onChange={(event, page) => {
          handlePageChange(page);
        }}
      />
      {/* <Pagination count={10} color="secondary" />
      <Pagination count={10} disabled /> */}
    </div>
  );
}

export default function CustomPagination({
  numOfPages,
  currentPage,
  limit,
  totalResults,
  handleLimitChange,
  handlePageChange,

  options,
}) {
  const classes = useStyles();
  return (
    <div className="pagination-row px-4 my-3 d-flex justify-content-between align-items-center pb-4">
      <div
        className="showing-n-per-page-wrapper d-flex flex-row align-items-center"
        style={{ minWidth: "245px" }}
      >
        <div className={`${classes.showingText} me-3`}>Showing</div>
        <div style={{ width: "40%" }}>
          <Select
          styles={styles}
            menuPlacement="top"
            options={options}
            defaultValue={{
              value: limit,
              label: limit,
            }}
            onChange={(e) => {
              handleLimitChange(e);
            }}
          />
        </div>
        <div className={`${classes.showingText} ms-3`}>of {totalResults}</div>
      </div>
      <div className="basic-pagination-wrapper d-flex flex-row align-items-center">
        <BasicPagination
          numOfPages={numOfPages}
          limit={limit}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
