
import React, { useState } from 'react'
import { GoogleLogin } from 'react-google-login'

import './../Login/Login.css';
import './Form.css'
import Input from './../Input/Input'
import './../../shared/comp.css'

import MustContainItem from './../MustContainItem/MustContainItem';

import { text_validate, email_validate, id_validate, phone_validate } from './../../shared/validation';
import { send_email, toastContainer, show_error_message, show_warn_message, show_light_message } from '../../shared/publicFunctions'

import { update, getItem, add } from './../../service/DataBase'


const clientId = '219371964278-fde8aue3rk4o7krrlnpueu2cesmilo1o.apps.googleusercontent.com';



const refreshTokenSetup = (res) => {
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
    const refreshToken = async () => {
        const newAuthres = await res.reloadAuthResponse();
        refreshTiming = (newAuthres.expires_in || 3600 - 5 * 60) * 1000;
        console.log('new auth res', newAuthres.id_token);
        setTimeout(refreshToken, refreshTiming);
    };
    setTimeout(refreshToken, refreshTiming);

}


export default function Form({ type, func, submit_handler, setProf }) {

    const onSuccess = async (res) => {
        console.log('[Login Success] currentUser:', res.profileObj);
        console.log(res)
        refreshTokenSetup(res);
        let tempUser = await getItem('users', res.profileObj.email)
        if (tempUser !== null && tempUser.email === res.profileObj.email) {
            sessionStorage.setItem('profile', JSON.stringify({ img: res.profileObj.imageUrl }));
            setProf(res.profileObj.imageUrl);
            sessionStorage.setItem('user', JSON.stringify(tempUser));
            submit_handler();
        }
        else {
            show_error_message(<i className="fa fa-exclamation-circle">  You are not registered</i>)
        }
    }

    const onFailure = (res) => {
        console.log('[Login Failure] res:', res);
        refreshTokenSetup(res);
    }

    const [containsUL, setContainsUL] = useState(false) // uppercase letter
    const [containsLL, setContainsLL] = useState(false) // lowercase letter
    const [containsN, setContainsN] = useState(false) // number
    const [containsSC, setContainsSC] = useState(false) // special character
    const [contains8C, setContains8C] = useState(false) // min 8 characters


    const mustContainData = [
        ["An uppercase letter (A-Z)", containsUL],
        ["A lowercase letter (a-z)", containsLL],
        ["A number (0-9)", containsN],
        ["A special character (!@#$)", containsSC],
        ["At least 8 characters", contains8C],
    ]

    const validatePassword = () => {
        if (inputValues.password.toLowerCase() !== inputValues.password) setContainsUL(true)
        else setContainsUL(false)

        if (inputValues.password.toUpperCase() !== inputValues.password) setContainsLL(true)
        else setContainsLL(false)

        if (/\d/.test(inputValues.password)) setContainsN(true)
        else setContainsN(false)

        if (/[~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(inputValues.password)) setContainsSC(true)
        else setContainsSC(false)

        if (inputValues.password.length >= 8) setContains8C(true)
        else setContains8C(false)
    }



    const [errorSignal, setErrorSignal] = useState();

    const [inputValues, setInputValues] = useState({
        firstName: "",
        lastName: "",
        id: "",
        email: "",
        phone: "",
        password: "",
        verifyPassword: "",
        message: "",
        verifyCode: "",
    });

    const [randomCode, setRandomCode] = useState({
        code: "",
        toSend: false,
        toVerify: false,
        changeDetails: false,
    });



    let fNameClass = text_validate(inputValues.firstName);
    let lNameClass = text_validate(inputValues.lastName);
    let idClass = id_validate(inputValues.id);
    let emailClass = email_validate(inputValues.email);
    let phoneClass = phone_validate(inputValues.phone);
    let passClass = (containsUL && containsLL && containsN && containsSC && contains8C);
    let verifyPassClass = (inputValues.password === inputValues.verifyPassword);
    let messageClass = text_validate(inputValues.message);
    let codeClass = (inputValues.verifyCode === randomCode.code);

    const min = 100000;
    const max = 1000000;


    const waitForEmail = () => {
        setRandomCode({
            ...randomCode,
            toSend: true,
        });
    }

    const forgatPassword = () => {
        let rand = String(Math.floor(min + Math.random() * (max - min)));
        setRandomCode(randomCode.code = rand);
    }


    const send_code = async () => {
        let isExist = false;
        let tempUser = await getItem('users', inputValues.email);
        if (tempUser !== null && tempUser.email === inputValues.email) {
            isExist = true;
        }
        if (emailClass && isExist) {
            forgatPassword();
            send_email(inputValues.email, "user", 'websiteloanfund@gmail.com',
                'Loan Website', ' Your verification code is: ' + randomCode.code);
            show_light_message(<i className="fa fa-thumbs-o-up">  Verification code sent successfully  :)</i>);
            setRandomCode({
                ...randomCode,
                toSend: false,
                toVerify: true,
            });
            setTimeout(() => {
                setRandomCode(randomCode.toVerify = false)
            }, 100000);
        }
        else if (!isExist) {
            show_error_message(<i className="fa fa-exclamation-circle">  You are not registered</i>)
        }
        else {
            failedToSubmit();
        }
    }

    const verifyCode = () => {
        if (inputValues.verifyCode === randomCode.code) {
            setRandomCode({
                ...randomCode,
                code: "",
                toVerify: false,
                changeDetails: true,
            });
        }
        else {
            failedToSubmit()
        }
    }



    const failedToSubmit = () => {
        setErrorSignal(true);
        setTimeout(() => {
            setErrorSignal(false);
        }, 3000);
    }



    function change(event) {
        setInputValues({
            ...inputValues,
            [event.target.id]: event.target.value
        });
    }

    const getGoogleProfile = async () => {
        let prof = JSON.parse(sessionStorage.getItem('profile'));
        if (prof !== null) {
            setProf(prof.img);
        }
        else {
            setProf("");
        }
    }

    let submit = async (event) => {
        event.preventDefault();
        if ((type === "Sign up") &&
            fNameClass && lNameClass
            && idClass && emailClass && phoneClass && passClass
            && verifyPassClass) {
            let user = {
                id: inputValues.id,
                type: "client",
                firstName: inputValues.firstName,
                lastName: inputValues.lastName,
                email: inputValues.email.toLowerCase(),
                phone: inputValues.phone,
                password: inputValues.password,
                loans: [],
                loansCount: 0,
                gemachim: []
            };
            let res = await add('users', user);
            if (res === "succeed") {
                sessionStorage.setItem('user', JSON.stringify(user));
                getGoogleProfile();
                submit_handler();
            }
            else if (res === "failed") {
                alert("login failed")
            }
            else if (res === "exist") {
                show_warn_message(<i className="fa fa-warning"> one or more of the details are not ok </i>)
            }
        }

        else if (type === "Login" && idClass && emailClass &&
            ((passClass && verifyPassClass) || !randomCode.changeDetails)) {
            let tempUser = await getItem('users', inputValues.id)
            if (tempUser !== null && tempUser.id === inputValues.id && tempUser.email === inputValues.email
                && (tempUser.password === inputValues.password || randomCode.changeDetails)) {
                if (randomCode.changeDetails) {
                    await update('users', tempUser.id, { password: inputValues.password });
                    setRandomCode({
                        ...randomCode,
                        changeDetails: false,
                    });
                }
                sessionStorage.setItem('user', JSON.stringify(tempUser));
                getGoogleProfile();
                submit_handler();
            }
            else {
                show_warn_message(<i className="fa fa-warning"> one or more of the details are not ok </i>)
            }

        }

        else if (type === "Send" && fNameClass && emailClass && messageClass) {
            submit_handler(inputValues.email, inputValues.firstName, inputValues.message);
            setInputValues({
                ...inputValues,
                firstName: "",
                email: "",
                message: "",
            });
        }
        else {
            failedToSubmit();
        }
    }

    return (

        <div>
            <form className="form_doc" onSubmit={submit}>
                <div className="form_details">
                    {
                        (type === "Sign up" || type === "Send")
                        &&
                        <Input
                            input_class={fNameClass}
                            input_type="text"
                            input_id="firstName"
                            placeholder={(type === "Send") ? "Name" : "First name"}
                            change={change}
                            input_value={inputValues.firstName}
                            error_signal={errorSignal}
                            error_message={"Please insert your " + ((type === "Send") ? "name" : "first name")}
                        />
                    }
                    {
                        (type === "Sign up")
                        &&
                        <Input
                            input_class={lNameClass}
                            input_type="text"
                            input_id="lastName"
                            placeholder="Last name"
                            change={change}
                            input_value={inputValues.lastName}
                            error_signal={errorSignal}
                            error_message="Please insert your last name"
                        />
                    }
                    {
                        ((type === "Sign up") || ((type === "Login") &&
                            ((!randomCode.toSend && !randomCode.toVerify) || randomCode.changeDetails)))
                        &&
                        <Input
                            input_class={idClass}
                            input_type="number"
                            input_id="id"
                            placeholder="ID"
                            change={change}
                            input_value={inputValues.id}
                            error_signal={errorSignal}
                            error_message="Invalid id"
                        />
                    }
                    {
                        (!randomCode.toVerify)
                        &&
                        <Input
                            input_class={emailClass}
                            input_type="text"
                            input_id="email"
                            placeholder="email@example.com"
                            change={change}
                            input_value={inputValues.email}
                            error_signal={errorSignal}
                            error_message="Invalid email"
                        />
                    }
                    {
                        (type === "Sign up")
                        &&

                        <Input
                            input_class={phoneClass}
                            input_type="tel"
                            input_id="phone"
                            placeholder="phone number"
                            change={change}
                            input_value={inputValues.phone}
                            error_signal={errorSignal}
                            error_message="Please insert your phone number"
                        />
                    }
                    {
                        ((type === "Sign up") || ((type === "Login") && ((!randomCode.toSend && !randomCode.toVerify) || randomCode.changeDetails)))
                        &&

                        <Input
                            input_class={passClass}
                            input_type="password"
                            input_id="password"
                            placeholder="Password"
                            change={change}
                            input_value={inputValues.password}
                            error_signal={errorSignal}
                            error_message={mustContainData.map(data => <MustContainItem data={data} key={data} />)}
                            validatePassword={validatePassword}
                        />
                    }

                    {
                        (type === "Sign up" || randomCode.changeDetails)
                        &&
                        <Input
                            input_class={verifyPassClass}
                            input_type="password"
                            input_id="verifyPassword"
                            placeholder="Verify password"
                            change={change}
                            input_value={inputValues.verifyPassword}
                            error_signal={errorSignal}
                            error_message="Password does not match up"
                            input_is_pass={true}
                        />
                    }

                    {
                        (type === "Send")
                        &&
                        <Input
                            input_class={messageClass}
                            input_type="text"
                            input_id="message"
                            placeholder="Message.."
                            change={change}
                            input_value={inputValues.message}
                            error_signal={errorSignal}
                            error_message="Please insert your message"
                            input_is_pass={true}
                        />
                    }

                    {
                        (type === "Login")
                        &&
                        <div>
                            {
                                (!randomCode.toSend && randomCode.toVerify)
                                &&
                                <Input
                                    input_class={codeClass}
                                    input_type="text"
                                    input_id="verifyCode"
                                    placeholder="Verify_code"
                                    change={change}
                                    input_value={inputValues.verifyCode}
                                    error_signal={errorSignal}
                                    error_message="Code does not match up"
                                />
                            }

                            {
                                (!randomCode.toSend && !randomCode.toVerify && !randomCode.changeDetails)
                                &&
                                <>
                                    <div>
                                        <GoogleLogin
                                            className="google_login"
                                            clientId={clientId}
                                            buttonText="Login with google"
                                            onSuccess={onSuccess}
                                            onFailure={onFailure}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                    </div>
                                    <button className="log_add" type="button" onClick={waitForEmail}>Forgat password?</button>
                                </>
                            }
                            {
                                (randomCode.toSend)
                                &&
                                <button type="submit" className="form_btn" onClick={send_code}>Send</button>
                            }
                            {
                                (randomCode.toVerify)
                                &&
                                <button type="submit" className="form_btn" onClick={verifyCode}>Verify</button>
                            }

                            {toastContainer()}
                        </div>
                    }
                    {
                        (!(randomCode.toSend) && !(randomCode.toVerify))
                        &&
                        <div className="log_tail">
                            {
                                (type === "Send")
                                &&
                                <><i className="fa fa-send"></i></>
                            }
                            <button type="submit" className="form_btn">
                                {type}</button>
                            {
                                (type === "Sign up" || type === "Login")
                                &&
                                <button type="button" onClick={func} className="form_btn">Cancel</button>
                            }
                        </div>
                    }
                </div>
            </form>
        </div>
    );
}
