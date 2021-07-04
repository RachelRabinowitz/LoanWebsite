
let express = require('express');
let app = express();
// const port = process.env.port || 27017;


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));


app.use('/users', require('./users'));
app.use('/gemachim', require('./gemachim'));
app.use('/generalDetails', require('./generalDetails'));

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(27017, function () {});
