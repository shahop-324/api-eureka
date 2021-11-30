/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "./../../../actions";

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "400",
    fontSize: "0.8rem",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "400",
    fontSize: "0.8rem",
    color: "#757575",
  }),
};

const ResolutionOptions = [
  {
    label: "SD (Standard defination, 480p)",
    value: "480p_1",
  },
  {
    label: "HD (High defination, 720p)",
    value: "720p_1",
  },
  {
    label: "Full HD (High defination, 1080p)",
    value: "1080p_1",
  },
  {
    label: "4K Ultra HD",
    value: "1080p_5",
  },
];

const FormLabel = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  font-family: "Ubuntu";
  color: #152d35;

  margin-bottom: 6px;
`;

const ButtonFilledDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";
  background-color: ${(props) =>
    props && props.color ? props.color : "#152d35"};

  border: ${(props) =>
    props && props.color ? `1px solid ${props.color}` : `1px solid #152d35`};
  border-radius: 5px;

  &:hover {
    color: ${(props) => (props && props.color ? props.color : "#152d35")};
    background-color: transparent;
    cursor: pointer;
  }
`;

const ButtonOutlinedDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  color: #152d35;
  background-color: transparent;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    background-color: #152d35;

    color: #ffffff;

    cursor: pointer;
  }
`;

const StreamSettings = ({ rtc }) => {
  const dispatch = useDispatch();
  const [audioDevices, setAudioDevices] = useState([]);

  const [videoDevices, setVideoDevices] = useState([]);

  const { eventDetails } = useSelector((state) => state.event);

  const [cameraId, setCameraId] = useState(
    videoDevices[0] && videoDevices[0].value
  );
  const [microphoneId, setMicrophoneId] = useState(
    audioDevices[0] && audioDevices[0].value
  );
  const [resolution, setResolution] = useState("720p_1");

  const getMediaDevices = () => {
    // Get all audio and video devices.
    AgoraRTC.getDevices().then((devices) => {
      const audioDevices = devices.filter(function (device) {
        return device.kind === "audioinput";
      });
      const videoDevices = devices.filter(function (device) {
        return device.kind === "videoinput";
      });

      console.log(audioDevices);
      console.log(videoDevices);

      const processedAudioDevices = audioDevices.map((el) => {
        return {
          value: el.deviceId,
          label: el.label,
        };
      });

      const processedVideoDevices = videoDevices.map((el) => {
        return {
          value: el.deviceId,
          label: el.label,
        };
      });

      setAudioDevices(processedAudioDevices);
      setVideoDevices(processedVideoDevices);
    });
  };

  useEffect(() => {
    getMediaDevices();
  }, []);

  if (!audioDevices[0] || !videoDevices[0]) {
    return null;
  }

  const handleApplyStreamSettings = () => {
    rtc.localVideoTrack &&
      rtc.localVideoTrack.setEncoderConfiguration(resolution);
    rtc.localVideoTrack && rtc.localVideoTrack.setDevice(cameraId);
    rtc.localAudioTrack && rtc.localAudioTrack.setDevice(microphoneId);

    dispatch(showNotification("Stream settings applied successfully!"));
  };

  return (
    <>
      <div style={{ width: "420px" }} className="mb-4">
        <FormLabel>Resolution</FormLabel>
        <Select
          defaultValue={ResolutionOptions[0]}
          styles={styles}
          menuPlacement={"bottom"}
          name={"resolution"}
          options={ResolutionOptions}
          onChange={(e) => {
            setResolution(e.value);
          }}
        />
      </div>
      <div style={{ width: "420px" }} className="mb-4">
        <FormLabel>Camera</FormLabel>
        <Select
          defaultValue={videoDevices[0]}
          styles={styles}
          menuPlacement={"bottom"}
          name={"resolution"}
          options={videoDevices}
          onChange={(e) => {
            setCameraId(e.value);
          }}
        />
      </div>
      <div style={{ width: "420px" }} className="mb-5">
        <FormLabel>Microphone</FormLabel>
        <Select
          defaultValue={audioDevices[0]}
          styles={styles}
          menuPlacement={"bottom"}
          name={"resolution"}
          options={audioDevices}
          onChange={(e) => {
            setMicrophoneId(e.value);
          }}
        />
      </div>
      <div className="d-flex flex-row align-items-center justify-content-end">
        <ButtonFilledDark
          color={eventDetails.color}
          onClick={() => {
            handleApplyStreamSettings();
          }}
          style={{ width: "120px" }}
        >
          Apply
        </ButtonFilledDark>
      </div>
    </>
  );
};

export default StreamSettings;
