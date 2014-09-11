var request = require('request');
var jsdom  = require('jsdom');
var requestDefaults = {
  'uri': null
    , 'headers': {
      'User-Agent': 'Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.4; en; rv:1.9.2.24) Gecko/20111114 Camino/2.1 (like Firefox/3.6.24)'
    }
};
var fetchDefaults = {
  'reqPerSec': 0
};
module.exports = function scrape(requestOptions, callback, fetchOptions) {
  if (!fetchOptions) {
    fetchOptions = {};
  }
  if (!callback) {
    callback = function(){};
  }
  Object.keys(fetchDefaults).forEach(function(key) {
    if (fetchOptions[key] === undefined) {
      fetchOptions[key] = fetchDefaults[key]
    }
  });

  var fetches = [];
  var queue = [];

  if (!Array.isArray(requestOptions)) {
    fetches.push(requestOptions);
  } else {
    fetches = requestOptions;
  }

  var stop = false;

  fetches.forEach(function(requestOptions, index) {
    if (typeof requestOptions === 'string') {
      requestOptions = {
        'uri': requestOptions
      }
    }
    Object.keys(requestDefaults).forEach(function(key) {
      requestOptions[key] = requestOptions[key] || requestDefaults[key];
    });
    if (!requestOptions['uri']) {
      stop |= (callback(new Error('You must supply an uri.'), null, null) === false);
      return;
    }
    queue.push(function() {
      request(requestOptions, function (err, response, body) {
        if (undefined != body && null != body){
          body = body.replace(/<(\/?)script/g, '<$1nobreakage');
        }
        setTimeout(runNextFetch, timeSpacing);
        if (err) {
          stop |= (callback(err, null, null) === false);
        }
        if (stop) {
          return;
        }
        if (response && response.statusCode == 200) {
          var window = jsdom.jsdom().createWindow();
          jsdom.jQueryify(window,'./deps/jquery-1.6.1.min.js', function(win, $) {
            // The html may not contain a body tag!
            var jb = $(body).find('body');
            if (jb.length > 0) {
              $('head').append($(body).find('head').html());
              $('body').append(jb.html());
            } else {
              $('body').append(body);
            }
            stop |= (callback(null, $, requestOptions) === false);
          });
        } else {
          stop |= (callback(new Error('Request to '+requestOptions['uri']+' ended with status code: '+(typeof response !== 'undefined' ? response.statusCode : 'unknown')),
                            null, null) === false);
        }
      });
    })
  });

  var concurrentConnections = !fetchOptions['reqPerSec'] ? queue.length : (Math.floor(fetchOptions['reqPerSec']) || 1);
  var timeSpacing = !fetchOptions['reqPerSec'] ? 0 : 1000/fetchOptions['reqPerSec'];

  for (var i=0; i < concurrentConnections; i++) {
    runNextFetch(i);
  };

  function runNextFetch(i) {
    if (stop) {
      return;
    }
    if (!i) {
      i = 0;
    }
    if (queue[i]) {
      queue[i]();
      queue.shift();
    }
  }
};
