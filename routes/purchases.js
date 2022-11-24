var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
const { isLoggedIn } = require('../helpers/util');
const moment = require("moment");

module.exports = (db) => {
  router.get('/', isLoggedIn, async function (req, res, next) {
    try {
      const { rows } = await db.query('SELECT * FROM purchases');
      res.render('purchases/list', {
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Purchases',
        user: req.session.user,
        rows,
      });
    } catch (err) {
      res.send(err);
    }
  });

  router.get('/datatable', async (req, res) => {
    let params = []

    if(req.query.search.value){
        params.push(`invoice ilike '%${req.query.search.value}%'`)
    }

    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    // const data = await db.query(`select * from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const data = await db.query(`SELECT purchases.*, suppliers.* FROM purchases LEFT JOIN suppliers ON purchases.supplier = suppliers.supplierid${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)

    const response = {
        "draw": Number(req.query.draw),
        "recordsTotal": total.rows[0].total,
        "recordsFiltered": total.rows[0].total,
        "data": data.rows
      }
    res.json(response)
})

router.get('/create', isLoggedIn, async  (req, res, next) => {
  try {
    const { rows } = await db.query('INSERT INTO purchases(totalsum) VALUES(0) returning *')
    res.redirect(`/purchases/show/${rows[0].invoice}`)
    console.log(rows);
  }catch(e){
    console.log(e);

    res.send(e)
  }
})

router.get('/show/:invoice', isLoggedIn, async  (req, res, next) => {
  try {
    const {invoice} = req.params 
    const purchases = await db.query('SELECT p.*, s.* FROM purchases as p LEFT JOIN suppliers as s ON p.supplier = s.supplierid WHERE invoice = $1', [invoice])
    console.log(purchases.rows);
    const users = await db.query(' SELECT * FROM users ORDER BY userid')
    const {rows : goods} = await db.query('SELECT barcode, name FROM goods ORDER BY barcode')
    const {rows} = await db.query('SELECT * FROM suppliers ORDER BY supplierid')
    res.render('purchases/form', {
      currentPage: 'Purchases',
      user: req.session.user,
      purchases: purchases.rows[0],
      goods,
      users,
      supplier: rows,
      moment
    })
  }catch(e){
    res.send(e)
  }
})

router.get('/goods/:barcode', isLoggedIn, async (req, res)=> {
  try{
    const {barcode} = req.params
    const {rows} = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
    res.json(rows[0])
  }catch(e){
    res.send(e)
  }
})

  return router
}