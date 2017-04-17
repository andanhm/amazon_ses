'use strict';

SesApp.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'DashboardController',
                templateUrl: 'templates/dashboard.html'
            })
            .when('/home', {
                controller: 'DashboardController',
                templateUrl: 'templates/dashboard.html'
            })
            .when('/send', {
                controller: 'EmailController',
                templateUrl: 'templates/send_email.html'
            })
            .when('/statistics', {
                controller: 'EmailController',
                templateUrl: 'templates/email_statistics.html'
            })
            .otherwise({ redirectTo: '/' });
    }
]);