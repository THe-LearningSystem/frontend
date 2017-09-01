(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseCtrl', CourseCtrl);

    CourseCtrl.$inject = ['$scope', '$state', 'Courses', '$stateParams', 'Authentication'];

    function CourseCtrl($scope, $state, Courses, $stateParams, Authentication) {
        var vm = this;
        $scope.Math = window.Math;

        vm.courseUrl = $stateParams.courseUrl;
        vm.state = $state;
        vm.course = null;
        vm.lessonCount = 0;
        vm.userEnrolledCourseData = null;
        vm.nextLesson = null;
        vm.firstLesson = null;

        vm.showMobileNavbar = false;

        Courses.courseDisplay(vm.courseUrl).then(function (response) {
            vm.course = response.data;
            //getEnrolledCourseData
            if(Authentication.user !== null){
                Courses.enrolledCourses(
                    {userId: Authentication.user._id, courseId: vm.course._id}
                ).then(function (response) {
                    if (response.data !== null) {
                        vm.userEnrolledCourseData = response.data;
                        vm.findNextLesson();
                    }
                });
            }
            //count the lessons
            _.forEach(vm.course.sections, function (section) {
                _.forEach(section.lessons, function (lesson) {
                    if (lesson.isPublished)
                        vm.lessonCount += 1;
                });
            });
        });

        vm.findNextLesson = function () {
            vm.nextLesson = null;
            _.forEach(vm.course.sections, function (section) {
                _.forEach(section.lessons, function (lesson) {
                    if (vm.firstLesson === null)
                        vm.firstLesson = lesson;
                    var foundLesson = false;
                    _.forEach(vm.userEnrolledCourseData.lessonData, function (lessonData) {
                        if (lessonData._id === lesson._id) {
                            foundLesson = true;
                            return false;
                        }
                    });
                    if (!foundLesson && lesson.isPublished) {
                        console.log(lesson);
                        vm.nextLesson = lesson;
                    }
                    if (vm.nextLesson !== null)
                        return false;
                });

            });
        };

        vm.courseMenuItems = [
            {name: 'core.courses.overview', stateName: 'frontend.courses.display.overview'},
            {name: 'core.courses.content', stateName: 'frontend.courses.display.content'},
            {name: 'core.courses.tools', stateName: 'frontend.courses.display.tools'},
            {
                name: 'core.courses.questionsAndAnswers', stateName: 'frontend.courses.display.questionsAndAnswers',
                subStates: ['frontend.courses.display.createQuestion', 'frontend.courses.display.questionsAndAnswers.display']
            },
            {
                name: 'core.courses.notifications', stateName: 'frontend.courses.display.notifications',
                subStates: ['frontend.courses.display.createNotification', 'frontend.courses.display.updateNotification']
            },
            {name: 'core.general.edit', stateName: 'frontend.courses.display.edit'}
        ];

        vm.isCurrentStateInArray = function (array) {
            return _.includes(array, vm.state.current.name);
        };


        vm.hasEditCoursePermission = function () {
            //TODO: edit only author and mods and global edit can edit a course
            return vm.course.author === Authentication.username;
        };


        vm.isAllowedToEdit = function (string) {
            var isAllowedToEdit = true;
            if (vm.course && Authentication.user)
                isAllowedToEdit = vm.course.author === Authentication.user._id;
            return isAllowedToEdit;
        };

        vm.enrollCourse = function () {
            var data = {
                userId: Authentication.user._id,
                courseId: vm.course._id
            };
            Courses.enrollCourse(data, function (response) {
                Courses.enrolledCourses(
                    {userId: Authentication.user._id, courseId: vm.course._id}
                ).then(function (response) {
                    console.log(response);
                    if (response.data !== null) {
                        vm.userEnrolledCourseData = response.data;
                        vm.findNextLesson();
                        $state.go('frontend.courses.display.content', {course: vm.course.urlName});
                    }
                });
            })
        };
    }
}());
