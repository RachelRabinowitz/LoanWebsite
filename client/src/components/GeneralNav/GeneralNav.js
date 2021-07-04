
import React, { useState, useEffect } from 'react'
import './GeneralNav.css';
import { useLocation, NavLink } from 'react-router-dom';


import Login from '../Login/Login'
import GemachList from '../GemachList/GemachList'


export default function GeneralNav(props) {

    let setUserStatus = props.setUserStatus;
    let setUserStatusOut = props.setUserStatusOut;
    let userStatus = props.userStatus;
    let userIsManager = props.userIsManager;
    let repayChange = props.repayChange;
    let isTopManager = props.isTopManager;

    const location = useLocation();

    const [path, setPath] = useState();

    useEffect(async () => {
        let currentPath = location.pathname;
        setPath(currentPath);
    }, [location.pathname]);

    return (
        <div className="general_navbar">
            <nav className="general_nav_content">
                <ul className="general_nav_ul">

                    <li>
                        <NavLink to="/" className="general_nav_item" exact activeclass="active">
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <div id="choose_gemach" className={((path !== undefined) && path.includes('gemachim')) ? "general_nav_item active" : "general_nav_item"} >
                            Gemach List
                            <div className="list">
                                <GemachList />
                            </div>
                        </div>
                    </li>

                    {
                        (userIsManager)
                        &&
                        <li>
                            <NavLink to="/manager" className="general_nav_item" exact activeclass="active">
                                Manager <i className="fa fa-info-circle"></i>
                            </NavLink>
                        </li>
                    }

                    {
                        (isTopManager)
                        &&
                        <li>
                            <NavLink to="/topManager" className="general_nav_item" exact activeclass="active">
                                Webmaster <i class="fa fa-globe"></i>
                            </NavLink>
                        </li>
                    }

                </ul>
            </nav>

            <div className="log_in_navbar">
                <Login setUserStatus={setUserStatus} setUserStatusOut={setUserStatusOut} userStatus={userStatus} repayChange={repayChange} />
            </div>
        </div>
    )
}
