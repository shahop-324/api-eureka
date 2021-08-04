import React from "react";
import "./../../../assets/Sass/TopNav.scss";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsIcon from "@material-ui/icons/Settings";
import AvatarMenu from "./../../AvatarMenu";
// import Avatar from '@material-ui/core/Avatar';
// import Faker from 'faker';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const Topnav = () => {
  const classes = useStyles();
  return (
    <div className="row topnav-container px-3">
      <div className="col-6 left">
        <div className="brand-logo-text">
          Evenz <span>Communities</span>
        </div>
      </div>
      <div className="col-6 right">
        <div className="icon-and-avatar-menu-wrapper d-flex flex-row align-items-center">
          <div className={`${classes.root} mx-2`}>
            <div
              className="btn-outline-text px-2 py-2 whats-new-button"
              style={{
                backgroundColor: "#C7C7C72D",
                borderRadius: "5px",
                fontSize: "13px",
              }}
            >
              What's New
            </div>
          </div>
          <div className={`${classes.root} mx-2`}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsNoneIcon />
            </Badge>
          </div>

          <div className={`${classes.root} mx-2`}>
            <SettingsIcon />
          </div>
          <div className="dashboard-avatar-menu mx-2 d-flex flex-row align-items-center">
            <AvatarMenu />
            {/* <Avatar alt="Travis Howard" src={Faker.image.avatar()} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
