(function () {
    'use strict';

    angular
        .module('courses')
        .controller('LessonAutomatonCtrl', LessonAutomatonCtrl);

    LessonAutomatonCtrl.$inject = ['$scope', '$state', '$stateParams', 'Courses', 'Authentication', 'CustomNotify'];

    function LessonAutomatonCtrl($scope, $state, $stateParams, Courses, Authentication, CustomNotify) {
        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        vm.lessonId = $stateParams.lessonId;
        vm.nextLesson = null;


        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
            //Get the next lesson
            Courses.getLesson(vm.lessonId).then(function (response) {
                vm.lesson = response.data;
                var foundLesson = false;
                _.forEach(vm.course.sections, function (section) {
                    _.forEach(section.lessons, function (lesson) {
                        if (foundLesson) {
                            vm.nextLesson = lesson;
                            foundLesson = false;
                            return false;
                        }
                        if (vm.lesson._id === lesson._id) {
                            vm.lesson.position = lesson.position;
                            foundLesson = true;
                        }
                    });
                })
            });
        });

        vm.isAllowedToEdit = function (string) {
            var isAllowedToEdit = true;
            if (vm.course)
                isAllowedToEdit = vm.course.author === Authentication.user._id;
            return isAllowedToEdit;
        };

        var _passCallback = function (data, passed) {
            if (passed) {
                Courses.addPassedLessonToUser(data, function (response) {
                    console.log("fuck you", response);
                }, false);
                if (vm.nextLesson !== null) {
                    $state.go('frontend.courses.display.lesson', {
                        courseUrl: vm.course.urlName,
                        lessonId: vm.nextLesson._id
                    });
                } else {
                    $state.go('frontend.courses.display.content', {courseUrl: vm.course.urlName});
                }
            } else {
                CustomNotify.warning("Wrong answer");
            }
        };

        vm.goToNextLesson = function () {
            //set the current lesson to passed
            var data = {
                courseId: vm.course._id,
                userId: Authentication.user._id,
                lessonId: vm.lessonId,
                payload: vm.lesson
            };
            if (vm.lesson.kind === 'quiz') {
                console.log(data);
                Courses.verifyLessonResult(data, function (response) {
                    console.log(response);
                    _passCallback(data, response.data.passedLesson);
                }, false);

            } else if (vm.lesson.kind === 'content') {
                _passCallback(data, true);
            }
        }
    }
}());
