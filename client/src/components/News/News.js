
import React, { useState, useEffect } from 'react'
import './News.css';

import { getItem } from './../../service/DataBase'


let marquee_status = 1;



export default function GemachList() {


    const [news, setNews] = useState([])

    const [values, set_values] = useState({
        button_className: "marquee_running",
        botton_type: "||",
        button_title: "Stop update scrolling",
    });



    useEffect(async () => {
        let newsList = await getItem('generalDetails', 1)
        setNews(newsList.News);
    }, []);



    const changeStatus = () => {
        if (marquee_status === 1) {
            set_values({
                ...values,
                button_className: "marquee_paused",
                botton_type: "◄",
                button_title: "Enable update scrolling",
            });
            marquee_status = 0;
        }
        else {
            set_values({
                ...values,
                button_className: "marquee_running",
                botton_type: "||",
                button_title: "Stop update scrolling",
            });
            marquee_status = 1;
        }
    }


    return (
        <div className="news_container">
            <div className="news">
                <td className="haid">News:</td>

                <td className="marquee">
                    <div className={values.button_className}>
                        <span >
                            {
                                (news !== undefined)
                                &&
                                news.map((item) => {
                                    return item + ". "
                                })
                            }
                        </span>
                    </div>
                </td>

                <td className="tail">
                    <button className="news_button" onClick={changeStatus} title={values.button_title} >{values.botton_type}</button>
                </td>
            </div>
        </div>
    );
}
