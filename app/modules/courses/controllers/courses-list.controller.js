(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CoursesCtrl', CoursesCtrl);

    CoursesCtrl.$inject = ['$scope', 'coursesService'];

    function CoursesCtrl($scope, coursesService) {
        var vm = this;

        coursesService.courseList().then(function (response) {
            console.log(response);
            vm.courses = response.data;

        })
    }
}());
