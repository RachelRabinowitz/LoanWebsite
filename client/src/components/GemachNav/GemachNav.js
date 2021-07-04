
import React from 'react'
import './GemachNav.css';
import './../../shared/InnerNav.css'
import { Link, animateScroll as scroll } from "react-scroll";





export default function GemachNav() {
    return (
        <div className="inner_navbar">
            <label htmlFor="show_navbar" className="responsive_navbar"><i className="fa fa-navicon"></i></label>
            <input type="checkbox" id="show_navbar" />
            <nav className="inner_nav_content">
                <ul id="navbar_list" className="ul_nav">

                    <li>
                        <Link to="" onClick={() => scroll.scrollToTop()} title="Back to top" className="inner_nav_item">
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
                        <Link to="loan" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            Loan
                        </Link>
                    </li>

                    <li>
                        <Link to="loan_repayment" className="inner_nav_item" spy={true} smooth={true} offset={-150} duration={500}>
                            Loan Repayment
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}

