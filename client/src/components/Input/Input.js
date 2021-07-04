import React, { useState } from 'react'
import BounceLoader from "react-spinners/BounceLoader";


export default function Input(props) {
    const [pass_is_hidden1, set_pass_status1] = useState("false");

    const change_pass_status1 = () => {
        set_pass_status1(!pass_is_hidden1);
    }

    let pass_type = (pass_is_hidden1 ? "password" : "text");


    return (
        <div className="form_item">
            <input className={props.input_class ? "form_input" : "form_input err"}
                type={props.input_type === "password" ? pass_type : props.input_type}
                id={props.input_id}
                placeholder={props.placeholder}
                onChange={props.change}
                onKeyUp={props.validatePassword}
                value={props.input_value}
            />
            {(props.input_type === "password")
                &&
                <i className={pass_is_hidden1 ? "fa fa-eye-slash" : "fa fa-eye"}
                    onClick={change_pass_status1}>
                </i>
            }
            <label htmlFor={props.input_id} className="animated-label"></label>
            <div className="err_div">
                <div className="loader">{
                    (!props.input_class && props.error_signal)
                    &&
                    <BounceLoader color={"red"} size={15} />
                }
                </div>
                {
                    (!props.input_class)
                    &&
                    <div className={props.error_signal ? "error_message active" : "error_message"}>
                        {props.error_message}
                    </div>
                }
            </div>
        </div>
    );
}