import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { IconButton } from "@material-ui/core";

import { TwitterPicker } from "react-color";
import Select from "react-select";

const fontOptions = [];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.85rem",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
    fontSize: "0.85rem",
  }),
};

const CreateTheme = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [background, setBackground] = useState("#ffffff");

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="px-4 py-3" style={{ width: "420px" }}>
          <div className="form-heading-and-close-button mb-4">
            <div></div>
            <div className="coupon-overlay-form-headline">Customize theme</div>
            <div className="overlay-form-close-button" onClick={handleClose}>
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
          <div class="mb-4 overlay-form-input-row">
            <label for="eventName" class="form-label form-label-customized">
              Theme name
            </label>
            <input
              name="eventName"
              type="text"
              className="form-control"
              id="themeName"
              ariadescribedby="themeName"
              //   component={renderInput}
            />
          </div>
          <div class="mb-4 overlay-form-input-row">
            <label for="eventName" class="form-label form-label-customized">
              Font Family
            </label>

            <Select
              // defaultValue={defaultValue}
              styles={styles}
              menuPlacement={"auto"}
              name="fontFamily"
              options={fontOptions}
              // value={input.value}
              // onChange={(value) => input.onChange(value)}
              // onBlur={() => input.onBlur()}
            />
          </div>
          <div className="mb-4">
            <label class="form-label form-label-customized">Color</label>
            <div
              className="theme-color-preview mb-3"
              style={{ backgroundColor: background }}
            ></div>
            <TwitterPicker
              color={background}
              onChangeComplete={handleChangeComplete}
            />
          </div>

          <button
            className="btn btn-outline-primary btn-outline-text"
            style={{ width: "100%" }}
          >
            Create theme
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default CreateTheme;
