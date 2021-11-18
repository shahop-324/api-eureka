import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import NoContentFound from "../../../../../../NoContent";
import Divider from "@material-ui/core/Divider";
import FileLibraryListFields from "../GridComponents/Files/ListFields";
import FileLibraryDetailsCard from "./../GridComponents/Files/DetailsCard";
import NoFile from "./../../../../../../../assets/images/NoProduct.png";
import AddFile from "./../FormComponents/Files/AddFile";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const renderFiles = (files) => {
  if (!files) return;
  return files.map((file) => {
    if (!file) return <></>;
    return (
      <FileLibraryDetailsCard
        id={file._id}
        key={file._id}
        name={file.name}
        downloads={file.downloads}
        timestamp={file.timestamp}
      />
    );
  });
};

const Files = () => {
  const { files } = useSelector((state) => state.booth);

  const [openAddFile, setOpenAddFile] = useState(false);

  const handleCloseAddFile = () => {
    setOpenAddFile(false);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row align-items-center justify-content-between px-4 py-4">
          <SectionHeading className="">Files</SectionHeading>
          <div>
            <button
              onClick={() => {
                setOpenAddFile(true);
              }}
              className="btn btn-outline-text btn-outline-primary d-flex flex-row align-items-center"
            >
              <span className=""> Add Files</span>
            </button>
          </div>
        </div>

        {typeof files !== "undefined" && files.length > 0 ? (
          <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
            <FileLibraryListFields />
            <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
              <Divider />
            </div>
            {renderFiles(files)}
          </div>
        ) : (
          <div
            className="d-flex flex-row align-items-center justify-content-center"
            style={{ height: "83vh", width: "100%" }}
          >
            {" "}
            <NoContentFound
              msgText="No File Found"
              img={NoFile}
            />{" "}
          </div>
        )}
      </div>
      <AddFile open={openAddFile} handleClose={handleCloseAddFile} />
    </>
  );
};

export default Files;
