import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";


const RoyalBlueCheckBox = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3877F3",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function CustomCheckboxLabels(props) {
  const [state, setState] = React.useState({
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <RoyalBlueCheckBox
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}
