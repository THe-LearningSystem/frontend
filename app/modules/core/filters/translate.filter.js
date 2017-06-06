(function () {
    'use strict';

    //http://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string
    //TODO: remove undefined errors and return undefined if no value found
    var _deep_value = function (obj, path) {
        for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            obj = obj[path[i]];
        }
        return obj;
    };


    var i18nGet = function (value) {
        var returnVal = _deep_value(I18nManager.data, value + '.' + I18nManager.preferredLanguage);
        if (returnVal === undefined)
            return value;
        else
            return returnVal;
    };


    // Users directive used to force lowercase input
    angular
        .module('core')
        .filter('translate', translate);

    function translate() {
        return function (x) {
            console.log(x);
            return x;
        };
    }
}());
