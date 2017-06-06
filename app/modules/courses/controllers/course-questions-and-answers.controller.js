(function () {
    'use strict';

    angular
        .module('courses')
        .controller('QuestionsAndAnswersCtrl', QuestionsAndAnswersCtrl);

    QuestionsAndAnswersCtrl.$inject = ['$scope', '$state', 'Courses', '$stateParams', 'Authentication'];

    function QuestionsAndAnswersCtrl($scope, $state, Courses, $stateParams, Authentication) {

        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
        });

    }
}());
