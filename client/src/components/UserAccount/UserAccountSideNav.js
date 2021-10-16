/* eslint-disable no-unused-vars */
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";
import BluemeetLOGO from "./../../assets/Logo/Bluemeet_LOGO_official.svg";

import { useDispatch, useSelector } from "react-redux";

import CreateNewCommunityForm from "./Forms/CreateNewCommunityForm";
import { communitySignIn, errorTrackerForCommunitySignIn } from "../../actions";
import Loader from "../Loader";
import CreateNewCommunityMsgCard from "./CreateNewCommunityMsgCard";
import maleMascot from "./../../assets/images/winkingPerson.png";
import { useSnackbar } from "notistack";

const SideNavPaper = styled.div`
  width: 100%;
  background-color: #f5f5f596;
`;

const BtnOutlinedWithIcon = styled.div`
  border: 1px solid #152d35;
  color: #152d35;
  padding: 8px 16px;
  border-radius: 10px;

  font-size: 0.8rem;
  font-family: "Ubuntu";
  font-weight: 500;

  &:hover {
    background-color: #152d35;
    color: #dcc7be;
    cursor: pointer;
  }
`;

const ProfileTabPaper = styled.div`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0px 3px 0 #152d353f;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const CommunitiesHeading = styled.div`
  font-size: 0.9rem;
  font-family: "Ubuntu";
  font-weight: 500;
  color: #152d35;
  letter-spacing: 0.15px;
`;
const CommunityTabPaper = styled.div`
  background-color: transparent;
  border-radius: 10px;
  border: 1px solid transparent;

  color: #152d35 !important;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: capitalize;
  display: grid;
  grid-template-columns: 1fr 3fr;

  &:hover {
    color: #152d35 !important;
    cursor: pointer;

    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0px 6px 0 #152d353f;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
`;

const ProfileName = styled.div`
  color: #152d35 !important;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const ProfileEmail = styled.div`
  color: #152d35 !important;
  font-family: "Ubuntu";
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: none;
`;

const CommunityProfileTab = (props) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { error, isCommunityLoading } = useSelector((state) => state.community);

  const { id } = useSelector((state) => state.user.userDetails);

  const userId = id;
  const onClickCommunityTab = () => {
    // dispatch(fetchCommunity(props.communityId));
    dispatch(communitySignIn(props.communityId, userId));
  };

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });
    return dispatch(errorTrackerForCommunitySignIn());
  }

  return (
    <CommunityTabPaper
      className="px-4 py-2 mb-3 mx-2"
      onClick={onClickCommunityTab}
    >
      <Avatar
        alt={props.name}
        variant="rounded"
        src={props.communityImage}
        style={{ alignSelf: "center" }}
      />
      <div className="d-flex flex-column justify-content-center align-items-left ms-3">
        <div className="mb-1">{props.name}</div>
      </div>
    </CommunityTabPaper>
  );
};

class UserProfileTab extends React.Component {
  render() {
    const { name, email, imageURL } = this.props;
    console.log(name, email);

    return (
      <ProfileTabPaper className="user-profile-tab px-4 py-2 mb-4 mx-2">
        <Avatar
          alt={name}
          variant="rounded"
          src={imageURL}
          style={{ alignSelf: "center" }}
        />
        <div className="d-flex flex-column justify-content-between align-items-left ms-3">
          <ProfileName className="mb-1">{name}</ProfileName>
          <ProfileEmail>{email}</ProfileEmail>
        </div>
      </ProfileTabPaper>
    );
  }
}

const UserAccountSideNav = () => {
  const { isLoading, error } = useSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);

  const { isCommunityLoading } = useSelector((state) => state.community);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { communities } = useSelector((state) => state.community);
  const { userDetails } = useSelector((state) => state.user);
  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ width: "100%", height: "100vh" }}
      >
        {" "}
        <Loader />{" "}
      </div>
    );
  }
  if (error) {
    throw new Error(error);
  }

  const { firstName, lastName, email, image } = userDetails;

  const name = `${firstName} ${lastName}`;

  const renderCommunitiesList = (communities) => {
    if (communities) {
      return communities.map((community) => {
        console.log(community);
        return (
          <CommunityProfileTab
            name={community.name}
            // TODO ALLOW COMMUNITY TO UPLOAD AND EDIT ITS LOGO
            communityId={community._id}
            key={community._id}
            communityImage={`https://bluemeet.s3.us-west-1.amazonaws.com/${community.image}`}
          />
        );
      });
    }
  };

  let userImageURL;

  if (image) {
    if (image.startsWith("https://")) {
      userImageURL = image;
    } else {
      userImageURL = `https://bluemeet.s3.us-west-1.amazonaws.com/${image}`;
    }
  }

  return (
    <SideNavPaper>
      <div className="px-3 py-2 mb-4 mt-3">
        <img
          src={BluemeetLOGO}
          alt="bluemeet logo"
          style={{ width: "120px" }}
        />
      </div>

      <UserProfileTab name={name} email={email} imageURL={userImageURL} />

      <div className="user-community-tab-section">
        <CommunitiesHeading className="user-community-tab-headline px-4 mb-3">
          Communities
        </CommunitiesHeading>
        <div
          className="user-community-tab-list mb-4"
          style={{ overflow: "auto", height: "77vh" }}
        >
          {isCommunityLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ width: "100%", height: "auto" }}
            >
              {" "}
              <Loader />{" "}
            </div>
          ) : typeof communities !== "undefined" && communities.length > 0 ? (
            renderCommunitiesList(communities)
          ) : (
            <CreateNewCommunityMsgCard
              msgText="Start by creating your community"
              img={maleMascot}
            />
          )}
          <div className="create-new-community-sidebar-btn d-flex flex-row justify-content-center my-4">
            <BtnOutlinedWithIcon className="py-2" onClick={handleClickOpen}>
              Create New Community
            </BtnOutlinedWithIcon>

            <CreateNewCommunityForm closeHandler={handleClose} open={open} />
          </div>
        </div>
      </div>
    </SideNavPaper>
  );
};
export default UserAccountSideNav;
