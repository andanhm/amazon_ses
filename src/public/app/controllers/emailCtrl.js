SesApp.controller('EmailController', ['$scope', 'EmailService', function($scope, EmailService) {
    $scope.send = function() {
        $scope.alert = 'alert alert-info alert-dismissable';
        $scope.alertMessage = 'Sending....';
        var data = {
            name: $scope.name,
            email: $scope.email,
            subject: $scope.subject || 'Test mail',
            message: $scope.message
        }
        if (data.email) {
            EmailService.sendEmail(data).then(
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
        } else {
            $scope.alertMessage = 'Email address is required';
            $scope.alert = 'alert alert-warning alert-dismissable';
        }
    }
}]);