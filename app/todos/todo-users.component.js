(function () {
    'use strict';

    angular.module('app')
        .component('hyfTodoUsers', {
            templateUrl: '/app/todos/todo-users.template.html',
            bindings: {
                todo: '<'
            },
            controller: TodoUsersController
        });

    TodoUsersController.$inject = ['$stateParams', 'backendService'];

    function TodoUsersController($stateParams, backendService) {

        //////// View Model ////////

        var ctrl = this;

        //////// Implementation ////////

    }
})();


