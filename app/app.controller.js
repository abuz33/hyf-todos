(function() {
    'use strict';

    angular.module('app')
        .controller('appController', AppController);

    AppController.$inject = ['todoService', 'appTitle'];

    function AppController(todoService, appTitle) {

        var ctrl = this;

        ctrl.appTitle = appTitle;

        todoService.getTodos()
            .then(function(data) {
                ctrl.todos = data.todos;
            });
    }
})();


