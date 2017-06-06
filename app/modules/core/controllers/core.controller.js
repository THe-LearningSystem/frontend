(function () {
    'use strict';

    angular
        .module('core')
        .controller('CoreCtrl', CoreCtrl);

    CoreCtrl.$inject = ['$rootScope','$scope','localStorageService','Authentication'];

    function CoreCtrl($rootScope,$scope,localStorageService,Authentication) {

        var vm = this;
        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;
        vm.auth = Authentication;

        vm.getWidth = function () {
            return window.innerWidth;
        };
        $rootScope.toggle = true;


        $scope.$watch(vm.getWidth, function (newValue, oldValue) {
            if (newValue >= mobileView) {
                if (localStorageService.get("toggle")!== null) {
                    $rootScope.toggle = localStorageService.get("toggle");
                } else {
                    $rootScope.toggle = true;
                }
            } else {
                $rootScope.toggle = false;
            }
        });

        vm.toggleSidebar = function () {
            $rootScope.toggle = !$rootScope.toggle;
            localStorageService.set('toggle', $rootScope.toggle);
        };

        window.onresize = function () {
            $scope.$apply();
        };
    }
}());