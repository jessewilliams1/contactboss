var App = angular.module('App', ['ngRoute', 'ngAnimate']);

// Controllers
App.controller('mainController', mainController);
App.controller('homeController', homeController);
App.controller('contactController', contactController);

// Factories
App.factory('User', User);
App.factory('Contact', Contact);

// Routes
App.config(function($routeProvider) {
	// Basics
	$routeProvider.when('/', { templateUrl : 'views/home.html', controller: homeController});
	$routeProvider.when('/home', { templateUrl : 'views/home.html', controller: homeController});
	$routeProvider.when('/contact/:contactID', { templateUrl : 'views/contact.html', controller: contactController});
});