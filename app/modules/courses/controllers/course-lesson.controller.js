(function () {
    'use strict';

    angular
        .module('courses')
        .controller('LessonCtrl', LessonCtrl);

    LessonCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'Courses', 'Authentication', 'CustomNotify'];

    function LessonCtrl($rootScope, $scope, $state, $stateParams, Courses, Authentication, CustomNotify) {
        var vm = this;
        vm.courseUrl = $stateParams.courseUrl;
        vm.lessonId = $stateParams.lessonId;
        vm.nextLesson = null;
        vm.rightAnswerData = null;
        vm.isLessonEditable = true;
        vm.passedLesson = null;

        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
            //Get the next lesson
            Courses.getLesson(vm.lessonId).then(function (response) {
                vm.lesson = response.data;
                //check if the lesson is already passed
                Courses.enrolledCourses({
                    userId: Authentication.user._id,
                    courseId: vm.course._id
                }).then(function (response) {
                    console.log(response);

                    _.forEach(response.data.lessonData,function(passedLessonData){
                        if(passedLessonData._id ===vm.lessonId){
                            vm.passedLesson = passedLessonData.passed;
                        }
                    })

                });

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
            var tmpLesson = data.payload;
            if (passed) {
                data.payload = {
                    _id: tmpLesson._id,
                    passed: true
                };
                Courses.addPassedLessonToUser(data, function (response) {
                    CustomNotify.success($rootScope.getTranslation('core.courses.passedLesson'));
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
                data.payload = {
                    _id: tmpLesson._id,
                    passed: false
                };
                Courses.addPassedLessonToUser(data, function (response) {
                }, false);
                CustomNotify.error($rootScope.getTranslation('core.courses.notPassedLesson'));
                if (vm.lesson.kind === 'quiz') {
                    vm.isLessonEditable = false;
                }
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
            if (!vm.isLessonEditable) {
                $state.go('frontend.courses.display.lesson', {
                    courseUrl: vm.course.urlName,
                    lessonId: vm.nextLesson._id
                });
                return;
            }
            if (vm.lesson.kind === 'quiz') {
                Courses.verifyLessonResult(data, function (response) {
                    console.log(response);
                    vm.rightAnswerData = response.data;
                    _passCallback(data, response.data.passedLesson);
                }, false);

            } else if (vm.lesson.kind === 'content') {
                _passCallback(data, true);
            }
        }
    }
}());
