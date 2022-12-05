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

  router.get('/datatable', async (req, res) => {
    let params = []

    if(req.query.search.value){
        params.push(`userid ilike '%${req.query.search.value}%'`)
    }

    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    const data = await db.query(`select * from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
        "draw": Number(req.query.draw),
        "recordsTotal": total.rows[0].total,
        "recordsFiltered": total.rows[0].total,
        "data": data.rows
      }
    res.json(response)
})

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

  router.get('/profile', isLoggedIn, async  (req, res, next) => {
    try {

      // const user = req.session.user
      // const userid = user.userid
      // const { rows: users } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
      res.render('users/profile', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Dashboard',
        user: req.session.user,
        // data: users[0],
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.post('/profile', isLoggedIn, async (req, res) => {
    try {
      const user = req.session.user
      // const {userid} = user
      const userid = user.userid
      const { email, name } = req.body

      await db.query('UPDATE users SET email = $1, name = $2 WHERE userid = $3 returning *',[email, name, userid])

      const { rows: emails } = await db.query(`SELECT * FROM users WHERE email = $1`,[email])
      const data = emails[0]
      req.session.user = data
      req.session.save()
      req.flash('success', 'Your profile has been updated')
      res.redirect('/users/profile')
    } catch (err) {
      console.log(err);
      req.flash('error', 'Can not updated profile')
      return res.redirect('/users/profile')
    }
  })

  router.get('/changepassword', isLoggedIn, async  (req, res, next) => {
    try {
      res.render('users/changepw', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Dashboard',
        user: req.session.user,
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.post('/changepassword', isLoggedIn, async  (req, res, next) => {
    try {
      const user = req.session.user
      // const {userid} = user
      const userid = user.userid
      const { oldpassword, newpassword, repassword } = req.body
      const { rows } = await db.query(`SELECT * FROM users WHERE userid = $1`, [userid])

      if (newpassword != repassword)  throw "Retype Password, New password doesn't match"
      if (!bcrypt.compareSync(oldpassword, rows[0].password)) throw `Your Old password is wrong`

      const hash = bcrypt.hashSync(newpassword, saltRounds)
      const { s } = await db.query('UPDATE users set password = $1 WHERE userid = $2', [hash, userid])
      req.flash('success', 'Your password has been updated')
      res.redirect('/users/changepassword')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/users/changepassword')
    }
  });

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
