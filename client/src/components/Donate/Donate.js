
import React, { useState } from 'react'
import { Link } from "react-scroll"

import './../UserInfo/UserInfo'

import Paypal from './../Paypal/Paypal'
import './../../shared/comp.css'
import './Donate.css';

import { email_validate } from './../../shared/validation';

import logo from './../../assets/image/logo.png'






export default function Donate({ history }) {

    const [email, setEmail] = useState();

    let email_class = email_validate(email);



    return (
        <div className="container" id="donate">
            <div className="container_div">
                <div className="form_head">
                    <h1 className="form_title">Donate</h1>
                    <img className="logo_in_form" src={logo} alt="Logo" />
                </div>
                <div className="_form">
                    <div className="donate_div">
                        <div>
                            <div>Wants to help us fulfill
                                    <Link to="asp" className="aboutLink" spy={true} smooth={true} offset={-150} duration={1000}> Aspirations</Link>
                            </div>
                            <br />
                            <div className="pay paypal_wrapper">
                                <Paypal history={history} email={email} clientId="AVwnwrN2jGTwMU_M3AQDRLIx_TkTVbVS-aVqEotbS2O_5IciP9zyHQHRqEwlkdy8Yu7m4Gbk4CctgBTf" />
                            </div>

                        </div>

                        <div>
                            <input className={email_class ? "" : "err"}
                                type="text"
                                id="Email"
                                placeholder="email@example.com"
                                onChange={(event) => { setEmail(event.value) }}
                                value={email}
                                required />
                            <div className="error_message">
                                {
                                    (!email_class)
                                    &&
                                    "invalid email"
                                }
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div >
    );

}