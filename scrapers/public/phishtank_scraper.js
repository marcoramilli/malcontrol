var scraper = require('./../scraper');
var geoip = require('geoip-lite');
var _savethreats = require('../../commons/save_threats');
var dns = require('dns');
var basic_url_report = "http://www.phishtank.com/phish_detail.php?phish_id=";

// http://www.phishtank.com/phish_detail.php?phish_id=2545750

exports.goScraper = function() {
  console.log("[+] Scraping PhishTank !");
  try {
    _savethreats.firstTimeRunning("phishtank", function(first) {
      if (!first) {
        // Assuming an incremental id
        return _savethreats.Threat.findOne()
          .where('scraped_source').equals("phishtank")
          .sort('-timestamp')
          .exec()
          .then(function(last) {
            var id = /\d+$/.exec(last.linkToReport);
            scrapeUntil(parseInt(id[0] || '-1'));
          });
      } else {
        scrapeUntil(-1);
      } // if first
    }); //first time running
  } catch (ex) {
    return console.log("[-] Error in scraping phishtank: " + ex);
  }
}; //goScraper

function scrapeUntil(lastid) {
  console.log('[+] Scraping until id', lastid);
  var uris = [];
  for (var i = 0; i < 5000; i++) { // 5000 pages is just a month...
    uris.push('http://www.phishtank.com/phish_archive.php?page=' + i);
  }
  var done = false;

  return scraper(uris, function(err, jQuery) {
    if (err) {
      console.log("[-] Error happening in phishtank: " + err);
      return true; // Keep going!
    }
    if (done)
      return false;

    jQuery('.data tr').each(function() {

      var content = jQuery(this);
      var tds = content.find("td");
      if (tds.length === 0) { // Header
        return true;
      }
      var linkId = parseInt(tds.eq(0).text());
      if (linkId < lastid) {
        done = true;
        return false;
      }
      var linkToReport = basic_url_report + linkId;
      console.log("[+] Link To Report found: " + linkToReport);

      //needs timestamp conversion
      var timestamp = tds.eq(1).text().split("added on")[1];

      try {
        var rs = /\s*(\w+) (\d+)\w+ (.*)/.exec(timestamp);
        var parse = rs[2] + ' ' + rs[1] + ' ' + rs[3] + ' UTC';
        timestamp = new Date(parse).toISOString();
      } catch (e) {
        console.error(e.stack);
      }

      console.log("[+] <phishtank> Time Stamp found: " + timestamp);

      var compositscore = "1 / Phishing";

      var url = tds.eq(1).text().split("added on")[0];
      console.log("[+] <phishtank> Link found: " + url);

      var domain = url.split("/")[2];
      dns.resolve4(domain, function(err, ip) {
        if (undefined !== ip && null !== ip) {
          console.log("[+] <phishtank> IP found: " + ip);
          var geo = geoip.lookup(ip.toString());
          if (undefined !== geo && null !== geo) {
            var country = geo['country'];
            var region = geo['region'];
            var city = geo['city'];
            var ll = geo['ll'];
            var desc = geo['desc'];
            return _savethreats.saveThreatToDB(linkToReport, url, timestamp, ip, compositscore, "phishtank", country, city, region, ll, desc);
          }
        }
      }); //dnsresolve
    }); //foreach element in the table of the scraped source
    return !done;
  }, {
    reqPerSec: 10
  }); //scraper
}
