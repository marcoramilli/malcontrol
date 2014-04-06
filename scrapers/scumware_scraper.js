var scraper = require('./scraper');
var geoip = require('geoip-lite');  
var _savethreats = require('../commons/save_threats');
var _base_report_url = "http://www.scumware.org/report/";


//TODO Adding report links
//URLQUERY
exports.goScraper = function(){
  return scraper('http://www.scumware.org', function(err, jQuery) {
      if (err) {console.log("[-] Error happening in scumware: " + err);}
      console.log("[+] Querying scumware");

      console.log(jQuery);
      return jQuery('tr').each(function() {
        var content = jQuery(this);
        console.log(content);

        //var timestamp  = content.find("td").eq(0).text();
        //console.log("[+] <scumware> Time Stamp found: " + timestamp);

        //var compositscore = "1/1"; 

        //var url = content.find("td").eq(1).text();
        //console.log("[+] <scumware> Link found: " + url);

        //var ip = content.find("td").eq(2).text();
        //console.log("[+] <scumware> IP found: " + ip);

        //var linkToReport = _base_report_url + ip + ".html" 
        //console.log("[+] <scumware> link to Report found: " + linkToReport);

      //var desc = content.find("td").eq(4).text();
      //console.log("[+] <scumware> Desc found: " + desc);

      //var geo = geoip.lookup(ip);
      //if (undefined !== geo && null !== geo){
        //var country = geo['country'];
        //var region = geo['region'];
        //var city = geo['city'];
        //var ll = geo['ll'];
        //var desc = geo['desc'];
      //}
      //if (undefined !== url && null !== url){
        //_savethreats.saveThreatToDB(linkToReport, url, timestamp, ip, compositscore, "scumware", country, city, region, ll, desc);
      //}
      });//foreach element in the table of the scraped source
});//scraper
};//goScraper
