(function () {
    'use strict';

    angular
        .module('admin.acl')
        .controller('SectionModalCtrl', SectionModalCtrl);

    SectionModalCtrl.$inject = ['$uibModalInstance','Courses','I18nManager', 'data'];

    function SectionModalCtrl($uibModalInstance,Courses,I18nManager, data) {
        var vm = this;
        if (data !== undefined) {
            console.log(data);
            vm.courseId = data.course._id;
        }

        vm.languages = I18nManager.config.languages;
        console.log(vm.languages);
        vm.selected = I18nManager.config.default;


        vm.selectLanguage = function (language) {
            vm.selected = language;
        };

        vm.create = function () {
            var data={
                courseId:vm.courseId,
                payload:{
                    name:vm.name,
                    description:vm.description
                }
            };
            Courses.createSection(data);
            $uibModalInstance.close();
        };

        vm.update = function () {
            $uibModalInstance.close();
        };

        vm.delete = function () {
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
