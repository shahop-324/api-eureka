//  This is event overview page

import React, {useState} from "react";
import styled from "styled-components";
import { uploadEventImage } from "../../../actions";
import UploadEventImageForm from "./FormComponents/uploadEventImageForm";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { Field, reduxForm } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import { useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { editEventDescription, errorTrackerForEditEventDiscription, errorTrackerForFetchEvent } from "../../../actions";


const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const EventOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1.5fr;
  grid-gap: 24px;
  height: 400px;
`;

const EventDetails = styled.div`
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 7px;
`;

const EventPromoImageContainer = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 7px;
`;

const EventDetailsHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.8rem;
  color: #212121;
`;

const EventDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 2fr;
  grid-gap: 24px;
`;

const EventName = styled.div`
  font-weight: 600;
  font-family: "Ubuntu";
  font-size: 1.2rem;
  color: #5f5f5f;
`;

const TextSmall = styled.div`
  font-weight: 400;
  font-size: 0.72rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const TextSignificant = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const EventLinkInput = styled.input`
  font-weight: 500;
  font-size: 0.8rem;
  font-family: "Ubuntu";
  color: #212121;
`;

const EventOverview = (props) => {


  const [tag, setTag] = useState("Confluence 2021");
  const [editMode, setEditMode] = useState(false);

    const { handleSubmit, pristine, submitting } = props;

  const { enqueueSnackbar } = useSnackbar();

  const { error } = useSelector((state) => state.event);

  const aboutText = useSelector(
    (state) => state.event.eventDetails.editingComment
  );

  const [editorState, setEditorState] = React.useState(
   aboutText ? EditorState.createWithContent(convertFromRaw(JSON.parse(aboutText))) : EditorState.createEmpty()
  );
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;

  const communityId = params.communityId;

  const onSubmit = () => {
    const JSONData = {
      editingComment: convertToRaw(editorState.getCurrentContent()),
    };
    dispatch(editEventDescription(JSONData, id));
  };

  const renderEditor = ({ input, id }) => {
    return (
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        name="editior"
        onEditorStateChange={onEditorStateChange}
        {...input}
        id={id}
      />
    );
  };

  if(error) {
    enqueueSnackbar(error, {
      variant: "error",
    });

    dispatch(errorTrackerForFetchEvent())
   return dispatch(errorTrackerForEditEventDiscription());
  }


  const previousTag = "Confluence 2021";


  const handleChangeTag = (e) => {
    setTag(e.target.value);
  };

  const resetTag = () => {
    setTag(previousTag);
  };

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const turnOffEditMode = () => {
    setEditMode(false);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <SectionHeading className="">Overview</SectionHeading>
        </div>

        <div className=" px-3 mb-4">
          <EventOverviewGrid className="mb-5">
            <EventDetails className="px-4 py-3">
              <EventDetailsHeading className="mb-4">
                Event Details
              </EventDetailsHeading>

              <EventDetailsGrid className="mb-5">
                <EventName>Event name</EventName>
                {/* <button onClick={() => {
              //  dispatch(editEvent({publishedStatus: "Published"}, id)) 
            }} className="publish-btn-sm btn btn-outline-primary btn-outline-text" style={{fontSize: "0.8rem", maxWidth: "200px", justifySelf: "end"}}>
              Publish
            </button> */}
            <div className="d-flex flex-row align-items-center justify-content-end">
                <button
                  className="btn btn-outline-primary btn-outline-text me-3"
                  style={{  justifySelf: "end" }}
                >
                  {" "}
                  <EditRoundedIcon
                    className="me-2"
                    style={{ fontSize: "18px" }}
                  />{" "}
                  edit
                </button>
                <button
                  className="btn btn-outline-primary btn-outline-text"
                  style={{  justifySelf: "end" }}
                >
                  {" "}
                  <PublishRoundedIcon
                    className="me-2"
                    style={{ fontSize: "18px" }}
                  />{" "}
                 Publish
                </button>
                </div>
                <div className="d-flex flex-row align-items-center ">
                  <div className="me-5">
                    <TextSmall className="">Starting on</TextSmall>
                    <TextSignificant className="my-1">
                      Saturday, 27 Sep 2021
                    </TextSignificant>
                    <TextSmall>11:15 pm</TextSmall>
                  </div>
                  <div className="me-5">
                    <TextSmall className="">Ending on</TextSmall>
                    <TextSignificant className="my-1">
                      Saturday, 02 Oct 2021
                    </TextSignificant>
                    <TextSmall>11:15 pm</TextSmall>
                  </div>
                  <div>
                    <TextSmall className="">Timezone</TextSmall>
                    <TextSignificant className="my-1">
                      UTC + 5:30
                    </TextSignificant>
                    <TextSmall>IST</TextSmall>
                  </div>
                </div>
              </EventDetailsGrid>
              <div className="referral-link-and-copy-to-clipboard mb-5">
                <div
                  className="ui action input me-4"
                  style={{ minWidth: "400px" }}
                >
                  <EventLinkInput
                    className="event-sharable-link"
                    type="text"
                    value={
                      "https://wwww.bluemeet.in/event-landing-page/27882hsji8jsnju2/2y2k2i8jbnsn"
                    }
                    readOnly
                    placeholder="Search..."
                  />
                  <button
                    className="ui icon button"
                    onClick={() => {
                      navigator.clipboard.writeText("referralLink");
                      alert("copied to clipboard!");
                    }}
                  >
                    <i className="copy outline icon"></i>
                  </button>
                </div>
                <buttton className="btn btn-primary btn-outline-text me-4">
                  Go to event
                </buttton>
                <buttton className="btn btn-outline-primary btn-outline-text">
                 Embeddable widget
                </buttton>
              </div>
              <EventDetailsHeading className="mb-4">
                Event organised by
              </EventDetailsHeading>
              <div className="form-group">
              <div className="editable-mail-group-name d-flex flex-row align-items-center justify-content-between px-3">
                <EventLinkInput
                  name="community name"
                  type="text"
                  readOnly={!editMode}
                  className="mail-group-name-input px-4 py-3"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    handleChangeTag(e);
                  }}
                  value={tag}
                  id="tag"
                  aria-describedby="community name"
                  placeholder="Community name"
                 
                />
                {!editMode ? (
                  <EditRoundedIcon
                    onClick={() => {
                      turnOnEditMode();
                    }}
                    className="chat-msg-hover-icon"
                    style={{ position: "absolute", right: "10px" }}
                  />
                ) : (
                  <div className="d-flex flex-row align-items-center">
                    <CheckRoundedIcon
                      onClick={() => {
                        turnOffEditMode();
                      }}
                      style={{ fill: "#188627" }}
                      className="me-3"
                    />
                    <ClearRoundedIcon
                      onClick={() => {
                        resetTag();
                        turnOffEditMode();
                      }}
                      style={{ fill: "#A51320" }}
                      className=""
                    />
                  </div>
                )}
              </div>
            </div>

            </EventDetails>
            <EventPromoImageContainer>
              <UploadEventImageForm />
            </EventPromoImageContainer>
          </EventOverviewGrid>

          

          <form onSubmit={handleSubmit(onSubmit)} className="pt-5">
              <TextSignificant className="mb-3" style={{fontSize: "1.15rem"}}>Event description</TextSignificant>
          <TextSmall className="mb-4">
               Make a great impression on your attendees by adding an eye-catching description.<br /> You can add paragraphs, images, links and more.
              </TextSmall>
            <div className=" pe-4 ">
              <div
                className="rich-text-editor-wrapper p-3"
                style={{ minHeight: "500px", border: "1px solid #CACACA" }}
              >
                <Field component={renderEditor} id={id} />
              </div>
              <div
                className="d-flex flex-row justify-content-end mt-3"
                style={{ width: "100%" }}
              >
                
                <button
                  type="submit"
                  className={`btn btn-primary btn-outline-text `}
                  disabled={pristine || submitting}
                >
                  Save changes
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

// export default EventOverview;

export default reduxForm({
    form: "editorForm",
    destroyOnUnmount: false,
  })(EventOverview);
  
