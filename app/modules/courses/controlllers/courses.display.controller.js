(function () {
    'use strict';

    angular
        .module('courses')
        .controller('courseController', courseController);

    courseController.$inject = ['$scope','coursesService', '$stateParams'];

    function courseController($scope,coursesService, $stateParams) {
        var vm = this;
        var urlName = $stateParams.urlName;

        coursesService.courseDisplay(urlName).then(function(response) {
            vm.course = response.data;
        });
    }
}());
