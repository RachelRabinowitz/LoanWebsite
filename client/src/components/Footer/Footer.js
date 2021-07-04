import React, { useState } from 'react'

import './Footer.css'
import './../../shared/comp.css'
import { toastContainer, show_message, show_error_message } from './../../shared/publicFunctions'


import { getItem, deleteItem } from './../../service/DataBase'

export default function Footer({ history, setUserStatus, userStatus }) {
    const [fullFooter, setFullFooter] = useState("true");

    const change_footer_status = () => {
        setFullFooter(!fullFooter);
    }


    const unsubscribe = async () => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (user === null) {
            show_error_message(<i className="fa fa-exclamation-circle"> You must be logged in to unsubscribe </i>);
        }
        else {
            let userJson = await getItem('users', user.id);
            if (userJson.loans !== undefined) {
                if (userJson.loans.length === 0 && userJson.gemachim.length === 0) {
                    let res = await deleteItem('users', user.id)
                    if (res === "succeed") {
                        sessionStorage.removeItem('user')
                        show_message(<i className="fa fa-sign-out">  Good bye  :)</i>);
                        setUserStatus();
                    }
                    else if (res === "exist") {
                        show_error_message(<i>Before unsubscribing be sure to end your loans repayments and remove Gemachim owned by you</i>)
                    }
                    else if (res === "failed") {
                        alert("delition failed")
                    }
                }
                else {
                    show_error_message(<i>Before unsubscribing be sure to end your loans repayments and remove Gemachim owned by you</i>)
                }
            }
        }
    }


    return (
        <div className={fullFooter ? "footer footer_up" : "footer footer_down"}>
            <div></div>
            <button className="footer_status_btn" onClick={change_footer_status}>
                {
                    (fullFooter)
                    &&
                    <i className="fa fa-chevron-down"></i>
                }
                {
                    (!fullFooter)
                    &&
                    <i className="fa fa-chevron-up"></i>
                }
            </button>
            <button className="unsubscribe" onClick={unsubscribe} >
                <h3><i className="fa fa-user-times"> Unsubscribe</i></h3>
            </button>
            <div className="copy_right">
                Copy rights <i className="fa fa-copyright"></i>
            </div>
            {toastContainer()}
        </div>
    );
}

