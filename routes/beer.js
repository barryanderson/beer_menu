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
  res.render('beerForm');
});

router.post('/add', (req, res) => {
  let {name, company, abv} = req.body;
  let errors = [];

  console.log(req.body);

  // Validate fields.
  if(!name) { errors.push({ text: 'Please add a title.'}); }
  if(!company) { errors.push({ text: 'Please add a company.'}); }
  if(!abv) { errors.push({ text: 'Please add an ABV.'}); }

  if(errors.length > 0) {
    res.render('beerForm', {errors, name, company, abv});
  } else {
    db.Beer.create({
      name,
      company,
      abv
    })
    .then((beer) => res.redirect('/beer'))
    .catch((err) => console.log(err));
  }
});

// Remove a beer.
router.get('/remove/:id', (req, res) => {
  db.Beer.destroy({
    where: { id: req.params.id }
  });
  res.redirect('/beer');
});

module.exports = router;
