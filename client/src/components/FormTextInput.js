import React from 'react';

const FormTextInput = (props) => {
    return (
<div class="form-group">
                <label Forhtml={props.ForhtmlId}>{props.label}</label>
                <input
                  type={props.type}
                  class="form-control"
                  id={props.ForhtmlId}
                  aria-describedby={props.ariaDescription}
                  placeholder={props.placeholder}
                />
              </div>
    );
}

export default FormTextInput;