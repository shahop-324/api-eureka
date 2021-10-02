import React, { useState, useEffect } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import TeamMembersListFields from "./HelperComponent/TeamMembersListFields";
import TeamMembersDetailsCard from "./HelperComponent/TeamMembersDetailsCard";
import HowManyMembersCanBeAddedMsg from "./HelperComponent/HowManyMembersCanbeAddedMsg";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded"; // Members Icon
import LabelRoundedIcon from "@mui/icons-material/LabelRounded"; // Roles Icon

import styled from "styled-components";
import AddNewMember from "./FormComponents/AddNewMember";
import AddNewRole from "./FormComponents/AddNewRole";
import RolesListFields from "./HelperComponent/RolesListFields";
import RoleDetailsCard from "./HelperComponent/RoleDetailsCard";
import CreateNewRole from "./FormComponents/CreateNewRole";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingInvitations,
  fetchCommunityManagers,
} from "./../../actions";
import { useParams } from "react-router-dom";
import NoContentFound from "../NoContent";

import NoRoles from "./../../assets/images/NoRoles.png";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const SwitchTab = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  font-family: "Ubuntu";
  color: ${(props) => (props && props.active ? "#272727" : "#575757")};
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
  border-bottom: ${(props) =>
    props && props.active ? "3px solid #538BF7" : "3px solid transparent"};
  width: fit-content;

  &:hover {
    color: #272727;
    cursor: pointer;
  }
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

const renderTeamRoles = (roles) => {
  return roles.map((role) => {
    return (
      <RoleDetailsCard
        key={role.id}
        id={role.id}
        assignedTo={role.assignedTo}
        title={role.title}
        lastUpdatedByName={
          role.lastUpdatedBy.firstName + " " + role.lastUpdatedBy.lastName
        }
        lastUpdatedByImage={
          role.lastUpdatedBy.image.startsWith("https://")
            ? role.lastUpdatedBy.image
            : `https://bluemeet.s3.us-west-1.amazonaws.com/${role.lastUpdatedBy.image}`
        }
        lastUpdatedAt={role.lastUpdatedAt}
      />
    );
  });
};

const renderInvitedPeople = (persons) => {
  return persons.map((person) => {
    return (
      <TeamMembersDetailsCard
        id={person.id}
        email={person.invitedUserEmail}
        status={"Pending"}
        position={"Community Manager"}
        name={person.existingUserName}
        image={person.existingUserImage}
      />
    );
  });
};

const renderCommunityManagers = (persons) => {
  return persons.map((person) => {
    return (
      <TeamMembersDetailsCard
        id={person.id}
        name={person.firstName + " " + person.lastName}
        status={"Accepted"}
        position={"Community Manager"}
        email={person.email}
        image={person.image}
      />
    );
  });
};

const TeamManagement = (props) => {
  const params = useParams();

  const { invitations, communityManagers } = useSelector(
    (state) => state.community
  );

  const { superAdminName, superAdminEmail, superAdminImage } = useSelector(
    (state) => state.community.communityDetails
  );

  const communityId = params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch invited members of this community who have status pending
    dispatch(fetchPendingInvitations(communityId));

    // Fetch People who have accepted invitation
    dispatch(fetchCommunityManagers(communityId));
  }, []);

  const [activeTab, setActiveTab] = useState("members");

  const [openAddNewMember, setOpenAddNewMember] = React.useState(false);

  const [openCreateNewRole, setOpenCreateNewRole] = React.useState(false);

  const classes = useStyles();

  const handleOpenCreateNewRole = () => {
    setOpenCreateNewRole(true);
  };

  const handleCloseCreateNewRole = () => {
    setOpenCreateNewRole(false);
  };

  const handleAddNewMember = () => {
    setOpenAddNewMember(true);
  };

  const handleCloseAddNewMember = () => {
    setOpenAddNewMember(false);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <SectionHeading className="">Team Management</SectionHeading>
          <div className="sec-heading-action-button d-flex flex-row">
            

            {(() => {
              switch (activeTab) {
                case "members":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text ms-3"
                      onClick={handleAddNewMember}
                    >
                      Add New Member
                    </button>
                  );

                case "roles":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text ms-3"
                      onClick={handleOpenCreateNewRole}
                    >
                      Add New Role
                    </button>
                  );
                default:
                  break;
              }
            })()}
          </div>
        </div>

        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          {(() => {
            switch (activeTab) {
              case "members":
                return (
                  <>
                    <TeamMembersListFields />
                    <div
                      className="divider-wrapper"
                      style={{ margin: "1.2% 0" }}
                    >
                      <Divider />
                    </div>
                    <TeamMembersDetailsCard
                      image={superAdminImage}
                      name={superAdminName}
                      position={"Super admin"}
                      email={superAdminEmail}
                      status={"----"}
                    />

                    {renderCommunityManagers(communityManagers)}

                    {renderInvitedPeople(invitations)}
                  </>
                );

              default:
                break;
            }
          })()}
        </div>
      </div>

      <AddNewMember
        open={openAddNewMember}
        handleClose={handleCloseAddNewMember}
      />
      <CreateNewRole
        open={openCreateNewRole}
        handleClose={handleCloseCreateNewRole}
      />
    </>
  );
};

export default TeamManagement;
