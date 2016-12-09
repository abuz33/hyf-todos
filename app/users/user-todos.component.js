(function () {
    'use strict';

    angular.module('app')
        .component('hyfUserTodos', {
            templateUrl: '/app/users/user-todos.template.html',
            bindings: {
                user: '<'
            },
            controller: UserTodosController
        });

    UserTodosController.$inject = ['$stateParams', 'backendService'];

    function UserTodosController($stateParams, backendService) {

        //////// View Model ////////

        var ctrl = this;

        //////// Implementation ////////

    }
})();


