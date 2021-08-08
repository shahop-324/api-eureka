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
import "./../index.css";
import "./../assets/css/style.css";
import "./../assets/css/UserAccountStyle.css";
import "./../assets/css/CardStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { navigationIndex, signOut } from "../actions/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import history from "../history";
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

const AvatarMenu = () => {
  const user = useSelector((state) => state.user);
  const isLoading = user.isLoading;
  const error = user.error;

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
  const onClickLoggedOut = async () => {
    // while (window.localStorage.length !== 0) {
    //   window.localStorage.clear();
    // }
    window.localStorage.clear();
    // if (window.localStorage.length === 0) {
    //   dispatch(signOut());
    // }
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

  if (isLoading) {
    return (
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }
  if (error) {
    return alert(error);
  }
  const image = user.userDetails.image;

  const communities = user.userDetails.communities;
  const imgURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;

  const renderCommunities = (communities, handleClose) => {
    return communities.map((community) => {
      return (
        <div
          className="px-3 me-2 menulist-community-tab"
          style={{ width: "100%" }}
          onClick={() => {
            history.push(
              `/user/${user.userDetails._id}/community/overview/${community._id}`
            );
          }}
        >
          <div className="avatar-menu-community-tab d-flex flex-row align-items-center">
            <Avatar
              className={`me-4`}
              variant="rounded"
              alt={community.name}
              src={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${community.image}`}
            />
            <div className="avatar-menu-community-name">{community.name}</div>
          </div>
        </div>
      );
    });
  };

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
            <Avatar variant="rounded" alt="Travis Howard" src={imgURL} />
            <ExpandMoreIcon className="mx-3" />
          </div>
        </Button>

        <Popper
          style={{
            zIndex: 10000,
            textAlign: "center",
            marginTop: "20px",
            maxWidth: "250px",
            marginRight: "2.5rem",
          }}
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
                    <MenuItem
                      onClick={(event) => {
                        dispatch(navigationIndex(0));
                        history.push("/user/home");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Home
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        dispatch(navigationIndex(3));
                        history.push("/user/profile");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Profile
                      </div>
                    </MenuItem>

                    <MenuItem
                      onClick={(event) => {
                        // dispatch(navigationIndex(3));
                        history.push("/search-events");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Explore Events
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        // dispatch(navigationIndex(3));
                        // history.push('/user/profile');
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Announcements
                      </div>
                    </MenuItem>

                    <hr />
                    <div className="avatar-menu-group-heading px-3 pb-2">
                      Switch to A Community ({communities.length})
                    </div>
                    <div
                      className="communities-list-error"
                      style={{ maxHeight: "200px", overflow: "scroll" }}
                    >
                      {renderCommunities(communities, handleClose)}
                    </div>

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
};

export default AvatarMenu;
