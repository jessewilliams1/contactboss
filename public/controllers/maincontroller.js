function mainController($scope, $location, $window, User, Contact) {
	$scope.alertVisible = false;
	$scope.alertText = null;
	$scope.currentUser = null;
	$scope.authenticated = false;
	$scope.loginFailed = false;

	$scope.newUser = {
		email: '',
		password: '',
		passwordVerify: ''
	};

	$scope.clearAlerts = function() {
		$scope.alertVisible = false;
		$scope.alertText = '';
	};

	$scope.toggleAlert = function(visibility, text) {
		// First, clear any other alerts, since only one can be visibile at a time
		$scope.clearAlerts();
		$scope.alertVisible = visibility;
		$scope.alertText = text;
	};
	
	$scope.changeView = function(viewName) {
    	$location.path(viewName);
  	};

	$scope.login = function(credentials) {
		if(loginForm.$invalid) {
			return;
		}
		credentials.email = credentials.email.toLowerCase();
		User.login(credentials,
			function(response){
				log.info('Login success');
				$scope.loginFailed = false;
				$window.localStorage.setItem('auth_token', response.token);

				// Pull info for the new user
				$scope.getUser();
	    	},
			function() {
	        	log.info('Login failed');
	        	$scope.loginFailed = true;
	    	}
	    );
	};


  	$scope.logout = function() {
		$window.localStorage.removeItem('auth_token');
		$scope.authenticated = false;
		$scope.currentUser = null;
		$scope.changeView('/');
  	};

	$scope.registerUser = function(newUser) {
		User.register(newUser,
			function(response){
				if(response.auth) {
					log.info('User registration success');
					$window.localStorage.setItem('auth_token', response.token);

					// Clear the form and pull the info for the new user
					$scope.clearNewUser();
					$scope.getUser();

				} else {
					log.error('Unknown error registering user');
				}
		  	},
			function() {
				log.error('Register fail');
			}
		);
	};

	$scope.clearNewUser = function() {
		$scope.newUser = { email: '', password: '', passwordVerify: ''};
	};

	$scope.getUser = function() {
		log.info('Authorizing user...');
		User.getUser(function(userProfile) {
			$scope.currentUser = userProfile
			$scope.authenticated = true;
			$scope.changeView('/home');
		},
		function() {
			log.error('Get user fail');
		});
	};

	$scope.initMainController = function() {
		// Only try to load if a token even exists locally
		if($window.localStorage.auth_token) {
			$scope.getUser();
		}
	};

	$scope.initMainController();
}