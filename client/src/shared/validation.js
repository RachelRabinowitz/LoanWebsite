
function text_validate(text) {
    let field_is_valid = true;
    if (!(/^[a-zA-Z]{2,}$/.test(text))) {
        field_is_valid = false;
    }
    return field_is_valid;
}

function email_validate(email) {
    let field_is_valid = true;
    if (!(/^\w?.+@[a-zA-Z_.]+?\.[a-zA-Z]{2,3}$/.test(email))) {
        field_is_valid = false;
    }
    return field_is_valid;
}

function id_validate(id) {
    let field_is_valid = true;
    if (id.length !== 9 || !(/^\d+$/.test(id))) {
        field_is_valid = false
    }
    else {
        let id_convert;
        let id_correctness = 0;
        for (let i = 0; i < 8; i++) {
            id_convert = String(Number(id[i]) * (i % 2 + 1));
            for (let j = 0; j < id_convert.length; j++) {
                id_correctness += Number(id_convert[j]);
            }
        }
        if (id_correctness % 10 !== (10 - Number(id[8])) % 10) {
            field_is_valid = false
        }
    }
    return field_is_valid;
}


function number_validate(number) {
    let field_is_valid = true;
    if (number < 0) {
        field_is_valid = false;
    }
    return field_is_valid;
}


function phone_validate(phone) {
    let field_is_valid = true;
    if (!(/^0(5[^7]|[2-4]|[8-9]|7[0-9])[0-9]{7}$/.test(phone))) {
        field_is_valid = false;
    }
    return field_is_valid;
}


const bankAccVlidator = (bank, branch, account) => {
    var validator = require('il-bank-account-validator');
    if (validator(bank, branch, account)) {
        return true;
    }
    else {
        return false;
    }
}

export { text_validate, email_validate, id_validate, number_validate, phone_validate, bankAccVlidator }
