//General Imports
var mongoose                 = require('mongoose');
var _config                  = require('./conf/configs');
var cluster                  = require('cluster');
var application_root         = __dirname;
var http                     = require('http');
var path                     = require('path');
var toobusy                  = require('toobusy'); //thank you guys, you saved me the day !
//-----------------------------------------------------------------

//Parser Imports
var _urlquery_scraper        = require('./scrapers/queryurl_scraper');
var _phishtank_scraper       = require('./scrapers/phishtank_scraper');
var _webinspector_scraper    = require('./scrapers/webinspector_scraper');
var _scumware_scraper        = require('./scrapers/scumware_scraper');
var _malwr_scraper           = require('./scrapers/malwr_scraper');
var _virusscan_scraper       = require('./scrapers/virusscan_scraper');
var _commonGeoMalw           = require('./commons/save_malw');
var _malware_domain_list     = require('./scrapers/malware_domain_list');
var _malware_malc0de_scraper = require('./scrapers/malware_malc0de');
var _malware_vxvault_scraper = require('./scrapers/malware_vxvault');
var _malwareblacklist_scraper= require('./scrapers/malwareblacklist');
var _autoshum_org_scraper    = require('./scrapers/autoshun.org');
//-----------------------------------------------------------------
//
//DB Connections
mongoose.connect("mongodb://"+_config.system.db_address+"/"+_config.system.db_dbname, function(err){                          
  if(err){
    console.log("[-] DB Connection FAILED !" + err);
    process.exit(0);
  }
});
//-----------------------------------------------------------------

setInterval(function(){ if (!toobusy()) {_phishtank_scraper.goScraper();}},_config.scrapers.phishtank_timer + parseInt(Math.random()*100000)); // _config.scrapers.phishtank_timer);
setInterval(function(){ if (!toobusy()) {_urlquery_scraper.goScraper();}}, _config.scrapers.urlquery_timer + parseInt(Math.random()*100000)); //_config.scrapers.urlquery_timer);
setInterval(function(){ if (!toobusy()) {_webinspector_scraper.goScraper();}},_config.scrapers.webinspector_timer + parseInt(Math.random()*100000));//_config.scrapers.webinspector_timer);
setInterval(function(){ if (!toobusy()) {_virusscan_scraper.goScraper();}},_config.scrapers.virusscanner_timer + parseInt(Math.random()*100000)); //_config.scrapers.virusscanner_timer);
//TOFIX: fix the following scraper !
setInterval(function(){ if (!toobusy()) {_malwr_scraper.goScraper();}}, _config.scrapers.malwr_timer + parseInt(Math.random()*100000)); //_config.scrapers.malwr_timer);
setInterval(function(){ if (!toobusy()) {_malware_domain_list.goScraper();}}, _config.scrapers.malwr_timer + parseInt(Math.random()*100000)); //_config.scrapers.malwr_timer);
setInterval(function(){ if (!toobusy()) {_malware_malc0de_scraper.goScraper();}},_config.scrapers.phishtank_timer + parseInt(Math.random()*100000)); // _config.scrapers.phishtank_timer);
setInterval(function(){ if (!toobusy()) {_malware_vxvault_scraper.goScraper();}},_config.scrapers.phishtank_timer + parseInt(Math.random()*100000)); // _config.scrapers.phishtank_timer);
setInterval(function(){ if (!toobusy()) {_autoshum_org_scraper.goScraper();}},_config.scrapers.autoshun_org_timer + parseInt(Math.random()*100000)); // _config.scrapers.phishtank_timer);
setInterval(function(){ if (!toobusy()) {_malwareblacklist_scraper.goScraper();}},_config.scrapers.malwareblacklist + parseInt(Math.random()*100000)); // _config.scrapers.phishtank_timer);


process.on('uncaughtException', function globalErrorCatch(error, p){
  console.error(error);
  console.error(error.stack);
});
