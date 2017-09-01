(function () {
    'use strict';

    angular
        .module('courses')
        .controller('SectionModalCtrl', SectionModalCtrl);

    SectionModalCtrl.$inject = ['$state', '$uibModalInstance', 'Courses', 'data'];

    function SectionModalCtrl($state, $uibModalInstance, Courses, data) {
        var vm = this;
        if (data !== undefined) {
            vm.courseId = data.course._id;
            vm.course = data.course;
            if (vm.course.secondaryLanguages.length > 0)
                vm.selected = vm.course.secondaryLanguages[0];

            if (data.section !== undefined) {
                vm.data = data.section;
            }
        }

        vm.selectLanguage = function (language) {
            vm.selected = language;
        };

        vm.create = function () {
            var data = {
                courseId: vm.courseId,
                payload: vm.data
            };
            Courses.createSection(data, function () {
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data = {
                courseId: vm.courseId,
                sectionId: vm.data._id,
                payload: vm.data
            };
            Courses.updateSection(data, function () {
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data = {
                courseId: vm.courseId,
                sectionId: vm.data._id
            };
            Courses.deleteSection(data, function () {
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
