import React, {useState} from "react";
import styled from "styled-components";
import BluemeetLogo from "./../../../assets/Logo/light.svg";

import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";

import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ProductDrawer from "../Navigation/ProductDrawer";
import UseCasesDrawer from "../Navigation/UseCasesDrawer";
import ResourcesDrawer from "../Navigation/ResourcesDrawer";
import CompanyDrawer from "../Navigation/CompanyDrawer";

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
  color: #ffffff;
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid #ffffff;
    cursor: pointer;
  }
`;

const TopNavNew = () => {

    const [openProduct, setOpenProduct] = useState(false);
    const [openUseCase, setOpenUseCase] = useState(false);
    const [openResources, setOpenResources] = useState(false);
    const [openCompany, setOpenCompany] = useState(false);

    

  return (
    <>
      <NavContainer className="container py-3 ">
        {/* Logo */}
        <img src={BluemeetLogo} alt="Bluemeet Logo" />

        {/* Links */}
        <div className="d-flex flex-row align-items-center justify-content-evenly">
          <NavLinkDropdown onMouseOver={() => {
              setOpenProduct(true)
          }} 
          
           className="d-flex flex-row me-3">
            <span className="me-1"> Product</span>
            <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
          </NavLinkDropdown>
          <NavLinkDropdown className="d-flex flex-row me-3"  >
            <span className="me-1" onMouseOverCapture={() => {
            //   setOpenProduct(false)
              setOpenUseCase(true)
          }}  > Use cases</span>
            <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
          </NavLinkDropdown>
          <NavLinkDropdown className="d-flex flex-row me-3">
            Pricing
          </NavLinkDropdown>
          <NavLinkDropdown className="d-flex flex-row me-3">
            Explore Events
          </NavLinkDropdown>
          <NavLinkDropdown className="d-flex flex-row me-3" onMouseOverCapture={() => {
            //   setOpenProduct(false)
              setOpenResources(true)
          }}  >
            <span className="me-1">Resources</span>
            <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
          </NavLinkDropdown>
          <NavLinkDropdown className="d-flex flex-row me-3" onMouseOverCapture={() => {
            //   setOpenProduct(false)
              setOpenCompany(true)
          }}  >
            <span className="me-1"> Company</span>
            <ArrowDropDownRoundedIcon style={{ fontSize: "20px" }} />
          </NavLinkDropdown>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-end">
          <NavLinkDropdown className="me-3">
            <span className="me-1">Your account</span>
            <ArrowRightRoundedIcon style={{ fontSize: "20px" }} />
          </NavLinkDropdown>
          <button className="btn btn-outline-light btn-outline-text">
            Request demo
          </button>
        </div>
        {/* Signin and demo request button */}
      </NavContainer>
      <ProductDrawer openDrawer={openProduct} setOpenProduct={setOpenProduct} setOpenUseCase={setOpenUseCase} setOpenCompany={setOpenCompany} setOpenResources={setOpenResources}/>
      <UseCasesDrawer openDrawer={openUseCase} setOpenProduct={setOpenProduct} setOpenUseCase={setOpenUseCase} setOpenCompany={setOpenCompany} setOpenResources={setOpenResources}/>
      <ResourcesDrawer openDrawer={openResources} setOpenProduct={setOpenProduct} setOpenUseCase={setOpenUseCase} setOpenCompany={setOpenCompany} setOpenResources={setOpenResources}/>
      <CompanyDrawer openDrawer={openCompany} setOpenProduct={setOpenProduct} setOpenUseCase={setOpenUseCase} setOpenCompany={setOpenCompany} setOpenResources={setOpenResources}/>
    </>
  );
};

export default TopNavNew;
