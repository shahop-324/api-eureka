import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Faker from "faker";
import "./../index.css";
import "./../assets/css/style.css";
import "./../assets/css/UserAccountStyle.css";
import "./../assets/css/CardStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../actions/index";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const AvatarMenu = ()  => {
  const {image} = useSelector((state) => state.user.userDetails);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const dispatch = useDispatch();
  const onClickLoggedOut = () => {
    dispatch(signOut());
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const imgURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;

  return (
    <div className={classes.root}>
      <div>
        <Button
          style={{ padding: "0" }}
          ref={anchorRef}
          disableRipple={true}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="false"
          onClick={handleToggle}
          disableElevation={true}
        >
          <div className="avatar-menu-h-wrapper d-flex flex-row me-3 ms-3 align-items-center ps-3 py-2">
            <Avatar
              variant="rounded"
              alt="Travis Howard"
              src={imgURL}
            />
            <ExpandMoreIcon className="mx-3" />
          </div>
        </Button>

        <Popper
          style={{ zIndex: 10000, textAlign: "center", marginTop: "20px" }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    style={{ alignItems: "center", justifyItems: "center" }}
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <div className="avatar-menu-group-heading px-3 pb-3 mt-2">
                      Account
                    </div>
                    <MenuItem onClick={handleClose}>
                      <div className="avatar-menu-account-section-btns mb-2">
                        Profile
                      </div>
                    </MenuItem>

                    <hr />
                    <div className="avatar-menu-group-heading px-3 pb-2">
                      Switch to A Community
                    </div>
                    <MenuItem onClick={handleClose}>
                      <div className="avatar-menu-community-tab d-flex flex-row align-items-center">
                        <Avatar
                          className={`me-4`}
                          variant="rounded"
                          alt="Travis Howard"
                          src={Faker.image.avatar()}
                        />
                        <div className="avatar-menu-community-name">Github</div>
                      </div>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <div className="avatar-menu-community-tab d-flex flex-row align-items-center">
                        <Avatar
                          className={`me-4`}
                          variant="rounded"
                          alt="Travis Howard"
                          src={Faker.image.avatar()}
                        />
                        <div className="avatar-menu-community-name">
                          Microsoft
                        </div>
                      </div>
                    </MenuItem>
                    <hr className="px-2" />
                    <button
                      onClick={onClickLoggedOut}
                      className="btn btn-outline-primary btn-outline-text"
                    >
                      Sign Out
                    </button>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}


export default AvatarMenu;