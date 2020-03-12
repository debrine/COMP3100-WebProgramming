const cookieSession = require('cookie-session');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const hbs = require('express-hbs');
const app = express();
const bodyParser = require('body-parser');
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
    let admin_content;
    const email = req.session.email;
    if (req.session.role === 'admin') {
         admin_content = "<a href='/admin'>Admin Webpage</a>";
    }
    else if (req.session.role ==='user') {
        admin_content = '';
    }
    res.type('.html');
    res.render('home', {
        title: 'Home Page',
        password : password,
        admin_content: admin_content,
        email: email,
        id: req.session.id
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
                users: users
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
    
})

app.get('/logout', function(req,res) {
    req.session.email = null;
    req.session.password = null;
    req.session.logged_in = null;
    req.session.id = null;
    req.session.role = null;

    res.redirect('/');
})

app.listen(port, () => console.log(`Listening on port ${port}!`));