(function() {
    'use strict';

    angular.module('app')
        .component('hyfTodos', {
            templateUrl: '/app/todos/todos.template.html',
            controller: TodosController
        });

    TodosController.$inject = ['$rootScope', '$mdDialog', '$q', '$window', 'backendService'];

    function TodosController($rootScope, $mdDialog, $q, $window, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.onDelete = onDelete;

        //////// Implementation ////////

        var deregisterFn;

        // listen for an addUser event, emitted by the toolbar of the home component
        this.$onInit = function() {
            deregisterFn = $rootScope.$on('addTodo', function (broadcastEvent, mouseEvent) {
                addTodo(mouseEvent);
            });
        }

        this.$onDestroy = function() {
            deregisterFn();
        }

        activate();

        function activate() {
            backendService.getTodos()
                .then(function (data) {
                    ctrl.todos = data.todos;
                })
                .catch(function (err) {
                    window.alert(err.message);
                });
        }

        function addTodo(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Add new todo')
                .textContent('Please enter a description for the new todo.')
                .placeholder('description')
                .ariaLabel('Todo description')
                .initialValue('')
                .targetEvent(ev)
                .ok('Add')
                .cancel('Cancel');

            $mdDialog.show(confirm)
                .then(function (text) {
                    backendService.addTodo({text: text, done: false})
                        .then(activate);
                }, function () {
                    console.log('Add new todo was cancelled');
                });
        }

        function onDelete(id, ev) {
            backendService.getTodoById(id)
                .then(function (todo) {
                    var userCount = todo.users.length
                    var message;
                    if (userCount === 0) {
                        message = '\'' + todo.text + '\' is assigned to nobody.';
                    } else if (userCount === 1) {
                        message = '\'' + todo.text + '\' is assigned to 1 user.';
                    } else {
                        message = '\'' + todo.text +  '\' is assigned to ' + userCount + 'users.';
                    }
                    var confirm = $mdDialog.confirm()
                        .title('Delete todo?')
                        .textContent(message)
                        .ariaLabel('Confirm delete todo')
                        .targetEvent(ev)
                        .ok('Delete')
                        .cancel('Cancel');
                    return $mdDialog.show(confirm)
                        .then(function () {
                            return backendService.deleteTodo(todo._id)
                                .then(activate)
                        }, function () {
                            console.log('Delete todo was cancelled');
                            return $q.resolve();
                        });
                })
                .catch(function (err) {
                    $window.alert(err.message);
                });

        }
    }
})();


