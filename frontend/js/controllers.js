'use strict';


/* Controllers */

malControlApp.controller('StatsController', function($scope, $http) {
    var map = L.mapbox.map('map', 'lzoffoli.hmddapfj')
            .setView([0,0], 2)
    ;
    var markersGroup = new L.MarkerClusterGroup();
    map.addLayer(markersGroup);
    $scope.markers = {};
    
    function updateStats($scope, $http) {
        //Top Countries
        $http.get('api/topcountriesphishers').success(function(data) {
            if( !$.isArray(data) ) return;
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            if( $scope.updatePie('phishersCountries', 'Phishers', $scope.topcountriesphishers, data, 22) ){
                $scope.topcountriesphishers = data;
            }
        });
        $http.get('api/topcountriesmalware').success(function(data) {
            if( !$.isArray(data) ) return;
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            if( $scope.updatePie('malwaresCountries', 'Malwares', $scope.topcountriesmalware, data, 22) ){
                $scope.topcountriesmalware = data;
            }
        });
        $http.get('api/topcountriesthreats').success(function(data) {
            if( !$.isArray(data) ) return;
            data.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            if( $scope.updatePie('threatsCountries', 'Threats', $scope.topcountriesthreats, data, 22) ){
                $scope.topcountriesthreats = data;
            }
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
            for( var d in data){
                if( data[d].ll &&  data[d].ll !== '0,0' ){
                    var latLng = data[d].ll.split(',');
                    var marker = L.marker( new L.LatLng(latLng[0],latLng[1]) );
                    if( !( data[d].ll in $scope.markers ) ){
                        var title = data[d].ll + '  --  ' + data[d].ip + '  --  ' + data[d].url;
                        var marker = L.marker(latLng, {
                            icon: L.icon({
                                iconUrl: '/images/malware.png',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10],
                                popupAnchor: [0, -21]
                            }),
                            title: title
                        });
                        var popupContent = $('<div>')
                                .append('<h1>'+title+'</h1>');
                        for( var p in data[d] ){
                            var prop;
                            if( (data[d][p]+'').match(/^http/) ){
                                prop = '<a href="'+data[d][p]+'">click here</a>';
                            } 
                            popupContent.append('<label style="font-size: 6px;"><span style="font-weight: bold;">'+p+'</span> '+prop+'</label><br>');
                        }
                        marker.bindPopup(popupContent.html());
                        $scope.markers[data[d].ll] = marker;
                        markersGroup.addLayer(marker);
                    }
                }
            }
        });
        $http.get('api/threats/' + interval).success(function(data) {
            for( var d in data){
                if( data[d].ll &&  data[d].ll !== '0,0' ){
                    var latLng = data[d].ll.split(',');
                    var marker = L.marker( new L.LatLng(latLng[0],latLng[1]) );
                    if( !( data[d].ll in $scope.markers ) ){
                        var title = data[d].ll + '  --  ' + data[d].ip + '  --  ' + data[d].url;
                        var marker = L.marker(latLng, {
                            icon: L.icon({
                                iconUrl: '/images/threat.png',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10],
                                popupAnchor: [0, -21]
                            }),
                            title: title
                        });
                        var popupContent = '<div class="malpopup">';
                        popupContent += '<h1 style="font-weight: bold;">'+data[d].ip+' - '+data[d].city+', '+data[d].country+'</h1>';
                        popupContent += '<p>Malicious url: <a target="_blank" href="'+(data[d].url.match(/^http/) ? '':'http://') + data[d].url+'">click here</a></p>';
                        var report = data[d].linkToReport ? '<a target="_blank" href="'+(data[d].linkToReport.match(/^http/) ? '':'http://') + data[d].linkToReport+'">See report</a>' :'';
                        popupContent += '<p>Source: '+data[d].scraped_source+' '+report+'</p>';
                        if( data[d].ids ){
                            popupContent += '<p>Type: '+data[d].ids+'</p>';
                        }
                        popupContent += '<p>Time: '+data[d].timestamp+'</p>';
                        popupContent += '<p>Location: '+data[d].ll+'</p>';
                        popupContent += '</div>';
                        marker.bindPopup(popupContent);
                        $scope.markers[data[d].ll] = marker;
                        markersGroup.addLayer(marker);
                    }
                }
            }
        });
        $http.get('api/malwareh').success(function(data) {
            data.current = parseFloat(data.current);
            data.max = parseFloat(data.max);
            $scope.malwaresh = data;
        });
        $http.get('api/threatsh').success(function(data) {
            data.current = parseFloat(data.current);
            data.max = parseFloat(data.max);
            $scope.threatsh = data;
        });
        
    }

    $scope.changeFromDate = function(){
        if( $scope.from_date > $scope.to_date ){
            $scope.to_date = moment($scope.from_date).add(1,'day').toDate();
        }
        $scope.markers = {};
        markersGroup.clearLayers();
        updateStats($scope,$http);
    };
    $scope.changeToDate = function(){
        if( $scope.from_date > $scope.to_date ){
            $scope.from_date = moment($scope.to_date).subtract(1,'day').toDate();
        }
        $scope.markers = {};
        markersGroup.clearLayers();
        updateStats($scope,$http);
    };
    $scope.updatePie = function( id, title, oldData, newData, max ){
        max = max || 50;
        var orig = JSON.stringify(oldData,['country','score']);
        var newd = JSON.stringify(newData,['country','score']);
        if( newd === orig ){
            return false;
        }
        var vdata = [];
        var MAX = max;
        for( var d in newData){
            if( vdata.length < MAX ){
                vdata.push([ newData[d].country, newData[d].score ]);
            }else{
                if( vdata[MAX] ){
                    vdata[MAX][1] += newData[d].score;
                }else{
                    vdata[MAX] = [ 'Others', newData[d].score ];
                }
            }
        }
        $('#'+id).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: ' + this.y + ' ('+ this.percentage.toFixed(2) +' %)';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Total',
                data: vdata
            }]
        });
        return true;
    };
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
    $scope.to_date = moment().toDate();
    $scope.from_date = moment().subtract(1,'day').toDate();

    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });
    updateStats($scope, $http);
    setInterval(function() {
        updateStats($scope, $http);
    }, 5000);

});