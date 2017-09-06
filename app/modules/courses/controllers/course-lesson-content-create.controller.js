(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseLessonContentCreateCtrl', CourseLessonContentCreateCtrl);

    CourseLessonContentCreateCtrl.$inject = ['$rootScope', '$state', 'Courses', 'I18nManager', '$stateParams'];

    function CourseLessonContentCreateCtrl($rootScope, $state, Courses, I18nManager, $stateParams) {
        var vm = this;

        vm.data = {};
        vm.editMode = false;

        vm.update = false;
        vm.courseUrl = $stateParams.courseUrl;
        vm.sectionUrl = $stateParams.sectionUrl;
        vm.lessonId = $stateParams.lessonId;
        vm.course = null;
        vm.section = null;


        vm.languages = I18nManager.config.languages;
        vm.currentStateName = $state.current.name;


        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
            if(vm.course.secondaryLanguages.length > 0)
                vm.selectedLanguage = vm.course.secondaryLanguages[0];
            vm.section = _.find(vm.course.sections, {urlName: vm.sectionUrl});
        });

        if (vm.lessonId) {
            Courses.getLesson(vm.lessonId).then(function (response) {
                vm.editMode = true;
                vm.data = response.data;
            });
        }else{
            vm.data = {};
            vm.data.isPublished = false;
            vm.data.type = "content";
            vm.data.data ={};
        }



        vm.create = function () {
            var data = {
                payload: vm.data
            };
            Courses.createLesson(data, function (response) {
                vm.section.lessons.push(response.data.obj._id);
                var sectionData = {
                    courseId: vm.course._id,
                    sectionId: vm.section._id,
                    payload: vm.section
                };
                Courses.updateSection(sectionData, function () {
                    $state.go('frontend.courses.display.content', {courseUrl: vm.courseUrl});
                })
            })
        };

        vm.update = function () {
            console.log("clicked");
            var data = {
                lessonId: vm.lessonId,
                payload: vm.data
            };
            Courses.updateLesson(data, function () {
                $state.go('frontend.courses.display.lesson', {courseUrl: vm.courseUrl, lessonId: vm.lessonId});

            });
        };

        vm.delete = function () {
            var data = {
                courseId: vm.course._id,
                sectionId: vm.section._id,
                lessonId: vm.lessonId
            };
            _.pull(vm.section.lessons, _.find(vm.section.lessons, {_id: vm.lessonId}));
            var sectionData = {
                courseId: vm.course._id,
                sectionId: vm.section._id,
                payload: vm.section
            };
            Courses.updateSection(sectionData, function () {
                Courses.deleteLesson(data, function () {
                    $state.go('frontend.courses.display.content', {courseUrl: vm.courseUrl});
                });
            });
        }
    }
}());
