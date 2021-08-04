

import { IconButton } from '@material-ui/core';
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import React, { useState } from 'react';

const MsgInput = ({sendChannelMessage}) => {

    const [Message, setMessage] = useState("");
    return (

        <div className="chat-msg-input-container d-flex flex-row justify-content-between">
          <input
            type="text"
            className="form-control chat-input"
            placeholder="Write a message ..."
            onChange={(e) => setMessage(e.target.value)}
            value={Message}
          />
          <IconButton
            onClick={() => {
              sendChannelMessage(Message);
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </div>

    );
}

export default MsgInput;



