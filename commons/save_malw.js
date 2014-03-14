//-----------------------------------------------------------------
var mongoose = require('mongoose');
var scraper = require('scraper');
var geoip = require('geoip-lite');  
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 
//-----------------------------------------------------------------

var globalStatusGEO = 0;
var step = 2;

//external
exports.firstTimeRunningMalware = function(callback){
  return malwareMODEL.count({scraped_source: "malwr.com"}, function(err, count){
    if (count >0) {callback(false);}
    else {callback(true);}
  });//count
};//firsttimerunningmalware

//external
exports.saveMalwareToDB  = function(plinkToReport, ptimestamp, pip, pcompositscore, pscraped_source, pcountry, pcity, pregion, pll, pdesc, pmd5, pname){
  return _saveMalwareToDB(plinkToReport, ptimestamp, pip, pcompositscore, pscraped_source, pcountry, pcity, pregion, pll, pdesc, pmd5, pname);
};

//internal
_saveMalwareToDB = function(plinkToReport, ptimestamp, pip, pcompositscore, pscraped_source, pcountry, pcity, pregion, pll, pdesc, pmd5, pname){
  //no malware into DB 
  var alerts = undefined;
  var ids = undefined;

  if (undefined != pcompositscore && null != pcompositscore){
    var p =pcompositscore.split("/");
    if (p.length > 0){
      alerts = p[0];
      ids = p[1];
    }
  }
  var tm = new malwareMODEL({
    //_id: new _malware.mongoose.Types.ObjectId,
    timestamp: ptimestamp,
      ip: pip,
      linkToReport: plinkToReport,
      alerts: alerts, 
      ids: ids, 
      scraped_source: pscraped_source,
      country: pcountry,
      city: pcity,
      region: pregion,
      ll: pll,
      desc: pdesc,
      md5: pmd5,
      name: pname,
      geoLoc: null == pcountry ? false : true,
      modified: new Date() 
  });//tm
  return malwareMODEL.findOneAndUpdate({linkToReport: plinkToReport},tm.toObject(),{upsert: true},function(err){
    if(err) console.log("[-] Error in saving on DB: " + err);
  });
};//savemalwaretodb

//external
exports.geoLocMalwr = function(){
  return malwareMODEL.find({geoLoc: false, scraped_source: "malwr.com"},{},{skip: globalStatusGEO, limit: step},function(err, malwrs){
    if(err){return console.log("[-] Error in saving geolocalization on Malware");}
    if (malwrs.length > 0){
      globalStatusGEO += step;
      malwrs.forEach(function(malw){
        var linkToReport = malw.linkToReport;  
        var timestamp = malw.timestamp;
        var ip = malw.ip;
        var alerts = malw.alerts;
        var ids = malw.ids;
        var compositscore = alerts + "/" + ids;
        var scraped_source = malw.scraped_source;
        var md5 = malw.md5;
        var dsc = malw.dsc;
        var name = malw.name;
        console.log("[+] Trying to geolocalize: " + name);
        if (undefined != linkToReport && null != linkToReport){
          //scraping the report to extract locations
          scraper(linkToReport, function(err, jQ){
            console.log("[+] Scraping: " + linkToReport);
            if (err) {return console.log("[-] Error happening in malwr: " + err);}
            var hosts = new Array();
            var country = new Array();
            var city = new Array();
            var region = new Array();
            var ll = new Array();
            try{
              jQ('#hosts tr td').each(function(){
                var c = jQ(this);
                if (undefined != c && null != c){
                  var ip = c.text();
                  if (ip != "IP" && ip != "" && null != ip && undefined != ip){
                    console.log("[+] Geolocalization is happening on: "+ ip);
                    hosts.push(ip);
                    var geo = geoip.lookup(ip);
                    if (undefined != geo && null != geo){
                      country.push(geo['country']);
                      region.push(geo['region']);
                      city.push(geo['city']);
                      ll.push(geo['ll']);
                    }//if geo exists
                  }//if ip exists
                }//if context exists
                _saveMalwareToDB(linkToReport, timestamp, ip.toString(), compositscore, "malwr.com", country.toString(), city.toString(), region.toString(), ll.toString(), dsc, md5, name);
                console.log("[+] Saving referral: " + linkToReport);
              });//eachhosts
            } catch(e) {
              //TODO: the geolocalization process follows on time. fix the geoLoc flag to stop it
              console.log("ERRROR: " + e);
              console.log("[-] No Hosts Found, saving what we've got");
            }
          });//scraping a little of reports
        }
      });//forEachMalware
    }//malwrs.length
  });//malwareFind 
};//geolocmalwr
