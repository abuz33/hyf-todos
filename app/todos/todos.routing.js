'use strict';

(function () {
    'use strict';

    angular.module('app')
        .config(routing);

    routing.$inject = ['$stateProvider'];

    function routing($stateProvider) {

        $stateProvider
            .state('todoUsers', {
                url: '/todo/:id',
                component: 'hyfTodoUsers',
                resolve: {
                    todo: resolveTodoUsers
                }
            });
    }

    resolveTodoUsers.$inject = ['$stateParams', 'backendService'];

    function resolveTodoUsers($stateParams, backendService) {
        return backendService.getTodoById($stateParams.id)
    }

})();