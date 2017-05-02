(function () {
    'use strict';

    angular
        .module('courses.services')
        .factory('Courses', Courses);

    Courses.$inject = ['crud'];

    function Courses(crud) {
        return {
            courseList: courseList,
            courseDisplay : courseDisplay,
            createCourse:createCourse,
            updateCourse:updateCourse,
            createSection:createSection,
            updateSection:updateSection,
            deleteSection:deleteSection
        };

        function courseList() {
            return crud.get('/courses/');
        }

        function courseDisplay(urlName) {
            return crud.get('/courses/' + urlName);
        }

        function createCourse(data){
            return crud.post('/courses/', data.payload);
        }
        function updateCourse(data){
            return crud.put('/courses/'+data.courseId+'/', data.payload);
        }

        /**
         * Section
         */
        function createSection(data) {
            return crud.post('/courses/'+data.courseId+'/sections/', data.payload);
        }

        function updateSection(data) {
            return crud.put('/courses/'+data.courseId+'/sections/'+data.sectionId+'/', data.payload);
        }

        function deleteSection(data) {
            return crud.delete('/courses/'+data.courseId+'/sections/');
        }
    }
}());