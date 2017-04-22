(function () {
    'use strict';

    registerModule('users');
    registerModule('users.directives');
    registerModule('users.routes', ['ui.router']);
    registerModule('users.services');

}());