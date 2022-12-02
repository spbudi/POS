var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/util');
const currencyFormatter = require('currency-formatter');


module.exports = (db) => {
  //   router.get('/', isLoggedIn ,function(req, res, next) {
  //     res.render('dashboard', {
  //         user: req.session.user,
  //         currentPage: 'POS - Dashboard'
  //     });
  // });

  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      const { rows: purchases } = await db.query(
        'SELECT sum(totalsum) AS total FROM purchases'
      );
      const { rows: sales } = await db.query(
        'SELECT sum(totalsum) AS total FROM sales'
      );
      const { rows: salestotal } = await db.query(
        'SELECT COUNT(*) AS total FROM customers'
      );

      console.log(sales);
      res.render('dashboard', {
        user: req.session.user,
        currentPage: 'POS - Dashboard',
        purchases,
        sales,
        salestotal,
        currencyFormatter,
      });
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};
