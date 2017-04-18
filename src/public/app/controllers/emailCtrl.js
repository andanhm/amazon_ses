'use strict';
SesApp.directive('fileUpload', function() {
    return {
        scope: true, //create a new scope
        link: function(scope, el, attrs) {
            el.bind('change', function(event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0; i < files.length; i++) {
                    //emit event upward
                    scope.$emit('fileSelected', { file: files[i] });
                }
            });
        }
    }
});

SesApp.controller('EmailController', ['$scope', 'EmailService', 'Title', function($scope, EmailService, Title) {
    Title.set('Send Email');
    $scope.files = [];
    $scope.$on('fileSelected', function(event, args) {
        $scope.$apply(function() {
            $scope.files.push(args.file);
        });
    });
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
            EmailService.sendEmail(data, $scope.files).then(
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