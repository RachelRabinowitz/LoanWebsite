import React from 'react'
import './../../shared/comp.css'
import './GemachPage.css'
import GemachNav from './../GemachNav/GemachNav'
import About from './../About/About'
import Contact from './../Contact/Contact'
import LoanRequest from './../LoanRequest/LoanRequest'
import LoanRepayment from './../LoanRepayment/LoanRepayment'


export default function GemachPage(props) {
    let name = props.match.params.id;
    let userLogged = props.userStatus;
    let changeRepay = props.changeRepay;

    return (
        <div className="gemach_page_container">
            {
                !(userLogged)
                &&
                <div className="before_login">
                    <h2><br />Please Sign in to take action</h2>
                </div>
            }
            {
                (userLogged)
                &&
                <div className="gemach_page">
                    <GemachNav />
                    <div className="home_head">
                        {"Welcom to " + name}
                    </div>
                    <About name={name} />
                    <Contact name={name} />
                    <LoanRequest name={name} />
                    <LoanRepayment name={name} changeRepay={changeRepay} />
                </div>
            }

        </div>
    );
}
