(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CoursesCtrl', CoursesCtrl);

    CoursesCtrl.$inject = ['Courses'];

    function CoursesCtrl(Courses) {
        var vm = this;
        Courses.courseList().then(function (response) {
            vm.courses = response.data;
        })
    }
}());
