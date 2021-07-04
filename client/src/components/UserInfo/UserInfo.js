import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from "react-copy-to-clipboard";

import './UserInfo.css';
import { getItem } from './../../service/DataBase'



export default function UserInfo(props) {

  let repayChange = props.repayChange

  const [is_copied, set_is_copied] = useState(false);

  const on_text_copy = () => {
    set_is_copied(true);
    setTimeout(() => {
      set_is_copied(false);
    }, 1500);
  }


  const [userData, setUserData] = useState();
  const [copyData, setcCopyData] = useState();

  useEffect(async () => {
    let user = JSON.parse(sessionStorage.user);
    let userD = await getItem('users', user.id)
    if (userD !== null && userD !== undefined && userD.loans !== undefined && userD.loans[0] !== undefined) {

      setcCopyData(userD.loans.map((item) => {
        return "Gemach name: " + item.id
          + "\t\n         Loans amount: " + item.loanAmount
          + "\t\n         Completed payments: " + item.comPayments
          + "\t\n         Remaining payments: " + item.remainPayments + '\n'
      }));

      setUserData(<table>
        <tr className="head">
          <td>Gemach name: </td>
          <td>Loans amount: </td>
          <td>Completed payments: </td>
          <td>Remaining payments: </td>
        </tr>
        <br />
        {userD.loans.map(item => (
          <tr className="data">
            <td>{item.id}</td>
            <td>{item.loanAmount}</td>
            <td>{item.comPayments}</td>
            <td>{item.remainPayments}</td>
          </tr>
        ))}
      </table>)
    }
    else {
      setUserData("No Loans")
    }
  }, [{ ...repayChange }]);




  return (
    <div className="info_container">
      <div>{userData}</div>
      {
        (userData !== "No Loans")
        &&
        <CopyToClipboard text={copyData} onCopy={on_text_copy}>
          <span>{is_copied ? "Copied!" : <i className="fa fa-copy" title="Copy information to Clipboard"></i>}</span>
        </CopyToClipboard>}
    </div>
  );
}

