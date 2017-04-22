(function () {
    'use strict';

    angular
        .module('courses.services')
        .factory('coursesService', coursesService);

    coursesService.$inject = ['$rootScope','$resource', '$log','$http'];

    function coursesService($rootScope,$resource, $log,$http) {
        return {
            courseList: courseList,
            courseDisplay : courseDisplay
        };

        function courseList() {
            return $http.get($rootScope.serverUrl+'/courses/');
        }

        function courseDisplay(urlName) {
            return $http.get($rootScope.serverUrl+'/courses/' + urlName).then(complete).catch(failed);
        }

        function complete(response) {
            return response;
        }

        function failed(error) {
            console.log(error.statusText);
        }
    }
}());