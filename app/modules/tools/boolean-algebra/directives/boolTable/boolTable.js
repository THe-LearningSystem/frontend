/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolTable', function($parse, $sce, $timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: "modules/tools/boolean-algebra/directives/boolTable/boolTable.html",
            link: function($scope, $element, $attr) {
                var $table = $element.find('table');
                var table = $table[0];
                var $fixedTables = angular.element('.fixed_headers');
                /* interpretierte id dem input zuweisen */
                var domain = app.domains[$attr.boolDomain];

                if (!domain) {
                    alert('Es wurde keine Domain gefunden!');
                }

                $scope.expression = domain.expression;

                $scope.checkResult = function(){
                    $scope.$broadcast('check-result');
                };

                domain.resizeTableTO = null;
                domain.resizeTable = function(delay){
                    if (!delay) delay = 10;
                    /*$timeout.cancel(domain.resizeTableTO);*/
                    domain.resizeTableTO = $timeout(function(){
                        $fixedTables.each(function(){
                            /* Baue Tabelle anhand der Datenstruktur auf */
                            var $t = angular.element(this);

                            var $tBody = $t.find('tbody');

                            var $ths = $t.find('thead th');
                            var $tds = $tBody.find('td');
                            var $trs = $tBody.find('tr');

                            var widths = [];
                            $ths.each(function(index){
                                widths[index] = angular.element(this).outerWidth(true);
                            });
                            $tds.each(function(index){
                                var $td = angular.element(this);
                                $td.css({width: widths[index] + "px"});
                            });

                            var maxHeight = 0;
                            $trs.each(function(){
                                var $tr = angular.element(this);
                                maxHeight += $tr.outerHeight(true);
                            });
                            $t.find('.slimScrollDiv').css({"max-height": maxHeight +"px"});
                        });
                    }, delay);
                };

                $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                    domain.resizeTable();
                });

                $fixedTables.each(function(){
                    var $fH = angular.element(this);
                    $fH.find('tbody').slimScroll({
                        height:"191px",
                        alwaysVisible: false
                    });
                });

                domain.tableRefresh = function(){
                    if (!$scope.table) {
                        $scope.table = domain.expression.generateTable();
                        domain.table = $scope.table;
                    } else {
                        $scope.table.build(domain.expression.rootNode);
                    }
                    $scope.table.updateView();
                    domain.resizeTable();
                };
                domain.tableRefresh();

                angular.element(window).resize(function(){
                    domain.resizeTable();
                });
            }
        };
    });
})();