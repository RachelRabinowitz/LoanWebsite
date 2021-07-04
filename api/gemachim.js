
'use strict'


var express = require('express');
var app = express()
var router = express.Router();

const mongoClient = require('mongodb').MongoClient
const connectionStr = 'mongodb+srv://LoanWebsite:racheli123@cluster0.11iya.mongodb.net/TheLoanWebsite?retryWrites=true&w=majority'

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var nodemailer = require('nodemailer');

const validator = require('./validation');

let db;
let gemachim;
let users;
let generalDetails;



mongoClient.connect(connectionStr, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected')
    db = client.db('TheLoanWebsite')
    gemachim = db.collection('gemachim')
    users = db.collection('users')
    generalDetails = db.collection('generalDetails')
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'websiteloanfund@gmail.com',
        pass: 'racheli*123'
    }
});


//============================================================================
// Auxiliary functions

const gemachIsOk = (gemach) => {
    return (gemach.id !== undefined && gemach.manager !== undefined &&
        gemach.manager.id !== undefined && validator.idValidate(gemach.manager.id) &&
        gemach.borrowers !== undefined && gemach.borrowers.length === 0 &&
        gemach.requirements !== undefined && gemach.requirements.length === 5 &&
        validator.textValidate(gemach.requirements[0]) &&
        validator.textValidate(gemach.requirements[1]) &&
        validator.textValidate(gemach.requirements[2]) &&
        validator.textValidate(gemach.requirements[3]) &&
        validator.textValidate(gemach.requirements[4]) &&
        gemach.accountDetails !== undefined &&
        validator.bankAccVlidator(gemach.accountDetails.bank, gemach.accountDetails.branch, gemach.accountDetails.account) &&
        gemach.loansAmount !== undefined && gemach.loansAmount >= 1500 &&
        gemach.payments !== undefined && gemach.payments.length === 2 && gemach.payments[0] >= 8 && gemach.payments[0] >= 10 &&
        gemach.payments[0] !== gemach.payments[1] &&
        gemach.requests !== undefined && gemach.requests.length === 0 &&
        gemach.about !== undefined && validator.textValidate(gemach.about) &&
        gemach.havePaypal !== undefined && gemach.havePaypal.length >= 2)
}


const sendEmail = (from, to, subject, text) => {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'logo.png',
                path: './../client/src/assets/image/logo.png'
            }
        ]
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const updateRepay = (gemachId, userId, res) => {
    let answer = "succeed"
    users.findOne({ id: userId })
        .then((user) => {
            if (user) {
                let updateLoans = user.loans;

                for (let i = 0; i < updateLoans.length; i++) {
                    if (updateLoans[i].id === gemachId) {
                        updateLoans[i] = {
                            ...updateLoans[i], ...{
                                comPayments: Number(updateLoans[i].comPayments) + 1,
                                remainPayments: Number(updateLoans[i].remainPayments) - 1
                            }
                        };
                        if (updateLoans[i].remainPayments === 0) {
                            answer = "finish"
                            updateLoans.splice(i, 1);
                            gemachim.findOne({ id: gemachId })
                                .then((gemach) => {
                                    if (gemach) {
                                        let updateBorrowers = gemach.borrowers;
                                        let index = updateBorrowers.indexOf(userId);
                                        if (index >= 0) {
                                            updateBorrowers.splice(index, 1);
                                            gemachim.updateOne({ id: gemachId }, { $set: { borrowers: updateBorrowers } })
                                                .then(() => { })
                                                .catch((err) => { res.send("failed") })
                                        }
                                        else { res.send("failed") }
                                    }
                                    else { res.send("failed") }
                                })
                                .catch((err) => { res.send("failed") })
                        }
                        break;
                    }
                }
                users.updateOne({ id: userId }, { $set: { loans: updateLoans } })
                    .then(() => {
                        res.send(answer)
                    })
                    .catch((err) => { res.send("faild") })
            }
            else { res.send("failed") }
        })
        .catch((err) => { res.send("failed") })
}


const updateRequests = (gemachId, user, request, res) => {
    gemachim.findOne({ id: gemachId })
        .then((gemach) => {
            let tempRequests = gemach.requests
            tempRequests.push(request)
            gemachim.updateOne({ id: gemachId }, { $set: { requests: tempRequests } })
                .then(() => {
                    sendEmail(
                        'loanwebsite1@gmail.com',
                        gemach.manager.email,
                        'New loan request',
                        'New loan request was received to Gemach: ' + gemachId
                        + '. \nPlease contact the loan applicant:\n'
                        + user.firstName + '\n' + user.lastName + '\n'
                        + user.email + '\n' + user.phone
                    )
                    sendEmail(
                        'loanwebsite1@gmail.com',
                        user.email,
                        'New request',
                        'Your request to Gemach' + gemachId
                        + 'has been successfully received.\nGemach owner will contact you soon...'
                    )
                    res.send("succeed");
                })
                .catch((err) => { res.send("failed") })
        })
        .catch((err) => { res.send("failed") })
}


//============================================================================

router.get('/', function (req, res) {
    gemachim.find({}, { id: 1 }).toArray()
        .then((list) => {
            if (list) { res.json(list) }
            else { res.json(null) }
        })
        .catch((err) => { res.json({ status: "failed" }) })
})

router.get('/:id', function (req, res) {
    gemachim.findOne({ id: req.params.id })
        .then((gemach) => {
            if (gemach) { res.json(gemach) }
            else { res.json(null) }
        })
        .catch((err) => { res.json({ status: "failed" }) })
})



router.post('/', function (req, res) {
    let gemach = req.body
    if (gemachIsOk(gemach)) {
        users.findOne({ id: gemach.manager.id })
            .then((user) => {
                if (user) {
                    let gemachimList = [];
                    if (user.gemachim !== undefined) {
                        gemachimList = user.gemachim
                    }
                    gemachimList.push(gemach.id)
                    users.updateOne({ id: gemach.manager.id }, { $set: { type: "manager", gemachim: gemachimList } })
                        .then(() => {
                            let gemachManager = {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phone: user.phone,
                            }
                            gemach = { ...gemach, ...{ manager: gemachManager } }
                            gemachim.insertOne(gemach)
                                .then(() => {
                                    sendEmail(
                                        'loanwebsite1@gmail.com',
                                        gemach.manager.email,
                                        'Your new Gemach Successfully inserted into the system',
                                        'Welcom to our lenders community \nGood Luck!'
                                    )

                                    generalDetails.findOne({ id: 1 })
                                        .then((details) => {
                                            if (details) {
                                                generalDetails.updateOne({ id: 1 }, { $set: { gemachimNum: Number(details.gemachimNum) + 1 } })
                                            }
                                        })
                                        .catch((err) => { res.send("failed") })
                                    res.send("succeed");
                                })
                                .catch((err) => { res.send("failed") })
                        })
                        .catch((err) => { res.send("faild") })
                }
                else { res.send("failed") }
            })
            .catch((err) => { res.send("failed"); })
    }
    else { res.send("failed") }
})


router.put('/:id', function (req, res) {
    let obj = req.body;
    if (obj.user !== undefined && obj.action !== undefined && obj.action === "repay" && obj.request === undefined) {
        updateRepay(req.params.id, obj.user, res);
    }
    else if (obj.user !== undefined && obj.action !== undefined && obj.action === "addRequest" && obj.request !== undefined) {
        updateRequests(req.params.id, obj.user, obj.request, res);
    }
    else {
        gemachim.updateOne({ id: req.params.id }, { $set: obj })
            .then(() => { res.send("succeed") })
            .catch((err) => { res.send("failed") })
    }
})


router.delete('/:id', (req, res) => {
    gemachim.findOne({ id: req.params.id })
        .then((gemach) => {
            if (gemach) {
                if (gemach.borrowers.length === 0) {
                    gemachim.deleteOne({ id: req.params.id })
                        .then(() => {
                            sendEmail(
                                'loanwebsite1@gmail.com',
                                gemach.manager.email,
                                'Removing Gemach' + gemach.id,
                                'Removing Gemach'
                                + gemach.id
                                + 'succeed \nSee you soon!'
                            )

                            sendEmail(
                                'loanwebsite1@gmail.com',
                                [gemach.requests.map(req => req.user.email)],
                                'Removing Gemach' + gemach.id,
                                'Your request for a loan from Gemach:'
                                + req.params.id
                                + 'was denied..'
                            )
                            res.send("succeed");
                        })
                        .catch((err) => { res.send("failed") })
                }
                else { res.send("exist") }
            }
            else { res.send("failed") }
        })
        .catch((err) => { res.send("failed") })
})





module.exports = router;