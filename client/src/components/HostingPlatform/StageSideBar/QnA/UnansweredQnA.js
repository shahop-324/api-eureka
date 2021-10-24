import { Avatar, IconButton } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import Faker from "faker";
import ExpandLessRoundedIcon from "@material-ui/icons/ExpandLessRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DeleteQnA from "./DeleteQnA";

const QnABody = styled.div`
  width: 100%;
  height: auto;
  padding: 15px;

  background: #152d3509;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const PersonName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #212121;
  display: block;
`;

const UserRoleTag = styled.div`
  background-color: #152d35;
  height: max-content;
  border-radius: 5px;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.7rem;
  color: #ffffff;

  padding: 4px 8px;
`;

const QuesText = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.85rem;
  color: #ffffff;
`;

const UpvoteWidget = styled.div`
  padding: 4px 10px;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border-radius: 5px;

  background-color: transparent;
  color: #152d35;
  border: 1px solid #152d35;

  &:hover {
    border: 1px solid transparent;
    background-color: #152d35;
    color: #ffffff;
    cursor: pointer;
  }
`;

const TextAreaWidget = styled.textarea`
  padding: 5px 10px;
  border-radius: 5px;
  width: 100%;
  /* background-color: #345b63; */
  background-color: transparent;

  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;

  color: #212121;

  &:focus {
    border: 1px solid #152d35;
    outline: none;
  }
`;

const StyledOutlineButton = styled.button`
  border: 1px solid #152d35 !important;
  color: #152d35 !important;

  &:hover {
    background-color: #152d35 !important;
    color: #ffffff !important;
  }
`;

const UnansweredQnA = () => {
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <QnABody className="mb-3">
        <div className="d-flex flex-row mb-4 justify-content-between">
          <div className="d-flex flex-row">
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
              className="me-3"
            />
            <div>
              <PersonName>{Faker.name.findName()}</PersonName>
              <PersonName>{"Product manager, Bluemeet"}</PersonName>
            </div>
          </div>

          <UserRoleTag>Host</UserRoleTag>
        </div>

        <div className="d-flex flex-row align-items-center mb-3">
          <UpvoteWidget className="me-3">
            <ExpandLessRoundedIcon />
            <div>48</div>
          </UpvoteWidget>
          <QuesText>how about investing money in crypto or NFTs ?</QuesText>
        </div>
        <TextAreaWidget className="mb-2"></TextAreaWidget>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <StyledOutlineButton className="btn btn-outline-text btn-outline-primary">
            Submit
          </StyledOutlineButton>

          <div className="d-flex flex-row align-items-center justify-content-end">
            <IconButton
              onClick={() => {
                handleOpenDelete();
              }}
            >
              <DeleteRoundedIcon />
            </IconButton>
          </div>
        </div>
      </QnABody>
      <DeleteQnA open={openDelete} handleClose={handleCloseDelete} />
    </>
  );
};

export default UnansweredQnA;
