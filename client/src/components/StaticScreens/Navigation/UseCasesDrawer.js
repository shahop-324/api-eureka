import React from "react";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import styled from "styled-components";
import StreamRoundedIcon from "@mui/icons-material/StreamRounded";
import CircleIcon from "@mui/icons-material/Circle";

import BluemeetLogo from "./../../../assets/Logo/Bluemeet_LOGO_official.svg";

import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";

import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";

const Paper = styled.div`
  width: 100%;
  height: 300px;
  background-color: #ffffff;
`;

const NavSectionHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 1rem;
  color: #212121;
`;

const ProductUseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 24px;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: row;

  border-radius: 10px;
  padding: 10px;
  &:hover {
    background-color: #d4e3f6;
    cursor: pointer;
  }
`;

const ProductIcon = styled.div`
  border-radius: 10px;
  border: 1px solid #152d35;
  background-color: #152d3f;
  color: #ffffff;

  height: fit-content;
`;

const ProductName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.82rem;
  color: #212121;
`;

const ProductCatchLine = styled.div`
  font-weight: 400;
  font-family: "Ubuntu";
  font-size: 0.78rem;
  color: #2c2c2c;
`;

const NavContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4.5fr 1.5fr;
  grid-gap: 16px;
  align-items: center;

  height: 50px;
`;

const NavLinkDropdown = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.85rem;
  color: #2f2f2f;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid #ffffff;
    cursor: pointer;
  }
`;

const DarkTopNav = ({ setOpenProduct, setOpenUseCase, setOpenResources,  setOpenCompany}) => {
  return (
    <NavContainer className="container py-3 ">
      {/* Logo */}
      <img src={BluemeetLogo} alt="Bluemeet Logo" />

      {/* Links */}
      <div className="d-flex flex-row align-items-center justify-content-evenly">
        <NavLinkDropdown className="d-flex flex-row me-3" onMouseOver={() => {
            setOpenUseCase(false);
            setOpenProduct(true);
        }}>
          <span className="me-1"> Product</span>
          <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
        </NavLinkDropdown>
        <NavLinkDropdown className="d-flex flex-row me-3" onMouseOver={() => {
              setOpenUseCase(true)
          }}>
          <span className="me-1"> Use cases</span>
          <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
        </NavLinkDropdown>
        <NavLinkDropdown className="d-flex flex-row me-3">
          Pricing
        </NavLinkDropdown>
        <NavLinkDropdown className="d-flex flex-row me-3">
          Explore Events
        </NavLinkDropdown>
        <NavLinkDropdown className="d-flex flex-row me-3" onMouseOver={() => {
            setOpenUseCase(false);
            setOpenResources(true);
        }}>
          <span className="me-1">Resources</span>
          <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
        </NavLinkDropdown>
        <NavLinkDropdown className="d-flex flex-row me-3" 
        onMouseOver={() => {
            setOpenUseCase(false);
            setOpenCompany(true);
        }}>
          <span className="me-1"> Company</span>
          <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
        </NavLinkDropdown>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-end">
        <NavLinkDropdown className="me-3">
          <span className="me-1">Your account</span>
          <ArrowRightRoundedIcon style={{ fontSize: "20px" }} />
        </NavLinkDropdown>
        <button className="btn btn-outline-dark btn-outline-text">
          Request demo
        </button>
      </div>
      {/* Signin and demo request button */}
    </NavContainer>
  );
};

const UseCasesDrawer = ({ openDrawer, handleCloseDrawer, setOpenProduct, setOpenUseCase, setOpenResources,  setOpenCompany }) => {
  return (
    <>
      <React.Fragment key="top">
        <SwipeableDrawer
          anchor="top"
          onOpen={() => {
            console.log("Side nav was opened");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <div style={{ height: "80px" }}>
            <DarkTopNav setOpenProduct={setOpenProduct} setOpenUseCase={setOpenUseCase} setOpenResources={setOpenResources}  setOpenCompany={setOpenCompany} />
          </div>
          <Paper className="px-4 py-4 container" onMouseLeave={() => {
              setOpenUseCase(false);
          }}>
            <NavSectionHeading className="mb-4">Use cases</NavSectionHeading>
            <ProductUseCasesGrid>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#4FBCEE",
                    border: "1px solid #4FBCEE",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Office hours</ProductName>
                  <ProductCatchLine>
                    Host amazing office hours with your customers
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#ECE141",
                    border: "1px solid #ECE141",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Tech Talks</ProductName>
                  <ProductCatchLine>
                    Talk about tech with bluemeet
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#EC6341",
                    border: "1px solid #EC6341",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Recruiting events</ProductName>
                  <ProductCatchLine>
                    Attract more portential and generate job oppertunities
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#55EC41",
                    border: "1px solid #55EC41",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Webinar</ProductName>
                  <ProductCatchLine>
                    Host your multitrack multisession event without efforts
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#9941EC",
                    border: "1px solid #9941EC",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Product demos</ProductName>
                  <ProductCatchLine>
                    Showcase your product and generate leads using bluemeet
                  </ProductCatchLine>
                </div>
              </ProductCard>
              <ProductCard className="mb-4">
                <ProductIcon
                  className="p-1 me-3"
                  style={{
                    backgroundColor: "#EC4196",
                    border: "1px solid #EC4196",
                  }}
                >
                  <CircleIcon />
                </ProductIcon>
                <div>
                  <ProductName className="mb-2">Build in public</ProductName>
                  <ProductCatchLine>
                    Engage your public audienece using bluemeet
                  </ProductCatchLine>
                </div>
              </ProductCard>
            </ProductUseCasesGrid>
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default UseCasesDrawer;
