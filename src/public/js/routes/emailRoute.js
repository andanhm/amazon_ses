'use strict';

SesApp.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'EmailController',
                templateUrl: 'templates/send_email.html'
            })
            .otherwise({ redirectTo: '/' });
    }
]);