'use strict';
SesApp.factory('Title', function($rootScope) {
    $rootScope.title = 'Amazon SES - Home Page';
    return {
        set: function(title) {
            $rootScope.title = title;
        }
    }
});