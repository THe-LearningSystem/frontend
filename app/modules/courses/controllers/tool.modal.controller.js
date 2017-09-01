(function () {
    'use strict';

    angular
        .module('courses')
        .controller('ToolModalCtrl', ToolModalCtrl);

    ToolModalCtrl.$inject = ['$uibModalInstance','Courses','I18nManager', 'data'];

    function ToolModalCtrl($uibModalInstance,Courses,I18nManager, data) {
        var vm = this;
        if (data !== undefined) {
            vm.course = data.course;
            if(vm.course.secondaryLanguages.length > 0)
                vm.selectedLanguage = vm.course.secondaryLanguages[0];
            vm.courseId = data.course._id;
            if(data.tool !== undefined){
               vm.data = data.tool;
            }
        }
        vm.languages = I18nManager.config.languages;
        vm.selected = I18nManager.config.default;


        vm.selectLanguage = function (language) {
            vm.selected = language;
        };

        vm.create = function () {
            var data={
                courseId:vm.courseId,
                payload:vm.data
            };
            Courses.createTool(data,function(){

            });
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data={
                courseId:vm.courseId,
                toolId:vm.data._id,
                payload:vm.data
            };
            Courses.updateTool(data);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data={
                courseId:vm.courseId,
                toolId:vm.data._id
            };
            Courses.deleteTool(data);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
