(function () {
    'use strict';

    angular.module('app')
        .component('hyfUserItem', {
            templateUrl: 'app/users/user-item.template.html',
            bindings: {
                user: '<',
                onDelete: '&'
            },
            controller: UserItemController
        });

    UserItemController.$inject = ['$mdDialog', '$state', 'backendService'];

    function UserItemController($mdDialog, $state, backendService) {

        //////// View Model ////////

        var ctrl = this;
        ctrl.editUser = editUser;
        ctrl.deleteUser = deleteUser;
        ctrl.showTodos = showTodos;

        //////// Implementation ////////

        function editUser(ev) {
            var confirm = $mdDialog.prompt()
                .title('Change user name')
                // .textContent('Please enter the user\'s name')
                .placeholder('name')
                .ariaLabel('User name')
                .initialValue(ctrl.user.name)
                .targetEvent(ev)
                .ok('Update')
                .cancel('Cancel');

            $mdDialog.show(confirm)
                .then(changeUserName,
                    function () {
                        console.log('Change user name was cancelled');
                    });
        }

        function changeUserName(name) {
            name = name.trim();
            if (name && name !== ctrl.user.name) {
                console.log('Updating user name: ' + name);
                ctrl.user.name = name
                backendService.updateUser(ctrl.user)
            }
        }

        function deleteUser(ev) {
            ctrl.onDelete({id: ctrl.user._id, ev: ev});
        }

        function showTodos() {
            $state.go('userTodos', {id: ctrl.user._id});
        }
    }

})();