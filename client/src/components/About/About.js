
import React, { useState, useEffect } from 'react'
import './../../shared/comp.css'
import './About.css';

import { getItem } from './../../service/DataBase'


export default function About(props) {

    let name = props.name;
    let changeDetails = props.changeDetails


    const [aboutItem, setItem] = useState({
        Item1: false,
        Item2: false,
        Item3: false,
    })


    const [generalData, setGeneralData] = useState({
        gemachim: "",
        loans: "",
        borrowers: "",
    })

    const [about, setAbout] = useState()


    useEffect(async () => {
        if (name === "general") {
            let details = await getItem('generalDetails', 1)
            setGeneralData(
                {
                    ...generalData,
                    gemachim: details.gemachimNum,
                    loans: details.loansNum,
                    borrowers: details.borrowersNum,
                });
        }
        else {
            let gabout;
            gabout = await getItem('gemachim', name)
            setAbout(gabout.about);
        }
    }, [{...changeDetails}]);



    return (
        <div className="container" id="about">
            <div className="container_div">
                <h1>About</h1>
                {
                    (name === "general")
                    &&
                    <>
                        <div className={!aboutItem.Item1 ? "about_item" : "about_item visiable"}>
                            <span id="Item1">
                                Description <i className={!aboutItem.Item1 ? "fa fa-plus" : "fa fa-minus"}
                                    onClick={() => {
                                        setItem({
                                            ...aboutItem,
                                            Item1: !aboutItem.Item1
                                        })
                                    }}></i>
                            </span>
                            {
                                aboutItem.Item1
                                &&
                                <p>
                                    The site was set up to help and facilitate others, with no goals at all
                                </p>
                            }
                        </div>
                        <div id="asp" className={!aboutItem.Item2 ? "about_item" : "about_item visiable"}>
                            <span>
                                Aspirations <i className={!aboutItem.Item2 ? "fa fa-plus" : "fa fa-minus"}
                                    onClick={() => {
                                        setItem({
                                            ...aboutItem,
                                            Item2: !aboutItem.Item2
                                        })
                                    }}></i>
                            </span>
                            {
                                aboutItem.Item2
                                &&
                                <p>
                                    Our ambition is to expand and enable loans through the site all over the world..
                                </p>
                            }
                        </div>
                        <div className={!aboutItem.Item3 ? "about_item" : "about_item visiable"}>
                            <span>
                                In Numbers <i className={!aboutItem.Item3 ? "fa fa-plus" : "fa fa-minus"}
                                    onClick={() => {
                                        setItem({
                                            ...aboutItem,
                                            Item3: !aboutItem.Item3
                                        })
                                    }}></i>
                            </span>
                            {
                                aboutItem.Item3
                                &&
                                <p>
                                    Gemachim: {generalData.gemachim}.<br />
                                    Loans: {generalData.loans}.<br />
                                    Borrowers: {generalData.borrowers}.
                                </p>
                            }
                        </div>
                    </>


                }

                {
                    (name !== "general")
                    &&
                    <div className="gemach_about">{about}</div>
                }
            </div>
        </div>

    );
}


