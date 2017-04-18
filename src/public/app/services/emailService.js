'use strict';

SesApp.factory('EmailService', ['$http', '$q', function($http, $q) {
    return {
        sendEmail: function(emailDetails, attachment) {
            return $http({
                method: 'POST',
                url: '/email',
                headers: { 'Content-Type': undefined },
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append('email', emailDetails.email);
                    formData.append('name', emailDetails.name);
                    formData.append('subject', emailDetails.subject);
                    formData.append('message', emailDetails.email);
                    formData.append('attachment', data.files[0]);
                    return formData;
                },
                data: { files: attachment }
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
        getEmails: function() {
            return $http({
                method: 'GET',
                url: '/email',
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