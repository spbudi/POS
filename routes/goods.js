var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();
const { isAdmin } = require('../helpers/util');
const path = require('path');

module.exports = (db) => {
  router.get('/', isAdmin, async function (req, res, next) {
    try {
      const { rows } = await db.query('SELECT * FROM goods');
      res.render('goods/list', {
        user: req.session.user,
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Good Utilities',
        rows,
      });
    } catch (err) {
      res.send(err);
    }
  });

  router.get('/datatable', async (req, res) => {
    let params = [];

    if (req.query.search.value) {
      params.push(`barcode ilike '%${req.query.search.value}%'`);
    }
    if (req.query.search.value) {
      params.push(`name ilike '%${req.query.search.value}%'`);
    }

    const limit = req.query.length;
    const offset = req.query.start;
    const sortBy = req.query.columns[req.query.order[0].column].data;
    const sortMode = req.query.order[0].dir;

    const total = await db.query(
      `select count(*) as total from goods${
        params.length > 0 ? ` where ${params.join(' or ')}` : ''
      }`
    );
    const data = await db.query(
      `select * from goods${
        params.length > 0 ? ` where ${params.join(' or ')}` : ''
      } order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
    );
    const response = {
      draw: Number(req.query.draw),
      recordsTotal: total.rows[0].total,
      recordsFiltered: total.rows[0].total,
      data: data.rows,
    };
    res.json(response);
  });

  router.get('/add', isAdmin, async (req, res, next) => {
    try {
      const { rows: units } = await db.query('SELECT * FROM units');
      res.render('goods/add', {
        currentPage: 'POS - Add',
        user: req.session.user,
        units,
      });
    } catch (err) {
      res.send(err);
    }
  });

  router.post('/add', isAdmin, (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    const imagesfiles = `${Date.now()}-${sampleFile.name}`;
    uploadPath = path.join(
      __dirname,
      '..',
      'public',
      'images',
      'upload',
      imagesfiles
    );

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);

      const { barcode, name, stock, purchaseprice, sellingprice, unit } =
        req.body;
      console.log(barcode, name, stock, purchaseprice, sellingprice);

      db.query(
        'INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [barcode, name, stock, purchaseprice, sellingprice, unit, imagesfiles]
      );
      if (err) {
        console.log(err);
        return console.error(err.message);
      }
      res.redirect('/goods');
    });
  });

  router.get('/edit/:barcode', isAdmin, async (req, res, next) => {
    try {
      const { barcode } = req.params;
      const { rows } = await db.query(
        'SELECT * FROM goods WHERE barcode = $1',
        [barcode]
      );
      const { rows: units } = await db.query('SELECT * FROM units');
      res.render('goods/edit', {
        currentPage: 'POS - Goods',
        user: req.session.user,
        item: rows[0],
        units,
      });
    } catch (e) {
      res.send(e);
    }
  });

  router.post('/edit/:barcode', isAdmin, async (req, res, next) => {
    try {
      const { barcode } = req.params;
      const { name, stock, purchaseprice, sellingprice, unit } = req.body;
      let sampleFile;
      let uploadPath;

      if (!req.files || Object.keys(req.files).length === 0) {
         await db.query(
          'UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5 WHERE barcode = $6',
          [name, stock, purchaseprice, sellingprice, unit, barcode]
        );
      } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.sampleFile;
        const imagesfiles = `${Date.now()}-${sampleFile.name}`;
        uploadPath = path.join(
          __dirname,
          '..',
          'public',
          'images',
          'upload',
          imagesfiles
        );

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath);

        await db.query(
          'UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7',
          [name, stock, purchaseprice, sellingprice, unit, imagesfiles, barcode]
        );
      }
      res.redirect('/goods');
    } catch (err) {
      console.log(err);
    }
  });

  router.get('/delete/:barcode', isAdmin, async (req, res, next) => {
    try {
      const { barcode } = req.params;
      await db.query('DELETE FROM goods WHERE barcode = $1', [barcode]);
      req.flash('success', 'Item deleted successfully');
      res.redirect('/goods');
    } catch (e) {
      console.log(e);
      req.flash('error', e);
      return res.redirect('/goods');
    }
  });

  return router;
};
