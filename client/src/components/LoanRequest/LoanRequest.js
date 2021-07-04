
import React, { useState, useEffect } from 'react'

import '../UserInfo/UserInfo'
import './../../shared/comp.css'
import './LoanRequest.css'

import Input from '../Input/Input'
import { banks, branches } from '../../shared/banksDetails'
import { toastContainer, formatDate, send_email } from '../../shared/publicFunctions'
import { bankAccVlidator } from '../../shared/validation';
import { update, getItem } from '../../service/DataBase'
import { animateScroll as scroll } from "react-scroll";




export default function LoanRequest({ name }) {


    const [right, setChevronRight] = useState("true");
    const [left, setChevronLeft] = useState();
    const [loanSuccess, setLoanSuccess] = useState(false);
    const [didntBor, setDidntBor] = useState(true);

    const [loanDetails, setLoanDetails] = useState({
        loansDate: "",
        bankNumber: "",
        branchNumber: "",
        accNumber: "",
        paymentsNum: 0,
        req1: false,
        req2: false,
        req3: false,
        req4: false,
        req5: false,
    });

    const [errorSignal, setErrorSignal] = useState();

    const [gemachData, setGemachData] = useState(null);

    useEffect(async () => {
        let gemach = await getItem('gemachim', name);
        setGemachData(gemach);
        let user = JSON.parse(sessionStorage.getItem('user'));
        for (let i = 0; i < [...gemach.borrowers].length; i++) {
            if (gemach.borrowers[i] === user.id) {
                setDidntBor(false);
                break;
            }
        }
        for (let j = 0; j < gemach.requests.length; j++) {
            if (gemach.requests[j].user.id === user.id) {
                setDidntBor(false);
                break;
            }
        }
    }, []);

    const reqCheck = () => {
        let oneFalse = false;
        for (let i = 1; i < 6; i++) {
            if (!loanDetails["req" + i]) {
                if (oneFalse) {
                    return false;
                }
                else {
                    oneFalse = true;
                }
            }
        }
        return true;
    }
    let accValidation = (loanDetails.accNumber !== "" &&
        bankAccVlidator(loanDetails.bankNumber, loanDetails.branchNumber, loanDetails.accNumber))

    let step1 = right && !left;
    let step2 = right && left;
    let step3 = !right && left;
    let requirements = reqCheck();
    let paymentsNum = loanDetails.paymentsNum;
    let step = step1 ? "step1" : step2 ? "step2" : "step3"

    const loanRight = () => {
        if (right && left) {
            setChevronRight(false);
        }
        else {
            setChevronLeft(true);
        }
    }

    const loanLeft = () => {
        if (right && left) {
            setChevronLeft(false);
        }
        else {
            setChevronRight(true);
        }
    }

    const change = (event) => {
        setLoanDetails(
            {
                ...loanDetails,
                [event.target.id]: event.target.value.split(" ")[0].replace(/\D/g, "")
            });
    }


    const changeCheck = (event) => {
        setLoanDetails(
            {
                ...loanDetails,
                [event.target.id]: event.target.checked
            });
    }

    const successMessage = () => {
        setLoanSuccess(true);
        setTimeout(() => {
            setLoanSuccess(false);
            scroll.scrollToTop();
        }, 5000);
    }

    const submitHandler = async () => {
        if (didntBor && accValidation && requirements && (paymentsNum > 0)) {
            let user = JSON.parse(sessionStorage.getItem('user'))
            let request = {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                },
                paymentsNum: loanDetails.paymentsNum,
                date: formatDate()
            }
            let res = await update('gemachim', name, { action: "addRequest", request: request, user: user });
            if (res === "succeed") {
                setChevronRight(true);
                setChevronLeft(false);
                setLoanDetails({
                    ...loanDetails,
                    loansDate: "",
                    bankNumber: "",
                    branchNumber: "",
                    accNumber: "",
                    paymentsNum: 0,
                    req1: false,
                    req2: false,
                    req3: false,
                    req4: false,
                    req5: false,
                })
                successMessage();
                setTimeout(() => {
                    setDidntBor(false);
                }, 5000);
            }
        }
    }


    return (
        <div className="container" id="loan">
            <div className="container_div">
                {
                    (!didntBor)
                    &&
                    <h2>
                        <br />You have already applied for a loan from this Gemach,
                        <br /> Please wait for the refund to finish.

                    </h2>
                }
                {
                    (didntBor)
                    &&
                    <div className={step}>
                        <div className="row">
                            <div id="line">
                            </div>
                            <div className="col_xs_12 steps_icons">
                                <div className="col_sm_4">
                                    <div className="step3_icon step3_icon_he">
                                    </div>
                                    <div className={step1 ? "step_num active" : "step_num"}>
                                        1</div>
                                    <p>requirements</p>
                                </div>
                                <div className="col_sm_4">
                                    <div className="step2_icon">
                                    </div>
                                    <div className={step2 ? "step_num active" : "step_num"}>
                                        2</div>
                                    <p>Account detaiks</p>
                                </div>
                                <div className="col_sm_4">
                                    <div className="step1_icon step1_icon_he">
                                    </div>
                                    <div className={step3 ? "step_num active" : "step_num"}>
                                        3</div>
                                    <p>Send request details</p>
                                </div>
                            </div>
                        </div>
                        {
                            (loanSuccess)
                            &&
                            <h2>Your request has been successfully received</h2>
                        }
                        {
                            (!loanSuccess)
                            &&
                            <div className={step1 ? "loan_container step1" : step2 ? "loan_container step2" : "loan_container step3"}>

                                {
                                    (left)
                                    &&
                                    <button className="loan_chevron left" onClick={loanLeft}>
                                        <i className="fa fa-chevron-left"></i>
                                    </button>

                                }
                                {
                                    (step1)
                                    &&
                                    <div id="part1" className="loan_parts inner_part">
                                        <div className="reqs">
                                            {
                                                (gemachData != null)
                                                &&
                                                gemachData.requirements.map((req, i) => {
                                                    return <div className="loan_req">
                                                        <input type="checkbox" checked={loanDetails["req" + Number(i + 1)]} id={"req" + Number(i + 1)} value={loanDetails["req" + Number(i + 1)]} onChange={changeCheck} />
                                                        <label className="check_label">{req}</label>
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <h2 id="part1_h2">Please mark the criteria you meet,
                                            <br />
                                            (at least four)
                                        </h2>
                                    </div>
                                }

                                {
                                    (step2)
                                    &&
                                    <div id="part2" className="loan_parts">
                                        <div className="inner_part">
                                            <div>
                                                <select id="bankNumber" className="join_select" onChange={change}>
                                                    {
                                                        (loanDetails.bankNumber === "")
                                                        &&
                                                        <option value="" selected disabled hidden>Choose bank</option>
                                                    }
                                                    <optgroup label="Banks:">
                                                        {
                                                            banks.map((bank) => {
                                                                return <option value={"bank" + bank.id} selected={loanDetails.bankNumber === String(bank.id)} key={bank.id}>{bank.text}</option>
                                                            })
                                                        }
                                                    </optgroup>
                                                </select>
                                                <select id="branchNumber" className="join_select" onChange={change}>
                                                    {
                                                        (loanDetails.branchNumber === "")
                                                        &&
                                                        <option value="" selected disabled hidden>Choose branch</option>
                                                    }
                                                    {
                                                        (loanDetails.bankNumber !== "")
                                                        &&
                                                        <optgroup label="Branches:">
                                                            {
                                                                branches["bank" + String(loanDetails.bankNumber)].map((branch) => {
                                                                    return <option value={branch} selected={loanDetails.branchNumber === branch.split(" ")[0].replace(/\D/g, "")} key={branch}>{branch}</option>
                                                                })
                                                            }
                                                        </optgroup>
                                                    }
                                                </select>

                                                <Input
                                                    input_class={accValidation}
                                                    input_type="number"
                                                    input_id="accNumber"
                                                    placeholder="Account number"
                                                    change={change}
                                                    input_value={loanDetails.accNumber}
                                                    error_signal={errorSignal}
                                                    error_message="Account details are invalid"
                                                />
                                            </div>
                                            <div className="loan_radio">
                                                {
                                                    (gemachData != null)
                                                    &&
                                                    gemachData.payments.map((payment) => {
                                                        return <div key={payment}><input id="paymentsNum" type="radio" name="payments" value={payment} onChange={change} checked={loanDetails.paymentsNum === payment} />
                                                            <label htmlFor="payments">{payment}</label><br /></div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    (step3)
                                    &&
                                    <div id="part3" className="loan_parts">
                                        <div className="inner_part">
                                            <h2>On submit,<br /> gemach owner will recive the ask and contact you</h2>
                                            <button className="form_btn" onClick={submitHandler}>Send request</button>
                                        </div>
                                    </div>
                                }
                                {
                                    (right)
                                    &&
                                    <button className="loan_chevron right" onClick={loanRight}
                                        disabled={(!requirements && (step === "step1")) || ((!accValidation || !(paymentsNum > 0)) && (step === "step2"))}
                                    >
                                        <i className="fa fa-chevron-right"></i>
                                    </button>
                                }
                            </div>
                        }
                        {toastContainer()}

                    </div>
                }
            </div>
        </div>
    );
}
