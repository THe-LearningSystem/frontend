deferredBootstrapper.bootstrap({
    element: document.body,
    module: 'app',
    resolve: {
        I18N_DATA: ['$http', function ($http) {
            return $http.get(theLearningSystemConfig.frontendUrl + '/languages.json');
        }],
        I18N_CONFIG: ['$http', function ($http) {
            return $http.get(theLearningSystemConfig.frontendUrl + '/configs.json');
        }]
    }
});


var config = {
    name: 'app',
    vendorDependencies: [
        'ui.router',
        'ui.bootstrap',
        'ui-notification',
        'LocalStorageModule',
        'ngSanitize',
        'ui.select',
        'dndLists',
        'bootstrap.angular.validation',
        'yaru22.angular-timeago',
        'jsonFormatter',
        'ngQuill',
        'rzModule'
    ]
};

var app = angular.module(config.name, config.vendorDependencies)
    .config(["$httpProvider", "$locationProvider", "localStorageServiceProvider", "I18N_DATA", 'bsValidationConfigProvider',
        function ($httpProvider, $locationProvider, localStorageServiceProvider, I18N_DATA, bsValidationConfigProvider) {
            localStorageServiceProvider
                .setPrefix('learningsystem');
            $locationProvider.html5Mode(true);



            bsValidationConfigProvider.global.setValidateFieldsOn('submit');
            bsValidationConfigProvider.global.errorClass = 'has-warning';
            bsValidationConfigProvider.global.successClass = '';
        }])

    .run(['$rootScope', '$state', 'localStorageService', 'Notification', 'I18nManager', "I18N_DATA", "I18N_CONFIG", 'bsValidationConfig',
        function ($rootScope, $state, localStorageService, Notification, I18nManager, I18N_DATA, I18N_CONFIG, bsValidationConfig) {
            $rootScope.getDeepValue = function (obj, path) {
                for (var i = 0, tmpPath = path.split('.'), len = tmpPath.length; i < len; i++) {
                    if (obj !== undefined) {
                        obj = obj[tmpPath[i]];
                    } else {
                        return path.toUpperCase();
                    }
                }
                if (_.has(obj, I18nManager.preferredLanguage)) {
                    return obj[I18nManager.preferredLanguage];
                } else {
                    return path;
                }
            };


            I18nManager.setData(I18N_DATA);
            I18nManager.setConfig(I18N_CONFIG);
            $rootScope.i18nj = I18nManager.init();
            $rootScope.preferredLanguage = I18nManager.preferredLanguage;


            $rootScope.getTranslation = function (input) {
                return $rootScope.getDeepValue(I18nManager.data, input);
            };

            bsValidationConfig.messages.required = $rootScope.getDeepValue(I18N_DATA, "core.general.required");

            $rootScope.serverUrl = theLearningSystemConfig.serverUrl;


            $rootScope.getLocalized = function (obj, defaultLanguage) {
                if (obj !== undefined) {
                    if (_.has(obj, I18nManager.preferredLanguage))
                        return obj[I18nManager.preferredLanguage];
                    else
                        return obj[I18nManager.defaultLanguage];
                } else {
                }

            };
        }]);


app.filter('translate', ['I18nManager', function (I18nManager) {
    var _deep_value = function (obj, path) {
        if (path !== undefined) {
            for (var i = 0, tmpPath = path.split('.'), len = tmpPath.length; i < len; i++) {
                if (obj !== undefined) {
                    obj = obj[tmpPath[i]];
                } else {
                    return path.toUpperCase();
                }
            }
            if (_.has(obj, I18nManager.preferredLanguage)) {
                return obj[I18nManager.preferredLanguage];
            } else {
                return path;
            }
        }
    };

    return function (input) {
        return _deep_value(I18nManager.data, input);
    }
}]);

app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

/**
 * Registers a new Module to the system (from https://github.com/meanjs/mean/blob/master/modules/core/client/app/config.js#L16)
 * @param moduleName
 * @param dependencies
 */
function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);
    // Add the module to the AngularJS configuration file
    angular.module(config.name).requires.push(moduleName);
}
