/**
 * Scrumdog
 */


var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var config = require('./config.json');
var models = require('./models');



var app = express();
app.use('/static', express.static('client/build'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


// only one route
app.get('/', function(req, res, next){
    res.status(200).sendFile('client/build/index.html', {
        root: __dirname
    });
});

// api routes
require('./routes/api')(app);


/**
 * Start the Expres server
 */
function startExpress(){
    return app.listen(config.server.port, function(){
        console.log('Scrumdog running on ' + config.server.port);
    });
}

// you can pass --forcesync as the first argumetn to force a sync of the DB.
// todo - do this better, it's flaky.
models.sequelize.sync({
    force: process.argv[2] === '--forcesync'
}).then(startExpress);
