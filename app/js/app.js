var config = {
    name: 'app',
    vendorDependencies: [
        'ngResource',
        'ngAnimate',
        'ngMessages',
        'ui.router',
        'ui.bootstrap',
        'ngFileUpload',
        'ui-notification',
        'angular-jwt',
        'LocalStorageModule'
    ]
};

var app = angular.module(config.name, config.vendorDependencies)
    .config(["$httpProvider", "$locationProvider", "localStorageServiceProvider", "jwtOptionsProvider",
        function ($httpProvider, $locationProvider, localStorageServiceProvider, jwtOptionsProvider) {
            localStorageServiceProvider
                .setPrefix('learningsystem');
            jwtOptionsProvider
                .config({
                    //Prefix JWT already in the Token
                    authPrefix: '',
                    tokenGetter: ['Authentication', function (Authentication) {
                        return Authentication.token;
                    }],
                    unauthenticatedRedirectPath: '/login',
                    whiteListedDomains: ['localhost']
                });
            $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('jwtInterceptor');
        }])

    .run(function ($rootScope, $state, jwtHelper, localStorageService, Authentication, Notification) {
        Authentication.init();
        $rootScope.serverUrl = "http://localhost:3000/api";
        $rootScope.isAuthenticated = Authentication.isAuthenticated;
        //Dont show signin or signup page when the user is already logged in
        //Not the best solution
        //TODO: find a better solution
        $rootScope.$on("$stateChangeStart",
            function (event, toState, toParams, fromState, fromParams) {
                $state.previous = {};
                $state.previous.state = fromState;
                $state.previous.params = fromParams;
                Authentication.init();
                if (Authentication.isAuthenticated && (toState.name === "users.signin" || toState.name === "users.signup")) {
                    event.preventDefault();
                    $state.transitionTo('home');
                }
                if (toState.name === "users.signout" && Authentication.isAuthenticated) {
                    event.preventDefault();
                    Notification.success({
                        message: '<i class="glyphicon glyphicon-ok"></i> Signout successfull!',
                        positionX: 'right',
                        positionY: 'bottom'
                    });
                    Authentication.removeToken();
                    $state.go('home');
                }
                console.log(Authentication.isAuthenticated, toState.requirements);
                //if the site is restricted and the user isnt logged in then redirect to login
                if (toState.requiredRight !== undefined && Authentication.isAuthenticated === false) {
                    event.preventDefault();
                    $state.go('users.signin');
                    //if the user has not the right then redirect to not-authorized
                } else if (toState.requiredRight !== undefined && !Authentication.hasRight(toState.requiredRight)) {
                    event.preventDefault();
                    $state.go('not-authorized');
                }

            }
        );
    });

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
