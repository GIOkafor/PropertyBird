angular.module('reapp.controllers', [])

.controller('LoginCtrl', function ($scope, $state, AuthService, $ionicPopup) {
	$scope.login = true;
	$scope.user = {};

	$scope.toggleAuth = function() {
		$scope.login = !$scope.login;
	}

	//auth funcs
	$scope.login = function (user) {
		AuthService.login(user.username, user.password).then(function(authenticated){
			$state.go('main.dash', {}, {reload: true});
			$scope.setCurrentUsername(user.username);
		}, function (err) {
			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Please check your credentials!'
			});
		});
	};
})

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
	$scope.username = AuthService.username();

	$scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
		var alertPopup = $ionicPopup.alert({
			title: 'Unauthorized!',
			template: 'You are not allowed to access this resource.'
		});
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
		AuthService.logout();
		$state.go('login');
		var alertPopup = $ionicPopup.alert({
			title: 'Session Lost!',
			template: 'Sorry, You have to login agan.'
		});
	});

	$scope.setCurrentUsername = function (name) {
		$scope.username = name;
	};
})

.controller('DashCtrl', function ($scope, $state, $http, $log, $ionicPopup, AuthService, Listings) {
	$scope.logout = function () {
		AuthService.logout();
		$state.go('login');
	}; 

	$scope.getListings = function() {
		Listings.getListings().then(function(resp){
			$log.info(resp);
		}, function (error) {
			alert('Unable to get listings!');
			$log.error(error);
		});
	}

	$scope.performValidRequest = function () {
		$http.get('http://localhost:8100/valid').then(
			function (result) {
				$scope.response = result;
			});
	};

	$scope.performUnauthorizedRequest = function () {
		$http.get('http://localhost:8100/notauthorized').then(
			function (result) {
				// no result here....
			}, function (err) {
				$scope.response = err;
			});
	};

	$scope.performInvalidRequest = function() {
		$http.get('http://localhost:8100/notauthenticated').then(
			function (result) {
				// No result here too...
			}, function (err) {
				$scope.response = err;
			});
	};
})