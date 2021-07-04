import React, { useState, useEffect } from 'react'
import './TopManager.css';

import Input from './../Input/Input'
import './../../shared/comp.css'
import { update, getItem, add } from './../../service/DataBase'

export default function TopManager({ userStatus }) {


    const [newsArr, setNewsArr] = useState([]);
    const [selectedNewsArr, setSelectedNewsArr] = useState([]);
    const [addNew, setAddNew] = useState("");
    const [errorSignal, setErrorSignal] = useState();
    let tempNews = [];
    let tempSelected = [];

    let addNewClass = addNew.length > 0;

    useEffect(async () => {
        let generalDetails = await getItem('generalDetails', 1)
        setNewsArr(generalDetails.News);
        for (let i = 0; i < generalDetails.News.length; i++) {
            tempSelected.push(true);
        }
        setSelectedNewsArr(tempSelected);
    }, []);


    function change(event) {
        setAddNew(event.target.value);
    }

    function changeChek(event) {
        tempSelected = [...selectedNewsArr];
        let loc = Number(event.target.id.slice(3));
        tempSelected[loc] = event.target.checked;
        setSelectedNewsArr([...tempSelected]);
    }


    const failedToSubmit = () => {
        setErrorSignal(true);
        setTimeout(() => {
            setErrorSignal(false);
        }, 3000);
    }

    const addNewToList = async () => {
        if (addNewClass) {
            tempNews = [...newsArr]
            tempNews.push(addNew);
            let res = await update('generalDetails', 1, { News: tempNews });
            if (res === "succeed") {
                setNewsArr(tempNews);
                tempSelected = [...selectedNewsArr]
                tempSelected.push(true);
                setSelectedNewsArr(tempSelected);
                setAddNew("");
            }
        }
        else {
            failedToSubmit();
        }
    }

    const ApplyChanges = async () => {
        tempNews = [...newsArr];
        tempSelected = [...selectedNewsArr];
        for (let i = 0; i < tempNews.length; i++) {
            if (!tempSelected[i]) {
                tempNews.splice(i, 1);
                tempSelected.splice(i, 1);
                i--
            }
        }
        let res = await update('generalDetails', 1, { News: tempNews });
        if (res === "succeed") {
            setNewsArr(tempNews);
            setSelectedNewsArr(tempSelected);
        }
    }

    return (
        <div id="top_manager">
            <div>
                {
                    (newsArr !== undefined)
                    &&
                    newsArr.map((item, i) => {
                        return <div className="new_item"><input type="checkbox" id={"new" + i} checked={selectedNewsArr[i]} onChange={changeChek} />{item}<br /></div>
                    })
                }
                <button type="submit" className="form_btn" onClick={ApplyChanges}>Apply</button>

            </div>

            <div className="add_new form_doc">
                <Input
                    input_class={addNewClass}
                    input_type="text"
                    input_id="addNew"
                    placeholder="Add new"
                    change={change}
                    input_value={addNew}
                    error_signal={errorSignal}
                    error_message="Enter content to add news"
                />
                <button type="submit" className="form_btn" onClick={addNewToList}>Add <i className="fa fa-plus"></i></button>
            </div>
        </div>
    )
}
