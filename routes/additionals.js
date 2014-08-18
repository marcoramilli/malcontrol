var _config = require('../conf/configs');
var sys     = require('sys');
var feed    = require("feed-read");


/**
/**
 * @api {get} /api/getmaplic returns the license key for map
 * @apiName Additionals
 * @apiVersion 0.0.1
 * @apiGroup additionals 
 *
 * @apiSuccess {Number} License 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "license": "asda123-we-1658jkgjf5"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETMapLicKey = function(req, res){
  return res.json({license: _config.map.license});
};//GETMAPLICKEY

/**
 * @api {get} /api/malwarenews returns the malware news 
 * @apiName Additionals
 * @apiVersion 0.0.1
 * @apiGroup additionals 
 *
 * @apiSuccess {JSON} News Object
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "license": "asda123-we-1658jkgjf5"
 *     }
 *
 * @apiError InternalError The Servers had some serious problems, contact mramilli@gmail.com 
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "status" : "error",
 *       "message": "Missing Parameters"
 *     }
 */
exports.GETMalwareNews = function(req, res){

var feed_url = _config.system.malware_news_feed; 
var r = [];
var response = feed(feed_url, function(err, articles) {
  if (err) res.json({sttus: 'error', message: 'error reading feeds'});
  for(i=0; i<articles.length; i++) {
    r.push({ "article_number" : i, 
            "article_title"  :  articles[i].title, 
            "article_link"   :  articles[i].link,
            "article_feed"   :  articles[i].feed,
            "article_content":  articles[i].content  
          });
  }
  return res.json(r);
});

};//GetMalwareNews
