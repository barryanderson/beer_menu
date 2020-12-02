const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set handlebar engine.
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}}));
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server started listening on port ${PORT}`));
