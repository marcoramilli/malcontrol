var _threat = require('../schemas/threat');
var threatMODEL = _threat.mongoose.model('threat', _threat.Threat); 
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 
var _malwareLocations = require('../schemas/malware_locations');
var malwareLocationsMODEL = _malwareLocations.mongoose.model('malwareLocations', _malwareLocations.MalwareLocations);
var _config = require('../conf/configs');

/**
 * @api {get} /api/getmaplic returns the license key for map
 * @apiName Maps 
 * @apiVersion 0.0.1
 * @apiGroup basicstats
 *
 * @apiSuccess {Number} License 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "license": "asda123-we-1658jkgjf5"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETMapLicKey = function(req, res){
  return res.json({license: _config.map.license});
};//GETMAPLICKEY

/**
 * @api {get} /api/numberofthreats returns the number of threats between specific dates
 * @apiName NumberOfThreat
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 *  @apiParam {String} fyear From Year
 *  @apiParam {String} fyear From Month 
 *  @apiParam {String} fyear From Day 
 *
 *  @apiParam {String} fyear To  Year
 *  @apiParam {String} fyear To Month 
 *  @apiParam {String} fyear To Day 
 *
 * @apiSuccess {Number} Number of Threats between Dates
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "numberofthreat": "20"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETNumberThreatsBetweenDates = function(req, res){
  var fyear = req.params.fyear;
  var fmonth = req.params.fmonth;
  var fday = req.params.fday;

  var tyear = req.params.tyear;
  var tmonth = req.params.tmonth;
  var tday = req.params.tday;

  if (fyear && fmonth && fday && tyear && tmonth && tday){
    return threatMODEL.count({modified: {$gte: new Date(fyear+','+fmonth+','+fday), $lt: new Date(tyear+','+tmonth+','+tday)}}, function(err, objs){
      if (err) {return console.log("[-] Error in GETNumberThreatsBetweenDates " + err);}  
      return res.send("{ \"numberofthreats\":\"" +  objs + "\"}");
    });//find
  } else {
    return res.send("{\"status\":\"error\", \"message\": \"missing parameters\"}");
  }
};//numberofthreats

/**
 * @api {get} /api/numberofmalware returns the number of malwares between specific dates
 * @apiName NumberOfMalware 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 *  @apiParam {String} fyear From Year
 *  @apiParam {String} fyear From Month 
 *  @apiParam {String} fyear From Day 
 *
 *  @apiParam {String} fyear To  Year
 *  @apiParam {String} fyear To Month 
 *  @apiParam {String} fyear To Day 
 *
 * @apiSuccess {Number} Number of Malware between Dates
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "numberofmalware": "20"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETNumberMalwareBetweenDates = function(req, res){
  var fyear = req.params.fyear;
  var fmonth = req.params.fmonth;
  var fday = req.params.fday;

  var tyear = req.params.tyear;
  var tmonth = req.params.tmonth;
  var tday = req.params.tday;

  if (fyear && fmonth && fday && tyear && tmonth && tday){
    return malwareMODEL.count({modified: {$gte: new Date(fyear+','+fmonth+','+fday), $lt: new Date(tyear+','+tmonth+','+tday)}}, function(err, objs){
      if (err) {return console.log("[-] Error in GETNumberMalwareBetweenDates " + err);}  
      return res.send("{ \"numberofmalware\":\"" +  objs + "\"}");
    });//find
  } else {
    return res.send("{\"status\": \"error\", \"message\":\"missing parameters\"}");
  }
};//numberofMalwarebetweendates

/**
 * @api {get} /api/topcountriesphishers Request to obtain the top countries phishers list 
 * @apiName TopCountries 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Country in top country 
 * @apiSuccess {Number} Number of threats 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "country": "EN",
 *       "score": "20"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
//exports.GETtopCountriesPhishers = function(req, res){
  //var country = new Array();
  //var scorearray = new Array();
  //return threatMODEL.find({"scraped_source":"phishtank"}, {}, {}, function (err, ips) {
    //if (err){
      //console.log("[-] Error in topCountries phishtank: " +err);
      //return res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");
    //}
    //if (ips.length === 0){
      //return res.send(" ");
    //}
    //for ( var c1=0; c1 < ips.length; c1++){
      //if (country.indexOf(ips[c1].country) === -1){
        ////country not in array
        //country.push(ips[c1].country);
      //}	
    //}

    //var sync = 0;
    //country.forEach(function(c){
      //return threatMODEL.count({"scraped_source":"phishtank", "country": c}, function(err,number){
        //scorearray.push({country: c, score:  number});
        //sync ++;
        //if (sync === country.length ){
          //var sortedscore = scorearray.sort(function(a,b){
            //return b.score - a.score;
          //});		
          //return res.send(sortedscore);
        //} 
      //});//count
    //});//for malware model
  //});//malwareMODEL getting everything
//};//GETTOPCOUNTRIESMALWARES


/**
 * @api {get} /api/topcountriesthreats Request to obtain the top countries threats list 
 * @apiName TopCountries 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Country in top country 
 * @apiSuccess {Number} Number of threats 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "country": "EN",
 *       "score": "20"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtopCountriesThreats = function(req, res){
  var country = new Array();
  var scorearray = new Array();
  return threatMODEL.find({}, {}, {}, function (err, ips) {
    if (err){
      console.log("[-] Error in topCountries threats: " +err);
      return res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");
    }
    if (ips.length === 0){
      return res.send(" ");
    }
    for ( var c1=0; c1 < ips.length; c1++){
      if (country.indexOf(ips[c1].country) === -1){
        //country not in array
        country.push(ips[c1].country);
      }	
    }

    var sync = 0;
    country.forEach(function(c){
      return threatMODEL.count({"country": c}, function(err,number){
        scorearray.push({country: c, score:  number});
        sync ++;
        if (sync === country.length ){
          var sortedscore = scorearray.sort(function(a,b){
            return b.score - a.score;
          });		
          return res.send(sortedscore);
        } 
      });//count
    });//for malware model
  });//malwareMODEL getting everything
};//GETTOPCOUNTRIESMALWARES

/**
 * @api {get} /api/topcountriesmalware Request to obtain the top malware countries list 
 * @apiName TopCountries 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Country in top country 
 * @apiSuccess {Number} Number of malware 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "country": "EN",
 *       "score": "20"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtopCountriesMalwares = function(req, res){
  var country = new Array();
  var scorearray = new Array();
  return malwareLocationsMODEL.find({}, {}, {}, function (err, ips) {
    if (err){
      console.log("[-] Error in topCountries malware: " +err);
      return res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");
    }
    if (ips.length === 0){
      return res.send(" ");
    }
    //fillingUP countries vector
    for ( var c1=0; c1 < ips.length; c1++){
      if (null !== ips[c1].country && undefined !== ips[c1].country){
        if (ips[c1].country.indexOf(',') == -1){
          //multiple countries
          var mc = ips[c1].country.split(',');
          for (var j=0; j < mc.length; j++){
            if (country.indexOf(mc[j]) === -1){
              //country not in array
              country.push(mc[j]);
            }	
          }
        } else if (country.indexOf(ips[c1].country) === -1){
          //country not in array
          country.push(ips[c1].country);
        }	
      }
    }
    var sync = 0;
    country.forEach(function(c){
      //TOFIX: multiple countries in malware
      return malwareLocationsMODEL.count({"country": c}, function(err,number){
        scorearray.push({country: c, score:  number});
        sync ++;
        if (sync === country.length ){
          var sortedscore = scorearray.sort(function(a,b){
            return b.score - a.score;
          });		
          return res.send(sortedscore);
        } 
      });//count
    });//for malware model
  });//malwareMODEL getting everything
};//GETTOPCOUNTRIESMALWARES

/**
 * @api {get} /api/totalthreats Request to obtain total number threats 
 * @apiName TotalThreats 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Totals 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "totals": "3000"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtotalThreats = function(req, res){
  return threatMODEL.count({}, function(err,number){
    if (err){ 
      console.log("Error in TotalThreats: " + err); 
      return res.send("{ \"status\" : \"error\", \"message\":\"Internal Error\" }");
    }
    return res.send("{\"totals\" :\"" + number.toString() + "\"}");
  });//count
};//totalThreats

/**
 * @api {get} /api/totalmalware Request to obtain total number of malwar
 * @apiName TotalMalware 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Totals 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "totals": "3000"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtotalMalware = function(req, res){
  return malwareMODEL.count({}, function(err,number){
    if (err){ 
      console.log("Error in TotalThreats: " + err); 
      return res.send("{ \"status\" : \"error\", \"message\":\"Internal Error\" }");
    }
    return res.send("{\"totals\" :\"" + number.toString() + "\"}");
  });//count
};//totalThreats

/**
 * @api {get} /api/totalphishers Request to obtain total number of phinshers 
 * @apiName TotalPhishers 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 * @apiSuccess {String} Totals 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "totals": "3000"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtotalPhishers = function(req, res){
  return threatMODEL.count({scraped_source: "phishtank"}, function(err,number){
    if (err){ 
      console.log("Error in Total Phishers: " + err); 
      return res.send("{ \"status\" : \"error\", \"message\":\"Internal Error\" }");
    }
    return res.send("{\"totals\" :\"" + number.toString() + "\"}");
  });//count
};//totalThreats

/**
 * @api {get} /api/threats returns the threats between specific dates
 * @apiName Threat
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 *  @apiParam {String} fyear From Year
 *  @apiParam {String} fyear From Month 
 *  @apiParam {String} fyear From Day 
 *
 *  @apiParam {String} fyear To  Year
 *  @apiParam {String} fyear To Month 
 *  @apiParam {String} fyear To Day 
 *
 * @apiSuccess [{JSON}] Json Objects
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     
 *
 *{
 * "_id": "531b3dbad375ff1e9a78f8b4",
 * "url": "http://richiesburgerurge.com/ForumRetrieve.aspx?ForumID=683&amp;TopicID=152063&amp;NoTe (...)",
 * "timestamp": "2014-03-08 16:55:16",
 * "ip": "54.236.189.64",
 * "alerts": "0 ",
 * "ids": " 0",
 * "scraped_source": "urlquery",
 * "country": "US",
 * "city": "Ashburn",
 * "region": "VA",
 * "ll": "39.0437,-77.4875",
 * "__v": 0,
 * "modified": "2014-03-08T15:56:42.941Z"
 *}
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETThreatsBetweenDates = function(req, res){
  var fyear = req.params.fyear;
  var fmonth = req.params.fmonth;
  var fday = req.params.fday;

  var tyear = req.params.tyear;
  var tmonth = req.params.tmonth;
  var tday = req.params.tday;

  if (fyear && fmonth && fday && tyear && tmonth && tday){
    return threatMODEL.find({modified: {$gte: new Date(fyear+','+fmonth+','+fday), $lt: new Date(tyear+','+tmonth+','+tday)}}, function(err, objs){
      if (err) {return console.log("[-] Error in GEThreatsBetweenDates " + err);}  
      return res.send( objs );
    });//find
  } else {
    return res.send("{\"status\": \"error\", \"message\": \"missing parameters\"}");
  }
};//Threat

/**
 * @api {get} /api/malware returns the malwares between specific dates
 * @apiName Malware 
 * @apiVersion 0.2.0
 * @apiGroup basicstats
 *
 *  @apiParam {String} fyear From Year
 *  @apiParam {String} fyear From Month 
 *  @apiParam {String} fyear From Day 
 *
 *  @apiParam {String} fyear To  Year
 *  @apiParam {String} fyear To Month 
 *  @apiParam {String} fyear To Day 
 *
 * @apiSuccess [{JSON}] JSon Array object representing Malware 
 *
 * @apiSuccessExample Success-Response:
 *
 *[
 *{
 *"_id": "533ec33ac7c0c23b6460a497",
 *"alerts": "37",
 *"city": "Denver",
 *"country": "US",
 *"desc": "PE32 executable (GUI) Intel 80386, for MS Windows",
 *"ids": "48",
 *"ip": "174.128.255.229",
 *"linkToReport": "https://malwr.com/analysis/M2EwODc5YTRlZjQ4NDZjYmI3YjQ4YWQxNTY0NTU5ZTE/",
 *"ll": "39.7525,-104.9995",
 *"md5": "8261b051340baf1d3077bd6bdf8b301e",
 *"name": "WMS.exe",
 *"scraped_source": "malwr.com",
 *"timestamp": "April 4, 2014, 8:36 a.m.",
 *"modified": "2014-04-04T14:57:13.748Z",
 *"geoLoc": true
 *},
 *{
 *"_id": "533ec33ac7c0c23b6460a497",
 *"alerts": "37",
 *"city": "Denver",
 *"country": "US",
 *"desc": "PE32 executable (GUI) Intel 80386, for MS Windows",
 *"ids": "48",
 *"ip": "174.128.255.229",
 *"linkToReport": "https://malwr.com/analysis/M2EwODc5YTRlZjQ4NDZjYmI3YjQ4YWQxNTY0NTU5ZTE/",
 *"ll": "39.7525,-104.9995",
 *"md5": "8261b051340baf1d3077bd6bdf8b301e",
 *"name": "WMS.exe",
 *"scraped_source": "malwr.com",
 *"timestamp": "April 4, 2014, 8:36 a.m.",
 *"modified": "2014-04-04T14:57:13.748Z",
 *"geoLoc": true
 *}
 *
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETMalwareBetweenDates = function(req, res){
  //TODO: restituire solo geolocalizzati e repplicare i malware se sono presenti piu geolocalizzazioni
  var fyear = req.params.fyear;
  var fmonth = req.params.fmonth;
  var fday = req.params.fday;

  var tyear = req.params.tyear;
  var tmonth = req.params.tmonth;
  var tday = req.params.tday;
  var response = [];

  if (fyear && fmonth && fday && tyear && tmonth && tday){
    return malwareMODEL.find({geoLoc: true, modified: {$gte: new Date(fyear+','+fmonth+','+fday), $lt: new Date(tyear+','+tmonth+','+tday)}}, function(err, objs){
      if (err) { console.log("[-] Error in GETMalwareBetweenDates " + err); res.send("{\"status\": \"error\", \"message\": \"GETMalwareBetweenDates\"}");}  
      if (objs.length === 0){console.log("no gelocated malware so far.. it takes planty of time"); res.send(response);}
      var mal_length = 0; 
      objs.forEach(function(obj){
        malwareLocationsMODEL.find({malid: obj._id}, function(err, locations){
          if (err) { console.log("[-] Error in GETMalwareBetweenDates " + err); res.send("{\"status\": \"error\", \"message\": \"GETMalwareBetweenDates\"}");}  
          if (locations.length === 0){
            response.push(obj);
            mal_length++;
            if (mal_length >= objs.length){
              return res.send(response);
            }
          } else {

            var locations_length = 0;
            locations.forEach(function(loc){
              var obj2           = obj.toObject();
              obj2.ll_id          = loc._id;
              obj2.ll             = loc.ll;
              obj2.ip             = loc.ip;
              obj2.city           = loc.city;
              obj2.scraped_source = loc.scraped_source;
              obj2.country        = loc.country; 

              //obj.save(function(err){
                //if (err){console.log("Error: " + err); res.send("{\"status\": \"error\", \"message\": \"missing parameters\"}");}
                response.push(obj2);
                locations_length++;
                if (locations_length >= locations.length){
                  mal_length++;
                }
                if (mal_length >= objs.length){
                  return res.send(response);
                }
              //});//objsave
            });//locations 
          }
        });//malwarelocation 
      });//foreach
      //return res.send( objs );
    });//find
  } else {
    return res.send("{\"status\": \"error\", \"message\": \"missing parameters\"}");
  }
};//Malwarebetweendates
