var scraper = require('./scraper');
var geoip = require('geoip-lite');  
var _savethreats = require('../commons/save_threats');
var _linkToReport = "http://urlquery.net/";

//URLQUERY
exports.goScraper = function(){
  try{
    return scraper('http://urlquery.net/', function(err, jQuery) {
        if (err) {console.log("[-] Error happening in urlquery:" + err);}
        console.log("[+] Querying urlquery");
        try{
          jQuery('.test tr').each(function() {
            var content = jQuery(this);

            var linkToReport = _linkToReport +  jQuery(this).find('a[href*="report"]').attr("href");
            console.log("[+] Link To Report found: " + linkToReport);

            var timestamp  = content.find("td").eq(0).text();
            console.log("[+] <urlquery.net> Time Stamp found: " + timestamp);

            var compositscore = content.find("td").eq(1).text();
            console.log("[+] <urlquery.net> Composit Score found: " + compositscore);

            var url = content.find("td").eq(2).text();
            console.log("[+] <urlquery.net> Link found: " + url);

            var ip = content.find("td").eq(3).text();
            console.log("[+] <urlquery.net> IP found: " + ip);

            var geo = geoip.lookup(ip);
            if (undefined !== geo && null !== geo){
              var country = geo['country'];
              var region = geo['region'];
              var city = geo['city'];
              var ll = geo['ll'];
              var desc = geo['desc'];
            }
            if (undefined !== url && null !== url){
              return _savethreats.saveThreatToDB(undefined, url, timestamp, ip, compositscore, "urlquery", country, city, region, ll, desc);
            }
          });//foreach element in the table of the scraped source
        }catch(e){return console.log("[-] Errors in urlquery");}
  });//scraper
  }catch(ex){console.log("[-] Error in scraping urlquery: " + ex);}
};//goScraper
