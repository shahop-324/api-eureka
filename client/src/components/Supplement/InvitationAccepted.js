import React, { useEffect } from "react";
import styled from "styled-components";
import BluemeetLogo from "./../../assets/Logo/light.svg";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useParams } from "react-router";
import {useDispatch} from "react-redux";
import {acceptInvitation} from "./../../actions";

const Nav = styled.div`
  background-color: #525f7f;
  height: 7vh;
  width: 100%;
`;

const CenteredPaper = styled.div`
  border-radius: 10px;
  background-color: #525f7f;
  height: 400px;
  width: 558px;
`;

const MsgText = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #ffffff;
`;

const InvitationAccepted = () => {

    const params = useParams();

    const dispatch = useDispatch();

    const InvitationId = params.inviteId;

    useEffect(() => {
        dispatch(acceptInvitation(InvitationId));
    }, []);

  return (
    <>
      <Nav className="py-2 px-4">
        <img src={BluemeetLogo} alt="Logo" />
      </Nav>

      <div
        style={{ height: "93vh" }}
        className="d-flex flex-row align-items-center justify-content-center"
      >
        <CenteredPaper className="px-4 py-3 d-flex flex-column align-items-center justify-content-center">
          <CheckCircleRoundedIcon
            style={{ color: "#90EE7D", fontSize: "100px" }}
            className="mb-3"
          />

          <MsgText size="1.1rem" className="mb-4">
            Congratulations!
          </MsgText>

          <MsgText
            className="mb-5"
            style={{ maxWidth: "300px", textAlign: "center" }}
          >
            You have successfully accepted invitation to join {"Community Name"}
            .
          </MsgText>

          <MsgText
            style={{
              maxWidth: "300px",
              textAlign: "center",
              color: "#F0E114",
            }}
          >
            Please log in using shreyanshshah242@gmail.com to access this
            community.
          </MsgText>
        </CenteredPaper>
      </div>
    </>
  );
};

export default InvitationAccepted;
