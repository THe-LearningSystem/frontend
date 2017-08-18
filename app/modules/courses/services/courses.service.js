(function () {
    'use strict';

    angular
        .module('courses.services')
        .factory('Courses', Courses);

    Courses.$inject = ['crud'];

    function Courses(crud) {
        return {
            courseList: courseList,
            courseDisplay: courseDisplay,
            createCourse: createCourse,
            updateCourse: updateCourse,
            createSection: createSection,
            updateSection: updateSection,
            deleteSection: deleteSection,
            getLesson: getLesson,
            createLesson: createLesson,
            updateLesson: updateLesson,
            deleteLesson: deleteLesson,
            verifyLessonResult:verifyLessonResult,
            createTool: createTool,
            updateTool: updateTool,
            deleteTool: deleteTool,
            createNotification: createNotification,
            updateNotification: updateNotification,
            deleteNotification: deleteNotification,
            createQuestion: createQuestion,
            updateQuestion: updateQuestion,
            deleteQuestion: deleteQuestion,
            createAnswer: createAnswer,
            updateAnswer: updateAnswer,
            deleteAnswer: deleteAnswer,
            enrolledCourses: enrolledCourses,
            enrollCourse: enrollCourse,
            addPassedLessonToUser: addPassedLessonToUser,
            removePassedLessonFromUser: removePassedLessonFromUser
        };

        function courseList() {
            return crud.get('/courses/');
        }

        function courseDisplay(courseUrl) {
            return crud.get('/courses/' + courseUrl);
        }

        /**
         * Course
         */
        function createCourse(data) {
            return crud.post('/courses/', data.payload);
        }

        function updateCourse(data, callback) {
            return crud.put('/courses/' + data.courseId + '/', data.payload, callback);
        }

        /**
         * Section
         */
        function createSection(data,callback) {
            return crud.post('/courses/' + data.courseId + '/sections/', data.payload, callback);
        }

        function updateSection(data, callback) {
            return crud.put('/courses/' + data.courseId + '/sections/' + data.sectionId + '/', data.payload, callback);
        }

        function deleteSection(data, callback) {
            return crud.delete('/courses/' + data.courseId + '/sections/' + data.sectionId + '/', callback);
        }

        /**
         * Lesson
         */
        function getLesson(lessonId) {
            return crud.get('/lessons/' + lessonId + '/');
        }

        function createLesson(data, callback) {
            return crud.post('/lessons/', data.payload, callback);
        }

        function updateLesson(data, callback) {
            return crud.put('/lessons/' + data.lessonId + '/', data.payload, callback);
        }

        function deleteLesson(data, callback) {
            return crud.delete('/lessons/' + data.lessonId + '/', callback);
        }
        function verifyLessonResult(data,callback, notify){
            return crud.post('/lessons/'+data.lessonId+'/verify/',data.payload,callback,notify);
        }


        /**
         * Tools
         */
        function createTool(data) {
            return crud.post('/courses/' + data.courseId + '/tools/', data.payload);
        }

        function updateTool(data) {
            return crud.put('/courses/' + data.courseId + '/tools/' + data.toolId + '/', data.payload);
        }

        function deleteTool(data) {
            return crud.delete('/courses/' + data.courseId + '/tools/' + data.toolId + '/');
        }

        /**
         * Notifications
         */
        function createNotification(data, callback) {
            return crud.post('/courses/' + data.courseId + '/notifications/', data.payload, callback);
        }

        function updateNotification(data, callback) {
            return crud.put('/courses/' + data.courseId + '/notifications/' + data.notificationId + '/', data.payload, callback);
        }

        function deleteNotification(data) {
            return crud.delete('/courses/' + data.courseId + '/notifications/' + data.notificationId + '/');
        }

        /**
         * Question
         */
        function createQuestion(data, callback) {
            return crud.post('/courses/' + data.courseId + '/questions-and-answers/', data.payload, callback);
        }

        function updateQuestion(data, callback) {
            return crud.put('/courses/' + data.courseId + '/questions-and-answers/' + data.questionId + '/', data.payload, callback);
        }

        function deleteQuestion(data) {
            return crud.delete('/courses/' + data.courseId + '/questions-and-answers/' + data.questionId + '/');
        }

        function createAnswer(data, callback) {
            return crud.post('/courses/' + data.courseId + '/questions-and-answers/' + data.questionId + '/answers/', data.payload, callback);
        }

        function updateAnswer(data, callback) {
            return crud.put('/courses/' + data.courseId + '/questions-and-answers/' + data.questionId + '/answers/' + data.answerId + '/', data.payload, callback);
        }

        function deleteAnswer(data) {
            return crud.delete('/courses/' + data.courseId + '/questions-and-answers/' + data.questionId + '/answers/' + data.answerId + '/');
        }

        /**
         * User
         */
        function enrolledCourses(data) {
            return crud.get('/users/' + data.userId + '/courses/' + data.courseId + '/');
        }

        function enrollCourse(data, callback, notify) {
            return crud.post('/users/' + data.userId + '/courses/' + data.courseId + '/', {}, callback, notify);
        }

        function addPassedLessonToUser(data, callback, notify) {
            return crud.post('/users/' + data.userId + '/courses/' + data.courseId + '/lessons/' + data.lessonId, data.payload, callback, notify);
        }

        function removePassedLessonFromUser(data, callback, notify) {
            return crud.delete('/users/' + data.userId + '/courses/' + data.courseId + '/lessons/' + data.lessonId, callback, notify);
        }
    }
}());