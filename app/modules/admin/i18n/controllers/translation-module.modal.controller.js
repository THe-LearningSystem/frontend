(function () {
    'use strict';

    angular
        .module('admin.i18n')
        .controller('TranslationModuleModalCtrl', TranslationModuleModalCtrl);

    TranslationModuleModalCtrl.$inject = ['$uibModalInstance', 'i18nService', 'data'];

    function TranslationModuleModalCtrl($uibModalInstance, i18nService, data) {
        var vm = this;
        if (data !== undefined) {
            vm._id = data._id;
            vm.name = data.name;
            vm.description = data.description;
        }
        vm.create = function () {
            var translationData = {
                payload: {
                    name: vm.name,
                    description: vm.description
                }
            };
            i18nService.createTranslationModule(translationData);
            $uibModalInstance.close();
        };

        vm.update = function () {
            var translationData = {
                moduleId: vm._id,
                payload: {
                    _id: vm._id,
                    name: vm.name,
                    description: vm.description
                }
            };
            i18nService.updateTranslationModule(translationData);
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var translationData = {
                moduleId: vm._id
            };
            i18nService.deleteTranslationModule(translationData);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
}());
