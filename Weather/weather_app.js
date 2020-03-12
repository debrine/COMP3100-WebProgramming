const sqlite3 = require('sqlite3').verbose();

const fs = require('fs');

const html = {
    weather: fs.readFileSync(__dirname + "/weather.html", "utf-8"),
    reports: fs.readFileSync(__dirname + "/reports.html", "utf-8")
};

const db = new sqlite3.Database(__dirname + '/weather.db',
    function (err) {
        if (!err) {
            db.run(`
                CREATE TABLE IF NOT EXISTS weather (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    location TEXT,
                    date TEXT,
                    description TEXT,
                    low_temperature REAL,
                    high_temperature REAL,
                    average_wind REAL,
                    average_direction REAL
                )`);
                console.log('opened weather.db');
            }
        else {
            console.log(err);
        }
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.port || 8000;

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html')
});


//this needs to be changed
app.get('/weather.html', function(req,res) {
    generate_users_page(res);
});

app.get('/reports.html', function(req,res) {
    res.send(html.reports.replace("{{ report_data }}", ""));
});

app.get('/report1.html', function(req,res) {
    db.all('SELECT location, date, MAX(high_temperature) FROM weather',[], function(err, rows) {
        if ( !err ) {
            const row = rows[0];
            const location = row.location;
            const date = row.date;
            const temp = row['MAX(high_temperature)'];
            console.log("report1", row);
            
            rep = '';
            rep += '<h2>Maximum Temperature Report</h2>';
            rep += "<ul>";
            rep += `<li>Max Temp: ${temp} degrees Celcius</li>`;
            rep += `<li>Location: "${location}"</li>`;
            rep += `<li>Date: "${date}"</li>`;
            rep += `</ul>`

            res.send(html.reports.replace("{{ report_data }}", rep))
        }
        else {
            console.log( err );
        }
    })});

app.get('/report2.html', function(req,res) {
    db.all('SELECT location, date, MIN(high_temperature) FROM weather',[], function(err, rows) {
        if ( !err ) {
            const row = rows[0];
            const location = row.location;
            const date = row.date;
            const temp = row['MIN(high_temperature)'];
            console.log("report2", row);
            
            rep = '';
            rep += '<h2>Minimum Temperature Report</h2>';
            rep += "<ul>";
            rep += `<li>Min Temp: ${temp} degrees Celcius</li>`;
            rep += `<li>Location: "${location}"</li>`;
            rep += `<li>Date: "${date}"</li>`;
            rep += `</ul>`

            res.send(html.reports.replace("{{ report_data }}", rep));
        }
        else {
            console.log( err );
        }
    })});

app.get('/report3.html', function(req,res) {
    db.all('SELECT AVG(low_temperature),AVG(high_temperature), AVG(average_wind), AVG(average_direction) FROM weather',[], function(err, rows) {
        if ( !err ) {
            const row = rows[0];
            const low_temp = row['AVG(low_temperature)'];
            const wind = row['AVG(average_wind)'];
            const high_temp = row['AVG(high_temperature)'];
            const direction = row['AVG(average_direction)'];
            console.log("report3", row);
            
            rep = '';
            rep += '<h2>Averages of All Records</h2>';
            rep += "<ul>";
            rep += `<li>Average Minimum Temperature: ${low_temp} degrees Celcius</li>`;
            rep += `<li>Average Maximum Temperature: ${high_temp} degrees Celcius</li>`;
            rep += `<li>Average Wind Speed: ${wind} km/h</li>`;
            rep += `<li>Average Wind Direction: ${direction} degrees`;
            rep += `</ul>`;

            res.send(html.reports.replace("{{ report_data }}", rep));
        }
        else {
            console.log( err );
        }
    })});
app.get('/report4.html', function(req,res) {
    db.all('SELECT AVG(low_temperature),AVG(high_temperature), location FROM weather GROUP BY location',[], function(err, rows) {
        if ( !err ) {
            console.log("report4", rows);
            
            rep = '';
            rep += '<h2>Averages of Temperatures per Location</h2>';
            rep += "<dl>";
            for(let row of rows)
            {
                const location = row.location;
                const low_temp = row['AVG(low_temperature)'];
                const high_temp = row['AVG(high_temperature)'];
            
            
            
                
                rep += `<dt>Unique Location: "${location}"`;
                rep += `<dd>`;
                rep += `<ul>`;
                rep += `<li> Average Minimum Temperature: ${low_temp} degrees Celcius</li>`;
                rep += `<li> Average Maximum Temperature: ${high_temp} degrees Celcius</li></ul>`;
                rep += `<p></p>`;


            }
            rep += `</dl>`
            res.send(html.reports.replace("{{ report_data }}", rep));
        }
        else {
            console.log( err );
        }
})});

app.get('/report5.html', function(req,res) {
    db.all('SELECT * FROM weather ORDER BY date DESC',[], function(err, rows) {
        if ( !err ) {
            console.log("report5", rows);
            
            rep = '';
            rep += '<h2>All Records Ordered by Time</h2>';
            rep += `<ul>`
            for(let row of rows)
            {
                const location = row.location;
                const low_temp = row.low_temperature;
                const high_temp = row.high_temperature;
                const date = row.date;
                const desc = row.description;
                const wind = row.average_wind;
                const dir = row.average_direction;
            
                rep += `<li>`;
                rep += `Date: "${date}", Location: "${location}", Mimimum Temperature: ${low_temp} degrees Celcius, Maximum Temperature: ${high_temp} degrees Celcius,`;
                rep += `Average Wind: ${wind} km/h, Average Direction: ${dir}`;
                rep += `<blockquote>Description: "${desc}"</blockquote></li>`;
                
                
            }
            rep += `</ul>`;
            res.send(html.reports.replace("{{ report_data }}", rep));
        }
        else {
            console.log( err );
        }
})});

app.post('/weather.html', function(req,res) {
    const form = req.body;
    console.log(form);
    if ( form.op === 'add' ) {
        console.log('add', form );
        db.run('INSERT INTO weather(location, date, description, low_temperature, high_temperature, average_wind, average_direction) VALUES(?,?,?,?,?,?,?)',
            [form.loc, form.date,form.desc,form.low,form.high,form.wind,form.dir],
            function( err) { if (!err) { res.redirect('/weather.html'); } }
        );
    }
    else if ( form.op === 'update' ) {
        console.log('update', form );
        let id = parseInt( form.id );
        db.run('UPDATE weather SET location=?, date=?, description=?, low_temperature=?, high_temperature=?, average_wind=?, average_direction=? WHERE id=?',
        [form.loc, form.date,form.desc,form.low,form.high,form.wind,form.dir, id],
            function( err) { if (!err) { res.redirect('/weather.html'); } }
        );
    }
    else if ( form.op === 'delete' ) {
        console.log('delete', form );
        let id = parseInt( form.id );
        db.run('DELETE FROM weather WHERE id=?', [id],
            function( err) { if (!err) { res.redirect('/weather.html'); } }
        );
    }


});

function generate_users_page( res ) {
    db.all('SELECT * FROM weather ORDER BY date DESC',[], function(err, rows) {
        if ( !err ) {
            make_users_page(rows, res);
        }
        else {
            console.log( err );
        }
    } );
}

function make_users_page(users, res) {
    let rep = '';
    for(let u of users) {
        const id = u.id;
        const loc = u.location;
        const time = u.date;
        const desc = u.description;
        const low = u.low_temperature;
        const high = u.high_temperature;
        const wind = u.average_wind;
        const dir = u.average_direction;
        

        rep+= "<form id='form_container' method='post'>";
        rep+= "<label class='double_line'>Location</label>";
        rep+= `<input id='loc' class='double_form'  name='loc' value="${loc}">`;
        rep+= "<label class='double_line'>Time</label>";
        rep+= `<input id='time'  name='date' class='double_form' value='${time}'>`;
        rep+= "<label class='single_line'>Description</label>";
        rep+= `<input id='desc'  name='desc' class='single_form' value="${desc}">`;
        rep+= "<label class='double_line'>Low Temp</label>";
        rep+= `<input id='low'  name='low' class='double_form' value=${low}>`;
        rep+= "<label class='double_line'>High Temp</label>";
        rep+= `<input id='high' name='high' class='double_form' value=${high}>`;
        rep+= "<label class='double_line'>Avg Wind</label>";
        rep+= `<input  id='wind' name='wind' class='double_form' value=${wind}>`;
        rep+= "<label class='double_line'>Avg Direction</label>";
        rep+= `<input id='dir' name='dir' class='double_form' value=${dir}>`;
        rep += `<input type=hidden name="id" value="${id}">`
        rep+= "<input type='submit' name='op' value='update'>";
        rep+= "<input type='submit' name='op' value='delete'>";
        rep+= "</form>";

        
    };
    res.send(html.weather.replace("{{ users }}", rep));
};

app.listen(port, () => console.log(`Listening on port ${port}!`));