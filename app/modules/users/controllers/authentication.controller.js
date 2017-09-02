(function () {
    'use strict';

    angular
        .module('users')
        .controller('AuthenticationCtrl', AuthenticationCtrl);

    AuthenticationCtrl.$inject = ['$rootScope', '$state', '$stateParams', 'UsersService', 'CustomNotify', 'Authentication', 'I18nManager'];

    function AuthenticationCtrl($rootScope, $state, $stateParams, UsersService, CustomNotify, Authentication, I18nManager) {
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
                    var token = response.data.token;
                    var user = Authentication.setToken(token).user;
                    //set the preferred Language
                    I18nManager.setPreferredLanguage(user.preferredLanguage);
                    // And redirect to the previous or home page
                    $state.transitionTo($state.previous.state.name || 'frontend.home', {}, {reload: true});
                    CustomNotify.success($rootScope.getTranslation('core.general.signinSuccessfull'));
                }, false);
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
