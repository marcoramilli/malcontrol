/*   __  __       _                           ____            _             _   __  __             _ _             
 *   |  \/  | __ _| |_      ____ _ _ __ ___   / ___|___  _ __ | |_ _ __ ___ | | |  \/  | ___  _ __ (_) |_ ___  _ __ 
 *   | |\/| |/ _` | \ \ /\ / / _` | '__/ _ \ | |   / _ \| '_ \| __| '__/ _ \| | | |\/| |/ _ \| '_ \| | __/ _ \| '__|
 *   | |  | | (_| | |\ V  V / (_| | | |  __/ | |__| (_) | | | | |_| | | (_) | | | |  | | (_) | | | | | || (_) | |   
 *   |_|  |_|\__,_|_| \_/\_/ \__,_|_|  \___|  \____\___/|_| |_|\__|_|  \___/|_| |_|  |_|\___/|_| |_|_|\__\___/|_|   
 */

/*Author: Marco Ramilli
 * website: marcoramilli.com
 * Version: pre alpha
 * Note: Don't even think to use this code in production environment
 * Everything you read is under development monde.
 */
//TODO: building crapers !
//http://www.malwaredomainlist.com/mdl.php
//http://www.spywareguide.com/product_list_full.php?pageNum_Rs1=4&totalRows_Rs1=2352
//http://www.bitdefender.com/resourcecenter/virus-encyclopedia/
//http://about-threats.trendmicro.com/us/search.aspx?p=Crypted.exe
//http://www.bitdefender.com/resourcecenter/virus-encyclopedia/

//General Imports
var mongoose = require('mongoose');
var _config = require('./conf/configs');
var cluster = require('cluster');
var application_root = __dirname;
var http = require('http');
var path = require('path');
var toobusy = require('toobusy'); //thank you guys, you saved me the day !
//-----------------------------------------------------------------

//Parser Imports
var _urlquery_scraper = require('./scrapers/queryurl_scraper');
var _phishtank_scraper = require('./scrapers/phishtank_scraper');
var _webinspector_scraper = require('./scrapers/webinspector_scraper');
var _scumware_scraper = require('./scrapers/scumware_scraper');
var _malwr_scraper = require('./scrapers/malwr_scraper');
var _virusscan_scraper = require('./scrapers/virusscan_scraper');
var _commonGeoMalw = require('./commons/save_malw');
//-----------------------------------------------------------------

//DB Connections
mongoose.connect("mongodb://"+_config.system.db_address+"/"+_config.system.db_dbname, function(err){                          
  if(err){
    console.log("[-] DB Connection FAILED !" + err);
    process.exit(0);
  }
});
//-----------------------------------------------------------------

if (cluster.isMaster){
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount -1; i += 1) {
    cluster.fork();
  }
  // Listen for dying workers
  cluster.on('exit', function (worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker ' + worker.id + ' died :(');
      cluster.fork();
      });

      setInterval(function(){ if (!toobusy()) {_commonGeoMalw.geoLocMalwr();}}, _config.system.background_geoloc_service);
    } 
    else if (cluster.isWorker){
      setInterval(function(){ if (!toobusy()) {_phishtank_scraper.goScraper();}}, _config.scrapers.phishtank_timer);
      setInterval(function(){ if (!toobusy()) {_urlquery_scraper.goScraper();}}, _config.scrapers.urlquery_timer);
      setInterval(function(){ if (!toobusy()) {_webinspector_scraper.goScraper();}},_config.scrapers.webinspector_timer);
      setInterval(function(){ if (!toobusy()) {_virusscan_scraper.goScraper();}}, _config.scrapers.virusscanner_timer);
      //TOFIX: fix the following scraper !
      ////setInterval(function(){_scumware_scraper.goScraper()}, _config.;
      setInterval(function(){ if (!toobusy()) {_malwr_scraper.goScraper();}}, _config.scrapers.malwr_timer);

      process.on('uncaughtException', function globalErrorCatch(error, p){
        console.error(error);
        console.error(error.stack);
      });

      var express = require('express');
      var basicRoutes = require('./routes/basic');
      var advancedRoutes = require('./routes/advances');
      var app = express();

      //-----------------------------------------------------------------
      app.configure(function () {
        app.use(express.logger( 'dev')); /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(application_root, "frontend")));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

        //** Error Handler must be the last one
        app.use(function(req, res, next){
          res.status(400);
          res.send("404. Page Not Found");
        });
        //-----------------------------------------------------------------
      });

      //Here the interesting part: the ROUTES !
      // **
      // **
      app.get('/api/topcountriesphishers', basicRoutes.GETtopCountriesPhishers);
      app.get('/api/topcountriesmalware', basicRoutes.GETtopCountriesMalwares);
      app.get('/api/topcountriesthreats', basicRoutes.GETtopCountriesThreats);
      app.get('/api/totalmalware', basicRoutes.GETtotalMalware);
      app.get('/api/totalthreats', basicRoutes.GETtotalThreats);
      app.get('/api/numberofmalware/:fyear/:fmonth/:fday/:tyear/:tmonth/:tday', basicRoutes.GETNumberMalwareBetweenDates);
      app.get('/api/numberofthreats/:fyear/:fmonth/:fday/:tyear/:tmonth/:tday', basicRoutes.GETNumberThreatsBetweenDates);
      app.get('/api/threats/:fyear/:fmonth/:fday/:tyear/:tmonth/:tday', basicRoutes.GETThreatsBetweenDates);
      app.get('/api/malware/:fyear/:fmonth/:fday/:tyear/:tmonth/:tday', basicRoutes.GETMalwareBetweenDates);
      app.get('/api/malwareh', advancedRoutes.GETNumberMalwarePerHour);
      app.get('/api/threatsh', advancedRoutes.GETNumberThraeatsPerHour);
      app.get('/api/malwaresourcestats', advancedRoutes.GETStatesScrapedMalware);
      app.get('/api/threatsourcestats', advancedRoutes.GETStatesScrapedThreats);
      // **
      // **

      //Server Creation 
      http.createServer(app).listen(_config.system.listening_port);
      console.log('[+] HTTP: Listening on port: ' + _config.system.listening_port); 
      //-----------------------------------------------------------------
    };//Worker
