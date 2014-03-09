var moment = require('moment');
var _threat = require('../schemas/threat');
var threatMODEL = _threat.mongoose.model('threat', _threat.Threat); 
var _malware = require('../schemas/malware');
var malwareMODEL = _malware.mongoose.model('malware', _malware.Malware); 
var _system = require('../schemas/system');
var systemMODEL = _system.mongoose.model('system', _system.System);

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
      req.send("{status: error, message: internal error}");
      return console.log("[-] Error in malwareMODEL.count " + err);}
    if (undefined != mh && null != mh){
      var curr = mh/24;
      return systemMODEL.findOne({}, function(err, obj){
        if(err) {return res.send("{status: error, message: Internal Error}");}
        if (undefined != obj && null != obj){
          var max = obj.maxNumberofMalwareh;
          if (max >= curr) {
            return res.send("{status: ok, current:" + curr +", max:"+max+"}");
          } else {
            obj.maxNumberofMalwareh = curr;
            obj.save();
            return res.send("{status: ok, current:" + curr +", max:"+curr+"}");
          }  
        }//obj undefined control
        else {
          var s = new systemMODEL({
            _id: new _system.mongoose.Types.ObjectId,
            maxNumberofMalwareh: curr,
            modified: new Date()
          });//mmodel 
          s.save();
          return res.send("{status: ok, current:" + curr +", max:"+curr+"}");
        }
      });//systemMODEL
    }//undefined control
    else {
      return res.send("{status: error, message: empty db}");
    }
  });//countr
}//GETNUMBERMALWAREPERHOUR

/**
 * @api {get} /api/threath returns the number of threats per hour 
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
      req.send("{status: error, message: Internal Error}");
      return console.log("[-] Error in threatMODEL.count " + err);}
    if (undefined != th && null != th){
      var curr = th/24;
      return systemMODEL.findOne({}, function(err, obj){
        if(err) {return res.send("{status: error, message: Internal Error}");}
        if (undefined != obj && null != obj){
          var max = obj.maxNumberofThreatsh;
          if (max >= curr) {
            return res.send("{status: ok, current:" + curr +", max:"+max+"}");
          } else {
            obj.maxNumberofThreatsh = curr;
            obj.save();
            return res.send("{status: ok, current:" + curr +", max:"+curr+"}");
          }  
        }//obj undefined control
        else {
          var s = new systemMODEL({
            _id: new _system.mongoose.Types.ObjectId,
            maxNumberofThreatsh: curr,
            modified: new Date()
          });//mmodel 
          s.save();
          return res.send("{status: ok, current:" + curr +", max:"+curr+"}");
        }
      });//systemMODEL
    }//undefined control
    else {
      return res.send("{status: error, message: empty db}");
    }
  });//countr
}//GETNUMBERTHREATSPERHOUR

