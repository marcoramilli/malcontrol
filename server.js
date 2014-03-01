var mongoose = require('mongoose');
var _config = require('./conf/configs');

var _urlquery_scraper = require('./scrapers/queryurl_scraper');
var _phishtank_scraper = require('./scrapers/phishtank_scraper');
var _webinspector_scraper = require('./scrapers/webinspector_scraper');
var _scumware_scraper = require('./scrapers/scumware_scraper');
var _malwr_scraper = require('./scrapers/malwr_scraper');
var _virusscan_scraper = require('./scrapers/virusscan_scraper');

mongoose.connect("mongodb://"+_config.system.db_address+"/"+_config.system.db_dbname, function(err){                          
  if(err){
    Console.log("[-] DB Connection FAILED !" + err);
    process.exit(0);
  }
  setInterval(function(){_phishtank_scraper.goScraper()}, _config.system.ll_update_frequence);
  setInterval(function(){_urlquery_scraper.goScraper()}, _config.system.ll_update_frequence);
  setInterval(function(){_webinspector_scraper.goScraper()}, _config.system.ll_update_frequence);
  setInterval(function(){_virusscan_scraper.goScraper()}, _config.system.ll_update_frequence);
  //setInterval(function(){_scumware_scraper.goScraper()}, _config.system.ll_update_frequence);
  setInterval(function(){_malwr_scraper.goScraper()}, _config.system.ll_update_frequence);
});


