import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import NoContentFound from "../../../../../../NoContent";
import Divider from "@material-ui/core/Divider";
import BusinessCardListFields from "../GridComponents/BusinessCards/ListFields";
import BusinessCardDetailsCard from "./../GridComponents/BusinessCards/DetailsCard";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import NoBusinessCard from "./../../../../../../../assets/images/NoBusinessCard.png";

import SendViaMail from "./../Helper/SendViaMail";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const renderBusinessCards = (businessCards) => {
  if (!businessCards) return;
  return businessCards.map((businessCard) => {
    if (!businessCard) return <></>;
    return (
      <BusinessCardDetailsCard
        id={businessCard._id}
        key={businessCard._id}
        name={businessCard.name}
        email={businessCard.email}
        image={businessCard.image}
        contact={businessCard.contact}
        timestamp={businessCard.timestamp}
      />
    );
  });
};

const Forms = () => {
  const { businessCards } = useSelector((state) => state.booth);

  const [openSendMail, setOpenSendMail] = useState(false);

  const handleCloseSendMail = () => {
    setOpenSendMail(false);
  };

  const { currentBoothId } = useSelector((state) => state.booth);

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row align-items-center justify-content-between px-4 py-4">
          <SectionHeading className="">Shared Business Cards</SectionHeading>
          <div className="d-flex flex-row align-items-center">
            <button
              onClick={() => {
                // setOpenAddForm(true);
                setOpenSendMail(true);
              }}
              className="btn btn-outline-text btn-outline-primary d-flex flex-row align-items-center me-3"
            >
              <MailOutlineRoundedIcon style={{ fontSize: "18px" }} />

              <span className="ms-2">Send via Mail</span>
            </button>
            <button
              onClick={() => {
                // setOpenAddForm(true);
              }}
              className="btn btn-outline-text btn-outline-primary d-flex flex-row align-items-center"
            >
              <FileDownloadRoundedIcon style={{ fontSize: "18px" }} />
              <span className="ms-2">Export</span>
            </button>
          </div>
        </div>

        {typeof businessCards !== "undefined" && businessCards.length > 0 ? (
          <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
            <BusinessCardListFields />
            <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
              <Divider />
            </div>
            {renderBusinessCards(businessCards)}
          </div>
        ) : (
          <div
            className="d-flex flex-row align-items-center justify-content-center"
            style={{ height: "83vh", width: "100%" }}
          >
            {" "}
            <NoContentFound
              msgText="No Business card shared yet"
              img={NoBusinessCard}
            />{" "}
          </div>
        )}
      </div>
      <SendViaMail
        open={openSendMail}
        handleClose={handleCloseSendMail}
        boothId={currentBoothId}
      />
    </>
  );
};

export default Forms;
