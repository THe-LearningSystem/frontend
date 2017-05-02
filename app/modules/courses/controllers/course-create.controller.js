(function () {
    'use strict';

    angular
        .module('courses')
        .controller('CourseCreateCtrl', CourseCreateCtrl);

    CourseCreateCtrl.$inject = ['Courses', 'I18nManager','$stateParams'];

    function CourseCreateCtrl(Courses, i18nManager,$stateParams) {
        var vm = this;
        vm.update = false;
        var urlName = $stateParams.urlName;
        if(urlName){
            vm.update = true;
            Courses.courseDisplay(urlName).then(function(response) {
                vm._id = response.data._id;
                vm.name = response.data.name;
                vm.description = response.data.description;
                console.log(vm._id);
            });
        }

        vm.languages = i18nManager.config.languages;
        console.log(vm.languages);
        vm.selected = i18nManager.config.default;

        vm.selectLanguage = function (language) {
            vm.selected = language;
        };

        vm.createCourse = function () {
            console.log(vm.name, vm.description);
            var data = {
                payload: {
                    name: vm.name,
                    description: vm.description,
                    urlName: vm.urlName
                }
            };
            Courses.createCourse(data)
            //TODO:redirect to created course display
        }
    }
}());
