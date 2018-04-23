// Custom Modules
var config = require('../../config/config.js');
var db = require('../../utils/db.js');
var dbConnection = db();
var log = require('../../utils/logger');
var module = 'contact.js';

/*
 * Create Contact
 * TODO: More robust validation with lengths, phone formatting, etc.
 */
exports.create = function(req, res) {
	try {
		// Validate required fields.
		if (!req.body.name || !req.body.phone) {
			log.error('Name or phone empty', module);
			res.status(400).send({error: true, message: 'Name or phone empty'});
			return;
		}

		// Create the contact record. Ensuring the user is always the owner of the current valid token
		var query = "INSERT INTO Contacts (name, phone, user_id) VALUES ('" + req.body.name + "', '" + req.body.phone + "', '" + req.user_id + "')";
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error creating contact -> ' + error, module);
				res.status(500).send({error: true, message: 'Error creating contact'});
			} else {
				log.info('New contact created: ' + result.insertId, module);
			    res.status(200).send({ error: false });
			}
		});
	} catch (error) {
		log.error('Error creating contact -> ' + error, module);
		res.status(500).send({error: true, message: 'Error creating contact'});
	}
};


/*
 * Get All Contacts
 */
exports.getAll = function(req, res) {
	try {
		// Get all contacts for the currently authorized user
		var query = 'SELECT * FROM Contacts WHERE user_id = "' + req.user_id + '"';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error getting all contacts -> ' + error, module);
				res.status(500).send({error: true, message: 'Error getting all contacts'});
			} else {
				log.info('Contacts found: ' + result.length, module);
			    res.status(200).send({ error: false, contacts: result});
			}
		});
	} catch (error) {
		log.error('Error getting all contacts -> ' + error, module);
		res.status(500).send({error: true, message: 'Error getting all contacts'});
	}
};


/*
 * Get One Contact
 */
exports.getOne = function(req, res) {
	try {
		// Validate contact ID
		if (!req.query.contact_id) {
			log.error('Contact ID empty', module);
			res.status(400).send({error: true, message: 'Contact ID empty'});
			return;
		}

		// Get the contact by ID, ensuring it is only for the currently authorized user
		var query = 'SELECT * FROM Contacts WHERE contact_id = "' + req.query.contact_id + '" AND user_id = "' + req.user_id + '"';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error getting one contact -> ' + error, module);
				res.status(500).send({error: true, message: 'Error getting one contact'});
			} else {
				log.info('Contact found: ' + result[0].name, module);
			    res.status(200).send({ error: false, contact: result[0]});
			}
		});
	} catch (error) {
		log.error('Error getting one contact -> ' + error, module);
		res.status(500).send({error: true, message: 'Error getting one contact'});
	}
};


/*
 * Update Contact
 * TODO: Better data validation
 */
exports.update = function(req, res) {
	try {
		// Validate required fields
		if (!req.body.contact_id || !req.body.name || !req.body.phone) {
			log.error('Missing required fields', module);
			res.status(400).send({error: true, message: 'Missing required fields'});
			return;
		}

		// Find and update the contact, given it's ID and the current user
		var query = 'UPDATE Contacts SET name = "' + req.body.name + '", phone = "' + req.body.phone + '" WHERE contact_id = "' + req.body.contact_id + '" AND user_id = "' + req.user_id + '"';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error updating contact -> ' + error, module);
				res.status(500).send({error: true, message: 'Error updating contact'});
			} else {
				log.info('Contact updated: ' + req.body.contact_id, module);
			    res.status(200).send({ error: false});
			}
		});
	} catch (error) {
		log.error('Error updating contact -> ' + error, module);
		res.status(500).send({error: true, message: 'Error updating contact'});
	}
};


/*
 * Delete Contact
 */
exports.delete = function(req, res) {
	try {
		// Validate contact ID
		if (!req.body.contact_id) {
			log.error('Contact ID missing', module);
			res.status(400).send({error: true, message: 'Contact ID missing'});
			return;
		}
		// Find and delete the contact, given it's ID and the current user
		var query = 'DELETE FROM Contacts WHERE contact_id = "' + req.body.contact_id + '" AND user_id = "' + req.user_id + '"';
		dbConnection.query(query, function(error, result){
			if (error) {
				log.error('Error deleting contact -> ' + error, module);
				res.status(500).send({error: true, message: 'Error deleting contact'});
			} else {
				log.info('Contact deleted: ' + req.body.contact_id, module);
			    res.status(200).send({ error: false});
			}
		});
	} catch (error) {
		log.error('Error deleting contact -> ' + error, module);
		res.status(500).send({error: true, message: 'Error deleting contact'});
	}
};