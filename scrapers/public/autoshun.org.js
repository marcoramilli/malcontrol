var request             = require('request');
var _save_badass        = require('../../commons/save_badass');
var _base_searching_url = "http://www.autoshun.org/files/shunlist.csv#sthash.GlMFGqI5.dpuf";

var _local_cache = {};

//autoshum.org
exports.goScraper = function(){
  try{
    request(_base_searching_url, function (error, response, body) {
        console.log("[+] Requesting url... " + _base_searching_url);
        if (!error && response.statusCode == 200) {
          var lines = body.split('\n');
          var run;
          lines.forEach(function(line, index, lines){
            if (index === 0 && undefined !== line){
              run = line.split(',')[1];
            } else {
              if (undefined !== line){
            var col = line.split(',');
            //console.log(col);
             _save_badass.saveBadAssToDB(col[0], "autoshum.org",  col[1], col[2], run);
              }
            }
          });
        } else {
          return console.log("[-] Error happening" + error);
        }
        });
  } catch(ex) {return console.log("[-] Error in scraping autoshum.org");}
};//goscraper



