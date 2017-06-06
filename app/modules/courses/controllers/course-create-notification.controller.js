(function () {
    'use strict';

    angular
        .module('courses')
        .controller('NotificationCreateCtrl', NotificationCreateCtrl);

    NotificationCreateCtrl.$inject = ['$state','Courses', 'I18nManager', '$stateParams'];

    function NotificationCreateCtrl($state,Courses, i18nManager, $stateParams) {
        var vm = this;
        vm.update = false;
        vm.courseUrl = $stateParams.courseUrl;
        if (vm.courseUrl) {
            vm.update = true;
            Courses.courseDisplay(vm.courseUrl).then(function (response) {
                vm.course = response.data;
                if ($stateParams.notificationId) {
                    vm.data = _.find(vm.course.notifications, {_id: $stateParams.notificationId});
                }
            });
        }
        vm.froalaOptions = {
            toolbarButtons: ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
            height: 300,

        };

        vm.create = function () {
            var data ={
                courseId:vm.course._id,
                payload:vm.data
            };
            Courses.createNotification(data,function(response){
                $state.go('frontend.courses.display.notifications');
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

            });
        };

    }
}());
