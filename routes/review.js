const express = require('express');
const router = express.Router();
const db = require('../models/index');

router.get('/:id', async (req, res) => {
  try {
    let reviews = await db.Review.findAll({
      where: { beerId: req.params.id },
      order: [['judgeName', 'ASC']]
    });
    const beer = await db.Beer.findByPk(req.params.id);
    reviews = calculateTotalScores(reviews);

    res.render('reviews', {reviews: reviews, beer: beer} );
  } catch (error) {
    res.status(500);
  }
});

router.get('/add/:id', async (req, res) => {
  try {
    const beer = await db.Beer.findByPk(req.params.id);
    res.render('reviewForm', {beer: beer});
  } catch (error) {
    res.status(500);
  }
});

router.post('/add/:id', async (req, res) => {
  let {id, judgeName, branding, aroma, appearance, flavor, mouthfeel, overall} = req.body;
  let errors = {};

  // Validate fields.
  if(!judgeName) { errors.judgeName = 'is-invalid'; }
  if(!branding) { errors.branding = 'is-invalid'; }
  if(!aroma) { errors.aroma = 'is-invalid'; }
  if(!appearance) { errors.appearance = 'is-invalid'; }
  if(!flavor) { errors.flavor = 'is-invalid'; }
  if(!mouthfeel) { errors.mouthfeel = 'is-invalid'; }
  if(!overall) { errors.overall = 'is-invalid'; }

  if(JSON.stringify(errors) == '{}') {
    try{
      const beer = await db.Beer.findOne({ where: {id: req.params.id }});

      if(id) {
        console.log(id);
        const review = await db.Review.update({
          judgeName: judgeName,
          branding: branding,
          aroma: aroma,
          appearance: appearance,
          flavor: flavor,
          mouthfeel: mouthfeel,
          overall: overall,
          beerId: beer.id
        },
        {where: {id: id}});
      } else {
        const review = await db.Review.create({
          judgeName: judgeName,
          branding: branding,
          aroma: aroma,
          appearance: appearance,
          flavor: flavor,
          mouthfeel: mouthfeel,
          overall: overall,
          beerId: beer.id
        });
      }

      res.redirect('/beer');
    } catch(error) {
      res.status(500);
    }
  } else {
    res.render('reviewForm', {errors, id, judgeName, branding, aroma, appearance, flavor, mouthfeel, overall});
  }
});


// Edit a review.
router.get('/edit/:id', async(req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    const beer = await db.Beer.findByPk(review.beerId);

    res.render('reviewForm', {beer: beer, id: review.id, judgeName: review.judgeName, branding: review.branding, aroma: review.aroma, appearance: review.appearance, flavor: review.flavor, mouthfeel: review.mouthfeel, overall: review.overall});
  } catch (error) {
    res.status(500);
  }
});

// Remove a review.
router.get('/remove/:id', async (req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    await db.Review.destroy({ where: { id: req.params.id } });
    res.redirect(`/review/${review.beerId}`);
  } catch (error) {
    res.status(500);
  }
});

function calculateTotalScores(reviews) {
  reviews.forEach((review) => {
    let {branding, aroma, appearance, flavor, mouthfeel, overall} = review;
    branding = parseFloat(branding);
    aroma = parseFloat(aroma);
    appearance = parseFloat(appearance);
    flavor = parseFloat(flavor);
    mouthfeel = parseFloat(mouthfeel);
    overall = parseFloat(overall);

    review.totalScore = Math.round((branding + aroma + appearance + flavor + mouthfeel + overall)/6)*10;
  });

  return reviews;
}

module.exports = router;
