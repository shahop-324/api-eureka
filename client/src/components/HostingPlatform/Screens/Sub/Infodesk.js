import React from "react";
import styled from "styled-components";
import FAQs from "./Helper/FAQs";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";

const Paper = styled.div`
  min-height: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  width: 100%;
`;

const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
  font-size: 1.1rem;
`;

const DocumentTab = styled.div`
  border-radius: 10px;
  background-color: #f0f2f2;
  padding: 12px;
  border-radius: 50px;


  &:hover {
    cursor: pointer;
    -webkit-border-radius: 50px;
border-radius: 50px;
background: #D1D8EC;
-webkit-box-shadow: 12px 12px 24px #b2b8c9, -12px -12px 24px #f0f8ff;
box-shadow: 12px 12px 24px #b2b8c9, -12px -12px 24px #f0f8ff;
  }

`;

const LinkTab = styled.div`
  border-radius: 10px;
  background-color: #f0f2f2;
  padding: 12px;
  border-radius: 50px;
  

  &:hover {
    -webkit-border-radius: 50px;
border-radius: 50px;
background: #D1D8EC;
-webkit-box-shadow: 12px 12px 24px #b2b8c9, -12px -12px 24px #f0f8ff;
box-shadow: 12px 12px 24px #b2b8c9, -12px -12px 24px #f0f8ff;
cursor: pointer;
  }
`;

const DocumentName = styled.span`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #404246;
`;

const OverviewContent = styled.div`
font-size: 0.78rem;
font-weight: 500;
color: #525252;
font-family: "Ubuntu";
`

const InfoDesk = () => {
  return (
    <>
      <div className="py-4">
        <Paper className="mb-5 px-4 py-3">
          <Heading className="mb-3">FAQs</Heading>
          <FAQs className="mb-3" />
        </Paper>
        <Paper className="mb-5 px-4 py-3">
          <Heading className="mb-3">Documents & Links</Heading>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridGap: "32px",
            }}
          >
            <DocumentTab>
              <DescriptionRoundedIcon />
              <DocumentName className="ms-3">Brochure on MVP</DocumentName>
            </DocumentTab>

            <LinkTab>
              <InsertLinkRoundedIcon className="ms-3" />
              <DocumentName className="ms-3">Visit our site</DocumentName>
            </LinkTab>
          </div>
        </Paper>
        <Paper className="mb-5 px-4 py-3">
          <Heading className="mb-3">Overview</Heading>

<OverviewContent>
    This event is for trial purpose. We will begin hosting large scale events soon.
</OverviewContent>

        </Paper>
      </div>
    </>
  );
};

export default InfoDesk;
