/**
 * Created by Sergej on 03.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.controller('BACtrl', function($scope, $compile) {

        if (!app.domains) {
            app.domains = {
                boolMain: new BADomain("boolMain"),
                boolMin: new BADomain("boolMin")
            };
        }
        $scope.minExpression = new BAExpression();

        $scope.createBTable = function(id){
            var $body = angular.element(id);
            var boolTableHtml = $compile('<bool-table bool-domain="boolMain"></bool-table>')($scope);
            $body.html(boolTableHtml);
        };

        $scope.createKV = function(id){
            var $input = angular.element('.boolInput[bool-domain="boolMain"]').find('.input');
            if (app.domains.boolMain.expression.text == "") {
                $input.focus();
                return false;
            }
            app.domains.boolMain.$input = $input;
            var $body = angular.element(id);
            var kvHtml = $compile('<bool-kv bool-domain="boolMain" bool-expr="' + app.domains.boolMain.expression.text + '"></bool-kv>')($scope);
            $body.html(kvHtml);
        };

        $scope.createCircuit = function (id) {
            var $input = angular.element('.boolInput[bool-domain="boolMain"]').find('.input');
            if (app.domains.boolMain.expression.text == "") {
                $input.focus();
                return false;
            }
            app.domains.boolMain.$input = $input;
            var $body = angular.element(id);
            var circuitHtml = $compile('<bool-circuit bool-domain="boolMain" bool-expr="' + app.domains.boolMain.expression.text + '"></bool-circuit>')($scope);
            $body.html(circuitHtml);
        };

        $scope.closeFooter = function(){
            angular.element('footer').hide();
        };
    }).filter('renderHTMLCorrectly', function($scope)
    {
        return function(stringToParse)
        {
            return $scope.trustAsHtml(stringToParse);
        }
    });
})();