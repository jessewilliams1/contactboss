function homeController($scope, $location, $window, User, Contact) {
	log.info('homeController loaded');
	$scope.allContacts = [];

	$scope.createContact = function(newContact) {
		Contact.create(newContact,
			function(response){
				if(!response.error) {
					$scope.changeView('/');
				} else {
					log.error(response.message);
				}
		  	},
			function() {
				log.error('Create new contact fail');
			}
		);
	};

	$scope.getAllContacts = function() {
		Contact.getAll(
			function(response){
				if(!response.error) {
					log.info('Contacts found');
					log.info(response.contacts[0].name);
					$scope.allContacts = response.contacts;
				} else {
					log.error(response.message);
				}
		  	},
			function() {
				log.error('Get all contacts fail');
			}
		);
	};

	$scope.initHomeController = function() {
		$scope.getAllContacts();
		log.info('homeController init done');

	};

	$scope.initHomeController();
}