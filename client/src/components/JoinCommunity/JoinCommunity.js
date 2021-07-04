import React, { useState } from 'react'
import { Link, animateScroll as scroll } from "react-scroll";

import './../../shared/comp.css'

import Input from './../Input/Input'
import './JoinCommunity.css';

import { banks, branches } from './../../shared/banksDetails'
import { text_validate, bankAccVlidator } from './../../shared/validation';
import { update, getItem, add } from './../../service/DataBase'
import { toastContainer, show_error_message } from '../../shared/publicFunctions'


export default function GemachList(props) {

    let userStatus = props.userStatus;
    let setToManager = props.setToManager;
    let changeGenDet = props.changeGenDet;

    const [joinDetails, setJoinDetails] = useState({
        gName: "",
        req1: "",
        req2: "",
        req3: "",
        req4: "",
        req5: "",
        bankNumber: "",
        branchNumber: "",
        accNumber: "",
        loansAmount: "",
        paymentsNum1: "",
        paymentsNum2: "",
        about: "",
        joinPaypal: ""
    });


    const [errorSignal, setErrorSignal] = useState();
    const [joinSuccess, setJoinSuccess] = useState(false);


    let accValidation = (joinDetails.accNumber !== "" &&
        bankAccVlidator(joinDetails.bankNumber, joinDetails.branchNumber, joinDetails.accNumber))
    let reqClass = (text_validate(joinDetails.req1) &&
        text_validate(joinDetails.req2) &&
        text_validate(joinDetails.req3) &&
        text_validate(joinDetails.req4) &&
        text_validate(joinDetails.req5));
    let nameClass = (joinDetails.gName.length >= 2)
    let loanClass = (1500 <= Number(joinDetails.loansAmount))
    let paymentsClass1 = (8 <= Number(joinDetails.paymentsNum1))
    let paymentsClass2 = (10 <= Number(joinDetails.paymentsNum2) &&
        Number(joinDetails.paymentsNum1) !== Number(joinDetails.paymentsNum2))
    let aboutClass = text_validate(joinDetails.about)
    let paypalClass = joinDetails.joinPaypal.length >= 2
    let detailsAreOk = (reqClass && nameClass && accValidation && loanClass && paymentsClass1 && paymentsClass2 && aboutClass && paypalClass)


    const change = (event) => {
        setJoinDetails(
            {
                ...joinDetails,
                [event.target.id]: event.target.value.split(" ")[0].replace(/\D/g, ""),
            });

    }

    const changeStr = (event) => {
        setJoinDetails(
            {
                ...joinDetails,
                [event.target.id]: event.target.value,
            });

    }

    const successMessage = () => {
        setJoinSuccess(true);
        setTimeout(() => {
            setJoinSuccess(false);
            scroll.scrollToTop();
        }, 5000);
    }

    const failedToSubmit = () => {
        setErrorSignal(true);
        setTimeout(() => {
            setErrorSignal(false);
        }, 3000);
    }

    const submit_handler = async (event) => {
        event.preventDefault();
        if (detailsAreOk) {
            let tempGemach = await getItem('gemachim', joinDetails.gName);
            if ((tempGemach === null || tempGemach.id !== joinDetails.gName)) {
                let tempUser = JSON.parse(sessionStorage.getItem('user'));
                let gemach = {
                    id: joinDetails.gName,
                    manager: {
                        id: tempUser.id,
                    },
                    borrowers: [],
                    requirements: [
                        joinDetails.req1,
                        joinDetails.req2,
                        joinDetails.req3,
                        joinDetails.req4,
                        joinDetails.req5,],
                    accountDetails: {
                        bank: joinDetails.bankNumber,
                        branch: joinDetails.branchNumber,
                        account: joinDetails.accNumber,
                    },
                    loansAmount: joinDetails.loansAmount,
                    payments: [
                        joinDetails.paymentsNum1,
                        joinDetails.paymentsNum2,],
                    requests: [],
                    about: joinDetails.about,
                    havePaypal: joinDetails.joinPaypal
                }
                let res = await add('gemachim', gemach)
                if (res === "succeed") {
                    changeGenDet()
                    setJoinDetails({
                        ...joinDetails,
                        gName: "",
                        req1: "",
                        req2: "",
                        req3: "",
                        req4: "",
                        req5: "",
                        bankNumber: "",
                        branchNumber: "",
                        accNumber: "",
                        loansAmount: "",
                        paymentsNum1: "",
                        paymentsNum2: "",
                        about: "",
                        joinPaypal: ""
                    });
                    successMessage();
                    sessionStorage.setItem('user', JSON.stringify({ ...tempUser, ...{ type: "manager" } }));
                    setTimeout(() => {
                        setToManager();
                    }, 3000);
                }
                else {
                    alert("joining failed")
                }
            }
            else {
                show_error_message(<i className="fa fa-exclamation-circle">  There is already a gamach with this name</i>)
            }
        }
        else {
            failedToSubmit();
        }
    }


    return (
        <div className="container" id="join_community">
            <div className="container_div">
                <h1>Join our Community</h1>
                {
                    (joinSuccess)
                    &&
                    <h2>Gemach details were successfully received,
                        <br />
                        Congratulations on joining the community of lenders on the site
                    </h2>
                }
                {
                    (userStatus && !joinSuccess)
                    &&
                    <div >
                        <div className="_form">
                            <form id="join_doc" className="form_doc" onSubmit={submit_handler}>
                                <Input
                                    input_class={nameClass}
                                    input_type="text"
                                    input_id="gName"
                                    placeholder="Gemach name"
                                    change={changeStr}
                                    input_value={joinDetails.gName}
                                    error_signal={errorSignal}
                                    error_message={"Please enter new gemach name"}
                                />
                                <div className="join_req">
                                    <h3>Requirements:</h3>
                                    {
                                        ["req1", "req2", "req3", "req4"].map((req) => {
                                            return (<Input
                                                input_class={true}
                                                input_type="text"
                                                input_id={req}
                                                placeholder={"requirement " + req[3]}
                                                change={changeStr}
                                                input_value={joinDetails[req]}
                                                error_signal={false}
                                            />)
                                        })
                                    }
                                    <Input
                                        input_class={reqClass}
                                        input_type="text"
                                        input_id="req5"
                                        placeholder="req5"
                                        change={changeStr}
                                        input_value={joinDetails.req5}
                                        error_signal={errorSignal}
                                        error_message={"Please enter the five requirements for borrowers"}
                                    />
                                    <Input
                                        input_class={aboutClass}
                                        input_type="text"
                                        input_id="about"
                                        placeholder="Tell us something about your gemach"
                                        change={changeStr}
                                        input_value={joinDetails.about}
                                        error_signal={errorSignal}
                                        error_message="Please insert some information"
                                    />
                                    <button type="submit" className="form_btn">
                                        {
                                            (!detailsAreOk)
                                            &&
                                            "Join"
                                        }
                                        {
                                            (detailsAreOk)
                                            &&
                                            <Link to="join_community" onClick={submit_handler} spy={true} smooth={true} offset={-150} duration={500}>Join</Link>
                                        }
                                    </button>
                                </div>
                            </form>

                            <div>
                                <select id="bankNumber" className="join_select" onChange={change}>
                                    <option value="" selected disabled hidden>Choose bank</option>
                                    <optgroup label="Banks:">
                                        {
                                            banks.map((bank) => {
                                                return <option value={"bank" + bank.id} key={bank.id}>{bank.text}</option>
                                            })
                                        }
                                    </optgroup>
                                </select>
                                <select id="branchNumber" className="join_select" onChange={change}>
                                    <option value="" selected disabled hidden>Choose branch</option>
                                    {
                                        (joinDetails.bankNumber !== "")
                                        &&
                                        <optgroup label="Branches:">
                                            {
                                                branches["bank" + String(joinDetails.bankNumber)].map((branch) => {
                                                    return <option value={branch} key={branch}>{branch}</option>
                                                })
                                            }
                                        </optgroup>
                                    }
                                </select>
                                <form id="join_sub_doc" className="form_doc">

                                    <Input
                                        input_class={accValidation}
                                        input_type="number"
                                        input_id="accNumber"
                                        placeholder="Account number"
                                        change={change}
                                        input_value={joinDetails.accNumber}
                                        error_signal={errorSignal}
                                        error_message="Account details are invalid"
                                    />
                                    <Input
                                        input_class={loanClass}
                                        input_type="number"
                                        input_id="loansAmount"
                                        placeholder="loans Amount"
                                        change={change}
                                        input_value={joinDetails.loansAmount}
                                        error_signal={errorSignal}
                                        error_message="Please enter amount of the loans"
                                    />
                                    <h3>payments:</h3>
                                    <Input
                                        input_class={paymentsClass1}
                                        input_type="number"
                                        input_id="paymentsNum1"
                                        placeholder="Option 1"
                                        change={change}
                                        input_value={joinDetails.paymentsNum1}
                                        error_signal={errorSignal}
                                        error_message="Payment number, at least 8"
                                    />
                                    <Input
                                        input_class={paymentsClass2}
                                        input_type="number"
                                        input_id="paymentsNum2"
                                        placeholder="Option 2"
                                        change={change}
                                        input_value={joinDetails.paymentsNum2}
                                        error_signal={errorSignal}
                                        error_message="Payment number, at least 10"
                                    />
                                    <div>Have a paypal account?
                                        <br /> insert your client id and be able to get payment with paypal.
                                        <br />
                                        if not, please create account before join community:<br />
                                        <a id="join_paypal" href="https://www.paypal.com/ca/for-you/account/create-account" target="_blank">Create Paypal account</a>
                                    </div>

                                    <Input
                                        input_class={paypalClass}
                                        input_type="text"
                                        input_id="joinPaypal"
                                        change={changeStr}
                                        input_value={joinDetails.joinPaypal}
                                        error_signal={errorSignal}
                                        error_message="Please insert paypal client Id"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                }
                {
                    (!userStatus)
                    &&
                    <h2><br />Please log in before joining community</h2>
                }
            </div>
            {toastContainer()}
        </div>
    );
}
