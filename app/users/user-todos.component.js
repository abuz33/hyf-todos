(function () {
    'use strict';

    angular.module('app')
        .component('hyfUserTodos', {
            templateUrl: '/app/users/user-todos.template.html',
            controller: UserTodosController,
        });

    UserTodosController.$inject = ['$stateParams', 'backendService'];

    function UserTodosController($stateParams, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.user = {};
        ctrl.todos = []

        //////// Implementation ////////

        activate();

        function activate() {
            backendService.getUserById($stateParams.id)
                .then(function (user) {
                    ctrl.user = user;
                    return backendService.getTodos()
                        .then(function (result) {
                            ctrl.todos = result.todos;
                        });
                })
                .catch(function (err) {
                    window.alert(err.message);
                });
        }
    }
})();


