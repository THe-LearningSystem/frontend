(function () {
    'use strict';

    angular
        .module('courses')
        .controller('coursesController', coursesController);

    coursesController.$inject = ['$scope', 'coursesService'];

    function coursesController($scope, coursesService) {
        var vm = this;

        coursesService.courseList().then(function (response) {
            console.log(response);
            vm.courses = response.data;

        })
    }
}());
