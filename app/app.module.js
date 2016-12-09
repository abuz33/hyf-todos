'use strict';

(function () {
    'use strict';

    angular.module('app', ['ui.router', 'ngMaterial'])
        .constant('appTitle', 'HYF Todos')
        .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider'];

    function config($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/?tab',
                component: 'hyfHome'
            });
    }

})();