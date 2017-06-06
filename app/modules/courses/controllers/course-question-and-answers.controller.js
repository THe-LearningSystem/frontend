(function () {
    'use strict';

    angular
        .module('courses')
        .controller('QuestionAndAnswersCtrl', QuestionAndAnswersCtrl);

    QuestionAndAnswersCtrl.$inject = ['$uibModal','$scope', '$state', 'Courses', '$stateParams', 'Authentication'];

    function QuestionAndAnswersCtrl($uibModal,$scope, $state, Courses, $stateParams, Authentication) {
        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        vm.questionAndAnswerId = $stateParams.questionId;

        vm.froalaOptions = {
            toolbarButtons: ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
            height: 300
        };


        $scope.$parent.$watch('vm.course',function(data){
            if(data){
                vm.course = data;
                vm.data = _.find(data.questionsAndAnswers,{_id:vm.questionAndAnswerId});
                console.log(vm.data);
            }
        });


        vm.createAnswer = function(){
            var data = {
                courseId : vm.course._id,
                questionId:vm.data._id,
                payload:vm.answer
            };
            Courses.createAnswer(data,function(response){
                console.log(response);
                // $state.reload();
                vm.answer = undefined;
                Courses.courseDisplay(vm.courseUrl).then(function (response) {
                    vm.course = response.data;
                    vm.data = _.find(vm.course.questionsAndAnswers,{_id:vm.questionAndAnswerId});
                    console.log(vm.data);
                });
            });
        }

    }
}());
