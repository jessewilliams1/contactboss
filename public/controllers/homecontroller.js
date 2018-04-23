function homeController($scope, $location, $window, $route, User, Contact) {
	log.info('homeController loaded');
	$scope.allContacts = [];
	$scope.newContact = {};

	$scope.createContact = function(newContact) {
		Contact.create(newContact,
			function(response){
				if(!response.error) {
					log.info('Create user success');
					$scope.newContact = null
					$route.reload();
				} else {
					log.error(response.message);
					$scope.newContact = {};
					$route.reload();
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