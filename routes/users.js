var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
const { isLoggedIn } = require('../helpers/util')


module.exports = (db) => {
  router.get('/', isLoggedIn, async function (req, res, next) {
    try {
      const { rows } = await db.query('SELECT * FROM users');
      res.render('users/list', {
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Users',
        rows,
      });
    } catch (err) {
      res.send(err);
    }
  });

  router.get('/add', isLoggedIn, async  (req, res, next) => {
    res.render('users/add', {
      currentPage: 'POS - users',
      user: req.session.user,
    })
  });

  router.post('/add', isLoggedIn, async (req, res) => {
    try {
      const { email, name, password, role } = req.body
      
      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (emails.length > 0) {
        throw 'User already exist'
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('success', 'Account was created successfully')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/users')
    }
  })

  router.get('/edit/:userid', isLoggedIn, async  (req, res, next) => {
    try {
      const { userid } = req.params
      const { rows } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
      res.render('users/edit', {
        currentPage: 'POS - users',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.post('/edit/:userid', isLoggedIn, async (req, res) => {
    try {
      const { userid } = req.params
      const { email, name, role } = req.body
      // const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      // if (users.length > 0) {
      //   throw 'User already exist'
      // }

      await db.query('UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4',[email, name, role, userid])
     
      req.flash('success', 'Account edited successfully')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', 'User already exist')
      return res.redirect('/users')
    }
  })

  router.get('/delete/:userid', isLoggedIn, async  (req, res, next) => {
    try {
      const { userid } = req.params
      await db.query('DELETE FROM users WHERE userid = $1', [userid])
      req.flash('success', 'Account deleted successfully')
      res.redirect('/users')
    } catch (e) {
      req.flash('error', err)
      return res.redirect('/users')
    }
  });

  return router;
};
