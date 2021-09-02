import React from "react";
import Avatar from "@material-ui/core/Avatar";

import { useDispatch, useSelector } from "react-redux";

import CreateNewCommunityForm from "./Forms/CreateNewCommunityForm";
import {
  communitySignIn,
  errorTrackerForCommunitySignIn,
  errorTrackerForPersonalData,
} from "../../actions";
import Loader from "../Loader";
import CreateNewCommunityMsgCard from "./CreateNewCommunityMsgCard";
import maleMascot from "./../../assets/images/winkingPerson.png";
import { useSnackbar } from "notistack";

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
    <div
      className="user-community-tab px-4 py-2 mb-3"
      onClick={onClickCommunityTab}
    >
      <Avatar
        alt={props.name}
        variant="rounded"
        src={props.communityImage}
        style={{ alignSelf: "center" }}
      />
      <div className="d-flex flex-column justify-content-center align-items-left ms-3">
        <div
          className="community-profile-name mb-1"
          style={{ fontSize: "0.9rem" }}
        >
          {props.name}
        </div>
      </div>
    </div>
  );
};

class UserProfileTab extends React.Component {
  render() {
    const { name, email, imageURL } = this.props;
    console.log(name, email);

    return (
      <div className="user-profile-tab px-4 py-2 mb-4">
        <Avatar
          alt={name}
          variant="rounded"
          src={imageURL}
          style={{ alignSelf: "center" }}
        />
        <div className="d-flex flex-column justify-content-between align-items-left ms-3">
          <div className="user-profile-name mb-1" style={{ fontSize: "1rem" }}>
            {name}
          </div>
          <div className="user-profile-email">{email}</div>
        </div>
      </div>
    );
  }
}

const UserAccountSideNav = () => {
  const { isLoading, error } = useSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

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

    // dispatch(errorTrackerForPersonalData());
    // alert(error);
    // return;
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
            communityId={community.id}
            key={community.id}
            communityImage={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${community.image}`}
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
      userImageURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;
    }
  }

  return (
    <div className="user-account-side-nav-bar">
      <UserProfileTab name={name} email={email} imageURL={userImageURL} />

      <div className="user-community-tab-section">
        <div className="user-community-tab-headline px-4 mb-3">Communities</div>
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
            <button
              className="btn btn-outline-text  btn-outline-primary  py-2"
              onClick={handleClickOpen}
            >
              Create New Community
            </button>
            <CreateNewCommunityForm closeHandler={handleClose} open={open} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserAccountSideNav;
