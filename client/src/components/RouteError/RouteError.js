import React from 'react'
import './RouteError.css';





export default function RouteError({ history }) {

    const Go_back = () => {
        history.push('/');
    }
    
    return (
        <div className="error">
            <h2>404 <br /> PAGE NOT FOUND</h2>
            <div className="item pulse_button">
                <div className="err_btn_wrapper">
                    <div className="pulsing"></div>
                    <button onClick={Go_back} className="error_btn">Go Homepage</button>
                </div>
            </div>


        </div>
    )
}

