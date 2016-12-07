(function () {
    'use strict';

    angular.module('app')
        .component('hyfTodoUsers', {
            templateUrl: '/app/todos/todo-users.template.html',
            controller: TodoUsersController,
        });

    TodoUsersController.$inject = ['$stateParams', 'backendService'];

    function TodoUsersController($stateParams, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.todo = {};
        ctrl.users = []

        //////// Implementation ////////

        activate();

        function activate() {
            backendService.getTodoById($stateParams.id)
                .then(function (todo) {
                    ctrl.todo = todo;
                    return backendService.getUsers()
                        .then(function (result) {
                            ctrl.users = result.users;
                        });
                })
                .catch(function (err) {
                    window.alert(err.message);
                });
        }
    }
})();


