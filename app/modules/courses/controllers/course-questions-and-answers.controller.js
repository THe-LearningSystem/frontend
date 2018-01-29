(function () {
    'use strict';

    angular
        .module('courses')
        .controller('QuestionsAndAnswersCtrl', QuestionsAndAnswersCtrl);

    QuestionsAndAnswersCtrl.$inject = ['Courses', '$stateParams'];

    function QuestionsAndAnswersCtrl(Courses, $stateParams) {
        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
        });
    }
}());
