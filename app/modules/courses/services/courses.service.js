(function () {
    'use strict';

    angular
        .module('courses.services')
        .factory('coursesService', coursesService);

    coursesService.$inject = ['crud'];

    function coursesService(crud) {
        return {
            courseList: courseList,
            courseDisplay : courseDisplay,
            createCourse:createCourse
        };

        function courseList() {
            return crud.get('/courses/');
        }

        function courseDisplay(urlName) {
            return crud.get('/courses/' + urlName);
        }

        function createCourse(data){
            return crud.put('/courses/', data.payload);
        }
    }
}());