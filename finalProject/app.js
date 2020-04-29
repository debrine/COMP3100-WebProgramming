const cookieSession = require('cookie-session');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const hbs = require('express-hbs');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static( __dirname + '/public'));

const db = new sqlite3.Database(__dirname + '/users.db',
    function (err) {
        if (!err) {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    password TEXT,
                    role TEXT,
                    CONSTRAINT unique_email UNIQUE (email)
                )`);
            db.run(`
                CREATE TABLE IF NOT EXISTS charts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    email TEXT,
                    visibility TEXT,
                    data TEXT,
                    CONSTRAINT unique_name UNIQUE (name),
                    CONSTRAINT fk_email
                    FOREIGN KEY (email)
                    REFERENCES users(email)
                        ON UPDATE CASCADE
                        ON DELETE CASCADE
                )`)
                console.log('opened users.db');
            }
        else {
            console.log(err);
        }
});

app.use(cookieSession({
    name: 'session',
    //keys: 
    // ...
    secret: 'secret'
  }));

//session variables: logged_in, role, email, id, password

const userNav = `<div class='nav_bar' id='user_nav'>
                    <a href='/home'>User Account</a>
                    <a href='/shared_sheets'>Shared Spreadsheets</a>
                    <a href='/user_sheets/'>User Spreadsheets</a>
                    <a href='/charting'>Charting</a>
                    <a href='/logout'>Log Out</a>
                </div>
                `;

const adminNav = `<div class='nav_bar' id='admin_nav'>
                    <a href='/home'>User Account</a>
                    <a href='/admin'>Admin Tools</a>
                    <a href='/shared_sheets'>Shared Spreadsheets</a>
                    <a href='/user_sheets/'>User Spreadsheets</a>
                    <a href='/charting'>Charting</a>
                    <a href='/logout'>Log Out</a>
                </div>
                `;

const navBars = {
    user: userNav,
    admin: adminNav
};

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + '/views/layout/main.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 8000;

function check_logged_in(req, res, next) {
    if (req.session.logged_in === true) {
        next();
    }
    else {
        res.redirect('/');
    }
}

function check_admin(req, res, next) {
    if (req.session.role === 'admin') {
        next();
    }
    else {
        res.redirect('/home');
    }
}

app.get('/', function(req, res) {
    res.type('.html');
    error = '';

    res.render('login', {
        title: 'Log In',
        error: error
    })
});

app.get('/admin_setup', function(req, res) {
    db.run('INSERT INTO users(email, password, role) VALUES(?,?,?)',
    ['admin', 'admin','admin'],
    function(err) { 
        if (!err) { res.redirect('/');}} 
)});

app.get('/shared_sheets', check_logged_in, function(req, res) {
    let conditionalString;
    if (req.session.role === 'admin') {
        conditionalString = '';
    }
    else {
        conditionalString = `where visibility LIKE 'public'`;
    }
    db.all(`SELECT * FROM charts ${conditionalString}`, [], function(err, rows) {
        if (!err) {
            const spreadsheets = rows;
            const loggedUser = req.session.email;
            let is_admin;
            if (req.session.role === 'admin') {
                is_admin = true;
            }
            else {
                is_admin = false;
            }
            res.render('shared_charts', {
                title: 'Shared Sheets',
                navBar: navBars[req.session.role],
                spreadsheets: spreadsheets,
            })
        }
        else {
            console.log('error', err);
        }
    })
});

app.post('/shared_sheets', jsonParser, function(req,res) {
    console.log('shared sheets post request received');
    const message = req.body;
    const id = message.id;
    const loggedUser = req.session.email;

    db.all(`SELECT * FROM charts where id == ${id}`, [], function(err, rows) {
        if (!err) { 
            const sheet = rows[0];
            const name = sheet.name;
            const newName = `${loggedUser}'s copy of ${name}`;
            const data = sheet.data;
            db.run(`INSERT INTO charts(name, email, visibility, data) VALUES(?,?,?,?)`,
            [newName, loggedUser, 'private', data],
            function(err) {
                if (!err) {
                    let returnMessage = {status: "copied"};
                    res.send(returnMessage);
                }
                else {
                    console.log('error', err);
                    let returnMessage = {error: err};
                    res.send(returnMessage);
                }
            });
        }
        else {
            let returnMessage = {error: err};
            res.send(returnMessage);
        }
    })
})

app.post('/', function(req, res) {
    const form = req.body;
    const email = form.email;
    const password = form.password;
    

    db.all(`SELECT email, password, role, id FROM users where email LIKE '${email}' AND password LIKE '${password}'`,[], function(err, rows) {
        if ( !err ) {
            const user = rows[0];
            console.log("fetched user: ", user);
            if (user === undefined) {
                res.type('.html');
                error = 'The provided email/password combination is invalid. Please try again';

                res.render('login', {
                    title: 'Log In',
                    error: error
                })
            }
            else {
                console.log("logging in", user);
                req.session.email = user.email;
                req.session.role = user.role;
                req.session.logged_in = true;
                req.session.password = user.password;
                req.session.id = parseInt(user.id);

                res.redirect('/home');
            }
        }
        else {
            console.log( err );
}});
});

app.get('/register', function(req, res) {
    res.type('.html');
    error = "";

    res.render('register', {
        title : 'User Registration',
        error : error
    });
});

app.get('/home', check_logged_in, function(req, res) {
    const password = req.session.password;
    const email = req.session.email;
    res.type('.html');
    res.render('home', {
        title: 'Home Page',
        password : password,
        email: email,
        id: req.session.id,
        navBar: navBars[req.session.role]
    });
});

app.post('/home', check_logged_in, function(req, res) {
    const form = req.body;
    const new_pass = form.password;
    db.run('UPDATE users SET email=?, password=? WHERE id=?',
        [form.email, new_pass, req.session.id],
        function (err) {if (!err) {
            console.log("updated user", form);
            req.session.password = new_pass;
            req.session.email = form.email;
            res.redirect('/home'); }} );
});

app.post('/register', function(req, res) {
    const form = req.body;
    console.log("register: ", form);
    db.run('INSERT INTO users(email, password, role) VALUES(?,?,?)',
            [form.email, form.password,'user'],
            function(err) { 
                if (!err) { res.redirect('/');} 
                else {
                    res.type('.html');
                    error = "Registration Error: This email address is already attached to an account.";

                    res.render('register' , {
                        title: 'User Registration',
                        error: error
                    });
                }
                } 
        );
});

app.get('/admin', check_logged_in, check_admin, function(req, res) {
    db.all('SELECT * FROM users ORDER BY id ASC', [], function(err, users) {
        for (let user of users) {
            if (user.role === 'user') {
                user.is_user = true;
                user.is_admin = false;
            }
            else {
                user.is_admin = true;
                user.is_user = true;
            }
        }
        
        if (!err) {
            res.type('.html');
            res.render('admin', {
                title: 'Admin Tools',
                users: users,
                navBar: navBars[req.session.role]
            })
        }
        else {
            console.log(err);
        }}
    )});

app.post('/admin', check_logged_in, check_admin, function(req, res) {
    const form = req.body;
    if(form.op === 'update') {
        console.log("update", form); 
        const id = parseInt(form.id);
        db.run('UPDATE users SET email=?, password=?, role=? WHERE id=?',
            [form.email, form.password, form.role, id],
        function (err) {    
            if (err) {
                console.log(err);
            }
        });
        
    }
    else if ( form.op === 'delete' ) {
        console.log('delete', form );
        let id = parseInt( form.id );
        db.run('DELETE FROM users WHERE id=?', [id],
            function( err) { if (err) {console.log(err);} }
        );
    }
    res.redirect('/admin');
    
});

app.get('/user_sheets', check_logged_in, function(req, res) {
    res.type('.html');
    res.render('user_sheets', {
        title: 'User Sheets',
        navBar: navBars[req.session.role]
    });
})

app.post('/user_sheets', jsonParser, check_logged_in, function(req,res) {
    const message = req.body;
    const request = message.request;
    const email = req.session.email;
    console.log('request received, message:', message);
    if (request === 'spreadsheets') {
        db.all(`SELECT * FROM charts WHERE email LIKE '${email}'`, [], function(err, rows) {
            if (!err) {
                console.log('rows', rows);
                res.send(rows);
            }
            else {
                console.log('error', err);
            }
        })
    }
    else if (request === 'update') {
        const name = message.name;
        const privacy = message.privacy;
        const id = message.id;
        db.run('UPDATE charts SET name=?, visibility=? WHERE id=?',
        [name, privacy, id],
        function (err) {if (!err) {
            res.send({status: 'success'});
        }
        else {
            res.send({error: err});
        }})
    }
    else if (request === 'delete') {
        const id = message.id;
        db.run('DELETE FROM charts WHERE id=?', [id],
            function( err) { if (err) {console.log(err);} }
        );
        res.redirect('back');
    }
    else if (request === 'add') {

        const name = message.name;
        const privacy = message.privacy;
        const email = req.session.email;
        db.run('INSERT INTO charts(email, name, visibility) VALUES(?,?,?)',
            [email, name, privacy],
            function(err) { 
                if (!err) {
                    db.all(`SELECT id FROM charts WHERE name LIKE '${name}'`, [], function(err, rows) {
                        let id = rows[0].id;
                        let returnMessage = {status: 'success', id: id};
                        res.send(returnMessage);
                    })
                    
                }
                else {
                    console.log('error', err);
                    res.send({status: 'duplicate'});
                }
            } 
        );
    }
    else if (request === 'update_sheet') {
        const id = message.id;
        const data = JSON.stringify(message.data);
        
        db.run('UPDATE charts SET data=? WHERE id=?',
        [data, id],
        function (err) {if (!err) {
            res.send({status: 'success'});
            console.log('data', data);
        }
        else {
            console.log('error', err);
            res.send({error: err});
        }})

    }
})

app.get('/user_sheets/style.css', function(req,res) {
    res.sendFile(__dirname+'/public/style.css');
})

app.get('/logout', function(req,res) {
    req.session.email = null;
    req.session.password = null;
    req.session.logged_in = null;
    req.session.id = null;
    req.session.role = null;

    res.redirect('/');
})

app.get('/user_sheets/SpreadSheet.js', function(req,res) {
    res.sendFile(__dirname+'/SpreadSheet.js');
});

app.get('/Chart.bundle.min.js', function(req,res) {
    res.sendFile(__dirname+'/Chart.bundle.min.js');
})

app.get('/charting', check_logged_in, function(req,res) {
    const email = req.session.email;
    const role = req.session.role;

    db.all(`SELECT * FROM charts WHERE email LIKE '${email}'`, [], function(err, rows) {
        if (!err) {
            console.log('selected rows', rows);
            res.type('.html');
            res.render('charting', {
                title: 'Charting',
                navBar: navBars[role],
                spreadsheets: rows
            })
        }
        else {
            console.log('err', err);
        }
    })
})
app.listen(port, () => console.log(`Listening on port ${port}!`));