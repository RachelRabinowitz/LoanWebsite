
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import Form from './../Form/Form'
import './../UserInfo/UserInfo'
import './../../shared/comp.css'
import './Login.css'
import logo from './../../assets/image/logo.png'
import UserInfo from './../UserInfo/UserInfo'



export default function Login(props) {

    let setUserStatus = props.setUserStatus
    let setUserStatusOut = props.setUserStatusOut;
    let repayChange = props.repayChange;

    const [logIsActive, setLogIsActive] = useState();
    const [logSign, setLogType] = useState();
    const [logStatusIn, setLogStatus] = useState();

    const [profLetters, setProfile] = useState({
        Profile: "",
    });

    const history = useHistory();
    const [avatar, setAvatar] = useState("")

    const setProf = (val) => {
        setAvatar(val)
    }

    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (user === null) {
            setLogStatus(false);
        }
        else {
            setLogStatus(true);
            setStatusToIn(true);
        }
        let prof = JSON.parse(sessionStorage.getItem('profile'));
        if (prof !== null) {
            setProf(prof.img);
        }
        else {
            setProf("");
        }
    }, [sessionStorage.getItem('user')])


    const openLogDoc = () => {
        if (!logIsActive) {
            setLogIsActive(!logIsActive);
        }
    }

    const closeLogDoc = () => {
        if (logIsActive) {
            setLogIsActive(!logIsActive);
        }
    }

    const setTypeToSign = () => {
        if (!logSign) {
            setLogType(!logSign);
        }
    }

    const setTypeToLog = () => {
        if (logSign) {
            setLogType(!logSign);
        }
    }


    const setStatusToIn = (val) => {
        let user = JSON.parse(sessionStorage.getItem('user'))
        if (user !== undefined) {
            let userProfile = user.firstName[0] + user.lastName[0];

            setProfile({
                ...profLetters,
                Profile: userProfile,
            });
        }
        if (val) {
            setUserStatus();
        }
        else {
            setUserStatusOut();
        }
    }

    function userLogOut() {
        history.push('/');
        setStatusToIn(false);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('profile')
    }


    function submit_handler() {
        closeLogDoc();
    }

    return (
        <div>
            <div className="log_entry">
                <div >
                    {
                        (!logStatusIn)
                        &&
                        <i className="fa fa-user-o"></i>
                    }

                    {
                        (logStatusIn)
                        &&
                        <div className="profile">
                            {/* <div>{profLetters.Profile}</div> */}
                            <img src={avatar} alt={profLetters.Profile} />
                        </div>
                    }
                </div>

                {
                    (!logStatusIn)
                    &&
                    <div className="log_options">
                        <button className="option" onClick={() => { setTypeToSign(); openLogDoc() }}>Sign up</button>
                        <button className="option" onClick={() => { setTypeToLog(); openLogDoc() }}>Login</button>
                    </div>
                }

                {
                    (logStatusIn)
                    &&
                    <div className="log_options">
                        <button onClick={userLogOut} className="option">Log out</button>
                        <button onClick={openLogDoc} className="option">
                            Your <i className="fa fa-info-circle"></i>
                        </button>
                    </div>
                }
            </div>

            <div id={logIsActive ? "log_is_active" : "log_not_active"} className="log_div">
                {
                    (!logStatusIn)
                    &&
                    <div id={logIsActive ? "log_is_active" : "log_not_active"} className="log_div">
                        <div className="form_doc log animate">
                            <div className="log_head">
                                <span onClick={closeLogDoc} className="close_log_div" title="Close">&times;</span>
                                <img className="logo_in_log" src={logo} alt="Logo" />
                            </div>
                            <nav>
                                <div>
                                    <ul className="ul_nav">
                                        <li className={logSign ? "log_nav active" : "log_nav"} onClick={setTypeToSign}>
                                            Sign up
                                        </li>
                                        <li className={!logSign ? "log_nav active" : "log_nav"} onClick={setTypeToLog}>
                                            Login
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                            {
                                (!logSign)
                                &&
                                <Form type="Login" func={closeLogDoc} submit_handler={submit_handler} setProf={setProf} />
                            }

                            {
                                (logSign)
                                &&
                                <Form type="Sign up" func={closeLogDoc} submit_handler={submit_handler} setProf={setProf} />
                            }

                        </div>
                    </div>
                }

                {
                    (logStatusIn)
                    &&
                    <div className="show_info animate">
                        <div className="log_head">
                            <span onClick={closeLogDoc} className="close_log_div" title="Close">&times;</span>
                        </div>
                        <UserInfo repayChange={repayChange} />
                    </div>
                }

            </div>
        </div>
    );
}
