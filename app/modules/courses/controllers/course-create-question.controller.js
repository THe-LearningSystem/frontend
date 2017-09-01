(function () {
    'use strict';

    angular
        .module('courses')
        .controller('QuestionCreateCtrl', QuestionCreateCtrl);

    QuestionCreateCtrl.$inject = ['$rootScope', '$scope', 'Courses', '$state', 'I18nManager', '$stateParams'];

    function QuestionCreateCtrl($rootScope, $scope, Courses, $state, I18nManager, $stateParams) {
        var vm = this;
        vm.update = false;
        vm.courseUrl = $stateParams.courseUrl;
        if (vm.courseUrl) {
            vm.update = true;
            Courses.courseDisplay(vm.courseUrl).then(function (response) {
                vm.course = response.data;
                if ($stateParams.notificationId) {
                    vm.data = _.find(vm.course.questions, {_id: $stateParams.questionId});
                }
            });
        }
        vm.froalaOptions = {
            toolbarButtons: ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
            height: 300,
            placeholderText: $rootScope.getDeepValue(I18nManager.data, 'core.courses.content')

        };

        vm.create = function () {
            var data = {
                courseId: vm.course._id,
                payload: vm.data
            };
            Courses.createQuestion(data, function (response) {
                $scope.$parent.vm.course = response.data.obj;
                $state.go('frontend.courses.display.questionsAndAnswers.display', {
                    courseUrl: vm.courseUrl,
                    questionId: _.last(response.data.obj.questionsAndAnswers)._id
                });
            });
        };
        vm.update = function () {
            var data = {
                courseId: vm.course._id,
                notificationId: vm.data._id,
                payload: vm.data
            };
            Courses.updateQuestion(data, function (response) {

            });
        };

    }
}());
