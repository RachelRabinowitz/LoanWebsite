import React, { useState, useEffect } from 'react'
import './Manager.css'
import { update, getItem, deleteItem } from './../../service/DataBase'
import { toastContainer, show_message, send_email } from '../../shared/publicFunctions'


export default function Manager({ userStatus, isManager, userIsNotManager, changeGenDet }) {


    const [gemachim, setGemachim] = useState([]);
    const [gemachimDetails, setGemachimDetails] = useState([]);
    const [borrowersDetails, setBorrowersDetails] = useState([]);
    let tempGemachimNames = [];
    let tempGemachim = [];
    let tempBors = [];


    useEffect(async () => {
        let gemach;
        let borrower;
        let details = {};
        if (userStatus && isManager) {
            let currentUser = JSON.parse(sessionStorage.getItem("user"));
            if (currentUser !== null) {
                let user = await getItem('users', currentUser.id);
                if (user !== null && user !== undefined && user.gemachim !== undefined) {
                    setGemachim(user.gemachim);
                    for (let i = 0; i < user.gemachim.length; i++) {
                        gemach = await getItem('gemachim', user.gemachim[i]);
                        tempGemachim.push(gemach);
                        setGemachimDetails([...tempGemachim])
                        let currentBorrwers = [];
                        if (gemach !== null && gemach !== undefined && gemach.borrowers !== undefined) {
                            for (let j = 0; j < gemach.borrowers.length; j++) {
                                borrower = await getItem('users', gemach.borrowers[j]);
                                if (borrower !== null && borrower.loans !== undefined) {
                                    for (let k = 0; k < borrower.loans.length; k++) {
                                        if (borrower.loans[k].id === user.gemachim[i]) {
                                            details = borrower.loans[k]
                                            break;
                                        }
                                    }
                                    currentBorrwers.push({
                                        id: borrower.id,
                                        name: borrower.firstName + ' ' + borrower.lastName,
                                        comPayments: details.comPayments,
                                        remainPayments: details.remainPayments,
                                        refundAmount: Math.round(Number(tempGemachim[i].loansAmount) / (details.comPayments + details.remainPayments))
                                    });
                                }
                            }
                        }
                        tempBors.push(currentBorrwers);
                        setBorrowersDetails([...tempBors])
                    }
                }
            }
        }
    }, [{...userStatus}, isManager])

    const loan = async (gemachName, loanAmount, paymentAmount, userId, i, j) => {
        let toIncreaseBorrow = 0;
        let loan = {
            id: gemachName,
            loanAmount: loanAmount,
            comPayments: 0,
            remainPayments: paymentAmount
        }
        let user = await getItem('users/', userId);
        if (user !== null) {
            if (user.loansCount === 0) {
                toIncreaseBorrow = 1;
            }
            let userLoans = user.loans;
            userLoans.push(loan);
            tempGemachim = [...gemachimDetails];
            let updateRequest = tempGemachim[i].requests;
            let updateBorrowers = tempGemachim[i].borrowers;
            updateRequest.splice(j, 1);
            updateBorrowers.push(userId)
            tempGemachim[i] = { ...tempGemachim[i], ...{ requests: updateRequest, borrowers: updateBorrowers } }
            tempBors = [...borrowersDetails];
            tempBors[i].push({
                id: user.id,
                name: user.firstName + ' ' + user.lastName,
                comPayments: 0,
                remainPayments: paymentAmount,
                refundAmount: Number(tempGemachim[i].loansAmount) / paymentAmount
            });
            let res = await update('users', userId, { loans: userLoans, loansCount: Number(user.loansCount) + 1, gemachId: gemachim[i], requests: updateRequest, borrowers: updateBorrowers });
            if (res === "succeed") {
                setGemachimDetails([...tempGemachim]);
                setBorrowersDetails([...tempBors])
                changeGenDet()
                let gDetails = await getItem('generalDetails', 1);
                let details = { loansNum: Number(gDetails.loansNum) + 1, borrowersNum: Number(gDetails.borrowersNum) + toIncreaseBorrow }
                await update('generalDetails', 1, details);
            }
        }
        else {
            tempGemachim = [...gemachimDetails];
            let updateRequest = tempGemachim[i].requests;
            updateRequest.splice(j, 1);
            tempGemachim[i] = { ...tempGemachim[i], ...{ requests: updateRequest} }
            setGemachimDetails([...tempGemachim]);
            alert("User is not exist")
        }
    }


    const removeGemach = async (gemachName, i) => {
        let gemach = await getItem('gemachim', gemachName);
        if (gemach !== null && gemach !== undefined && gemach.borrowers !== undefined && gemach.requests !== undefined) {
            if (gemach.borrowers.length === 0) {
                let currentUser = JSON.parse(sessionStorage.getItem("user"));
                if (currentUser !== null) {
                    let user = await getItem('users', currentUser.id);
                    if (user !== null && user !== undefined && user.gemachim !== undefined) {
                        let res = await deleteItem('gemachim', gemachName);
                        if (res === "succeed") {
                            let gemachimList = user.gemachim;
                            gemachimList.splice(i, 1);
                            let someData = { gemachim: gemachimList }
                            if (gemachimList.length === 0) {
                                someData = { ...someData, ...{ type: "client" } }
                                userIsNotManager();
                            }
                            tempGemachimNames = [...gemachim];
                            tempGemachimNames.splice(i, 1);
                            setGemachim(tempGemachimNames);
                            tempGemachim = [...gemachimDetails];
                            tempGemachim.splice(i, 1);
                            setGemachimDetails(tempGemachim);
                            await update('users', user.id, someData);
                            let gDetails = await getItem('generalDetails', 1);
                            let details = { gemachimNum: Number(gDetails.gemachimNum) - 1 }
                            await update('generalDetails', 1, details);
                        }
                        else if (res === "exist") {
                            show_message(<i>Please wait until borrowers finish repaying loans</i>)
                        }
                        else if (res === "exist") {
                            alert("delition failed")
                        }
                    }
                }
            }
            else {
                show_message(<i>Please wait until borrowers finish repaying loans</i>)
            }
        }
    }

    return (
        <div id="manager">
            {
                (gemachimDetails !== undefined)
                &&
                gemachimDetails.map((item, i) => {
                    return (<div key={i}>
                        <h4>{gemachim[i] + " :"}</h4>
                        <h6>Requests:</h6>
                        <div className="gemach_reqs">
                            {
                                (item !== null && item !== undefined && item.requests !== undefined)
                                &&
                                item.requests.map((current, j) => {
                                    return (
                                        <div className="confirm_loan" key={current.user.id + j}>
                                            <h5 className="req">
                                                {current.user.firstName + " "}
                                                {current.user.lastName + " "}
                                                {current.user.id}
                                            </h5>
                                            <button className="form_btn" onClick={() => { loan(gemachim[i], item.loansAmount, current.paymentsNum, current.user.id, i, j) }}>Loan</button>
                                            <br />
                                        </div>)
                                })
                            }
                        </div>
                        {
                            (item === null || item === undefined || item.requests === undefined || item.requests.length === 0)
                            &&
                            <h2>   No requests .</h2>
                        }
                        <h6>Loans:</h6>
                        <div className="gemach_reqs">
                            {
                                (borrowersDetails[i] !== null && borrowersDetails[i] !== undefined)
                                &&
                                borrowersDetails[i].map((bor, k) => {
                                    return (
                                        <div className="confirm_loan bor" key={bor.id + k}>
                                            <h5>
                                                {bor.name}
                                                <br />
                                                {bor.id}
                                                <br />
                                                {"Completed payments: " + bor.comPayments}
                                                <br />
                                                {"Remaining payments: " + bor.remainPayments}
                                                <br />
                                                {"Payment amount: " + bor.refundAmount}
                                            </h5>
                                            <br />
                                        </div>)
                                })
                            }
                        </div>
                        {
                            (borrowersDetails[i] === null || borrowersDetails[i] === undefined || borrowersDetails[i].length === 0)
                            &&
                            <h2>No loans .</h2>
                        }
                        <button type="submit" className="form_btn" onClick={() => { removeGemach(gemachim[i], i) }}>
                            Remove <i className="fa fa-trash"></i>
                        </button>
                        <hr />
                    </div>)
                })
            }
            {toastContainer()}
        </div>
    )
}
