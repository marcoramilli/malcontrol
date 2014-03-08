var mongoose = require('mongoose');

var _threat = require('../schemas/threat');
var threatMODEL = _threat.mongoose.model('threat', _threat.Threat); 


exports.saveThreatToDB  = function(plinkToReport, purl, ptimestamp, pip, pcompositscore, pscraped_source, pcountry, pcity, pregion, pll, pdesc){
  return threatMODEL.find({url: purl}, function(err, t){
    if(t.length == 0 || err){
      //no threats 
      var alerts = undefined;
      var ids = undefined;

      if (undefined != pcompositscore && null != pcompositscore){
        var p =pcompositscore.split("/");
        if (p.length > 0){
          alerts = p[0];
          ids = p[1];
        }
      }
      var tm = new threatMODEL({
        _id: new _threat.mongoose.Types.ObjectId,
          url: purl,
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
          modified: new Date()
      });//tm
      return tm.save(function(err){
        if(err) console.log("[-] Error in saving on DB: " + err);
        //TODO: Adding error logs
      });
    }else {
      //console.log("[-] Dup Threat: " + err);
    } 
  });//threatMODEL.find
}//savethreattodb
