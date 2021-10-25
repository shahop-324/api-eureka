import React from "react";
import styled from "styled-components";
import AnsweredQnA from "./AnsweredQnA";
import QnAInput from "./QnAInput";
import UnansweredQnA from "./UnansweredQnA";
import { useSelector } from "react-redux";

const QnAContainer = styled.div`
  height: 71vh;
  width: 100%;
`;

const Scrollable = styled.div`
  height: 61vh;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const renderQnA = (QnAs) => {
  return QnAs.map((element) => {
    if (element.deleted) return;
    if (!element.answeredBy) {
      // This question is unanswered
      return (
        <UnansweredQnA
          key={element._id}
          id={element._id}
          question={element.question}
          upvotes={element.upvotes}
          upvotedBy={element.upvotedBy}
          askedByName={
            element.askedBy.firstName + " " + element.askedBy.lastName
          }
          askedByImage={
            element.askedBy.image
              ? element.askedBy.image.startsWith("https://")
                ? element.askedBy.image
                : `https://bluemeet.s3.us-west-1.amazonaws.com/${element.askedBy.image}`
              : "#"
          }
          askedByOrganisation={element.askedBy.organisation}
          askedByDesignation={element.askedBy.designation}
          createdAt={element.createdAt}
          showOnStage={element.showOnStage}
        />
      );
    } else {
      return (
        <AnsweredQnA
          key={element._id}
          id={element._id}
          question={element.question}
          upvotes={element.upvotes}
          upvotedBy={element.upvotedBy}
          askedByName={
            element.askedBy.firstName + " " + element.askedBy.lastName
          }
          askedByImage={
            element.askedBy.image
              ? element.askedBy.image.startsWith("https://")
                ? element.askedBy.image
                : `https://bluemeet.s3.us-west-1.amazonaws.com/${element.askedBy.image}`
              : "#"
          }
          askedByOrganisation={element.askedBy.organisation}
          askedByDesignation={element.askedBy.designation}
          answeredByName={element.answeredBy.firstName + " " + element.answeredBy.lastName}
          answeredByImage={
            element.answeredBy.image
              ? element.answeredBy.image.startsWith("https://")
                ? element.answeredBy.image
                : `https://bluemeet.s3.us-west-1.amazonaws.com/${element.answeredBy.image}`
              : "#"
          }
          answer={element.answer}
          createdAt={element.createdAt}
          showOnStage={element.showOnStage}
        />
      );
    }
  });
};

const MainQnAComponent = () => {
  const { sessionQnAs } = useSelector((state) => state.sessionQnAs);

  return (
    <>
      <QnAContainer>
        <Scrollable className="mb-3">
          {/* Render QnA List Here */}
          {renderQnA(sessionQnAs)}
        </Scrollable>
        {/* Render QnA input here */}
        <QnAInput />
      </QnAContainer>
    </>
  );
};

export default MainQnAComponent;
