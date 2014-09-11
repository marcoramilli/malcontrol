var scraper = require('./../scraper');
var _savemalware = require('../../commons/save_malw');
var _baseLink = "https://malwr.com";
var _base_searching_url = "https://malwr.com/analysis/?page=";

var _local_cache = {};

// NOTE: malwr has closed submissions.
//URLQUERY
exports.goScraper = function(){

  _savemalware.firstTimeRunningMalware("malwr.com",function(firstime){

    var uris = [];
    if (firstime){
      for(var i=1; i<5000; i++){
        uris[i-1] = _base_searching_url + i;
      }
      console.log("[+] First time you are scraping malwr.com");
      console.log("[+] Building DB =========================================");
      console.log("[+] Will query: " + uris.length *50 + " This will get a lot of resources and time !");
      console.log("[+] Building DB =========================================");
    } else {
      console.log("[+] Not the first time you are scraping malwr.com!");
      uris[0] = _base_searching_url + "1";
    }
    try{
      return scraper(uris, function(err, jQuery) {
        if (err) {return console.log("[-] Error happening in malwr: " + err);}
        console.log("[+] Querying malwr");

        return jQuery('tr').each(function() {
          var content = jQuery(this);
          if (undefined !== content && null !== content){

            var linkToReport = undefined;
            var link = content.find('a[href*="analysis"]').attr('href');
            if(undefined !== link && null !== link){
              linkToReport = _baseLink + link; 
              console.log("[+] Link To Report found: " + linkToReport);
              if (_local_cache[link] ){
                console.log("[-] Already Analyed !");
                return;
              } else {
                _local_cache[link] = true;
              }
            }

            var timestamp  = content.find("td").eq(0).text();

            var rs = /\s*([a-z]+)\D*(\d{1,2})\D*(\d{4})\D*(\d+)(:\d+)?\s*([ap].*m)?/i.exec(timestamp);
            if (rs !== null) {
              try {
                var dp = rs[2] + ' ' + rs[1] + ' ' + rs[3] + ' ' + rs[4];
                if (rs[5] !== undefined) {
                  dp += rs[5];
                } else {
                  dp += ':00';
                }
                if (rs[6] !== undefined) {
                  if (rs[6][0] === 'a' || rs[6][0] === 'A')
                    dp += ' AM UTC';
                  else
                    dp += ' PM UTC';
                } else {
                  dp += ' AM UTC';
                }
                timestamp = new Date(dp).toISOString();
              } catch (e) {
                console.error("[+] <malwr.net> Cannot parse timestamp: " + timestamp);
              }
            }
            console.log("[+] <malwr.net> Time Stamp found: " + timestamp);

            var md5 = content.find("td").eq(1).text();
            console.log("[+] <malwr.net> MD5 found: " + md5);

            var compositscore = content.find("td").eq(4).text();
            console.log("[+] <malwr.net> Composit Score found: " + compositscore);

            var name = content.find("td").eq(2).text();
            console.log("[+] <malwr.net> Name found: " + name);

            var dsc = content.find("td").eq(3).text();
            console.log("[+] <malwr.net> Desc found: " + dsc);

            return _savemalware.saveMalwareToDB(linkToReport, timestamp, null, compositscore, "malwr.com", dsc, md5, name); 
          }//not nulls
        });//foreach element in the table of the scraped source
      },{'reqPerSec': 0.2});//scraper
    } catch(ex){return console.log("[-] Error in scraping malrw " + ex);}
  });//firsttime
};//goScraper

