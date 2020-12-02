const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/beer'));
app.use('/review', require('./routes/review'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server started listening on port ${PORT}`));
