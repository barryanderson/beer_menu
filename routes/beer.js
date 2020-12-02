const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', (req, res) => {
  db.Beer.findAll()
    .then((beers) => {
      res.render('beers', {
        beers: beers
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

// Add a beer.
router.get('/add', (req, res) => {
  const data = {
    name: 'PunkIPA',
    company: 'Brew Dog',
    abv: 5
  }

  let {name, company, abv} = data;

  db.Beer.create({
    name,
    company,
    abv
  });
});

module.exports = router;
