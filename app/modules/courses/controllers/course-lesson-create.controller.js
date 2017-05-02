(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseLessonCreateCtrl', CourseLessonCreateCtrl);

    CourseLessonCreateCtrl.$inject = ['Courses', 'I18nManager', '$stateParams'];

    function CourseLessonCreateCtrl(Courses, I18nManager, $stateParams) {
        var vm = this;
        vm.update = false;


        vm.languages = I18nManager.config.languages;
        vm.selected = I18nManager.config.default;



    }
}());
