
import React from 'react'
import './Home.css';

import HomeNav from './../HomeNav/HomeNav'
import News from './../News/News'
import About from './../About/About'
import Contact from './../Contact/Contact'
import JoinCommunity from './../JoinCommunity/JoinCommunity'
import Donate from './../Donate/Donate'


export default function Home(props) {

    let userStatus = props.userStatus;
    let setToManager = props.setToManager;
    let changeGenDet = props.changeGenDet;
    let changeDetails = props.changeDetails;

    return (
        <div className="home_container">
            <div className="home">
                <HomeNav />
                <div className="home_head">
                    Welcom to loan Gemachim site
                    <br />
                    " ישראל ערבים זה לזה "
                    <br />
                    {/* Israel arevim ze laze */}
                </div>
                <News />
                <About name="general" changeDetails={changeDetails} />
                <Contact name="general" />
                <JoinCommunity userStatus={userStatus} setToManager={setToManager} changeGenDet={changeGenDet} />
                <Donate />
            </div>
        </div>
    );
}

