(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CoursesCtrl', CoursesCtrl);

    CoursesCtrl.$inject = ['$scope', 'Courses'];

    function CoursesCtrl($scope, Courses) {
        var vm = this;

        Courses.courseList().then(function (response) {
            console.log(response);
            vm.courses = response.data;
        console.log(vm.courses);
        })
    }
}());
