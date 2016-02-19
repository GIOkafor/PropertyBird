angular.module('reap.controllers', [])

.controller('LoginCtrl', function ($scope) {
	$scope.login = true;
	$scope.user = {
			type : 'agent'
		}
	$scope.toggleAuth = function() {
		$scope.login = !$scope.login;
	}
})