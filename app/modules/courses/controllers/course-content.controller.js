(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseContentCtrl', CourseContentCtrl);

    CourseContentCtrl.$inject = ['$scope', '$uibModal', 'Courses', 'I18nManager', 'Authentication','$state'];

    function CourseContentCtrl($scope, $uibModal, Courses, i18nManager, Authentication,$state) {
        var vm = this;
        vm.courseUrl = $scope.$parent.vm.courseUrl;
        vm.parentVm = $scope.$parent.vm;

        vm.editMode = true;
        vm.languages = i18nManager.config.languages;
        vm.selected = i18nManager.config.default;
        vm.allowReorder = false;

       var _checkUserEnrolledData = function(){
            Courses.enrolledCourses({
                userId: Authentication.user._id,
                courseId: vm.course._id
            }).then(function (response) {
                vm.userEnrolledCourseData = response.data;
                _.forEach(vm.course.sections, function (section) {
                    _.forEach(section.lessons, function (lesson) {
                        lesson.userPassed = null;
                        _.forEach(vm.userEnrolledCourseData.lessonData, function (userLessonData) {
                            if (userLessonData._id === lesson._id) {
                                lesson.userPassed = userLessonData.passed;
                            }
                        });
                    })
                })
            });
        };


        $scope.$parent.$watch('vm.course', function (data) {
            if (data) {
                vm.course = data;
                console.log(vm.course);
                _checkUserEnrolledData();
            }
        });


        vm.mySpliceSection = function (index) {
            vm.course.sections.splice(index, 1);
            var data = {
                courseId: vm.course._id,
                payload: vm.course
            };
            Courses.updateCourse(data, function () {
                Courses.courseDisplay(vm.course._id).then(function(response){
                    vm.course = response.data;
                    _checkUserEnrolledData();
                })
            });
            return true;

        };

        vm.mySplice = function (section, index) {
            section.lessons.splice(index, 1);
            var data = {
                courseId: vm.course._id,
                payload: vm.course
            };
            Courses.updateCourse(data, function () {
                Courses.courseDisplay(vm.course._id).then(function(response){
                    vm.course = response.data;
                    _checkUserEnrolledData();
                })
            });
            return true;
        };

        vm.createSection = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/courses/views/section.modal.view.html',
                controller: 'SectionModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            course: vm.course
                        };
                    }
                }
            });
        };

        vm.updateSection = function (section) {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/courses/views/section.modal.view.html',
                controller: 'SectionModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            course: vm.course,
                            section: section
                        };
                    }
                }
            });
        };

        vm.changePassedLessonToUser = function (lesson) {
            var data = {
                courseId: vm.course._id,
                userId: Authentication.user._id,
                lessonId: lesson._id
            };
            if (lesson.userPassed) {
                Courses.addPassedLessonToUser(data, function (response) {
                    $scope.$parent.vm.userEnrolledCourseData.passedLessons.push(lesson._id);
                    $scope.$parent.vm.findNextLesson();
                });
            } else {
                Courses.removePassedLessonFromUser(data, function (response) {
                    _.pull($scope.$parent.vm.userEnrolledCourseData.passedLessons, lesson._id);
                    $scope.$parent.vm.findNextLesson();
                });
            }
        };
    }
}());
