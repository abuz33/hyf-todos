(function() {
    'use strict';

    angular.module('app')
        .component('hyfHome', {
            templateUrl: '/app/home/home.template.html',
            controller: HomeController
        });

    HomeController.$inject = ['$rootScope', '$stateParams', 'appTitle'];

    function HomeController($rootScope, $stateParams, appTitle) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.appTitle = appTitle;
        ctrl.addItem = addItem;
        ctrl.selectedIndex = 0;

        //////// Implementation ////////

        if ($stateParams.tab) {
            ctrl.selectedIndex = parseInt($stateParams.tab, 10);
        }

        function addItem(ev) {
            $rootScope.$broadcast(ctrl.selectedIndex === 0 ? 'addTodo' : 'addUser', ev);
        }

    }
})();


