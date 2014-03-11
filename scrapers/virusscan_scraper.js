var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _savemalware = require('../commons/save_malw');

var _local_cache = {};

//TODO Adding report links
//URLQUERY
exports.goScraper = function(){
  return scraper('http://www.virscan.org/reportlist.php', function(err, jQuery) {
      if (err) {console.log("[-] Error happening in malwr: " + err);}
      console.log("[+] Querying viruscan");

      return jQuery('#lastScanTable tr').each(function() {
        var content = jQuery(this);
        if (undefined != content && null != content){

          var name = content.find("td").eq(0).text();
          console.log("[+] <viruscan> Name found: " + name.split('(')[0]);

          var linkToReport = undefined;
          var link = content.find('a[href*="virscan.org"]').attr('href');
          if(undefined != link && null != link){
            linkToReport = link; 
            console.log("[+] Link To Report found: " + linkToReport);
            if (_local_cache[link] ){
              console.log("[-] Already Analyed !");
              return;
            } else {
              _local_cache[link] = true;
            }
          }
          var cs = content.find("td").eq(1).text();
          var compositscore;
          if ("Found nothing" != cs.trim()){
            if (cs.indexOf("(") != -1){
              var c1 = cs.split("(")[1];
              if (c1.indexOf(")") != -1){
                var c2 = c1.split(")")[0];
                compositscore = c2 + "/ 42"; 
              }
            }
          } else {

            compositscore = "0 / 42";
          }
          console.log("[+] <viruscan> Score: " + compositscore);
          return _savemalware.saveMalwareToDB(linkToReport, new Date, null, compositscore, "virscan", null, null, null, null, null, null, name);
        }//not nulls
      });//foreach element in the table of the scraped source
});//scraper
}//goScraper
