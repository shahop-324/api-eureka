import React from "react";
import Avatar from "@material-ui/core/Avatar";

import { useDispatch, useSelector } from "react-redux";

import CreateNewCommunityForm from "./Forms/CreateNewCommunityForm";
import { communitySignIn } from "../../actions";

const CommunityProfileTab = (props) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user.userDetails);

  const userId = id;
  const onClickCommunityTab = () => {
    dispatch(communitySignIn(props.communityId, userId));
  };

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
          style={{ fontSize: "1rem" }}
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
          alt="shreyansh shah"
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

  //use open to rerender
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
      <section>
        <p>Loading...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section>
        <p>{error}</p>
      </section>
    );
  }
  // const dispatch = useDispatch();

  const { firstName, lastName, email, image } = userDetails;

  const name = `${firstName} ${lastName}`;
  // const redirectToCommunity = (id) => {
  //   dispatch(communitySignIn(id));
  // };

  // onClick={redirectToCommunity(community.communityId.id)}
  const renderCommunitiesList = () => {
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

  const userImageURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;

  return (
    <div className="user-account-side-nav-bar">
      <UserProfileTab name={name} email={email} imageURL={userImageURL} />

      <div className="user-community-tab-section">
        <div className="user-community-tab-headline px-4 mb-3">Communities</div>
        <div
          className="user-community-tab-list mb-4"
          style={{ overflow: "auto", height: "77vh" }}
        >
          {renderCommunitiesList()}
          <div className="create-new-community-sidebar-btn d-flex flex-row justify-content-center">
            <button
              className="btn btn-outline-text  btn-outline-primary mt-3 py-2"
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
