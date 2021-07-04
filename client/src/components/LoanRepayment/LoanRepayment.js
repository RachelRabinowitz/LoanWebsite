import React, { useState, useEffect } from 'react'
import './../../shared/comp.css'
// import './LoanRepayment.css';
import Paypal from './../Paypal/Paypal'
import { update, getItem } from './../../service/DataBase'
import { show_message } from '../../shared/publicFunctions';


export default function LoanRepayment({ history, name, changeRepay }) {

    const [repayPaypalId, setRepayPaypalId] = useState("AVwnwrN2jGTwMU_M3AQDRLIx_TkTVbVS-aVqEotbS2O_5IciP9zyHQHRqEwlkdy8Yu7m4Gbk4CctgBTf");
    const [havetoPay, setHavetoPay] = useState(false);

    useEffect(async () => {
        let tempPaypalId = await getItem('gemachim', name);
        setRepayPaypalId(tempPaypalId.havePaypal);

        let tempUser = JSON.parse(sessionStorage.getItem('user'));
        let user = await getItem('users', tempUser.id);
        let updateLoans = user.loans;
        for (let i = 0; i < updateLoans.length; i++) {
            if (updateLoans[i].id === name && updateLoans[i].remainPayments > 0) {
                setHavetoPay(true);
                return;
            }
        }
        setHavetoPay(false);
    }, []);


    const pay = async () => {
        let tempUser = JSON.parse(sessionStorage.getItem('user'));
        let res = await update('gemachim', name, { action: "repay", user: tempUser.id });
        if (res === "succeed") {
            show_message(<i className="fa fa-thumbs-o-up">  Repayment successfully recieved  :)</i>);
        }
        else if (res === "finish") {
            setHavetoPay(false);
            alert("You have finished repaying the loan")
            changeRepay();
        }
        else if (res === "failed") {
            alert("repay failed")
        }
    }

    return (
        <div className="container" id="loan_repayment">
            <div className="container_div">
                <h1>Loan Repayment</h1>
                {
                    (!havetoPay)
                    &&
                    <h2>No refund payments</h2>
                }
                {
                    (havetoPay)
                    &&
                    <div className={havetoPay ? "visible" : "hidden"}>
                        <button className="form_btn" onClick={pay}>Repay</button>
                            Or by paypal
                            <Paypal history={history} clientId={repayPaypalId} handler={pay} />
                    </div>
                }
            </div>
        </div>
    );
}
