import React from "react";
import VerticalTabsProfile from "./UserAccountVerticalTabsProfile";

const UserAccountProfileMainBody = () => {
  return (
    <div className="user-account-main-body-home-content pt-5" style={{overflow: "auto", height: "85vh"}}>
      <VerticalTabsProfile />
    </div>
  );
};

export default UserAccountProfileMainBody;
