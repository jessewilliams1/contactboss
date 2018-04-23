/* TODO:
 * Use Knex or similar to greatly simplify DB operations and give a true model
 */

// Custom modules
var config = require('./config/config.js');
var user = require('./modules/handlers/user.js');
var contact = require('./modules/handlers/contact.js');
var db = require('./utils/db.js');
var log = require('./utils/logger.js');
var module = 'contact-boss.js';

// Other modules
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

(function startup() {
	try {
		log.info('#### Starting Up', module);

		// Initialize express & start up
		var app = initializeApp();
		app.listen(config.NODE_APP_PORT);

		log.info('#### Startup Complete', module);
		log.info('#### Listening on: ' + config.NODE_APP_PORT, module);

	} catch (error) {
		log.error('#### Startup Error -> ' + error, module);
	}
})();


function validateRequest() {
	return function(req, res, next) {
		var token = req.headers['x-access-token'];
		if (!token) {
			log.error('No token given', module);
			return res.status(403).send({ auth: false, message: 'No token given' });
		} else {
			// If token is given, verify and decode
			log.info('Verifying token', module);
			jwt.verify(token, config.JWT_SECRET, function(error, decodedToken) {
				if (error) {
					log.info('Token invalid', module);
					res.status(500).send({error: true, message: 'Invalid token'});
				} else {
					req.user_id = decodedToken.id;
					next();
				}
			});
		}
	}
}


function initializeApp() {
	try {
		// Initialize & test the MySQL connection
		var dbConnection = db();
		dbConnection.query('SHOW TABLES', function(error, result){
			if(error) {
				log.error('Fatal error connecting to MySQL: ' + error);
				process.exit(0);
			} else {
				log.info('MySQL connection established. Tables found: ' + result.length, module);
			}
		});

		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());
		app.use(express.static('public'));

		// Public Routes
		app.route('/login').post(user.login);
		app.route('/register').post(user.register);
		
		// Routes requiring a valid token
		app.route('/getUser').get(validateRequest(), user.getUser);
		app.route('/createContact').post(validateRequest(), contact.create);
		app.route('/getAllContacts').get(validateRequest(), contact.getAll);
		app.route('/getOneContact').get(validateRequest(), contact.getOne);
		app.route('/updateContact').post(validateRequest(), contact.update);
		app.route('/deleteContact').post(validateRequest(), contact.delete);

		return app;
	} catch (error) {
		log.error('Fatal error initializing app -> ' + error, module);
		process.exit(0);
	}
}