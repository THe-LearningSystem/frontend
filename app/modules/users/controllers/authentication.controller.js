(function () {
    'use strict';

    angular
        .module('users')
        .controller('AuthenticationCtrl', AuthenticationCtrl);

    AuthenticationCtrl.$inject = ['$state', '$stateParams','UsersService', 'Notification', 'Authentication','I18nManager'];

    function AuthenticationCtrl($state,$stateParams, UsersService, Notification, Authentication,I18nManager) {
        var vm = this;

        vm.auth = Authentication;
        vm.fromOutside = $stateParams.fromOutside;
        vm.signup = signup;
        vm.signin = signin;
        vm.isUsernameUnique = isUsernameUnique;
        vm.isEmailUnique = isEmailUnique;
        vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
        vm.emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        vm.usernameIsUnique = true;
        vm.emailIsUnique = true;

        function signup(isValid) {
            if (!isValid) {
                return false;
            } else {
                UsersService.signup(vm.credentials, function (response) {

                });
            }
        }


        function signin(isValid) {
            if (!isValid) {
                return false;
            } else {
                UsersService.signin({
                    username: vm.credentials.usernameOrEmail,
                    password: vm.credentials.password
                }, function (response) {
                    console.log(response);
                    var token = response.data.token;
                    var user =Authentication.setToken(token).user;
                    //set the preferred Language
                    console.log(user);
                    I18nManager.setPreferredLanguage(user.preferredLanguage);

                        // And redirect to the previous or home page
                    $state.go($state.previous.state.name || 'frontend.home', $state.previous.params);
                })
            }
        }

        function isUsernameUnique() {
            if (vm.credentials.username !== undefined) {
                UsersService.isUsernameUnique(vm.credentials.username).then(function () {
                    vm.usernameIsUnique = false;
                }).catch(function () {
                    vm.usernameIsUnique = true;
                });
            }
        }

        function isEmailUnique() {
            if (vm.credentials.email !== undefined) {
                UsersService.isEmailUnique(vm.credentials.email).then(function () {
                    vm.emailIsUnique = false;
                }).catch(function () {
                    vm.emailIsUnique = true;
                });
            }
        }
    }
}());
