const express = require('express');
// express object is created
const app = express();
const bodyParser = require('body-parser');
// fs object is created
const fs = require('fs');

// requiring CORS so the browser allows the requests
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// establishing the port
const port = 1337;

// directory will not be created if it already exists
let direct = './data';
if (!fs.existsSync(direct)) {
    fs.mkdir(direct, (err) => {
        if (err) throw err;
    });
}


// writes a new file
app.post('/submit', (req, res) => {
    const data = JSON.stringify(req.body);
    var fileName = req.body.cusID;
    // removing JSON quotations
    fileName.toString().substring(1, (fileName.length - 1));
    let fileRoute = direct + '/' + fileName + '.txt';

    fs.writeFile(fileRoute, data, err => {
        if (err) {
            console.log(err);
        } else {
            res.send('File written');
        }
    })
});


// displays file data on the client side
app.post('/read', (req, res) => {
    const data = JSON.stringify(req.body);

    var fileName = req.body.cusID;
    // removing JSON quotations
    fileName.toString().substring(1, (fileName.length - 1));
    // console.log(fileName)
    let fileRoute = direct + '/' + fileName + '.txt';

    fs.readFile(fileRoute, { encoding: 'utf8' }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            console.log('File retrieval successful.');
            res.send(data);
        }
    })
});


// deletes files 
app.post('/delete', (req, res) => {
    var fileName = req.body.cusID;
    // removing JSON quotations
    fileName.toString().substring(1, (fileName.length - 1));
    // console.log(fileName)
    let fileRoute = direct + '/' + fileName + '.txt';
    fs.unlink(fileRoute, (error) => {
        if (error) {
            console.log(error);
        }
        else {
            res.send('File deleted.');
        }
    })
});


// checks if files exist
app.post('/verify', (req, res) => {
    var fileName = req.body.cusID;
    // removing JSON quotations
    fileName.toString().substring(1, (fileName.length - 1));
    // file route variable is created
    let fileRoute = direct + '/' + fileName + '.txt';
    fs.access(fileRoute, fs.constants.F_OK, (err) => {
        // if file is accessible, 'good' is returned
        if (!err) {
            res.send('good');
        } else {
            res.send('denied');
        }
    });
});


let server = app.listen(port, function () {
    console.log('Server is running on port ' + port);
});