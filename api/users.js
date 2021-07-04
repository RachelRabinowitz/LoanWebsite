
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
let users;
let gemachim;
let generalDetails;




mongoClient.connect(connectionStr, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected')
    db = client.db('TheLoanWebsite')
    users = db.collection('users')
    gemachim = db.collection('gemachim')
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

const userIsOk = (user) => {
    return (user.id !== undefined && validator.idValidate(user.id) &&
        user.type !== undefined && user.type === "client" &&
        user.firstName !== undefined && validator.textValidate(user.firstName) &&
        user.lastName !== undefined && validator.textValidate(user.lastName) &&
        user.email !== undefined && validator.emailValidate(user.email) &&
        user.phone !== undefined && validator.phoneValidate(user.phone) &&
        user.password !== undefined &&
        user.loans !== undefined && user.loans.length === 0 &&
        user.loansCount !== undefined && user.loansCount === 0 &&
        user.gemachim && user.gemachim.length === 0)
}

const findUser = (obj, res) => {
    users.findOne(obj)
        .then((user) => {
            if (user) { res.json(user) }
            else { res.json(null) }
        })
        .catch((err) => { res.json({ status: "faild" }) })
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
                path: './../client/src/assets/image',
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
//============================================================================

router.get('/:id', function (req, res) {
    if (validator.idValidate(req.params.id)) {
        findUser({ id: req.params.id }, res)
    }
    else if (validator.emailValidate(req.params.id)) {
        findUser({ email: req.params.id }, res)
    }
    else if (validator.phoneValidate(req.params.id)) {
        findUser({ phone: req.params.id }, res)
    }
    else { res.json({ status: "faild" }) }
})


router.post('/', function (req, res) {
    let user = req.body;
    if (userIsOk(user)) {
        users.findOne({ $or: [{ id: user.id }, { email: user.email }, { phone: user.phone }] })
            .then((foundUser) => {
                if (foundUser) { res.send("exist") }
                else {
                    users.insertOne(user)
                        .then(() => {
                            sendEmail(
                                'loanwebsite1@gmail.com',
                                user.email,
                                'Welcome to the loan website',
                                'You have successfully logged in to the system'
                            )
                            res.send("succeed");
                        })
                        .catch((err) => { res.send("failed") })
                }
            })
            .catch((err) => { res.send("failed") })
    }
})


router.put('/:id', function (req, res) {
    let obj = req.body;
    if (obj.loans !== undefined &&
        obj.loansCount !== undefined &&
        obj.requests !== undefined &&
        obj.borrowers !== undefined) {
        gemachim.updateOne({ id: obj.gemachId }, { $set: { requests: obj.requests, borrowers: obj.borrowers } })
            .then(() => {
                users.updateOne({ id: req.params.id }, { $set: { loans: obj.loans, loansCount: obj.loansCount } })
                    .then(() => { res.send("succeed") })
                    .catch((err) => { return res.send("faild") })
            })
            .catch((err) => { return res.send("faild") })
    }
    else if ((obj.type === undefined || obj.type === "client" || obj.type === "manager") &&
        (obj.password === undefined || validator.passValidate(obj.password)) &&
        (obj.loansCount === undefined || obj.loansCount > 0)) {
        users.updateOne({ id: req.params.id }, { $set: obj })
            .then(() => { res.send("succeed") })
            .catch((err) => { res.send("faild") })
    }
    else { res.send("failed") }
})

router.delete('/:id', (req, res) => {
    users.findOne({ id: req.params.id })
        .then((user) => {
            if (user !== null && user.loans.length === 0) {
                users.deleteOne({ id: req.params.id })
                    .then(() => {
                        sendEmail(
                            'loanwebsite1@gmail.com',
                            user.email,
                            'Unsbubscibing the loan website',
                            'You have been successfully removed from the system'
                        )
                        res.send("succeed");
                    })
                    .catch((err) => { res.send("failed") })
            }
            else { res.send("exist") }
        })
        .catch((err) => { res.send("failed") })
})


module.exports = router;