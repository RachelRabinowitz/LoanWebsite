
'use strict'

var express = require('express');
var app = express()
var router = express.Router();

const mongoClient = require('mongodb').MongoClient
const connectionStr = 'mongodb+srv://LoanWebsite:racheli123@cluster0.11iya.mongodb.net/TheLoanWebsite?retryWrites=true&w=majority'

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

let db;
let generalDetails;



mongoClient.connect(connectionStr, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected')
    db = client.db('TheLoanWebsite')
    generalDetails = db.collection('generalDetails')
})



router.get('/1', function (req, res) {
    generalDetails.findOne({ id: 1 })
        .then((details) => {
            if (details) { res.json(details) }
            else { res.json(null) }
        })
        .catch((err) => { res.json({ status: "failed" }) });
})



router.put('/:id', function (req, res) {
    let obj = req.body;
    generalDetails.updateOne({ id: 1 }, { $set: obj })
        .then(() => { res.send("succeed") })
        .catch((err) => { res.send("failed"); });
})


module.exports = router;