
(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CellularCtrl', CellularCtrl);

    CellularCtrl.$inject = ['$scope','$state','Courses', '$stateParams','Authentication','$uibModal'];

    function CellularCtrl($scope,$state,Courses, $stateParams,Authentication,$uibModal) {
        var vm = this;

        vm.test = "Hallo";

    }
}());
