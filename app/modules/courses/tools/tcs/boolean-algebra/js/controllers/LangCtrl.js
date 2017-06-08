/**
 * Created by Sergej on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');
    app.controller("LangCtrl", function ($scope, $translate) {
        $scope.changeLang = function (key) {
            $translate.use(key).then(function (key) {
                console.log("Sprache zu " + key + " gewechselt.");
            }, function (key) {
                console.log("Irgendwas lief schief.");
            });
        };
    });
})();