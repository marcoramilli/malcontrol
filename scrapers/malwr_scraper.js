var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _savemalware = require('../commons/save_malw');
var _baseLink = "https://malwr.com";


//TODO Adding report links
//URLQUERY
exports.goScraper = function(){
  scraper('https://malwr.com/analysis/', function(err, jQuery) {
      if (err) {console.log("[-] Error happening in malwr: " + err);}
      console.log("[+] Querying malwr");

      jQuery('tr').each(function() {
        var content = jQuery(this);
        if (undefined != content && null != content){

          var linkToReport = undefined;
          var link = jQuery(this).find('a[href*="analysis"]').attr('href');
          if(undefined != link && null != link){
            linkToReport = _baseLink + link; 
            console.log("[+] Link To Report found: " + linkToReport);
          }

          var timestamp  = content.find("td").eq(0).text();
          console.log("[+] <malwr.net> Time Stamp found: " + timestamp);

          var md5 = content.find("td").eq(1).text();
          console.log("[+] <malwr.net> MD5 found: " + md5);

          var compositscore = content.find("td").eq(4).text();
          console.log("[+] <malwr.net> Composit Score found: " + compositscore);

          var name = content.find("td").eq(2).text();
          console.log("[+] <malwr.net> Name found: " + name);

          var dsc = content.find("td").eq(3).text();
          console.log("[+] <malwr.net> Desc found: " + dsc);

          if (undefined != linkToReport && null != linkToReport){
            scraper(linkToReport, function(err, jQ){
              if (err) {console.log("[-] Error happening in malwr: " + err);}
              var hosts = new Array();
              var country = new Array();
              var city = new Array();
              var region = new Array();
              var ll = new Array();

              try{
                var counter = 0;
                var jq = jQ('#hosts tr');
                jq.each(function(){
                  console.log("[+] Doing the hard job....");
                  counter++;
                  var c = jQ(this);
                  if (undefined != c && null != c)
                  var ip = c.find('td').eq(0).text();
                if (null != ip && undefined != ip){
                  host.push(ip);
                  var geo = geoip.lookup(ip);
                  if (undefined != geo && null != geo){
                    country.push(geo['country']);
                    region.push(geo['region']);
                    city.push(geo['city']);
                    ll.push(geo['ll']);
                  }
                }
                if (counter >= jq.length){
                  console.log(linkToReport + " " +  timestamp + " " + md5 + " " + name + " " + hosts + " " + city);
                  _savemalware.saveMalwareToDB(linkToReport, timestamp, ip.toString(), compositscore, "malwr.com", country.toString(), city.toString(), region.toString(), ll.toString(), dsc, md5);
                }

                });//eachhosts
              } catch(e) {
                console.log("[-] No Hosts Found, saving what we have found");
                _savemalware.saveMalwareToDB(linkToReport, timestamp, null, compositscore, "malwr.com", null, null, null, null, dsc, md5); 
              }
            });//scraping a little of reports
          }
        }//not nulls
      });//foreach element in the table of the scraped source
});//scraper
}//goScraper
