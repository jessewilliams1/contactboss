// Custom Modules
var config = require('../../config/config.js');
var db = require('../../utils/db.js');
var dbConnection = db();
var log = require('../../utils/logger');
var module = 'user.js';

// Other modules
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/*
 * Register User
 * TODO: Better data validation on emails & passwords
 */
exports.register = function(req, res) {
	try {
		// Validate required fields
		if (!req.body.email || !req.body.password) {
			log.error('Email or password missing', module);
			res.status(400).send({error: true, message: 'Email or password missing'});
			return;
		}

		// Hash password and create the user record
		var hashedPassword = bcrypt.hashSync(req.body.password, 8);
		var query = 'INSERT INTO Users (email, password) VALUES ("' + req.body.email + '", "' + hashedPassword + '")';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error registering user -> ' + error, module);
				res.status(500).send({error: true, message: 'Error registering user'});
			} else {
				log.info('New user registered: ' + result.insertId, module);

			    // Create and return new token for local use
			    var token = jwt.sign({ id: result.insertId }, config.JWT_SECRET, { expiresIn: config.JWT_TOKEN_TTL });
			    res.status(200).send({ auth: true, token: token });
			}
		});
	} catch (error) {
		log.error('Error registering user -> ' + error, module);
		res.status(500).send({error: true, message: 'Error registering user'});
	}
};


/*
 * Login
 * TODO: Better way of passing credentials (instead of POST body)
 */
exports.login = function(req, res) {
	try {
		// Check for missing credentials
		if(!req.body.email || !req.body.password) {
			log.error('Email or password missing', module);
			res.status(400).send({error: true, message: 'Email or password missing'});
			return;
		}

		// Get the user by email and compare their password
		var query = 'SELECT user_id, password FROM Users WHERE email = "' + req.body.email  + '"';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error logging in -> ' + error, module);
				res.status(500).send({error: true, message: 'Error logging in'});
			} else {
				// Check their password
				log.info('User login attempt: ' + req.body.email, module);
				var validPassword = bcrypt.compareSync(req.body.password, result[0].password)
				if (validPassword) {
					log.info('User login success: ' + req.body.email, module);

				    // If password matches, create and return the token for local use
				    var token = jwt.sign({ id: result[0].user_id }, config.JWT_SECRET, { expiresIn: config.JWT_TOKEN_TTL });
				    res.status(200).send({ auth: true, token: token });					
				} else {
					log.info('User login fail: ' + req.body.email, module);
					res.status(401).send({error: true, message: 'Invalid credentials'});
				}
			}
		});
	} catch (error) {
		log.error('Error logging in -> ' + error, module);
		res.status(500).send({error: true, message: 'Error logging in'});
	}
};


/*
 * Login
 */
exports.getUser = function(req, res) {
	try {
		// Get the user record based on the given user ID. User already has valid token.
		var query = 'SELECT user_id, email FROM Users WHERE user_id = "' + req.user_id  + '"';
		dbConnection.query(query, function(error, result) {
			if(error) {
				log.error('Error getting user -> ' + error, module);
				res.status(500).send({error: true, message: 'Error getting user'});
			} else {
				if(!result[0]) {
					log.info('User not found', module);
					res.status(401).send({error: true, message: 'User not found'});								
				} else {
					res.status(200).send({error: false, user: result[0]});
				}
			}
		});
	} catch (error) {
		log.error('Error getting user -> ' + error, module);
	    res.status(500).send({error: true, message: 'Error getting user'});
	}
};