var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _savemalware = require('../commons/save_malw');
var _baseLink = "https://malwr.com";
var _base_searching_url = "https://malwr.com/analysis/?page=";

var _local_cache = {};

//URLQUERY
exports.goScraper = function(){

  _savemalware.firstTimeRunningMalware(function(firstime){

    var uris = new Array();
    if (firstime){
      for(var i=1; i<500; i++){
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
        if (err) {console.log("[-] Error happening in malwr: " + err);}
        console.log("[+] Querying malwr");

        return jQuery('tr').each(function() {
          var content = jQuery(this);
          if (undefined != content && null != content){

            var linkToReport = undefined;
            var link = content.find('a[href*="analysis"]').attr('href');
            if(undefined != link && null != link){
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
            console.log("[+] <malwr.net> Time Stamp found: " + timestamp);

            var md5 = content.find("td").eq(1).text();
            console.log("[+] <malwr.net> MD5 found: " + md5);

            var compositscore = content.find("td").eq(4).text();
            console.log("[+] <malwr.net> Composit Score found: " + compositscore);

            var name = content.find("td").eq(2).text();
            console.log("[+] <malwr.net> Name found: " + name);

            var dsc = content.find("td").eq(3).text();
            console.log("[+] <malwr.net> Desc found: " + dsc);

            //IMPORTANT: GEOLOCALIZATION HAS BEEN MOVED FOR PERFORMANCE PURPOSES
            //if (undefined != linkToReport && null != linkToReport){
            ////scraping the report to extract locations
            //scraper(linkToReport, function(err, jQ){
            ////if (err) {console.log("[-] Error happening in malwr: " + err);}
            //var hosts = new Array();
            //var country = new Array();
            //var city = new Array();
            //var region = new Array();
            //var ll = new Array();
            //try{
            //jQ('#hosts tr').each(function(){
            //var c = jQ(this);
            //console.log("[+] ("+ c.length + ") Doing the hard job...." + linkToReport );
            //if (undefined != c && null != c){
            //var ip = c.find('td').eq(0).text().trim();
            //if (ip != "IP" && ip != "" && null != ip && undefined != ip){
            //console.log("[+]ip: "+ ip);
            //hosts.push(ip);
            //var geo = geoip.lookup(ip);
            //console.log("[+] Geolocalized: " + ip );
            //if (undefined != geo && null != geo){
            //country.push(geo['country']);
            //region.push(geo['region']);
            //city.push(geo['city']);
            //ll.push(geo['ll']);
            //}//if geo exists
            //}//if ip exists
            //}//if context exists
            ////console.log("!!!!!!!!!!!"+linkToReport + " " +  timestamp + " " + md5 + " " + name + " " + hosts + " " + city);
            //return _savemalware.saveMalwareToDB(linkToReport, timestamp, ip.toString(), compositscore, "malwr.com", country.toString(), city.toString(), region.toString(), ll.toString(), dsc, md5, name);
            //});//eachhosts
            //} catch(e) {
            //console.log("[-] No Hosts Found, saving what we have found");
            return _savemalware.saveMalwareToDB(linkToReport, timestamp, null, compositscore, "malwr.com", null, null, null, null, dsc, md5, name); 
            //}
            //});//scraping a little of reports
            //}
          }//not nulls
        });//foreach element in the table of the scraped source
      },{'reqPerSec': 0.2});//scraper
    } catch(ex){console.log("[-] Error in scraping malrw " + ex);}
  });//firsttime
}//goScraper

