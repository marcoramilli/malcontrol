'use strict';


/* Services */

var malcontrolServices = angular.module('malcontrolServices', ['ngResource']);

malcontrolServices.factory('TopCountry',
        [
            '$resource',
            function($resource) {
                return $resource('/api/topcountries:category', {}, {
                    queryMalwares: {method: 'GET', params: {category: 'malware'}, isArray: true},
                    queryThreats: {method: 'GET', params: {category: 'threats'}, isArray: true}
                });
            }
        ]);

malcontrolServices.factory('HighchartsHelper',
        [
            function() {
                return {
                    getDefaultGaugeOptions: function(title) {
                        return {
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
                                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                                            stops: [
                                                [0, '#FFF'],
                                                [1, '#333']
                                            ]
                                        },
                                        borderWidth: 0,
                                        outerRadius: '109%'
                                    }, {
                                        backgroundColor: {
                                            linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
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
                        };
                    },
                    getDefaultPieOptions: function(title, vdata) {
                        return {
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
                                    dataLabels: {enabled: false}
                                }
                            },
                            series: [{
                                    type: 'pie',
                                    name: 'Total',
                                    data: vdata
                                }]
                        };
                    }
                };
            }
        ]);