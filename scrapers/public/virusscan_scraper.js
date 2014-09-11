var scraper = require('./../scraper');
var _savemalware = require('../../commons/save_malw');
var _local_cache = {};

//URLQUERY
exports.goScraper = function(){
  try{
    var page = 'http://www.virscan.org/reportlist/';
    var uris = [];
    for (var i = 1; i <= 10; i++) {
      uris.push(page + i);
    }
    return scraper(uris, function(err, jQuery) {
        if (err) {
          console.log("[-] Error happening in malwr: " + err);
          return true; // Don't stop
        }
        console.log("[+] Querying viruscan");

        return jQuery('#lastScanTable tr').each(function() {
          var content = jQuery(this);
          if (undefined !== content && null !== content){

            var name = content.find("td").eq(0).text();
            console.log("[+] <viruscan> Name found: " + name.split('(')[0]);

            var linkToReport = undefined;
            var link = content.find('a[href*="virscan.org"]').attr('href');
            if(undefined !== link && null !== link){
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
            if (/Found nothing/.test(cs)) {
              compositscore = '0 / 100';
            } else {
              var res = /Found (.+) \((\d+)%\)/.exec(cs);
              if (res === null) {
                console.error('Percentage not found in:', cs);
                compositscore = '0 / 100';
              } else {
                compositscore = res[2] + ' / 100';
              }
            }
            console.log("[+] <viruscan> Score: " + compositscore);
            return _savemalware.saveMalwareToDB(linkToReport, new Date, null, compositscore, "virscan", null, null, name);
          }//not nulls
        });//foreach element in the table of the scraped source
  });//scraper
  }catch(ex){return console.log("[-] Error in scraping virscan: " + ex);}
};//goScraper
