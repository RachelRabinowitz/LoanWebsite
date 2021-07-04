
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import './../../shared/comp.css'
import './GemachList.css';

import { getItem, getGemachim } from './../../service/DataBase'


export default function GemachList() {


    const [list, setList] = useState([])
    const [filteredList, setFilteredList] = useState([])

    const location = useLocation();
    const [path, setPath] = useState();

    const [searchValue, setSearchValue] = useState("")


    useEffect(async () => {
        let currentPath = location.pathname;
        setPath(currentPath);
    }, [location.pathname]);


    useEffect(async () => {
        let gList = await getGemachim()
        if (gList !== null) {
            setList(gList);
            let searchList = [];
            gList.map((item) => {
                searchList.push(item.id);
            })
            setFilteredList(searchList);
        }
    }, []);


    useEffect(async () => {
        search();
    }, [list, searchValue]);

    const updateList = async () => {
        let gList = await getGemachim()
        setList(gList);
    }

    const search = () => {
        let searchList = [];
        list.map((item) => {
            searchList.push(item.id);
        })
        setFilteredList(searchList.filter(item => item.includes(searchValue)));
    }


    const change = (event) => {
        setSearchValue(event.target.value);
    }


    return (
        <div className="container" id="gemachlist" onMouseOver={updateList} onMouseLeave={() => { setSearchValue("") }}>
            <div className="list_div">
                <div id="list_head">
                    <h1>Gemach List</h1>
                    <div className="search">
                        <input type="search" className="search_input" value={searchValue} onChange={change} placeholder="Search..." />
                        <button onClick={search} className="search_button" >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                <div className="gemach_list">
                    {
                        (filteredList !== undefined)
                        &&
                        filteredList.map((item) => {
                            return <a href={'http://localhost:3000/gemachim/' + item} className={((path !== null) && (path.includes(item))) ? "list_item active_link" : "list_item"} key={item}>{item}</a>
                        })
                    }
                </div>
                {
                    (filteredList.length === 0 && searchValue === "")
                    &&
                    <h2>No Gemachim.</h2>
                }
                {
                    (filteredList.length === 0 && searchValue !== "")
                    &&
                    <h2>No Gemach matches the requested search</h2>
                }
            </div>
        </div>
    );
}
