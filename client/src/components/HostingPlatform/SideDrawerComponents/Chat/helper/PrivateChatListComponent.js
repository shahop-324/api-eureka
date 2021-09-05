import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import PeopleList from "./PeopleList";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const PrivateChatListComponent = () => {
  const [openPeopleList, setOpenPeopleList] = useState(false);

  const handleClosePeopleList = () => {
    setOpenPeopleList(false);
  };

  const classes = useStyles();
  return (
    <>
      <div className="chat-msg-container pt-2 px-2 d-flex flex-column justify-content-between">
        <div>
          <div class="ui icon input" style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="Search people..."
              className="form-control"
            />
            <i class="search icon"></i>
          </div>
        </div>
        <div
          className={classes.root}
          style={{ textAlign: "end" }}
          onClick={() => {
            setOpenPeopleList(true);
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            style={{ backgroundColor: "#538BF7" }}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>

      <PeopleList open={openPeopleList} handleClose={handleClosePeopleList}/>
    </>
  );
};

export default PrivateChatListComponent;
