'use strict';

(function () {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

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