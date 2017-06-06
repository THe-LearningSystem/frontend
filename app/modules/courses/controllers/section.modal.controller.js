(function () {
    'use strict';

    angular
        .module('courses')
        .controller('SectionModalCtrl', SectionModalCtrl);

    SectionModalCtrl.$inject = ['$scope','$state','$uibModalInstance','Courses','I18nManager', 'data'];

    function SectionModalCtrl($scope,$state,$uibModalInstance,Courses,I18nManager, data) {
        var vm = this;
        if (data !== undefined) {
            console.log(data);
            vm.courseId = data.course._id;
            vm.course = data.course;
            if(vm.course.secondaryLanguages.length > 0)
                vm.selected = vm.course.secondaryLanguages[0];

            console.log(vm.selected);
            if(data.section !== undefined){
               vm.data = data.section;
            }
        }

        vm.selectLanguage = function (language) {
            vm.selected = language;
        };

        vm.create = function () {
            var data={
                courseId:vm.courseId,
                payload:vm.data
            };
            Courses.createSection(data,function(response){
                console.log(response);
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.update = function () {
            var data={
                courseId:vm.courseId,
                sectionId:vm.data._id,
                payload:vm.data
            };
            console.log(data.payload.description);
            Courses.updateSection(data,function(response){
                console.log(response);
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var data={
                courseId:vm.courseId,
                sectionId:vm.data._id
            };
            Courses.deleteSection(data,function(response){
                console.log(response);
                $state.reload();
            });
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("");
        };
    }
}());
