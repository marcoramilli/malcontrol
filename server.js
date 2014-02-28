var mongoose = require('mongoose');
var _config = require('./conf/configs');

var _urlquery_scraper = require('./scrapers/queryurl_scraper');
var _phishtank_scraper = require('./scrapers/phishtank_scraper');
var _webinspector_scraper = require('./scrapers/webinspector_scraper');
var _scumware_scraper = require('./scrapers/scumware_scraper');
var _malwr_scraper = require('./scrapers/malwr_scraper');

mongoose.connect("mongodb://"+_config.system.db_address+"/"+_config.system.db_dbname, function(err){                          
  if(err){
    Console.log("[-] DB Connection FAILED !" + err);
    process.exit(0);
  }
  //_phishtank_scraper.goScraper();
  //_urlquery_scraper.goScraper();
  //_webinspector_scraper.goScraper();
 //// _scumware_scraper.goScraper();
  _malwr_scraper.goScraper();
});


