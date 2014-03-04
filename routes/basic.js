var moment = require('moment');
var _threat = require('../schemas/threat');
var threatMODEL = _threat.mongoose.model('threat', _threat.Threat); 
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 

//TODO: give threats geolocalized from date
//TODO: give malware geolocalized from data

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
 * @apiError InternalError The Servers had some serious problems, contact marco.ramilli@iprel.it 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETtopCountriesPhishers = function(req, res){
  var country = new Array();
  var scorearray = new Array();
  return threatMODEL.find({"scraped_source":"phishtank"}, {}, {}, function (err, ips) {
    if (err){
      console.log("[-] Error in topCountries phishtank: " +err);
      return res.send("{status: error, message: Internal Error}");
    }
    if (ips.length == 0){
      return res.send(" ");
    }
    for ( var c1=0; c1 < ips.length; c1++){
      if (country.indexOf(ips[c1].country) == -1){
        //country not in array
        country.push(ips[c1].country);
      }	
    }

    var sync = 0;
    country.forEach(function(c){
      return threatMODEL.count({"scraped_source":"phishtank", "country": c}, function(err,number){
        scorearray.push({country: c, score:  number});
        sync ++;
        if (sync == country.length ){
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
 * @apiError InternalError The Servers had some serious problems, contact marco.ramilli@iprel.it 
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
      return res.send("{status: error, message: Internal Error}");
    }
    if (ips.length == 0){
      return res.send(" ");
    }
    for ( var c1=0; c1 < ips.length; c1++){
      if (country.indexOf(ips[c1].country) == -1){
        //country not in array
        country.push(ips[c1].country);
      }	
    }

    var sync = 0;
    country.forEach(function(c){
      return threatMODEL.count({"country": c}, function(err,number){
        scorearray.push({country: c, score:  number});
        sync ++;
        if (sync == country.length ){
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
 * @apiError InternalError The Servers had some serious problems, contact marco.ramilli@iprel.it 
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
  return malwareMODEL.find({}, {}, {}, function (err, ips) {
    if (err){
      console.log("[-] Error in topCountries malware: " +err);
      return res.send("{status: error, message: Internal Error}");
    }
    if (ips.length == 0){
      return res.send(" ");
    }
    for ( var c1=0; c1 < ips.length; c1++){
      if (country.indexOf(ips[c1].country) == -1){
        //country not in array
        country.push(ips[c1].country);
      }	
    }

    var sync = 0;
    country.forEach(function(c){
      return malwareMODEL.count({"country": c}, function(err,number){
        scorearray.push({country: c, score:  number});
        sync ++;
        if (sync == country.length ){
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
 * @apiError InternalError The Servers had some serious problems, contact marco.ramilli@iprel.it 
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
      return res.send('{ "status" : "error", "message":"Internal Error" }');
    }
    return res.send('{"totals" :"' + number.toString() + '"}');
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
 * @apiError InternalError The Servers had some serious problems, contact marco.ramilli@iprel.it 
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
      return res.send('{ "status" : "error", "message":"Internal Error" }');
    }
    return res.send('{"totals" :"' + number.toString() + '"}');
  });//count
};//totalThreats
