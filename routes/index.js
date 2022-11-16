var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
router.get('/', function(req, res, next) {
    res.render('login',{
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Login'
    });
});

router.post('/login', async function(req, res, next) {
    try {
    const { email, password } = req.body
    // console.log(email,name,password,role);
    const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1',[email])
    // res.json(emails)
    if(emails.length == 0) throw `Email doesn't exist, Please register first`

    if(!bcrypt.compareSync(password, emails[0].password)) throw `Password doesn't match`
    // Buat session
    const user = emails[0]
    delete user['password']

    req.session.user = user
    res.redirect('/dashboard')

    }catch(err) {
        req.flash('error', err)
        return res.redirect('/')
    }
});

router.get('/register', function(req, res, next) {
    res.render('register',{
        success: req.flash('success'),
        error: req.flash('error')
    });
});

router.post('/register', async function(req, res, next) {
    try {
    const { email, name, password, role } = req.body
    // console.log(email,name,password,role);
    const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1',[email])
    // res.json(emails)
    if(emails.length > 0) {
        throw 'Email already exist'
    }

    const hash = bcrypt.hashSync(password, saltRounds);
    await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [ email, name, hash, role])
    req.flash('success', 'Your account created successfully, please login')
    res.redirect('/')

    } catch(err) {
        req.flash('error', err)
        return res.redirect('/register')
    }
});

router.get('/dashboard', isLoggedIn ,function(req, res, next) {
    res.render('dashboard', {
        user: req.session.user,
        currentPage: 'POS - Dashboard'
    });
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('/')
      })
});


 return router;
}
