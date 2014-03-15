'use strict';


/* Controllers */

malControlApp.controller('StatsController', function($scope, $http) {
    function updateStats($scope, $http) {
        console.log($scope.from_date);
        //Top Countries
        $http.get('api/topcountriesphishers').success(function(data) {
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            $scope.topcountriesphishers = data;
        });
        $http.get('api/topcountriesmalware').success(function(data) {
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            $scope.topcountriesmalware = data;
        });
        $http.get('api/topcountriesthreats').success(function(data) {
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            $scope.topcountriesthreats = data;
        });
        //Totals
        $http.get('api/totalmalware').success(function(data) {
            $scope.totalmalware = data.totals;
        });
        $http.get('api/totalphishers').success(function(data) {
            $scope.totalphishers = data.totals;
        });
        $http.get('api/totalthreats').success(function(data) {
            $scope.totalthreats = data.totals;
        });
        //Interval Analysis
        var from = moment($scope.from_date).format('YYYY/MM/DD');
        var to = moment($scope.to_date).format('YYYY/MM/DD');
        var interval = from + '/' + to;
        $http.get('api/malware/' + interval).success(function(data) {
            $scope.malwares = data;
        });
        $http.get('api/threats/' + interval).success(function(data) {
            $scope.threats = data;
        });
        $http.get('api/malwareh').success(function(data) {
            console.log('pre:',data.status,data.current, data.max, data);
            data.current = parseFloat(data.current);
            data['max'] = parseFloat(data['max']);
            console.log('post:',data,data['max'],parseFloat(data.max));
            $scope.malwaresh = data;
        });
        $http.get('api/threatsh').success(function(data) {
            data.current = parseFloat(data.current);
            data.max = parseFloat(data.max);
            $scope.threatsh = data;
        });
    }

    $scope.update = function() {
        updateStats($scope, $http);
    };
    $scope.totalmalware = 0;
    $scope.totalphishers = 0;
    $scope.totalthreats = 0;
    $scope.malwaresh = { current: 0, max: 0 };
    $scope.threatsh = { current: 0, max: 0 };
    $scope.phishersh = { current: 0, max: 0 };
    $scope.malwares = [];
    $scope.threats = [];
    $scope.from_date = moment('2014-01-01', 'YYYY-MM-DD').toDate();
    $scope.to_date = moment('2014-03-01', 'YYYY-MM-DD').toDate();

    updateStats($scope, $http);
    setInterval(function() {
        updateStats($scope, $http);
    }, 5000);

});