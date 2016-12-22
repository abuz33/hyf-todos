'use strict';

(function () {
    'use strict';

    angular.module('app')
        .config(routing);

    routing.$inject = ['$stateProvider'];

    function routing($stateProvider) {

        $stateProvider
            .state('userTodos', {
                url: '/user/:id',
                component: 'hyfUserTodos',
                resolve: {
                    user: resolveUserTodos
                }
            });
    }

    resolveUserTodos.$inject = ['$stateParams', 'backendService'];

    function resolveUserTodos($stateParams, backendService) {
        return backendService.getUserById($stateParams.id)
    }

})();