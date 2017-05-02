(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseCtrl', CourseCtrl);

    CourseCtrl.$inject = ['$scope','$state','Courses', '$stateParams','Authentication'];

    function CourseCtrl($scope,$state,Courses, $stateParams,Authentication) {
        var vm = this;
        var urlName = $stateParams.urlName;
        vm.currentState =$state.current;

        $scope.$watch(function(){
            return $state.$current
        }, function(newVal, oldVal){
            vm.currentState =newVal;
        });

        Courses.courseDisplay(urlName).then(function(response) {
            vm.course = response.data;
        });

        vm.hasEditCoursePermission = function(){
            //TODO: edit only author and mods and global edit can edit a course
            return vm.course.author === Authentication.username;
        }
    }
}());
