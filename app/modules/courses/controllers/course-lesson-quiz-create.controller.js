(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseLessonQuizCreateCtrl', CourseLessonQuizCreateCtrl);

    CourseLessonQuizCreateCtrl.$inject = ['$rootScope', '$scope', '$state', 'Courses', 'I18nManager', '$stateParams'];

    function CourseLessonQuizCreateCtrl($rootScope, $scope, $state, Courses, I18nManager, $stateParams) {
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
            if (vm.course.secondaryLanguages.length > 0)
                vm.selectedLanguage = vm.course.secondaryLanguages[0];
            vm.section = _.find(vm.course.sections, {urlName: vm.sectionUrl});
        });

        if (vm.lessonId) {
            Courses.getLesson(vm.lessonId).then(function (response) {
                vm.editMode = true;
                vm.data = response.data;
            });
        } else {
            vm.data = {};
            vm.data.data = {};
            vm.data.data.answers = [{}, {}];
            vm.data.type = "quiz";
        }


        $scope.$parent.$watch('vm.data', function (data) {
            if (data) {
                vm.data.data = data.data;
            }
        });

        vm.froalaOptions = {
            toolbarButtons: ['bold', 'italic', 'underline', 'insertHR', '|', 'undo', 'redo'],
            // toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline','|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            height: 200,
            placeholderText: $rootScope.getDeepValue(I18nManager.data, 'core.courses.content')
        };

        vm.froalaOptionsSmall = {
            toolbarButtons: ['bold', 'italic', 'underline', 'insertHR', '|', 'undo', 'redo'],
            // toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline','|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            height: 120,
            placeholderText: $rootScope.getDeepValue(I18nManager.data, 'core.courses.answer')+' ...'
        };

        vm.addAnswer = function () {
            if (vm.data.data.answers.length < 4)
                vm.data.data.answers.push({});
        };


        vm.create = function () {
            var data = {
                payload: vm.data
            };
            Courses.createLesson(data, function (response) {
                console.log(response);
                vm.section.lessons.push(response.data.obj._id);
                var sectionData = {
                    courseId: vm.course._id,
                    sectionId: vm.section._id,
                    payload: vm.section
                };
                Courses.updateSection(sectionData, function (response) {
                    console.log("updated section", response);
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
            Courses.updateLesson(data, function (response) {
                console.log(response);
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
            Courses.updateSection(sectionData, function (response) {
                console.log("updated section", response);
                Courses.deleteLesson(data, function (response) {
                    console.log("deleted lesson", response);
                    $state.go('frontend.courses.display.content', {courseUrl: vm.courseUrl});
                });
            });
        }
    }
}());
