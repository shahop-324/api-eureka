import React, { useState } from "react";
import Faker from "faker";
import { Avatar } from "@material-ui/core";
import "./../../../Styles/PeopleList.scss";
import PeopleProfile from "./PeopleProfile";

const PeopleComponent = ({ handleOpen }) => {
  return (
    <>
      <div className="people-list-view-card p-3 mb-4">
        <div className="mb-3">
          <div
            className=" mb-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}
          >
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
            />
            <div
              className="chat-box-name ms-3"
              style={{ textTransform: "capitalize", fontFamily: "Ubuntu" }}
            >
              <div>{Faker.name.findName()}</div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#4B4B4B",
                  fontSize: "0.7rem",
                }}
                className="d-flex flex-row align-items-center justify-content-between"
              >
                <div>Product Manager, Evenz</div>

                {/* <div>3m ago</div> */}
              </div>
            </div>
          </div>
        </div>

        <div
          className="view-full-profile-btn py-1"
          onClick={() => {
            handleOpen();
          }}
        >
          Know more
        </div>
      </div>
    </>
  );
};

const PeopleList = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

  return (
    <>
    <div>
      <PeopleComponent handleOpen={handleOpen}/>
      <PeopleComponent handleOpen={handleOpen}/>
      <PeopleComponent handleOpen={handleOpen}/>
      <PeopleComponent handleOpen={handleOpen}/>
      <PeopleComponent handleOpen={handleOpen}/>
    </div>

    <PeopleProfile open={open} handleClose={handleClose}/>
    </>
  );
};

export default PeopleList;
