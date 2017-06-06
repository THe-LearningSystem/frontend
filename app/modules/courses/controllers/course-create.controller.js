(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseCreateCtrl', CourseCreateCtrl);

    CourseCreateCtrl.$inject = ['Courses', 'I18nManager', '$stateParams'];

    function CourseCreateCtrl(Courses, i18nManager, $stateParams) {
        var vm = this;
        vm.update = false;
        vm.courseUrl = $stateParams.courseUrl;
        if (vm.courseUrl) {
            vm.update = true;
            Courses.courseDisplay(vm.courseUrl).then(function (response) {
                vm.data = response.data;
                console.log(response.data);
                if (vm.data.secondaryLanguages.length > 0)
                    vm.selected = vm.data.secondaryLanguages[0];
            });
        }

        vm.languages = i18nManager.config.languages;


        vm.create = function () {
            var data = {
                payload: vm.data
            };
            console.log(data);
            Courses.createCourse(data);
        };

        vm.update = function () {
            console.log("update COurse");
            var data = {
                courseId: vm.data._id,
                payload: vm.data
            };
            console.log(data);
            Courses.updateCourse(data);
        }
    }
}());
