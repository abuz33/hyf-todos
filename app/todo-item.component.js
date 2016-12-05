(function() {
    'use strict';

    angular.module('app')
        .component('hyfTodoItem', {
            templateUrl: 'app/todo-item.template.html',
            bindings: {
                todo: '<',
            },
            controller: TodoItemController
        });

    TodoItemController.$inject = [];

    function TodoItemController() {

        //////// View Model ////////

        var ctrl = this;
        // ctrl.getRoleTitle = getRoleTitle;

        //////// Implementation ////////

        // function getRoleTitle(role) {
        //     return peopleService.roleTitles[role];
        // }
    }

})();