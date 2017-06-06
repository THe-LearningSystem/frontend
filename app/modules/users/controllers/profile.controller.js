(function () {
    'use strict';

    angular
        .module('users')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['$state', 'UsersService', 'Notification', 'Authentication','I18nManager'];

    function ProfileCtrl($state, UsersService, Notification, Authentication,I18nManager) {
       var vm = this;

       UsersService.get(Authentication.user._id).then(function(response) {
            vm.user = response.data;
            console.log(response);
        });
        console.log(vm.user);
        vm.languages = I18nManager.config.languages;



        vm.update = function(){
            I18nManager.setPreferredLanguage(vm.user.preferredLanguage);
            UsersService.update({userId:vm.user._id,payload:vm.user});
        }
    }
}());
