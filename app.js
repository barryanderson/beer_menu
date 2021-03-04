const express = require('express');
const exphbs = require('express-handlebars');
const hbshelpers = require('handlebars-helpers');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const multihelpers = hbshelpers();

// const {sequelize} = require('./models');
// sequelize.sync({force: true});

// Set handlebar engine.
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', helpers: multihelpers, runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}}));
app.set('view engine', '.hbs');

// Set static folder.
app.use(express.static(path.join(__dirname, 'public')));

// Body parser.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Routes.
app.get('/', (req, res) => {res.render('index');});
app.use('/beer', require('./routes/beer'));
app.use('/review', require('./routes/review'));
app.use('/scores', require('./routes/scores'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server started listening on port ${PORT}`));
