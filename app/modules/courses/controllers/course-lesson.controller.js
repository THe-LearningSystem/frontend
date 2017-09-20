(function () {
    'use strict';

    angular
        .module('courses')
        .controller('LessonCtrl', LessonCtrl);

    LessonCtrl.$inject = ['$rootScope', '$state', '$stateParams', 'Courses', 'Authentication', 'CustomNotify'];

    function LessonCtrl($rootScope, $state, $stateParams, Courses, Authentication, CustomNotify) {
        var vm = this;

        vm.courseUrl = $stateParams.courseUrl;
        vm.lessonId = $stateParams.lessonId;
        vm.nextLesson = null;
        vm.rightAnswerData = null;
        vm.isLessonEditable = true;
        vm.passedLesson = null;
        vm.failedLesson = false;

        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
            //Get the next lesson
            Courses.getLesson(vm.lessonId).then(function (response) {
                vm.lesson = response.data;
                //Workaround fot the youtube videos, they werent responsive
                String.prototype.replaceAll = function (search, replacement) {
                    var target = this;
                    return target.replace(new RegExp(search, 'g'), replacement);
                };
                var tmp = vm.lesson.data.content;
                _.forEach(tmp, function (language, key) {
                    language = language.replaceAll("<iframe", "<div class='video-container'><iframe");
                    language = language.replaceAll("</iframe>", "</iframe></div>");
                    tmp[key] = language;
                });
                vm.lesson.data.content = tmp;
                //workaround end
                //check if the lesson is already passed
                Courses.enrolledCourses({
                    userId: Authentication.user._id,
                    courseId: vm.course._id
                }).then(function (response) {
                    _.forEach(response.data.lessonData, function (passedLessonData) {
                        if (passedLessonData._id === vm.lessonId) {
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
                            vm.section = section;
                            vm.lesson.position = lesson.position;
                            foundLesson = true;
                        }
                    });
                })
            });
        });


        vm.isAllowedToEdit = function () {
            var isAllowedToEdit = true;
            if (vm.course && Authentication.user) {
                var user = _.find(vm.course.moderators, function (o) {
                    return o._id === Authentication.user._id;
                });
                isAllowedToEdit = (vm.course.author === Authentication.user._id) || user !== undefined;

            }
            return isAllowedToEdit;
        };

        var _passCallback = function (data, passed) {
            var tmpLesson = data.payload;
            if (passed) {
                data.payload = {
                    _id: tmpLesson._id,
                    passed: true
                };
                Courses.addPassedLessonToUser(data, function () {
                    CustomNotify.success($rootScope.getTranslation('core.courses.passedLesson'));
                    if (vm.nextLesson !== null) {
                        setTimeout(function () {
                            $state.go('frontend.courses.display.lesson', {
                                courseUrl: vm.course.urlName,
                                lessonId: vm.nextLesson._id
                            });
                        }, 500);

                    } else {
                        $state.go('frontend.courses.display.content', {courseUrl: vm.course.urlName});
                    }
                }, false);
            } else {
                data.payload = {
                    _id: tmpLesson._id,
                    passed: false
                };
                Courses.addPassedLessonToUser(data, function () {
                    vm.failedLesson = true;
                }, false);
                CustomNotify.error($rootScope.getTranslation('core.courses.notPassedLesson'));
                if (vm.lesson.kind === 'quiz') {
                    vm.isLessonEditable = false;
                }
            }
        };

        vm.goToNextLesson = function () {
            if (vm.nextLesson) {
                $state.go('frontend.courses.display.lesson', {
                    courseUrl: vm.course.urlName,
                    lessonId: vm.nextLesson._id
                });
            } else {
                $state.go('frontend.courses.display.content', {
                    courseUrl: vm.course.urlName
                });
            }
        };

        vm.checkLessonAndGoToNextLesson = function () {
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
                    vm.rightAnswerData = response.data;
                    _passCallback(data, response.data.passedLesson);
                }, false);

            } else if (vm.lesson.kind === 'content') {
                _passCallback(data, true);
            }
        };
    }
}());
