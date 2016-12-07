(function () {
    'use strict';

    angular.module('app')
        .component('hyfTodoItem', {
            templateUrl: 'app/todos/todo-item.template.html',
            bindings: {
                todo: '<',
                onDelete: '&'
            },
            controller: TodoItemController
        });

    TodoItemController.$inject = ['$mdDialog', '$state', 'backendService'];

    function TodoItemController($mdDialog, $state, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.doneChanged = doneChanged;
        ctrl.editTodo = editTodo;
        ctrl.deleteTodo = deleteTodo;
        ctrl.showUsers = showUsers;

        //////// Implementation ////////

        function doneChanged() {
            backendService.updateTodo(ctrl.todo);
        }

        function editTodo(ev) {
            var confirm = $mdDialog.prompt()
                .title('Change todo')
                .textContent('Please update the description for todo.')
                .placeholder('todo text')
                .ariaLabel('Todo text')
                .initialValue(ctrl.todo.text)
                .targetEvent(ev)
                .ok('Update')
                .cancel('Cancel');

            $mdDialog.show(confirm)
                .then(changeTodo,
                    function () {
                        console.log('Change todo was cancelled');
                    });
        }

        function changeTodo(text) {
            text = text.trim();
            if (text && text !== ctrl.todo.text) {
                console.log('Updating todo: ' + text);
                ctrl.todo.text = text
                backendService.updateTodo(ctrl.todo)
            }
        }

        function deleteTodo(ev) {
            ctrl.onDelete({id: ctrl.todo._id, ev: ev});
        }

        function showUsers() {
            $state.go('todoUsers', {id: ctrl.todo._id});
        }

    }

})();