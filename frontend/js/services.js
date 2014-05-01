'use strict';


/* Services */

var malcontrolServices = angular.module('malcontrolServices', ['ngResource']);

malcontrolServices.factory('TopCountry', 
[
    '$resource',
    function($resource) {
        return $resource('/api/topcountries:category', {}, {
            queryMalwares: {method: 'GET', params: { category: 'malware' }, isArray: true},
            queryThreats: {method: 'GET', params: { category: 'threats' }, isArray: true}
        });
    }
]);
