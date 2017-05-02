(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseContentCtrl', CourseContentCtrl);

    CourseContentCtrl.$inject = ['$uibModal','coursesService', 'i18nManagerService','$stateParams'];

    function CourseContentCtrl($uibModal,coursesService, i18nManager,$stateParams) {
        var vm = this;
        var urlName = $stateParams.urlName;
            coursesService.courseDisplay(urlName).then(function(response) {
                vm._id = response.data._id;
                vm.course = response.data;
            });
        vm.languages = i18nManager.config.languages;
        vm.selected = i18nManager.config.default;


        vm.createSection = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/courses/views/section.modal.view.html',
                controller: 'sectionModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return undefined;
                    }
                }
            });
        };
    }
}());
