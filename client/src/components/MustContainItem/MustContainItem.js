
import React from 'react'

import './MustContainItem.css'

const MustContainItem = props => {


    const { data } = props
    const label = data[0]
    const meetsReq = data[1]

    const setClass = () => {
        const classArr = ["must_line"]
        if (meetsReq)
            classArr.push('cross_out')
        return classArr.join(' ')

    }

    return (
        <div className="MustContainItem">
            <div className="must_item">
                <li className={!meetsReq ? "must_text" : "must_text ok"}>{label}</li>
                <div className={setClass()}></div>
            </div>
        </div>
    );
}

export default MustContainItem;
