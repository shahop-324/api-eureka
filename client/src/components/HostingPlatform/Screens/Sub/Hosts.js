import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import PersonProfile from "../../PersonProfile";
import { useSelector } from "react-redux";
import NoContent from "./../../NoContent";
import NoHost from "./../../../../assets/images/NoHost.svg";

const EventHostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
`;

const HostCardBody = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  height: auto;
  min-height: 300px;
`;

const HostImg = styled.img`
  height: 200px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
`;

const HostName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 0.93rem;
`;

const HostDesignationOrg = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 0.78rem;
`;

const HostCardComponent = ({
  name,
  image,
  organisation,
  designation,
  person,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { userDetails } = useSelector((state) => state.user);
  let isMe = false;

  if (person._id.toString() === userDetails._id.toString()) {
    isMe = true;
  }

  return (
    <>
      <HostCardBody className="">
        <Avatar
          alt={name}
          src={image}
          variant={"rounded"}
          style={{ height: "210px", width: "100%" }}
        />

        <div className="p-3">
          <HostName className="mb-3">
            {name} {isMe && <span>(You)</span>}{" "}
          </HostName>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div>
              <HostDesignationOrg className="mb-2">
                {designation}
              </HostDesignationOrg>
              <HostDesignationOrg>{organisation}</HostDesignationOrg>
            </div>

            <button
              className="btn btn-light btn-outline-text"
              onClick={() => {
                setOpen(true);
              }}
            >
              View profile
            </button>
          </div>
        </div>
      </HostCardBody>

      <PersonProfile open={open} handleClose={handleClose} person={person} />
    </>
  );
};

const renderHosts = (hosts) => {
  return hosts.map((host) => {
    return (
      <HostCardComponent
        person={host}
        name={host.firstName + " " + host.lastName}
        image={
          host.image
            ? host.image.startsWith("https://")
              ? host.image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${host.image}`
            : ""
        }
        organisation={host.organisation}
        designation={host.designation}
      />
    );
  });
};

const Hosts = () => {
  const { eventDetails } = useSelector((state) => state.event);

  return (
    <>
      {typeof eventDetails.hosts !== "undefined" &&
      eventDetails.hosts.length > 0 ? (
        <EventHostsGrid>{renderHosts(eventDetails.hosts)}</EventHostsGrid>
      ) : (
        <NoContent
          Msg={"There are no host assigned to this event yet."}
          Image={NoHost}
        />
      )}
    </>
  );
};

export default Hosts;
