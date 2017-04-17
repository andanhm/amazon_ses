'use strict';

SesApp.factory('EmailService', ['$http', '$q', function($http, $q) {
    return {
        sendEmail: function(emailDetails) {
            return $http({
                method: 'POST',
                url: '/send',
                data: emailDetails
            }).then(function(response) {
                    return response.data;
                },
                function(errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },

        getEmailStatus: function(msgId) {
            return $http({
                method: 'GET',
                url: '/email/msgId=' + msgId,
            }).then(function(response) {
                    return response.data;
                },
                function(errResponse) {
                    return $q.reject(errResponse);
                }
            );
        },
    };
}]);