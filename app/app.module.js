'use strict';

(function () {
    'use strict';

    angular.module('app', ['ui.router', 'ngMaterial'])
        .constant('appTitle', 'HYF Todos')
        .config(routing);

    routing.$inject = ['$urlRouterProvider', '$stateProvider'];

    function routing($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/?tab',
                component: 'hyfHome'
            });
    }

})();