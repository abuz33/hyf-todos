(function() {
    'use strict';

    angular.module('app')
        .factory('todoService', todoService);

    todoService.$inject = ['$http', '$q', '$log'];

    function todoService($http, $q, $log) {

        return {
            getTodos: getTodos,
            addTodo: addTodo,
            updateTodo: updateTodo,
            deleteTodo: deleteTodo,
            deleteAllTodos: deleteAllTodos

        }

        function getTodos() {
            return $http.get('/todo')
                .then(function(data) {
                    return data.data;
                })
                .catch(function(err) {
                    handleFailure(err, 'getTodos');
                });
        }

        function addTodo(todo) {

        }

        function updateTodo(todo) {

        }

        function deleteTodo(id) {

        }

        function deleteAllTodos() {

        }

        function handleFailure(e, funcName) {
            var newMessage = 'XHR Failed for ' + funcName;
            if (e.data && e.data.description) {
                newMessage = newMessage + '\n' + e.data.description;
            }
            e.data.description = newMessage;
            $log.error(newMessage);
            return $q.reject(e);
        }
    }

})();
