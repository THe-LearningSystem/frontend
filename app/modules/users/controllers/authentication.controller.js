(function () {
    'use strict';

    angular
        .module('users')
        .controller('AuthenticationCtrl', AuthenticationCtrl);

    AuthenticationCtrl.$inject = ['$state', 'UsersService', 'Notification', 'Authentication'];

    function AuthenticationCtrl($state, UsersService, Notification, Authentication) {
        var vm = this;

        vm.auth = Authentication;
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
                UsersService.signup(vm.credentials)
                    .then(onUserSignupSuccess)
                    .catch(onUserSignupError);
            }
        }


        function signin(isValid) {
            if (!isValid) {
                return false;
            } else {
                //TODO:fix this
                UsersService.signin({username: vm.credentials.usernameOrEmail, password: vm.credentials.password})
                    .then(onUserSigninSuccess)
                    .catch(onUserSigninError);
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

        // Authentication Callbacks
        function onUserSignupSuccess(response) {
            Notification.success({
                message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!',
                positionX: 'right',
                positionY: 'bottom'
            });
            // And redirect to the previous or home page
            //$state.go('users.signin');
        }

        function onUserSignupError(response) {
            Notification.error({
                message: response.data.message,
                title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!',
                delay: 6000
            });
        }

        function onUserSigninSuccess(response) {
            var token = response.data.token;
            console.log(Authentication);
            Authentication.setToken(token);

            // If successful we assign the response to the global user model
            Notification.success({
                message: '<i class="glyphicon glyphicon-ok"></i> Signin successful!',
                positionX: 'right',
                positionY: 'bottom'
            });
            console.log($state.previous);
            // And redirect to the previous or home page
            $state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onUserSigninError(response) {
            Notification.error({
                message: response.data.message,
                title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!',
                delay: 6000
            });
        }


    }
}());
