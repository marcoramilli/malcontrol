'use strict';


/* Controllers */

malControlApp.controller('StatsController', [
    '$scope', '$http', 'TopCountry',
    function($scope, $http, TopCountry) {
        var map = L.mapbox.map('map', 'lzoffoli.hmddapfj',{
            center: [20,0],
            zoom: 3,
            tileLayer: {
                continuousWorld: false,
                noWrap: true
            }
        });
        var markersGroup = new L.MarkerClusterGroup();
        map.addLayer(markersGroup);
        $scope.markers = {};
        
        function updateStats($scope, $http) {
            //Top Countries
            $http.get('api/topcountriesmalware').success(function(data) {
                if( !$.isArray(data) ) return;
                var vdata = $scope.parseTopCountriesData($scope.topcountriesmalware, data, 22);
                if( vdata !== false ){
                    $scope.topcountriesmalware = data;
                    $scope.updatePie('malwares-countries', 'Malwares', vdata );
                }
            });
            $http.get('api/topcountriesthreats').success(function(data) {
                if( !$.isArray(data) ) return;
                var vdata = $scope.parseTopCountriesData($scope.topcountriesthreats, data, 22);
                if( vdata !== false ){
                    $scope.topcountriesthreats = data;
                    $scope.updatePie('threats-countries', 'Threats', vdata );
                }
            });
            //Sources stats
            $http.get('api/malwaresourcestats').success(function(data) {
                if( !$.isArray(data) ) return;
                var vdata = $scope.parseSourcesStatsData($scope.malwaressources, data);
                if( vdata !== false ){
                    $scope.malwaressources = data;
                    $scope.updatePie('malwares-sources-stats', 'Malwares Sources', vdata );
                }
            });
            $http.get('api/threatsourcestats').success(function(data) {
                if( !$.isArray(data) ) return;
                var vdata = $scope.parseSourcesStatsData($scope.threatssources, data);
                if( vdata !== false ){
                    $scope.threatssources = data;
                    $scope.updatePie('threats-sources-stats', 'Threats Sources', vdata );
                }
            });
            //Totals
            $http.get('api/totalmalware').success(function(data) {
                $scope.totalmalware = data.totals;
            });
            $http.get('api/totalthreats').success(function(data) {
                $scope.totalthreats = data.totals;
            });
            //Interval Analysis
            var from = moment($scope.from_date).format('YYYY/MM/DD');
            var to = moment($scope.to_date).format('YYYY/MM/DD');
            var interval = from + '/' + to;
            $http.get('api/malware/' + interval).success(function(data) {
                $scope.parseData(data);
            });
            $http.get('api/threats/' + interval).success(function(data) {
                $scope.parseData(data);
            });
            //Current
            $http.get('api/numberofmalware/'+interval).success(function(data) {
                $scope.currentmalware = data.numberofmalware;
            });
            $http.get('api/numberofthreats/'+interval).success(function(data) {
                $scope.currentthreats = data.numberofthreats;
            });
            $http.get('api/malwareh').success(function(data) {
                data.current = parseFloat(data.current);
                data.max = parseFloat(data.max);
                if( $scope.malwaresh.current !== data.current
                        && $scope.malwaresh.max !== data.max){
                    $scope.malwaresh = data;
                    $scope.updateGauge('malwares-gauge',data.current,data.max);
                }
            });
            $http.get('api/threatsh').success(function(data) {
                data.current = parseFloat(data.current);
                data.max = parseFloat(data.max);
                if( $scope.threatsh.current !== data.current
                        && $scope.threatsh.max !== data.max){
                    $scope.threatsh = data;
                    $scope.updateGauge('threats-gauge',data.current,data.max);
                }
            });

        }
        $scope.parseData = function(data){
            for( var d in data){
                if( data[d].ll &&  data[d].ll !== '0,0' ){
                    var latLng = data[d].ll.split(',');
                    var marker = L.marker( new L.LatLng(latLng[0],latLng[1]) );
                    if( !( data[d].ll in $scope.markers ) ){
                        var marker = $scope.createMarker(data[d]);
                        $scope.markers[data[d].ll] = marker;
                        markersGroup.addLayer(marker);
                    }
                }
            }
        };
        $scope.createMarker = function(data){
            var title = data.ll + '  --  ' + data.ip + '  --  ' + (data.url||data.desc);
            var latLng = data.ll.split(',');
            var marker = L.marker(latLng, {
                icon: L.icon({
                    iconUrl: $scope.getMarkerIcon(data.scraped_source),
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -32]
                }),
                title: title
            });
            var popupContent = '<div class="malpopup">';
            popupContent += '<h1 style="font-weight: bold;">'+data.ip+' - '+data.city+', '+data.country+'</h1>';
            if( data.url ){
                popupContent += '<p>Malicious url: <a target="_blank" href="'+(data.url.match(/^http/) ? '':'http://') + data.url+'">click here</a></p>';
            }
            if( data.desc ){
                popupContent += '<p>File: '+data.name+'<br>';
                popupContent += 'MD5: '+data.md5+'<br>';
                popupContent += ''+data.desc+'</p>';
            }
            var report = data.linkToReport ? '<a target="_blank" href="'+(data.linkToReport.match(/^http/) ? '':'http://') + data.linkToReport+'">See report</a>' :'';
            popupContent += '<p>Source: '+data.scraped_source+' '+report+'</p>';
            if( data.ids && isNaN(data.ids) ){
                popupContent += '<p>Type: '+data.ids+'</p>';
            }
            popupContent += '<p>Time: '+data.timestamp+'</p>';
            popupContent += '<p>Location: '+data.ll+'</p>';
            popupContent += '</div>';
            marker.bindPopup(popupContent);
            return marker;
        };
        $scope.getMarkerIcon = function(source){
            switch( source ){
                case 'malwr.com':
                    return '/images/sources/malwr.png';
                case 'phishtank':
                case 'scumware':
                case 'urlquery':
                case 'virusscan':
                case 'webinspector':
                    return '/images/sources/'+source+'.png';
                default:
                    return '/images/threat.png';
            }
        };
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
        $scope.parseTopCountriesData = function( oldData, newData, max ){
            var MAX = max || 50;
            newData.sort(function(a, b) {
                if (a.score === b.score) {
                    return a.country > b.country;
                }
                return b.score - a.score;
            });
            var orig = JSON.stringify(oldData,['country','score']);
            var newd = JSON.stringify(newData,['country','score']);
            if( newd === orig ){
                return false;
            }
            var vdata = [];
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
            return vdata;
        };
        $scope.parseSourcesStatsData = function( oldData, newData, max ){
            var MAX = max || 50;
            newData.sort(function(a, b) {
                if (a.count === b.count) {
                    return a.source > b.source;
                }
                return b.count - a.count;
            });
            var orig = JSON.stringify(oldData,['source','count']);
            var newd = JSON.stringify(newData,['source','count']);
            if( newd === orig ){
                return false;
            }
            var vdata = [];
            for( var d in newData){
                if( vdata.length < MAX ){
                    vdata.push([ newData[d].source, newData[d].count ]);
                }else{
                    if( vdata[MAX] ){
                        vdata[MAX][1] += newData[d].count;
                    }else{
                        vdata[MAX] = [ 'Others', newData[d].count ];
                    }
                }
            }
            return vdata;
        };
        $scope.updatePie = function( id, title, vdata ){
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
                        dataLabels: { enabled: false }
    //                    dataLabels: {
    //                        enabled: true,
    //                        color: '#000000',
    //                        connectorColor: '#000000',
    //                        formatter: function() {
    //                            return '<b>'+ this.point.name +'</b>: ' + this.y + ' ('+ this.percentage.toFixed(2) +' %)';
    //                        }
    //                    }
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
        $scope.updateGauge = function(id,current,max){
            max = max<10 ? 10 : max;
            current = parseFloat(current.toFixed(2));
            var chart = $scope['gauge_'+id];
            var level1 = max/3;
            var level2 = max*2/3;
            var level3 = max;
            var gpb = {
                        id: 'green-plot-band',
                        from: 0,
                        to: level1,
                        color: '#55BF3B' // green
                    };
            var ypb = {
                        id: 'yellow-plot-band',
                        from: level1,
                        to: level2,
                        color: '#DDDF0D' // yellow
                    };
            var rpb = {
                        id: 'red-plot-band',
                        from: level2,
                        to: level3,
                        color: '#DF5353' // red
                    };
            chart.yAxis[0].update({
                    min: 0,
                    max: max
             });
             chart.yAxis[0].removePlotBand('green-plot-band');
             chart.yAxis[0].addPlotBand(gpb);
             chart.yAxis[0].removePlotBand('yellow-plot-band');
             chart.yAxis[0].addPlotBand(ypb);
             chart.yAxis[0].removePlotBand('red-plot-band');
             chart.yAxis[0].addPlotBand(rpb);

             chart.series[0].points[0].update(current);
        };
        $scope.setupGauge = function(id, title){
            var $gauge = $('#'+id);
            $gauge.css({
                width: $gauge.outerWidth(),
                height: $gauge.outerHeight()
            });
            $gauge.highcharts({
                 chart: {
                     type: 'gauge',
                     plotBackgroundColor: null,
                     plotBackgroundImage: null,
                     plotBorderWidth: 0,
                     plotShadow: false
                 },

                 title: {
                     text: title
                 },

                 pane: {
                     startAngle: -150,
                     endAngle: 150,
                     background: [{
                         backgroundColor: {
                             linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                             stops: [
                                 [0, '#FFF'],
                                 [1, '#333']
                             ]
                         },
                         borderWidth: 0,
                         outerRadius: '109%'
                     }, {
                         backgroundColor: {
                             linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                             stops: [
                                 [0, '#333'],
                                 [1, '#FFF']
                             ]
                         },
                         borderWidth: 1,
                         outerRadius: '107%'
                     }, {
                         // default background
                     }, {
                         backgroundColor: '#DDD',
                         borderWidth: 0,
                         outerRadius: '105%',
                         innerRadius: '103%'
                     }]
                 },

                 // the value axis
                 yAxis: {
                     min: 0,
                     max: 1,

                     minorTickInterval: 'auto',
                     minorTickWidth: 1,
                     minorTickLength: 10,
                     minorTickPosition: 'inside',
                     minorTickColor: '#666',

                     tickPixelInterval: 30,
                     tickWidth: 2,
                     tickPosition: 'inside',
                     tickLength: 10,
                     tickColor: '#666',
                     labels: {
                         step: 2,
                         rotation: 'auto'
                     },
                     plotBands: []        
                 },

                 series: [{
                     name: 'Detected',
                     data: [0],
                     tooltip: {
                         valueSuffix: ' unit/h'
                     }
                 }]
             },
             function (chart) {
                  if (!chart.renderer.forExport) {
                      $scope['gauge_'+id] = chart;
                  }
             });
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
//        $scope.updatePie('malwares-countries','Malwares Top Countries',[]);
        $scope.updatePie('threats-countries','Threats Top Countries',[]);
        $scope.setupGauge('malwares-gauge','Malwares per hour');
        $scope.setupGauge('threats-gauge','Threats per hour');
        $scope.updatePie('malwares-sources-stats','Malwares Sources',[]);
        $scope.updatePie('threats-sources-stats','Threats Sources',[]);
        updateStats($scope, $http);
        setInterval(function() {
            updateStats($scope, $http);
        }, 5000);

        $('input[type="date"]').datepicker({
            dateFormat: 'yy-mm-dd'
        });
    }
]);