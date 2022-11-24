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
    const {userid} = req.session.user
    const { rows } = await db.query('INSERT INTO purchases(totalsum, operator) VALUES(0, $1) returning *', [userid])
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
      success: req.flash('success'),
      error: req.flash('error'),
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

router.post('/show/:invoice', isLoggedIn, async (req, res) => {
  try {
    const { invoice } = req.params
    const { totalsum, supplier } = req.body
    const {userid} = req.session.user
    await db.query('UPDATE purchases SET totalsum = $1, supplier = $2, operator = $3 WHERE invoice = $4', [totalsum, supplier,userid, invoice])

    req.flash('success', 'Transaction Success!')
    res.redirect('/purchases')
  } catch (error) {
    console.log(error)
    req.flash('error', 'Transaction Fail!')
    return res.redirect('/purchases')
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

router.post('/additem', isLoggedIn, async (req, res) => {
  try {
    const { invoice, itemcode, quantity } = req.body
    await db.query('INSERT INTO purchaseitems (invoice, itemcode, quantity)VALUES ($1, $2, $3) returning *', [invoice, itemcode, quantity]);
    const { rows } = await db.query('SELECT * FROM purchases WHERE invoice = $1', [invoice])
  
    res.json(rows[0])
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

router.get('/details/:invoice', isLoggedIn, async (req, res, next) => {
  try {
    const { invoice } = req.params
    const { rows: data } = await db.query('SELECT purchaseitems.*, goods.name FROM purchaseitems LEFT JOIN goods ON purchaseitems.itemcode = goods.barcode WHERE purchaseitems.invoice = $1 ORDER BY purchaseitems.id', [invoice])

    res.json(data)
    console.log(data);
  } catch (err) {
    console.log(err)
  }
});

router.get('/deleteitems/:id', isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params
    const { rows: data } = await db.query('DELETE FROM purchaseitems WHERE id = $1 returning *', [id])
    
    req.flash('success', 'Transaction deleted successfully') 
    res.redirect(`/purchases/show/${data[0].invoice}`)
  } catch (err) {
    req.flash('error', 'Please, Edit and Delete items first ')

    console.log(err)
  }
});

router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
  try {
    const { invoice } = req.params
    await db.query('DELETE FROM purchases WHERE invoice = $1', [invoice])
  
    req.flash('success', 'Transaction deleted successfully')
    res.redirect('/purchases');
  } catch (err) {
    req.flash('error', 'Please, Edit and Delete items first ')
    return res.redirect('/purchases')
  }
});

  return router
}