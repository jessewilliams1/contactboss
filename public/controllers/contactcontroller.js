function contactController($scope, $location, $window, Contact) {
	log.info('contactController loaded');
	$scope.singleContact = null;
	$scope.title;

	$scope.getContact = function(contactID) {
		Contact.getOne(contactID,
			function(response){
				if(!response.error) {
					log.info('Contact found');
					$scope.singleContact = response.contact;
					$scope.title = String($scope.singleContact.name);
				} else {
					log.error(response.message);
				}
		  	},
			function() {
				log.error('Get contact fail');
			}
		);
	};

	$scope.updateContact = function(updatedContact) {
		Contact.update(updatedContact,
			function(response){
				if(!response.error) {
					log.info('Contact updated');
					$scope.changeView('/');
				} else {
					log.error(response.message);
				}
		  	},
			function() {
				log.error('Contact update fail');
			}
		);
	};

	$scope.deleteContact = function(deletedContact) {
		Contact.delete(deletedContact,
			function(response){
				if(!response.error) {
					log.info('Contact deleted');
					$scope.changeView('/');
				} else {
					log.error(response.message);
				}
		  	},
			function() {
				log.error('Contact delete fail');
			}
		);
	};

	$scope.initContactController = function() {
		log.info('contactController init complete');
		// Grab the message ID from the URL and get its full record
	    var currentURL = $location.url();
    	var contactID = currentURL.slice(9,currentURL.length);
    	if(contactID) {
    		$scope.getContact(contactID);
		}
	};


	$scope.initContactController();
}