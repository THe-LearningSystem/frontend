(function () {
    'use strict';

    angular
        .module('admin.i18n.routes')
        .config(routeConfig);


    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('backend.i18n', {
                abstract: true,
                url: '/i18n',
                template: '<ui-view/>'
            })
            .state('backend.i18n.list', {
                url: '',
                templateUrl: '/modules/admin/i18n/views/i18n-module-list.view.html',
                controller: 'I18nCtrl',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                    label: 'Translation List'
                }
            })
            .state('backend.i18n.module', {
                url: '/:moduleId',
                templateUrl: '/modules/admin/i18n/views/i18n-module.view.html',
                controller: 'I18nModuleCtrl',
                controllerAs: 'vm'

            })
            .state('backend.i18n.group', {
                url: '/:moduleId/groups/:groupId',
                templateUrl: '/modules/admin/i18n/views/i18n-module-group.view.html',
                controller: 'I18nGroupCtrl',
                controllerAs: 'vm',
                ncyBreadcrumb: {
                    label: 'State {{vm.group.name}}'
                }
            });
    }
}());
