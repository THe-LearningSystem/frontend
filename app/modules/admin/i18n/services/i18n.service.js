(function () {
    'use strict';

    // Users service used for communicating with the users REST endpoint
    angular
        .module('admin.acl.services')
        .factory('i18nService', i18nService);

    i18nService.$inject = ['crud'];

    function i18nService(crud) {
        return {
            getConfig: getConfig,
            getAll: getAll,
            getAllSimplified:getAllSimplified,
            get: get,
            createTranslationModule: createTranslationModule,
            updateTranslationModule: updateTranslationModule,
            deleteTranslationModule: deleteTranslationModule,
            createTranslationGroup: createTranslationGroup,
            updateTranslationGroup: updateTranslationGroup,
            deleteTranslationGroup: deleteTranslationGroup,
            createTranslation: createTranslation,
            updateTranslation: updateTranslation,
            deleteTranslation: deleteTranslation
        };
        function getConfig() {
            return crud.get('/i18n/config');
        }

        function getAll() {
            return crud.get('/i18n');
        }
        function getAllSimplified() {
            return crud.get('/i18n/?simplified=true');
        }
        function get(moduleId) {
            return crud.get('/i18n/' + moduleId);
        }

        /**
         *Translation Module
         */

        function createTranslationModule(data) {
            return crud.post('/i18n/', data.payload);
        }

        function updateTranslationModule(data,callback) {
            return crud.put('/i18n/' + data.moduleId + '/', data.payload,callback);
        }

        function deleteTranslationModule(data,callback) {
            return crud.delete('/i18n/' + data.moduleId + '/',callback);
        }

        /**
         * TranslationGroup
         */

        function createTranslationGroup(data,callback) {
            return crud.post('/i18n/' + data.moduleId + '/groups/', data.payload,callback);
        }

        function updateTranslationGroup(data,callback) {
            console.log(data);
            return crud.put('/i18n/' + data.moduleId + '/groups/' + data.groupId + '/', data.payload,callback);
        }

        function deleteTranslationGroup(data,callback) {
            return crud.delete('/i18n/' + data.moduleId + '/groups/' + data.groupId + '/',callback);
        }

        /**
         * Translations
         */

        function createTranslation(data,callback) {
            return crud.post('/i18n/' + data.moduleId + '/groups/' + data.groupId + '/', data.payload,callback);
        }

        function updateTranslation(data,callback) {
            return crud.put('/i18n/' + data.moduleId + '/groups/' + data.groupId + '/translations/' + data.payload.id, data.payload,callback);
        }

        function deleteTranslation(data,callback) {
            return crud.delete('/i18n/' + data.moduleId + '/groups/' + data.groupId + '/translations/' + data.translationId,callback);
        }
    }
}());
