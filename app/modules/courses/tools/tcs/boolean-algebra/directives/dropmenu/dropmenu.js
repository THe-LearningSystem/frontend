/**
 * Created by Sergej on 08.12.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    /* Benutzerdefiniertes Selectmenu */
    app.directive('dropmenu', function ($timeout, $sce) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var $ul = $element.find('ul');
                var $li = $ul.children('li');
                var $firstLi = $li.siblings('[selected]');
                if ($firstLi.length == 0) {
                    $firstLi = $li.first();
                }

                var change = $scope[$attr.dropmenuChange] || function(key) {console.log("You've chosen " + key + ". Please use dropdown-change attribute to invoke a function.")};

                var $preview;
                $timeout(function(){
                    $element.prepend('<div class="preview"><span class="content">'+ $sce.trustAsHtml($firstLi.html()) +'</span><span class="glyphicon glyphicon-triangle-bottom"></span></div>');
                    $preview = $element.find('.preview');
                    $element.css({width: ($firstLi.outerWidth() + 50) + "px"});
                }, 500);

                var close = function(){
                    $element.removeClass('open');
                };

                $li.on('click', function(e){
                    var $thisLi = angular.element(this);
                    change($thisLi.attr('value'));
                    close();
                    $timeout(function(){
                        $preview.find('.content').html($thisLi.html());
                    },100);
                    e.stopPropagation();
                });

                $element.on('click', function(e){
                    $element.toggleClass('open');
                    e.stopPropagation();
                    e.preventDefault();
                }).on('blur', close);
            }
        }
    });
})();