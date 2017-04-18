'use strict';

SesApp.config([
    '$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
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
                controller: 'StatisticsController',
                templateUrl: 'templates/statistics.html'
            })
            .otherwise({ redirectTo: '/' });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
]);