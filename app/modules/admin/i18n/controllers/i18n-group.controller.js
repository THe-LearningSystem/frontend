(function () {
    'use strict';

    //http://stackoverflow.com/questions/5223/length-of-a-javascript-object
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    angular
        .module('admin.i18n')
        .controller('I18nGroupCtrl', I18nGroupCtrl);

    I18nGroupCtrl.$inject = ['$stateParams', 'i18nService', '$uibModal'];

    function I18nGroupCtrl($stateParams, i18nService, $uibModal) {
        var vm = this;
        i18nService.getConfig().then(function (response) {
            vm.languageConfig = response.data;
        });
        i18nService.get($stateParams.moduleId).then(function (response) {
            vm.module = response.data;
            vm.group = _.find(vm.module.groups, {_id: $stateParams.groupId});
        });

        vm.isTranslationComplete = function (myObject) {
            return vm.languageConfig.languages.length === Object.size(myObject.values);
        };

        vm.createTranslation = function () {
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/i18n/views/translation.modal.view.html',
                controller: 'TranslationModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            moduleId: vm.module._id,
                            groupId: vm.group._id,
                            languageConfig: vm.languageConfig
                        };
                    }
                }
            });
        };
        vm.updateTranslation = function (translation) {
            event.preventDefault();
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                templateUrl: '/modules/admin/i18n/views/translation.modal.view.html',
                controller: 'TranslationModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            moduleId: vm.module._id,
                            groupId: vm.group._id,
                            translation: translation,
                            languageConfig: vm.languageConfig
                        };
                    }
                }
            });
        };
    }
}());

