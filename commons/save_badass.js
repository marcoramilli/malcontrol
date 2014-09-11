//-----------------------------------------------------------------
var mongoose         = require('mongoose');
var geoip            = require('geoip-lite');  
var badass           = require('../schemas/badass');
var badassMODEL      = badass.mongoose.model('badass', badass.Badass); 
//-----------------------------------------------------------------
//

//external
exports.Badass = badassMODEL;

exports.firstTimeRunning = function(source, callback){
  return badassMODEL.count({scraped_source: source}, function(err, count){
    if (count > 0) {callback(false);}
    else {callback(true);}
  });//count
};//firsttimerunning

exports.saveBadAssToDB = function (ip, scraped, date, note, run){
      var geo = geoip.lookup(ip);
      var co;
      var ci;
      var re;
      var ll;

      if (undefined !== geo && null !== geo){
        co = geo['country'];
        ci = geo['city'];
        re = geo['region'];
        ll =  geo['ll'];
      }
      var ba = new badassMODEL({
          _id:            new badass.mongoose.Types.ObjectId, 
          detection_date: date,
          ip:              ip,
          description:     note,
          scraped_source:  scraped,
          run:             run,

          coutry:          co,
          city:            ci,
          region:          re,
          ll:              ll,

          modified:        new Date()
      });

    return badassMODEL.findOneAndUpdate({detection_date: date, ip: ip, description: note, scraped_source : scraped},ba.toObject(),{upsert: true},function(err){
      //if(err) console.log("[-] Error in saving on DB: " + err);
    });


};//saveBadAss
