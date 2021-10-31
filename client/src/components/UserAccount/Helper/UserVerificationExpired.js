import React from "react";
import styled from "styled-components";
import LinkExpired from "./../Images/LinkExpired.png";

const NavStrip = styled.div`
  height: 7vh;
  border-bottom: 1px solid #d3d3d3;
`;

const Body = styled.div`
  height: 93vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BrandName = styled.div`
  font-weight: 700;
  font-family: "Ubuntu";
  font-size: 1.2rem;
  color: #538bf7;
`;

const Heading = styled.div`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
`;

const SmallText = styled.div`
  text-align: center;
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.86rem;
  color: #494949;
`;

const Image = styled.img`
  height: 360px;
  width: auto;
  object-fit: contain;
  border-radius: 10px;
`;

const UserVerificationExpired = () => {
  return (
    <>
      {/* Nav bar */}
      <NavStrip className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
        <BrandName>Bluemeet</BrandName>
        <button className="btn btn-outline-text btn-outline-primary">
          Go to Bluemeet.in
        </button>
      </NavStrip>
      <Body className="px-4 py-3">
        <Heading className="mb-4">Verification link expired.</Heading>

        <Image className="mb-4" src={LinkExpired} />

        <SmallText className="mb-3">
          Looks like this verification link has already expired. Please create a
          new user account to continue.
        </SmallText>
      </Body>
    </>
  );
};

export default UserVerificationExpired;
