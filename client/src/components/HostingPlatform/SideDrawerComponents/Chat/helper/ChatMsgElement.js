import React from 'react';
import { Avatar } from '@material-ui/core';
import Faker from 'faker';

import "./../../../Styles/root.scss";

const ChatMsgElement = (props) => {
    return (
        <>
            <div className="chat-msg-element py-2">
              <div className="d-flex flex-row align-items-center">
                <Avatar src={props.image} />
                <div className="chat-box-name ms-3">
                  {props.name}
                </div>
              </div>
              <div className="chat-msg-text ms-5 px-2">
                  {props.msgText}
              </div>
            </div>
        </>
    );
}

export default ChatMsgElement;