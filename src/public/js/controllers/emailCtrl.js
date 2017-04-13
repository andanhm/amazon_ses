SesApp.controller('EmailController', ['$scope', 'EmailService', function($scope, EmailService) {
    $scope.alert = false;
    $scope.send = function() {
        $scope.alert = true;
        $scope.envelopeColor = {
            'background-color': '#50505a'
        };
        $scope.alertMessage = 'Sending....';
        var data = {
            name: $scope.name,
            email: $scope.email,
            subject: $scope.subject,
            message: $scope.message
        }
        EmailService.sendEmail(data).then(
            function(response) {
                if (response.error) {
                    $scope.alertMessage = 'Unable to send email. Try again later!!!';
                    $scope.envelopeColor = {
                        'background-color': '#a94442'
                    }
                } else {
                    $scope.alertMessage = 'Message send successfully';
                    $scope.envelopeColor = {
                        'background-color': '#3c763d'
                    }
                }
            },
            function() {
                $scope.alertMessage = 'Sorry for the inconvenience. we are fixing a temporary glitch. Please re-try in mint';
                $scope.envelopeColor = {
                    'background-color': '#8a6d3b'
                }
            });
    }
}]);