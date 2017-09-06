(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('users.services')
        .factory('UsersService', UsersService);

    UsersService.$inject = ['crud'];

    function UsersService(crud) {
        return {
            signup: signup,
            signin: signin,
            isUsernameUnique: isUsernameUnique,
            isEmailUnique: isEmailUnique,
            get:get,
            update:update
        };

        function get(userId){
            return crud.get('/users/'+userId);
        }

        function update(data){
            return crud.put('/users/'+data.userId,data.payload);
        }
        function signup(credentials,callback) {
            return crud.post('/auth/signup', credentials,callback);
        }

        function signin(credentials,callback,notify) {
            return crud.post('/auth/signin', credentials,callback,notify);
        }

        function isUsernameUnique(username) {
            return crud.get('/users/username/' + username);
        }

        function isEmailUnique(email) {
            return crud.get('/users/email/' + email);
        }
    }
}());
