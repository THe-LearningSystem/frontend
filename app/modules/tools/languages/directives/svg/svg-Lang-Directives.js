//Directive for derivationtree and its options.
    angular.module('tcs-tools').directive("ownlangsvg", function () {
    return {
        transclude: true,
        replace: true,
        link: function (scope, elm, attrs) {

            scope.langDerivationtree.svg = d3.select('#diagram-lang-svg');
            elm.on('contextmenu', function () {
                event.preventDefault();
                scope.langDerivationtree.menu.preventSvgContextClick = false;
            }).on('click', function () {
                console.log('click');
                event.preventDefault();
            });


            //add listener
            window.addEventListener('resize', function () {
                scope.langDerivationtree.updateWidthAndHeight();
            });
        },
        templateUrl: 'modules/tools/languages/directives/svg/own-lang-svg.html'
    };
});

//Directive for the grid.
    angular.module('tcs-tools').directive("svglanggrid", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

            scope.langDerivationtree.grid.draw();

        },
        templateUrl: 'modules/tools/languages/directives/svg/svg-lang-grid.html'
    };
});

    angular.module('tcs-tools').directive("svglangouter", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {
            scope.langDerivationtree.svgLangOuter = d3.select("#diagram-lang-svg");
            d3.select("#diagram-lang-svg").call(scope.langDerivationtree.zoom.behaviour);

        },
        templateUrl: 'modules/tools/languages/directives/svg/svg-lang-outer.html'
    };
});

    angular.module('tcs-tools').directive("svglangtransition", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

        },
        templateUrl: 'modules/tools/languages/directives/svg/svg-lang-transition.html'
    };
});

    angular.module('tcs-tools').directive("svgproductionrule", function () {
    return {
        replace: true,
        restrict: 'E',
        templateNamespace: 'svg',
        link: function (scope, elm, attrs) {

        },
        templateUrl: 'modules/tools/languages/directives/svg/svg-lang-production-rule.html'
    };
});
