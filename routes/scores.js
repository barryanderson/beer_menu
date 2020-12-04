const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/', async (req, res) => {
  try {
    let beers = await db.Beer.findAll({
      attributes: [
        ['id', 'id'],
        ['name', 'name'],
        ['company', 'company'],
        ['abv', 'abv'],
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
    beers = sortBy(beers);
    res.render('scores', {beers: beers} );
  } catch (error) {
    res.status(500);
  }
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

    beer.branding = Math.round(branding);
    beer.aroma = Math.round(aroma);
    beer.appearance = Math.round(appearance);
    beer.flavor = Math.round(flavor);
    beer.mouthfeel = Math.round(mouthfeel);
    beer.overall = Math.round(overall);
    beer.totalScore = Math.round((branding + aroma + appearance + flavor + mouthfeel + overall)/6)*10;
  });

  return beers;
}

function sortBy(beers) {
  beers.sort((a, b) => {
    return  b.totalScore - a.totalScore;
  })

  return beers;
}

module.exports = router;
