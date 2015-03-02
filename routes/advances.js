var moment = require('moment');
var _threat = require('../schemas/threat');
var threatMODEL = _threat.mongoose.model('threat', _threat.Threat); 
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 
var _system = require('../schemas/system');
var systemMODEL = _system.mongoose.model('system', _system.System);

var events = require('events');
var eventEmitter = new events.EventEmitter();


/**
 * @api {get} /api/threatsresourcestats returns the number of threats  per scraped sources 
 * @apiName Number of Threats per scraped
 * @apiVersion 0.1.0 
 * @apiGroup advanceStats
 *
 * @apiSuccess {JSON} Array representing json object 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *    {
 *     "source": "urlquery",
 *     "count": 64
 *     },
 *     {
 *      "name": "phishtank",
 *      "count": 4000
 *     }
 *  ]
 *
 * @apiError InternalError The Servers had some serious problems contact mramilli@gmail.com
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETStatesScrapedThreats = function(req, res){
  return threatMODEL.distinct("scraped_source", function(err, sources){
    if (err) {
      res.send("{\"status\": \"error\", \"message\": \"internal error\"}");
      return console.log("[-] Error in threatMODEL.count " + err);
    } 
    if (sources.length === 0){
      res.send("{\"status\": \"warning\", \"message\": \"no sources so far\"}");
      return console.log("[-] No sources so far");
    } else if (sources.length > 0 && undefined !== sources && null !== sources){
      var stats = [];
      sources.forEach(function(sc){
        threatMODEL.count({"scraped_source": sc}, function(err, number){
          stats.push({source:sc, count:number});
          if(stats.length >= sources.length){
            return res.send(stats);
          }
        });//malwarefind
      });//syncro loop
    }//undefined control
    else {
      return res.send("{\"status\": \"error\", \"message\": \"empty db\"}");
    }
  });//countr
};//GETNUMBERMALWAREPERHOUR

/**
 * @api {get} /api/malwaresourcestats returns the number of malwares per scraped sources 
 * @apiName Number of Malware per scraped
 * @apiVersion 0.1.0 
 * @apiGroup advanceStats
 *
 * @apiSuccess {JSON} Array representing json object 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *    {
 *     "source": "malwr.com",
 *     "count": 64
 *     },
 *     {
 *      "name": "malwr.com",
 *      "count": 4000
 *     }
 *  ]
 *
 * @apiError InternalError The Servers had some serious problems contact mramilli@gmail.com
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETStatesScrapedMalware = function(req, res){
  return malwareMODEL.distinct("scraped_source", function(err, sources){
    if (err) {
      res.send("{\"status\": \"error\", \"message\": \"internal error\"}");
      return console.log("[-] Error in malwareMODEL.count " + err);
    } 
    if (sources.length === 0){
      res.send("{\"status\": \"warning\", \"message\": \"no sources so far\"}");
      return console.log("[-] No sources so far");
    } else if (sources.length > 0 && undefined !== sources && null !== sources){
      var stats = [];
      sources.forEach(function(sc){
        malwareMODEL.count({"scraped_source": sc}, function(err, number){
          stats.push({source:sc, count:number});
          if(stats.length >= sources.length){
            return res.send(stats);
          }
        });//malwarefind
      });//syncro loop
    }//undefined control
    else {
      return res.send("{\"status\": \"error\", \"message\": \"empty db\"}");
    }
  });//countr
};//GETNUMBERMALWAREPERHOUR

/**
 * @api {get} /api/malwareh returns the number of malwares per hour 
 * @apiName Malware per H
 * @apiVersion 0.1.0 
 * @apiGroup advanceStats
 *
 * @apiSuccess {JSON} String representing json object 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "status": "ok", 
 *      "current":33.75, 
 *      "max":35.291666666666664
 *     }
 *
 * @apiError InternalError The Servers had some serious problems contact mramilli@gmail.com
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETNumberMalwarePerHour = function(req, res){
  var now = moment();//.format("YYYY-MM-DD HH:mm Z");
  var oneHbefore = moment().subtract('days', 1);

  return malwareMODEL.count({modified: {$gte: oneHbefore.format("YYYY-MM-DD HH:mm Z"), $lt: now.format("YYYY-MM-DD HH:mm Z")}}, function(err, mh){
    if (err) {
      res.send("{\"status\": \"error\", \"message\": \"internal error\"}");
      return console.log("[-] Error in malwareMODEL.count " + err);}
    if (undefined !== mh && null !== mh){
      var curr = mh/24;
      return systemMODEL.findOne({}, function(err, obj){
        if(err) {return res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");}
        if (undefined !== obj && null !== obj){
          var max = obj.maxNumberofMalwareh;
          if (max >= curr) {
            return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\",\"max\":\""+max+"\"}");
          } else {
            obj.maxNumberofMalwareh = curr;
            obj.save();
            return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\",\"max\":\""+curr+"\"}");
          }  
        }//obj undefined control
        else {
          var s = new systemMODEL({
            _id: new _system.mongoose.Types.ObjectId,
            maxNumberofMalwareh: curr,
            modified: new Date()
          });//mmodel 
          s.save();
          return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\",\"max\":\""+curr+"\"}");
        }
      });//systemMODEL
    }//undefined control
    else {
      return res.send("{\"status\": \"error\", \"message\": \"empty db\"}");
    }
  });//countr
};//GETNUMBERMALWAREPERHOUR

/**
 * @api {get} /api/threatsh returns the number of threats per hour 
 * @apiName Threats per H
 * @apiVersion 0.1.0 
 * @apiGroup advanceStats
 *
 * @apiSuccess {JSON} String representing json object 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "status": "ok", 
 *      "current":33.75, 
 *      "max":35.291666666666664
 *     }
 *
 * @apiError InternalError The Servers had some serious problems contact mramilli@gmail.com
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Internal Error"
 *     }
 */
exports.GETNumberThraeatsPerHour = function(req, res){
  var now = moment();//.format("YYYY-MM-DD HH:mm Z");
  var oneHbefore = moment().subtract('days', 1);

  return threatMODEL.count({modified: {$gte: oneHbefore.format("YYYY-MM-DD HH:mm Z"), $lt: now.format("YYYY-MM-DD HH:mm Z")}}, function(err, th){
    if (err) {
      res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");
      return console.log("[-] Error in threatMODEL.count " + err);}
    if (undefined !== th && null !== th){
      var curr = th/24;
      return systemMODEL.findOne({}, function(err, obj){
        if(err) {return res.send("{\"status\": \"error\", \"message\": \"Internal Error\"}");}
        if (undefined !== obj && null !== obj){
          var max = obj.maxNumberofThreatsh;
          if (max >= curr) {
            return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\",\"max\":\""+max+"\"}");
          } else {
            obj.maxNumberofThreatsh = curr;
            obj.save();
            return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\",\"max\":\""+curr+"\"}");
          }  
        }//obj undefined control
        else {
          var s = new systemMODEL({
            _id: new _system.mongoose.Types.ObjectId,
            maxNumberofThreatsh: curr,
            modified: new Date()
          });//mmodel 
          s.save();
          return res.send("{\"status\": \"ok\", \"current\":\"" + curr +"\", \"max\":\""+curr+"\"}");
        }
      });//systemMODEL
    }//undefined control
    else {
      return res.send("{\"status\": \"error\", \"message\": \"empty db\"}");
    }
  });//countr
};//GETNUMBERTHREATSPERHOUR

