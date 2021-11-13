import React from "react";
import styled from "styled-components";
import { DashboardSectionHeading } from "./Elements";
import FollowingDetailsCard from "./GridComponents/Following/DetailsCard";
import FollowingListFields from "./GridComponents/Following/ListFields";

const Paper = styled.div`
  height: 83vh;
  width: 100%;
`;

const Following = () => {
  return (
    <>
      <div className="user-account-main-body-home-content">
        <div
          className="user-account-main-body-home-content-left ps-2"
          style={{ overflow: "auto", height: "100%" }}
        >
          <DashboardSectionHeading className="pb-4 ps-4">
            Following
          </DashboardSectionHeading>

          <div className="px-4">
            <FollowingListFields />
            <FollowingDetailsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Following;
