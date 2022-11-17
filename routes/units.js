var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
const { isLoggedIn } = require('../helpers/util')


module.exports = (db) => {
  router.get('/', isLoggedIn, async function (req, res, next) {
    try {
      const { rows } = await db.query('SELECT * FROM units');
      res.render('units/list', {
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Units',
        rows,
      });
    } catch (err) {
      res.send(err);
    }
  });

  router.get('/add', isLoggedIn, async  (req, res, next) => {
    res.render('units/add', {
      currentPage: 'POS - Add',
      user: req.session.user,
    })
  });

  router.post('/add', isLoggedIn, async (req, res) => {
    try {
      const { unit, name, note } = req.body
      await db.query('INSERT INTO units (unit, name, note) VALUES ($1, $2, $3)', [unit, name, note])
      req.flash('success', 'Units was created successfully')
      res.redirect('/units')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/units')
    }
  })

  router.get('/edit/:unit', isLoggedIn, async  (req, res, next) => {
    try {
      const { unit } = req.params
      const { rows } = await db.query('SELECT * FROM units WHERE unit = $1', [unit])
      res.render('units/edit', {
        currentPage: 'POS - units',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.post('/edit/:unit', isLoggedIn, async (req, res) => {
    try {
      const{ unit } = req.params
      const { name, note } = req.body
      await db.query('UPDATE units SET name = $1, note = $2 WHERE unit = $3',[name, note, unit])
      req.flash('success', 'Item edited successfully')
      res.redirect('/units')
    } catch (err) {
      req.flash('error', 'Unit already exist')
      return res.redirect('/units')
    }
  })

  router.get('/delete/:unit', isLoggedIn, async  (req, res, next) => {
    try {
      const { unit } = req.params
      await db.query('DELETE FROM units WHERE unit = $1', [unit])
      req.flash('success', 'Item deleted successfully')
      res.redirect('/units')
    } catch (e) {
      req.flash('error', err)
      return res.redirect('/units')
    }
  });

  return router
}