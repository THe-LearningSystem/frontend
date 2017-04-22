(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('users.services')
        .factory('UsersService', UsersService);

    UsersService.$inject = ['$rootScope','$http'];

    function UsersService($rootScope,$http) {
        return {
            signup: signup,
            signin: signin,
            isUsernameUnique: isUsernameUnique,
            isEmailUnique: isEmailUnique
        };

        function signup(credentials) {
            return $http.post($rootScope.serverUrl+'/auth/signup', credentials);
        }

        function signin(credentials) {
            return $http.post($rootScope.serverUrl+'/auth/signin', credentials);
        }

        function isUsernameUnique(username) {
            return $http.get($rootScope.serverUrl+'/users/username/' + username);
        }

        function isEmailUnique(email) {
            return $http.get($rootScope.serverUrl+'/users/email/' + email);
        }

        function complete(response) {
            return response;
        }

        function failed(error) {
            console.log(error.statusText);
        }
    }
}());
