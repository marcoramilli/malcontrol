//-----------------------------------------------------------------
var mongoose = require('mongoose');
var scraper = require('../scrapers/scraper');
var geoip = require('geoip-lite');  
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 
var _malwareLocations = require('../schemas/malware_locations');
var malwareLocationsMODEL = _malwareLocations.mongoose.model('malwareLocations', _malwareLocations.MalwareLocations);
//-----------------------------------------------------------------

var globalStatusGEO = 0;
var step = 2;

//external
exports.firstTimeRunningMalware = function(source, callback){
  return malwareMODEL.count({scraped_source: source}, function(err, count){
    if (count > 0) {callback(false);}
    else {callback(true);}
  });//count
};//firsttimerunningmalware


//External
exports.saveMalwareToDB = function(plinkToReport, ptimestamp, pip, pcompositscore, pscraped_source, pdesc, pmd5, pname){
  //no malware into DB 
  var alerts;
  var ids;
  if (undefined !== pcompositscore && null !== pcompositscore){
    var p =pcompositscore.split("/");
    if (p.length > 0){
      alerts = p[0];
      ids = p[1];
    }
  }
  var tm = new malwareMODEL({
      timestamp: ptimestamp,
      ip: pip,
      linkToReport: plinkToReport,
      alerts: alerts, 
      ids: ids, 
      scraped_source: pscraped_source,
      desc: pdesc,
      md5: pmd5,
      name: pname,
      modified: new Date() 
  });//tm
  if ( null === plinkToReport){
    tm._id = new _malware.mongoose.Types.ObjectId; 
    tm.save(function(err){ if(err) console.log("[-] Error in saving on DB: " + err);});

  } else{ 
    return malwareMODEL.findOneAndUpdate({linkToReport: plinkToReport},tm.toObject(),{upsert: true},function(err){
      if(err) console.log("[-] Error in saving on DB: " + err);
    });
  }
};//savemalwaretodb


//getting reports from malwr.com and dig into it to find ips
//TODO: move it into scraper folder
_malware_report_scraper_malwr = function(malw){
  var linkToReport = malw.linkToReport;  
  var timestamp = new Date();
  console.log("[+] Trying to geolocalize: " + malw.name);
  if (undefined !== linkToReport && null !== linkToReport){

    return scraper(linkToReport, function(err, jQ){
      console.log("[+] Scraping: " + linkToReport);
      if (err) {return console.log("[-] Error happening in malwr: " + err);}
      try{
        return jQ('#hosts tr td').each(function(){
          console.log("[+] Analysing internal page");
          var c = jQ(this);
          if (undefined !== c && null !== c){
            var ip = c.text();
            if (ip !== "IP" && ip !== "" && null !== ip && undefined !== ip){
              console.log("[+] Geolocalization is happening on: "+ ip);
              var geo = geoip.lookup(ip);
              if (undefined !== geo && null !== geo){
                _saveGeoLoc(malw._id, timestamp, ip.toString(), malw.scraped_source, geo['country'], geo['city'], geo['region'], geo['ll']);
              }//if geo exists
            }//if ip exists
          }//if context exists
        });//eachhosts
      } catch(e) {
        console.log("ERRROR: " + e);
        console.log("[-] No Hosts Found, saving what we've got");
      }
    });//scraping a little of reports
  }
};//_malware_report_scraper_malwr

//in this specific website just get ip and geolocalize it!
_malware_report_scraper_malwaredomains = function(malw){
  var ip = malw.ip;
  if (ip !== "IP" && ip !== "" && null !== ip && undefined !== ip){
    console.log("[+] Geolocalization is happening on: "+ ip);
    var geo = geoip.lookup(ip);
    if (undefined !== geo && null !== geo){
      _saveGeoLoc(malw._id, timestamp, ip.toString(), malw.scraped_source, geo['country'], geo['city'], geo['region'], geo['ll']);
    }//if geo exists
  }//if ip exists
};//_malware_report_scraper_malwaredomains

//external
exports.geoLocMalwr = function(){
  return malwareMODEL.find({geoLoc: false},{},{skip: globalStatusGEO, limit: step},function(err, malwrs){
    if(err){return console.log("[-] Error in saving geolocalization on Malware");}
    if (malwrs.length > 0){
      globalStatusGEO += step;

      malwrs.forEach(function(malw){
        if (malw.scraped_source === "malwr.com"){
           _malware_report_scraper_malwr(malw); 
        }
        if (malw.scraped_source === "malwaredomainlist.com"){
          _malware_report_scraper_malwaredomains(malw);
        }
      });//forEachMalware
    }//malwrs.length
  });//malwareFind 
};//geolocmalwr

//internal
_saveGeoLoc = function(pmalid, ptimestamp, pip, pscraped_source, pcountry, pcity, pregion, pll){
  console.log("[+] Saving GeoLocalization");
  var ml = new malwareLocationsMODEL({
    _id : new _malwareLocations.mongoose.Types.ObjectId,
      malid: pmalid,
      timestamp: ptimestamp,
      ip: pip,
      scraped_source: pscraped_source,
      country: pcountry,
      city:pcity,
      region: pregion,
      ll: pll,
      modified: new Date() 
  });//tm
  return ml.save(function(err){
    if(err) console.log("[-] Error in saving on DB: " + err);
    return malwareMODEL.findOneAndUpdate({_id: pmalid},{geoLoc: true},{upsert: false},function(err){
      if(err) console.log("[-] Error in malwareMODEL update");
    });
  });
};//_SaveGeoLoc
