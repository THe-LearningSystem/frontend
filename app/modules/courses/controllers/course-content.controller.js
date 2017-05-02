(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseContentCtrl', CourseContentCtrl);

    CourseContentCtrl.$inject = ['$uibModal', 'Courses', 'I18nManager', '$stateParams'];

    function CourseContentCtrl($uibModal, Courses, i18nManager, $stateParams) {
        var vm = this;
        var urlName = $stateParams.urlName;
        Courses.courseDisplay(urlName).then(function (response) {
            vm._id = response.data._id;
            vm.course = response.data;
        });
        vm.languages = i18nManager.config.languages;
        vm.selected = i18nManager.config.default;


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
            vm.course.sections = reorderArray(vm.course.sections, index, vm.course.sections.indexOf(obj));
            var data = {
                courseId: vm.course._id,
                payload: vm.course
            };
            Courses.updateCourse(data);
        };

    }
}());
