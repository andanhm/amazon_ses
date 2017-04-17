'use strict';

SesApp.factory('DashboardService', ['$http', '$q', function($http, $q) {
    return {
        getCounts: function() {
            return $http({
                method: 'GET',
                url: '/dashboard'
            }).then(function(response) {
                    return response.data;
                },
                function(errResponse) {
                    return $q.reject(errResponse);
                }
            );
        }
    };
}]);