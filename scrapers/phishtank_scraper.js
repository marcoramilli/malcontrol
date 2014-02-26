var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _savethreats = require('../commons/save_threats');
var dns = require('dns');
var basic_url_report = "http://www.phishtank.com/phish_detail.php?phish_id=";

//TODO Adding report links
exports.goScraper = function(){
  console.log("[+] Scraping PhishTank !"); 
  scraper('http://www.phishtank.com/phish_archive.php', function(err, jQuery) {
      if (err) {console.log("[-] Error happening in phishtank: " + err);}

      jQuery('.data tr').each(function() {
        var content = jQuery(this);
        var linkToReport = basic_url_report + content.find("td").eq(0).text();
        console.log("[+] Link To Report found: " + linkToReport);

        //needs timestamp conversion
        var timestamp  = content.find("td").eq(1).text().split("added on")[1];
        console.log("[+] <phishtank> Time Stamp found: " + timestamp);

        var compositscore = "1 / Phishing"; 

        var url = content.find("td").eq(1).text().split("added on")[0];
        console.log("[+] <phishtank> Link found: " + url);

        var domain = url.split("/")[2];
        dns.resolve4(domain, function(err,ip){
          console.log("[+] <phishtank> IP found: " + ip);
          if (undefined != ip && null != ip){
            var geo = geoip.lookup(ip.toString());
            if (undefined != geo && null != geo){
              var country = geo['country'];
              var region = geo['region'];
              var city = geo['city'];
              var ll = geo['ll'];
              var desc = geo['desc'];
              _savethreats.saveThreatToDB(linkToReport,url, timestamp, ip, compositscore, "phishtank", country, city, region, ll, desc);
            }
          }
        });//dnsresolve
      });//foreach element in the table of the scraped source
});//scraper

}//goScraper
