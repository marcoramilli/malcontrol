var scraper = require('./../scraper');
var geoip = require('geoip-lite');
var _savethreats = require('../../commons/save_threats');
var dns = require('dns');
var basic_url_report = "http://app.webinspector.com";

exports.goScraper = function() {
  console.log("[+] Scraping WebInspector!");
  var baseUrl = 'http://app.webinspector.com/recent_detections?page=';
  var uris = [];
  for (var i = 1; i < 3; i++) {
    uris.push(baseUrl + i);
  }
  var timeLimit = null;
  _savethreats.firstTimeRunning("webinspector", function(res) {
    if (!res) {
      return _savethreats.Threat.findOne()
        .where('scraped_source').equals("webinspector")
        .sort('-timestamp')
        .exec()
        .then(function(last) {
          if (last === null) { // Mhmm..
            return scrape(uris, null);
          } else {
            try {
              var d = new Date(last.timestamp);
              return scrape(uris, d);
            } catch (e) {
              console.error('Cannot parse:', last.timestamp);
              return scrape(uris, null);
            }
          }
        })
        .then(null, function(err) {
          console.error('Error in DB:', err.stack);
          return scrape(uris, null);
        });
    } else {
      return scrape(uris, null);
    }
  });
}

function scrape(uris, timeLimit) {
  try {

    var done = false;
    if (timeLimit !== null)
      console.log('[+] Scraping webinspector with timelimit:', timeLimit.toISOString());
    return scraper(uris, function(err, jQuery) {

      if (done)
        return false;

      if (err) {
        console.log("[-] Error happening in webinspector: " + err);
        return true; // Keep going!
      }

      return jQuery('.sites-list tr').each(function() {
        /*
      <td><span>http://deadstarsco.com</span></td>
      <td>Suspicious</td>
      <td>2014-09-09 08:05:53 UTC</td>
      <td>
        <a href="/public/reports/show_website?result=3&amp;site=http%3A%2F%2Fdeadstarsco.com">Suspicious pages were found on this site.</a>
        <br>
      </td>
      */
        var content = jQuery(this);
        var tds = content.find("td");
        if (tds.length === 0) // Header
          return true;

        var linkToReport = null;
        tds.find('a').each(function() {
            var idx = this.href.indexOf('/public/reports');
            if (idx === -1)
              return true; // Continue

            if (this.href.indexOf('http://') === 0) {
              if (idx > 0) {
                linkToReport = this.href;
                return false;
              }
            } else if (this.href.indexOf('file://') === 0) {
              if (idx === 'file://'.length) {
                linkToReport = basic_url_report + this.href.slice(idx);
                return false;
              }
            }
            return true;
        });
        if (linkToReport === null) {
          console.error('[-] <webinspector> Link not found: !', tds.html());
        } else {
          linkToReport = linkToReport;
          console.log("[+] <webinspector> Link To Report found: " + linkToReport);
        }

        //needs timestamp conversion
        var timestamp = content.find("td").eq(2).text();
        try {
          var date = new Date(timestamp);
          if (timeLimit !== null && timeLimit > date) {
            done = true;
            return false;
          }
          timestamp = date.toISOString();
          console.log("[+] <webinspector> Time Stamp found: " + timestamp);
        } catch (e) {
          console.error("[-] <webinspector> Can't convert timestamp:", timestamp);
        }

        // Now only suspicious or high risk!
        var level = content.find("td").eq(1).text();
        var compositscore = "0 / 2";
        if (/Suspicious/i.test(level) !== -1) {
          compositscore = "1 / 2";
        } else if (/High (Risk)?/.text(level)) {
          compositscore = "2 / 2";
        } else {
          console.error("[-] <webinspector> New level:", level);
        }
        console.log("[+] <webinspector> Composite Score found: " + compositscore);

        var url = content.find("td").eq(0).text();
        console.log("[+] <webinspector> Link found: " + url);

        var domain = url.split("http://")[1];
        dns.resolve4(domain, function(err, ip) {
          console.log("[+] <webinspector> IP found: " + ip);
          if (undefined !== ip && null !== ip) {
            var geo = geoip.lookup(ip.toString());
            if (undefined !== geo && null !== geo) {
              var country = geo['country'];
              var region = geo['region'];
              var city = geo['city'];
              var ll = geo['ll'];
              var desc = geo['desc'];
              return _savethreats.saveThreatToDB(linkToReport, url, timestamp, ip, compositscore, "webinspector", country, city, region, ll, desc);
            }
          }
        }); //dnsresolve
      }); //foreach element in the table of the scraped source
      return !done;
    }); //scraper
  } catch (ex) {
    return console.log("[-] Error in scraping webinspector: " + ex);
  }
}; //goScraper
