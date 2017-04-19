'use strict';

SesApp.config([
    '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'EmailController',
                templateUrl: 'templates/send_email.html'
            })
            .when('/send', {
                controller: 'EmailController',
                templateUrl: 'templates/send_email.html'
            })
            .when('/email', {
                controller: 'EmailController',
                templateUrl: 'templates/email_request.html'
            })
            .when('/blacklist', {
                controller: 'BlacklistController',
                templateUrl: 'templates/blacklist.html'
            })
            .otherwise({ redirectTo: '/' });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
]);