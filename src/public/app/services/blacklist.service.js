'use strict';

SesApp.factory('BlacklistService', ['$http', '$q', function($http, $q) {
    return {
        removeFromBlacklist: function(email) {
            return $http({
                method: 'DELETE',
                url: '/blacklist/email=' + email,
            }).then(function(response) {
                    return response.data;
                },
                function(errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
        getBlacklist: function() {
            return $http({
                method: 'GET',
                url: '/blacklist',
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