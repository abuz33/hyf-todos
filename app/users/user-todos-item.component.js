(function () {
    'use strict';

    angular.module('app')
        .component('hyfUserTodosItem', {
            templateUrl: '/app/users/user-todos-item.template.html',
            controller: UserTodosItemController,
            bindings: {
                user: '<',
                todo: '<'
            }
        });

    UserTodosItemController.$inject = ['$window', 'backendService'];

    function UserTodosItemController($window, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.assigned = false;
        ctrl.toggleAssignment = toggleAssignment;

        //////// Implementation ////////

        this.$onInit = function () {
            ctrl.assigned = ctrl.user.assignedTodos.indexOf(ctrl.todo._id) !== -1;
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


