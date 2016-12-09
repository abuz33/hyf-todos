'use strict';

(function () {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

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