var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _savethreats = require('../commons/save_threats');
var dns = require('dns');
var basic_url_report = "http://app.webinspector.com/public/reports/show_website?site=";

//TODO Adding report links
exports.goScraper = function(){
  console.log("[+] Scraping WebInspector!"); 
  try {
    return scraper('http://app.webinspector.com/recent_detections', function(err, jQuery) {
        if (err) {console.log("[-] Error happening in webinspector: " + err);}

        return jQuery('.sites-list tr').each(function() {
          var content = jQuery(this);
          var linkToReport = basic_url_report +  content.find("td").eq(0).text();
          console.log("[+] <webinspector> Link To Report found: " +  linkToReport);

          //needs timestamp conversion
          var timestamp  = content.find("td").eq(2).text();
          console.log("[+] <webinspector> Time Stamp found: " + timestamp);

          var compositscore = content.find("td").eq(1).text() + "/ 1"; 
          console.log("[+] <webinspector> Composite Score found: " + compositscore);

          var url = content.find("td").eq(0).text();
          console.log("[+] <webinspector> Link found: " + url);

          var domain = url.split("http://")[1];
          dns.resolve4(domain, function(err,ip){
            console.log("[+] <webinspector> IP found: " + ip);
            if (undefined !== ip && null !== ip){
              var geo = geoip.lookup(ip.toString());
              if (undefined !== geo && null !== geo){
                var country = geo['country'];
                var region = geo['region'];
                var city = geo['city'];
                var ll = geo['ll'];
                var desc = geo['desc'];
                return _savethreats.saveThreatToDB(linkToReport,url, timestamp, ip, compositscore, "webinspector", country, city, region, ll, desc);
              }
            }
          });//dnsresolve
        });//foreach element in the table of the scraped source
  });//scraper
  }catch(ex){console.log("[-] Error in scraping webinspector: " + ex);}
};//goScraper
