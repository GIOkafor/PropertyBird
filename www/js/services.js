angular.module('reapp.services', [])

.service('AuthService', function($q, $http, USER_ROLES) {
	var LOCAL_TOKEN_KEY = 'yourTokenKey';
	var username = '';
	var isAuthenticated = false; 
	var role = '';
	var authToken; 

	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if(token){
			useCredentials(token);
		}
	}

	function storeUserCredentials(token){
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}

	function useCredentials(token) {
		username = token.split('.')[0];
		isAuthenticated = true;
		authToken = token;

		//sets user permission based on input
		if (username == 'admin') {
			role = USER_ROLES.admin
		}
		if (username == 'user') {
			role = USER_ROLES.public
		}

		//set token as the header for your requests
		$http.defaults.headers.common['X-Auth-Token'] = token;
	}

	function destroyUserCredentials() {
		authToken = undefined;
		username = '';
		isAuthenticated = false;
		$http.defaults.headers.common['X-Auth-Token'] = undefined;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	}

	var login = function(name, pw) {
		return $q(function(resolve, reject) {
			if((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')){
				//make a request and receive auth token from server
				storeUserCredentials(name + '.yourServerToken');
				resolve('login success.');
			}else{
				reject('Login Failed.');
			}
		});
	};

	var logout = function(){
		destroyUserCredentials();
	};

	var isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return(isAuthenticated && authorizedRoles.indexOf(role) !== -1);
	};

	//try to load existing credentials if they already exist if not ...
	loadUserCredentials();

	return{
		login: login,
		logout: logout,
		isAuthorized: isAuthorized,
		isAuthenticated: function () {
			return isAuthenticated;
		},
		username: function() {
			return username;
		},
		role: function() {
			return role;
		}
	};
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS){
	return{
		responseError: function (response) {
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated,
				403: AUTH_EVENTS.notAuthorized
			}[response.status], response);
			return $q.reject(response);
		}
	};
})

.factory('Listings', function($http, $log, IDX_KEY){
	$log.info("Listings factory start...");
	var url = "http://www.torontomls.net/api/Idx.asp?api_key=f4fd144531da81ace06aa74e420391b3"; //enter url here

	return{
		getListings: function(){
			return $http.jsonp(url);
		}
	}
})

.config(function ($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});