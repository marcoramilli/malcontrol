'use strict';


/* Services */

var malcontrolServices = angular.module('malcontrolServices', ['ngResource']);

malcontrolServices.factory('Phone', 
[
    '$resource',
    function($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {method: 'GET', params: {phoneId: 'phones'}, isArray: true}
        });
    }
]);