(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseContentCtrl', CourseContentCtrl);

    CourseContentCtrl.$inject = ['$scope', '$uibModal', 'Courses', 'I18nManager', 'Authentication'];

    function CourseContentCtrl($scope, $uibModal, Courses, i18nManager, Authentication) {
        var vm = this;
        vm.courseUrl = $scope.$parent.vm.courseUrl;
        vm.parentVm = $scope.$parent.vm;

        $scope.$parent.$watch('vm.course', function (data) {
            if (data) {
                vm.course = data;
                Courses.enrolledCourses({
                    userId: Authentication.user._id,
                    courseId: vm.course._id
                }).then(function (response) {
                    vm.userEnrolledCourseData = response.data;
                    _.forEach(vm.course.sections, function (section) {
                        _.forEach(section.lessons, function (lesson) {
                            if (_.includes(vm.userEnrolledCourseData.passedLessons, lesson._id)) {
                                lesson.userPassed = true;
                            } else {
                                lesson.userPassed = false;
                            }
                        })
                    })
                });

            }
        });

        vm.editMode = true;
        vm.languages = i18nManager.config.languages;
        vm.selected = i18nManager.config.default;

        vm.reorderSection = false;

        vm.isEditEnabled = function (string) {

            return vm.parentVm.isAllowedToEdit(string) && vm.editMode;
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
            console.log(section);
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


        function reorderArray(array, index, otherIndex) {
            var tmpArray = [];
            if (otherIndex < index) {
                var tmp = index;
                index = otherIndex;
                otherIndex = tmp;
            }
            var i;
            //copy everything until index
            for (i = 0; i < index; i++) {
                tmpArray.push(array[i]);
            }
            //copy otherindex and index
            tmpArray.push(array[otherIndex]);
            tmpArray.push(array[index]);

            //copy everything after index except otherindex
            for (i = index + 1; i < array.length; i++) {
                if (i !== otherIndex) {
                    tmpArray.push(array[i]);
                }
            }

            return tmpArray;
        }

        vm.onDropComplete = function (index, obj) {
            // vm.course.sections = reorderArray(vm.course.sections, index, vm.course.sections.indexOf(obj));
            // var data = {
            //     courseId: vm.course._id,
            //     payload: vm.course
            // };
            // Courses.updateCourse(data, function (response) {
            //     Courses.courseDisplay(vm.courseUrl).then(function (response) {
            //         vm.course = response.data;
            //     });
            // });
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
