(function () {
    'use strict';

    angular
        .module('admin.i18n')
        .controller('TranslationModuleModalCtrl', TranslationModuleModalCtrl);

    TranslationModuleModalCtrl.$inject = ['$uibModalInstance', 'i18nService', 'data'];

    function TranslationModuleModalCtrl($uibModalInstance, i18nService, data) {
        var vm = this;
        if (data !== undefined) {
            vm.data = data;
            console.log(data);
        }
        vm.create = function () {
            var translationData = {
                payload: vm.data
            };
            i18nService.createTranslationModule(translationData);
            $uibModalInstance.close();
        };

        vm.update = function () {
            var translationData = {
                moduleId:  vm.data._id,
                payload: vm.data
            };
            console.log(translationData);
            i18nService.updateTranslationModule(translationData,function(response){
                console.log(response);
            });
            $uibModalInstance.close();
        };

        vm.delete = function () {
            var translationData = {
                moduleId: vm.data._id
            };
            i18nService.deleteTranslationModule(translationData);
            $uibModalInstance.close();
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
}());
