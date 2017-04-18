SesApp.controller('StatisticsController', ['$scope', 'EmailService', 'Title', function($scope, EmailService, Title) {
    Title.set('Dashboard Statistics');
    $scope.emails = [];
    $scope.showPopover = false;

    EmailService.getEmails().then(
        function(response) {
            if (response.error) {
                $scope.emails = 'Unable to send email. Try again later!!!';
                $scope.alert = 'alert alert-danger alert-dismissable';
            } else {
                $scope.emails = response.data;
            }
        },
        function() {
            $scope.alertMessage = 'Sorry for the inconvenience. we are fixing a temporary glitch. Please re-try in mint';
            $scope.alert = 'alert alert-warning alert-dismissable';
        });
}]);