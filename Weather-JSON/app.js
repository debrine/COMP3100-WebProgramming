const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();
const db = new sqlite3.Database(__dirname + '/stj2019.db',
    function (err) {
        if (!err) {console.log('opened stj2019.db');}
        else {console.log(err);}
});
const port = process.env.PORT || 8000;

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/weatherData.html');
    console.log(db);
}); 

app.get('/table1.js', function(req, res) {
    res.sendFile(__dirname+'/table1.js');
})

app.get('/Chart.bundle.min.js', function(req, res) {
    res.sendFile(__dirname+'/Chart.bundle.min.js');
})

app.get('/table2.js', function(req, res) {
    res.sendFile(__dirname+'/table2.js');
})

app.get('/plotChart.js', function(req, res) {
    res.sendFile(__dirname+'/plotChart.js');
})

app.get('/data/:startDate/:endDate', function(req, res) {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    console.log(`start: ${startDate} end: ${endDate}`)
    db.all(`SELECT * FROM stj2019 WHERE strftime('%Y-%m-%d', time) BETWEEN '${startDate}' AND '${endDate}' ORDER BY time;`,[], function(err, rows) {
        console.log(rows);
        res.send(rows);
    })

})

app.post('/data', jsonParser, function(req, res) {
    const message = req.body;
    const startDate = message.startDate;
    const endDate = message.endDate;

    console.log(`start: ${startDate} end: ${endDate}`)
    db.all(`SELECT * FROM stj2019 WHERE strftime('%Y-%m-%d', time) BETWEEN '${startDate}' AND '${endDate}' ORDER BY time;`,[], function(err, rows) {
        console.log(rows);
        res.send(rows);
    })
})

app.post('/plot', jsonParser, function(req,res) {
    const message = req.body;
    const startDate = message.startDate;
    const endDate = message.endDate;
    const selectedColumns = message.selectedColumns;
    if (selectedColumns.length == 0) {
        res.send(null);
    }
    else {
        let columnString = '';
        for (let i = 0; i < selectedColumns.length - 1; i++) {
            columnString += (selectedColumns[i]+', ')
        }
        columnString += selectedColumns[selectedColumns.length - 1];
        db.all(`SELECT ${columnString} FROM stj2019 WHERE strftime('%Y-%m-%d', time) BETWEEN '${startDate}' AND '${endDate}' ORDER BY time;`,[], function(err, rows) {
            console.log(rows);
            res.send(rows);
        });
        
    }
})

app.listen(port, () => console.log(`Listening on port ${port}!`));