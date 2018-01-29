(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseCreateCtrl', CourseCreateCtrl);

    CourseCreateCtrl.$inject = ['Courses', 'I18nManager', '$stateParams','UsersService','$scope'];

    function CourseCreateCtrl(Courses, i18nManager, $stateParams,UsersService,$scope) {
        var vm = this;
        vm.isInUpdate = false;
        vm.courseUrl = $stateParams.courseUrl;
        if (vm.courseUrl) {
            vm.isInUpdate = true;
            Courses.courseDisplay(vm.courseUrl).then(function (response) {
                vm.data = response.data;
                UsersService.getLightUserList().then(function(response){
                    vm.users = response.data;
                });
                //fix for the language selection
                vm.course = vm.data;
                if (vm.data.secondaryLanguages.length > 0)
                    vm.selectedLanguage = vm.data.secondaryLanguages[0];
            });
        }

        vm.languages = i18nManager.config.languages;


        vm.create = function () {
            var data = {
                payload: vm.data
            };
            Courses.createCourse(data);
        };

        vm.update = function () {
            var data = {
                courseId: vm.data._id,
                payload: vm.data
            };
            Courses.updateCourse(data);
        }
    }
}());
