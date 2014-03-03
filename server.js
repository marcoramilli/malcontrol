/*   __  __       _                           ____            _             _   __  __             _ _             
*   |  \/  | __ _| |_      ____ _ _ __ ___   / ___|___  _ __ | |_ _ __ ___ | | |  \/  | ___  _ __ (_) |_ ___  _ __ 
*   | |\/| |/ _` | \ \ /\ / / _` | '__/ _ \ | |   / _ \| '_ \| __| '__/ _ \| | | |\/| |/ _ \| '_ \| | __/ _ \| '__|
*   | |  | | (_| | |\ V  V / (_| | | |  __/ | |__| (_) | | | | |_| | | (_) | | | |  | | (_) | | | | | || (_) | |   
*   |_|  |_|\__,_|_| \_/\_/ \__,_|_|  \___|  \____\___/|_| |_|\__|_|  \___/|_| |_|  |_|\___/|_| |_|_|\__\___/|_|   
*/

//Author: Marco Ramilli
//website: marcoramilli.com
//Version: pre alpha
//Note: Don't even think to use this code in production environment
//      Everything you read is under developmento monde.



var mongoose = require('mongoose');
var _config = require('./conf/configs');
var cluster = require('cluster');
var application_root = __dirname;
var http = require('http');
var path = require('path');

var _urlquery_scraper = require('./scrapers/queryurl_scraper');
var _phishtank_scraper = require('./scrapers/phishtank_scraper');
var _webinspector_scraper = require('./scrapers/webinspector_scraper');
var _scumware_scraper = require('./scrapers/scumware_scraper');
var _malwr_scraper = require('./scrapers/malwr_scraper');
var _virusscan_scraper = require('./scrapers/virusscan_scraper');
var _commonGeoMalw = require('./commons/save_malw');

mongoose.connect("mongodb://"+_config.system.db_address+"/"+_config.system.db_dbname, function(err){                          
  if(err){
    Console.log("[-] DB Connection FAILED !" + err);
    process.exit(0);
  }
});

  if (cluster.isMaster){

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount -1; i += 1) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
      // Replace the dead worker,
      // we're not sentimental
      console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
        });

      //lets separate geo localization for performance purposes
      //TODO: release the background_geoloc_service as soon as possible!
      //setInterval(function(){_commonGeoMalw.geoLocMalwr()}, _config.system.background_geoloc_service);
      } 
      else {
        setInterval(function(){_phishtank_scraper.goScraper()}, _config.scrapers.phishtank_timer);
        setInterval(function(){_urlquery_scraper.goScraper()}, _config.scrapers.urlquery_timer);
        setInterval(function(){_webinspector_scraper.goScraper()},_config.scrapers.webinspector_timer);
        setInterval(function(){_virusscan_scraper.goScraper()}, _config.scrapers.virusscanner_timer);
        //TOFIX: fix the following scraper !
        ////setInterval(function(){_scumware_scraper.goScraper()}, _config.;
        setInterval(function(){_malwr_scraper.goScraper()}, _config.scrapers.malwr_timer);

        process.on('uncaughtException', function globalErrorCatch(error, p){
          console.error(error);
          console.error(error.stack);
        });

        //You though I was an hero ? Nope, I do use Express too.
        var express = require('express');
        ////TODO: needs authentication to be in production
        var app = express();

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
          //************************************
        });

        //Here the interesting part: the ROUTES !
        // **
        // **
        // TODO: Routest and public API
        //app.post('/api/putip/', getdata.putipPOST); DEPRECATED !
        //app.get('/api/file/:username/:password/:fromdate', getdata.respondAjaxGetFilesInfo);// fromdate: 2014-01-01 01:40:02 
        // **
        // **
        //Server Creation 
        http.createServer(app).listen(80); //DEPRECATED 
        console.log('[+] HTTP: Listening on port 80...'); 
        // **
      }
