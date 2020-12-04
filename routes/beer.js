const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { sequelize, QueryTypes } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    // const beers = await db.Beer.findAll({ order: [['name', 'ASC']] });

    let beers = await db.Beer.findAll({
      attributes: [
        ['id', 'id'],
        ['name', 'name'],
        ['company', 'company'],
        ['abv', 'abv'],
        [db.sequelize.fn('COUNT', db.sequelize.col('beerId')), 'reviewCount'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('branding')), 2), 'branding'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('aroma')), 2), 'aroma'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('appearance')), 2), 'appearance'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('flavor')), 2), 'flavor'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('mouthfeel')), 2), 'mouthfeel'],
        [db.sequelize.fn('ROUND', db.sequelize.fn('AVG', db.sequelize.col('overall')), 2), 'overall'],
      ],
      include: [{
        model: db.Review,
        as: 'Reviews',
        attributes: [
        ],
      }],
      raw: true,
      group: ['Beer.id'],
      order: [['name', 'ASC']]
    });

    // This should be moved in SQL query but seems a hassle.  Review.
    beers = calculateTotalScores(beers);

    res.render('beers', { beers: beers });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

// Add a beer.
router.get('/add', async (req, res) => {
  res.render('beerForm');
});

router.post('/add', async (req, res) => {
  let {name, company, abv, id} = req.body;
  let errors = {};

  console.log(id);

  // Validate fields.
  if(!name) { errors.name = 'is-invalid'; }
  if(!company) { errors.company = 'is-invalid'; }
  if(!(!isNaN(parseFloat(abv)) && isFinite(abv))) { errors.abv = 'is-invalid'; }

  if(JSON.stringify(errors) == '{}') {
    try {

      if(id) {
        console.log(id);
        const beer = await db.Beer.update({ name, company, abv }, {where: {id: id}});
      } else {
        const beer = await db.Beer.create({ name, company, abv });
      }

      res.redirect('/beer');
    } catch (error) {
      res.status(500);
    }
  } else {
    res.render('beerForm', {errors, name, company, abv, id});
  }
});

// Edit a beer.
router.get('/edit/:id', async(req, res) => {
  try {
    const beer = await db.Beer.findByPk(req.params.id);

    res.render('beerForm', {id: beer.id, name: beer.name, company: beer.company, abv: beer.abv});
  } catch (error) {
    res.status(500);
  }
});


// Remove a beer.
router.get('/remove/:id', (req, res) => {
  db.Beer.destroy({
    where: { id: req.params.id }
  });
  res.redirect('/beer');
});

function calculateTotalScores(beers) {
  beers.forEach((beer) => {
    let {branding, aroma, appearance, flavor, mouthfeel, overall} = beer;
    branding = parseFloat(branding);
    aroma = parseFloat(aroma);
    appearance = parseFloat(appearance);
    flavor = parseFloat(flavor);
    mouthfeel = parseFloat(mouthfeel);
    overall = parseFloat(overall);

    beer.totalScore = Math.round((branding + aroma + appearance  + flavor + mouthfeel + overall)/6)*10;
  });

  return beers;
}

module.exports = router;
