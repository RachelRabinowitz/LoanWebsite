import React, { useState, useEffect } from 'react'
import Form from './../Form/Form'
import './../../shared/comp.css'
import './Contact.css';

import logo from './../../assets/image/logo.png'
import { send_email, toastContainer, show_message } from './../../shared/publicFunctions'
import { getItem } from './../../service/DataBase'








export default function Contact({ name }) {


    const [contact, setContact] = useState({})

    useEffect(async () => {
        let cont;
        if (name !== undefined) {
            if (name === "general") {
                cont = await getItem('generalDetails', 1)
                setContact(cont.manager);
            }
            else {
                cont = await getItem('gemachim' , name)
                setContact(cont.manager);
            }
        }

    }, []);

    function send_user_email(email, name, message) {
        send_email(contact.email, email, "manager", name, message);
        show_message(<i className="fa fa-thumbs-o-up">  The email was sent successfully  :)</i>);
    }

    return (
        <div className="container" id="contact">
            <div className="container_div">
                <h1>Contact us</h1>
                <div className="_form">

                    <div className="call_contact">
                        <img className="logo_in_contact" src={logo} alt="Logo" />

                        <h3>Call us:</h3>
                        <i className="fa fa-phone"></i> {(contact.phone !== undefined) && contact.phone}
                    </div>
                    <div className="divider">
                        <div className="divide"></div>
                        <h1>Or</h1>
                        <div className="divide"></div>
                    </div>
                    <div className="form_doc contact">
                        <Form type="Send" submit_handler={send_user_email} />
                        {toastContainer()}
                    </div>
                </div>
            </div>
        </div>
    );
}

