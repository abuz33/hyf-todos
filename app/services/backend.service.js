(function () {
    'use strict';

    angular.module('app')
        .factory('backendService', backendService);

    backendService.$inject = ['$http'];

    function backendService($http) {

        return {
            getTodos: getTodos,
            addTodo: addTodo,
            updateTodo: updateTodo,
            deleteTodo: deleteTodo,
            deleteAllTodos: deleteAllTodos,
            getTodoById: getTodoById,
            getUsers: getUsers,
            addUser: addUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            getUserById: getUserById,
            assignUserToTodo: assignUserToTodo,
            unassignUserFromTodo: unassignUserFromTodo
        }

        function getTodos() {
            return $http.get('/todo')
                .then(function (data) {
                    return data.data;
                })
                .catch(function (err) {
                    handleFailure(err, 'getTodos');
                });
        }

        function addTodo(todo) {
            return $http.post('/todo', todo)
                .catch(function (err) {
                    handleFailure(err, 'addTodo');
                });
        }

        function updateTodo(todo) {
            return $http.put('/todo', todo)
                .catch(function (err) {
                    handleFailure(err, 'updateTodo');
                });
        }

        function deleteTodo(id) {
            return $http.delete('/todo/' + id)
                .catch(function (err) {
                    handleFailure(err, 'deleteTodo');
                });
        }

        function deleteAllTodos() {
            return $http.delete('/todo')
                .catch(function (err) {
                    handleFailure(err, 'deleteAllTodos');
                });
        }

        function getTodoById(id) {
            return $http.get('/todo/' + id)
                .then(function (data) {
                    return data.data;
                })
                .catch(function (err) {
                    handleFailure(err, 'getTodoById');
                });
        }


        function getUsers() {
            return $http.get('/user')
                .then(function (data) {
                    return data.data;
                })
                .catch(function (err) {
                    handleFailure(err, 'getUsers');
                });
        }

        function addUser(user) {
            return $http.post('/user', user)
                .catch(function (err) {
                    handleFailure(err, 'addUser');
                });
        }

        function updateUser(user) {
            return $http.put('/user', user)
                .catch(function (err) {
                    handleFailure(err, 'updateUser');
                });
        }

        function deleteUser(id) {
            return $http.delete('/user/' + id)
                .catch(function (err) {
                    handleFailure(err, 'deleteUser');
                });
        }

        function getUserById(id) {
            return $http.get('/user/' + id)
                .then(function (data) {
                    return data.data;
                })
                .catch(function (err) {
                    handleFailure(err, 'getUserById');
                });
        }

        function assignUserToTodo(userId, todoId) {
            return $http.put('/user/' + userId + '/' + todoId)
                .catch(function (err) {
                    handleFailure(err, 'assignUserToTodo');
                });
        }

        function unassignUserFromTodo(userId, todoId) {
            return $http.delete('/user/' + userId + '/' + todoId)
                .catch(function (err) {
                    handleFailure(err, 'unassignUserFromTodo');
                });
        }

        function handleFailure(e, funcName) {
            var message = 'XHR Failed for ' + funcName;
            if (e.data) {
                message = message + '\n' + e.data;
            }
            throw new Error(message);
        }
    }

})();
