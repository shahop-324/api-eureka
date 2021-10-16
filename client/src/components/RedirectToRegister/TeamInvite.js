import React from "react";
import styled from "styled-components";
import BluemeetLOGO from "./../../assets/Logo/Bluemeet_LOGO_official.svg";
import Faker from "faker";
import { Avatar } from "@material-ui/core";

const Paper = styled.div`
  height: auto;
  background-color: #f32f2f;
  text-align: center;
`;

const NormalText = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #ffffff;
`;

const AttractiveText = styled.a`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #e2d40e;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    color: #212121;
  }
`;

const StaticBanner = () => {
  return (
    <>
      <Paper className="py-2">
        <NormalText>
          You have been invited to join as a community manager in Orchid
          Investment community.
        </NormalText>{" "}
        <AttractiveText>Create your account to get access.</AttractiveText>
      </Paper>
    </>
  );
};

const NavBar = styled.div`
  height: 7vh;
  background-color: #ffffff;
  border-bottom: 1px solid #ebebeb;
`;

const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1.1rem;
  color: #212121;
`;

const TextDescriptive = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.9rem;
  color: #525252;
`;

const TextEmphasis = styled.div`
  font-weight: 500;
  font-size: 0.85rem;

  font-family: "Ubuntu";
  color: #db3a3a;
`;

const CreateAccountButton = styled.button`
  font-weight: 600;
  font-size: 1.2rem;
  width: 100%;
  font-family: "Ubuntu";
  color: #ffffff;
  border-radius: 15px;
`;

const CommunityTeamInvite = () => {
  return (
    <>
      <StaticBanner></StaticBanner>
      <NavBar className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
        <img src={BluemeetLOGO} alt={"Bluemeet logo"} />
        <button className="btn btn-outline-primary btn-outline-text">
          Go to bluemeet.in
        </button>
      </NavBar>

      <div
        className="container d-flex flex-column align-items-center justify-content-center"
        style={{ height: "91vh" }}
      >
        <Avatar
          alt={Faker.image.avatar()}
          style={{ height: "6rem", width: "6rem" }}
          src={Faker.image.avatar()}
          variant="rounded"
          className="mb-4"
        />

        <Heading className="mb-3">Community Name</Heading>

        <TextDescriptive className="mb-3">
          You have been invited to join this community as a community manager on
          Bluemeet. <br />{" "}
        </TextDescriptive>
        <TextEmphasis className="mb-5">
          Please create your account with this email (test@gmail.com) to get
          stated.
        </TextEmphasis>

        <CreateAccountButton
          className="btn btn-outline-text btn-primary"
          style={{ width: "330px" }}
        >
          Create my account
        </CreateAccountButton>
      </div>
    </>
  );
};

export default CommunityTeamInvite;
