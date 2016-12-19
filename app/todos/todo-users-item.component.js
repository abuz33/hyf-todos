(function () {
    'use strict';

    angular.module('app')
        .component('hyfTodoUsersItem', {
            templateUrl: '/app/todos/todo-users-item.template.html',
            controller: TodoUsersItemController,
            bindings: {
                user: '<',
                todo: '<'
            }
        });

    TodoUsersItemController.$inject = ['$window', 'backendService'];

    function TodoUsersItemController($window, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.assigned = false;
        ctrl.toggleAssignment = toggleAssignment;

        //////// Implementation ////////

        this.$onInit = function () {
            ctrl.assigned = ctrl.todo.assignedUsers.indexOf(ctrl.user._id) !== -1;
        }

        function toggleAssignment() {
            ctrl.assigned = !ctrl.assigned;
            var promise;
            if (ctrl.assigned) {
                promise = backendService.assignUserToTodo(ctrl.user._id, ctrl.todo._id);
            } else {
                promise = backendService.unassignUserFromTodo(ctrl.user._id, ctrl.todo._id);
            }
            promise.catch(function (err) {
                $window.alert(err.message);
            });
        }
    }
})();


