(function () {
    'use strict';

    angular
        .module('courses')
        .controller('NotificationCreateCtrl', NotificationCreateCtrl);

    NotificationCreateCtrl.$inject = ['$scope','$state','Courses', 'I18nManager', '$stateParams'];

    function NotificationCreateCtrl($scope,$state,Courses, i18nManager, $stateParams) {
        var vm = this;
        vm.isUpdating = false;

        vm.courseUrl = $stateParams.courseUrl;
        if (vm.courseUrl) {
            Courses.courseDisplay(vm.courseUrl).then(function (response) {
                vm.course = response.data;
                if ($stateParams.notificationId) {
                    vm.isUpdating = true;
                    vm.data = _.find(vm.course.notifications, {_id: $stateParams.notificationId});
                }
            });
        }
        vm.froalaOptions = {
            toolbarButtons: ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
            height: 300
        };

        vm.create = function () {
            console.log("click");
            var data ={
                courseId:vm.course._id,
                payload:vm.data
            };
            Courses.createNotification(data,function(response){
                $state.transitionTo('frontend.courses.display.notifications',{courseUrl:vm.courseUrl},{reload:true});
            });
        };

        vm.update = function () {
            console.log(vm.course);
            var data ={
                courseId:vm.course._id,
                notificationId:vm.data._id,
                payload:vm.data
            };
            Courses.updateNotification(data,function(response){
                $state.transitionTo('frontend.courses.display.notifications',{courseUrl:vm.courseUrl},{reload:true});
            });
        };

        vm.delete = function () {
            var data ={
                courseId:vm.course._id,
                notificationId:vm.data._id
            };
            Courses.deleteNotification(data,function(response){
                $state.transitionTo('frontend.courses.display.notifications',{courseUrl:vm.courseUrl},{reload:true});
            });
        };

    }
}());
