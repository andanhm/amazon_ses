'use strict';
SesApp.controller('BlacklistController', ['$scope', 'Title', 'BlacklistService', function($scope, Title, BlacklistService) {
    Title.set('Email Blacklist');

    $scope.get = function() {
        $scope.blacklists = [];
        BlacklistService.getBlacklist().then(
            function(response) {
                if (response.error) {
                    $scope.alertMessage = 'Unable to send email. Try again later!!!';
                    $scope.alert = 'alert alert-danger alert-dismissable';

                } else {
                    $scope.blacklists = response.data;
                }
            },
            function() {
                $scope.alertMessage = 'Sorry for the inconvenience. we are fixing a temporary glitch. Please re-try in mint';
                $scope.alert = 'alert alert-warning alert-dismissable';
            });
    }
    $scope.delete = function(email) {
        BlacklistService.removeFromBlacklist(email).then(
            function(response) {
                if (response.error) {
                    $scope.alertMessage = 'Unable to send email. Try again later!!!';
                    $scope.alert = 'alert alert-danger alert-dismissable';

                } else {
                    $scope.alertMessage = 'Message send successfully';
                    $scope.alert = 'alert alert-success alert-dismissable';

                }
            },
            function() {
                $scope.alertMessage = 'Sorry for the inconvenience. we are fixing a temporary glitch. Please re-try in mint';
                $scope.alert = 'alert alert-warning alert-dismissable';
            });
    }
}]);