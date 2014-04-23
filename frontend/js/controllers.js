'use strict';


/* Controllers */

malControlApp.controller('StatsController', function($scope, $http) {
    var map = L.mapbox.map('map', 'lzoffoli.hmddapfj',{
        tileLayer: {
            continuousWorld: false,
            noWrap: true
        }
    })
    .setView([20,0],3)
    ;
    var markersGroup = new L.MarkerClusterGroup();
    map.addLayer(markersGroup);
    $scope.markers = {};
    
    function updateStats($scope, $http) {
        //Top Countries
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
        var chart = $scope['gauge_'+id];
        var level1 = max/3;
        var level2 = max*2/3;
        var level3 = max;
        chart.yAxis[0].update({
                min: 0,
                max: max,
                plotBands: [{
                    from: 0,
                    to: level1,
                    color: '#55BF3B' // green
                }, {
                    from: level1,
                    to: level2,
                    color: '#DDDF0D' // yellow
                }, {
                    from: level2,
                    to: level3,
                    color: '#DF5353' // red
                }]  
         });
         chart.series[0].points[0].update(current);
    };
    $scope.setupGauge = function(id, title){
        var $gauge = $(id);
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
                 max: 10,

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
                 title: {
                     text: 'unit/h'
                 },
                 plotBands: [{
                     from: 0,
                     to: 3,
                     color: '#55BF3B' // green
                 }, {
                     from: 3,
                     to: 7,
                     color: '#DDDF0D' // yellow
                 }, {
                     from: 7,
                     to: 10,
                     color: '#DF5353' // red
                 }]        
             },

             series: [{
                 name: 'Detected',
                 data: [0],
                 tooltip: {
                     valueSuffix: ' unit/h'
                 }
             }],
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
    $scope.setupGauge('#malwares-gauge','Malwares per hour');
    $scope.setupGauge('#threats-gauge','Threats per hour');
    $scope.updatePie('malwaresCountries','Malwares Top Countries',[],[''],100);
    $scope.updatePie('threatsCountries','Threats Top Countries',[],[''],100);
    updateStats($scope, $http);
    setInterval(function() {
        updateStats($scope, $http);
    }, 5000);

    $('input[type="date"]').datepicker({
        dateFormat: 'yy-mm-dd'
    });
});

var input =
   {
      keyDown : function(event)
      {
         window.addEventListener('keydown', event, false);
      },
      keyUp : function(event)
      {
         window.addEventListener('keyup', event, false);
      },
      mouse: {
        isMove: function(event)
        {
           game.addEventListener('mousemove', event, false);
        },
        isClick: function(event)
        {
           game.addEventListener('click', event, false);
        }
      }
      
   };