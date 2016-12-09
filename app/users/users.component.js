(function () {
    'use strict';

    angular.module('app')
        .component('hyfUsers', {
            templateUrl: '/app/users/users.template.html',
            controller: UsersController
        });

    UsersController.$inject = ['$rootScope', '$mdDialog', '$window', 'backendService'];

    function UsersController($rootScope, $mdDialog, $window, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.onDelete = onDelete;

        //////// Implementation ////////

        var deregisterFn;

        // listen for an addUser event, emitted by the toolbar of the home component
        this.$onInit = function() {
            deregisterFn = $rootScope.$on('addUser', function (broadcastEvent, mouseEvent) {
                addUser(mouseEvent);
            });
        }

        this.$onDestroy = function() {
            deregisterFn();
        }

        activate();

        function activate() {
            backendService.getUsers()
                .then(function (data) {
                    ctrl.users = data.users;
                })
                .catch(function (err) {
                    window.alert(err.message);
                });
        }

        function addUser(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('Add new user')
                .textContent('Please enter the name of the new user.')
                .placeholder('name')
                .ariaLabel('User name')
                .initialValue('')
                .targetEvent(ev)
                .ok('Add')
                .cancel('Cancel');
            $mdDialog.show(confirm)
                .then(function (name) {
                    return backendService.addUser({name: name});
                })
                .then(function (data) {
                    ctrl.users = data.users;
                })
                .catch( function () {
                    console.log('Add new user was cancelled');
                });
        }

        function onDelete(id, ev) {
            backendService.getUserById(id)
                .then(function (user) {
                    var todosCount = user.todos.length
                    var message;
                    if (todosCount === 0) {
                        message = user.name + ' has NO assigned todos.';
                    } else if (todosCount === 1) {
                        message = user.name + ' has 1 assigned todo.';
                    } else {
                        message = user.name + ' has ' + todosCount + ' assigned todos.';
                    }
                    var confirm = $mdDialog.confirm()
                        .title('Delete user?')
                        .textContent(message)
                        .ariaLabel('Confirm delete user')
                        .targetEvent(ev)
                        .ok('Delete')
                        .cancel('Cancel');
                    return $mdDialog.show(confirm)
                        .then(function () {
                            return backendService.deleteUser(user._id);
                        })
                        .then(function (data) {
                            ctrl.users = data.users;
                        })
                        .catch(function () {
                            console.log('Delete user was cancelled');
                        });
                })
                .catch(function (err) {
                    $window.alert(err.message);
                });
        }
    }
})();


