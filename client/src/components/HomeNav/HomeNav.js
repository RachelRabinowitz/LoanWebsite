
import React from 'react'
import { Link, animateScroll as scroll } from "react-scroll";
import './HomeNav.css';
import './../../shared/InnerNav.css'



export default function HomeNav() {
    return (
        <div className="inner_navbar">
            <label htmlFor="show_navbar" className="responsive_navbar"><i className="fa fa-navicon"></i></label>
            <input type="checkbox" id="show_navbar"/>
            <nav className="inner_nav_content">
                <ul id="navbar_list" className="ul_nav">
                
                    <li>
                        <Link to="" onClick={() =>scroll.scrollToTop()} title="Back to top" className="inner_nav_item">
                            <i className="fa fa-fw fa-home"></i>
                        </Link>
                    </li>

                    <li>
                        <Link to="about" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            About
                        </Link>
                    </li>

                    <li>
                        <Link to="contact" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            Contact us
                        </Link>
                    </li>

                    <li>
                        <Link to="join_community" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            Join community
                        </Link>
                    </li>
                    <li>
                        <Link to="donate" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            Donate
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

