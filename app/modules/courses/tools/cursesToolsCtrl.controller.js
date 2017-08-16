(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CoursesToolsCtrl', CoursesToolsCtrl);

    CoursesToolsCtrl.$inject = ['$scope', '$state', 'Courses', '$stateParams', 'Authentication'];

    function CoursesToolsCtrl($scope, $state, Courses, $stateParams, Authentication) {

        var vm = this;

        vm.courseUrl = $stateParams.courseUrl;

        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
        });
    }
}());
