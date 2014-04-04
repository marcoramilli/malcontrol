/*
 * Simple testing, must be enpowered.
 * Incomplete Tests, not all the routes have been added !
 *
 */
var assert = require('assert');
var request = require('supertest');  
var _config = require('../conf/configs.json');

describe('Routing', function() {
  var url = "http://localhost:"+ _config.system.listening_port;

  //before(function(done) {
  //console.log("Preparing Tests ... ");
  //// In our tests we use the test db
  ////mongoose.connect(config.db.mongodb); 
  ////done();
  //});

  //describe('GET TopCountriresPhishers', function() {
    //it('should return JSON withing the top phishers countries', function(done) {

      //request(url)
      //.get('/api/topcountriesphishers')
      //.expect('Content-Type', /json/)
      //.expect(200) //Status code(200);
    //.end(function(err,res) {
      //if (err) {
        //throw err;
      //}
      //done();
    //});//end
    //});//it
  //});//describe

  describe('GET TopCountriesmalware', function() {
    it('should return JSON withing the top malware countries', function(done) {

      request(url)
      .get('/api/topcountriesmalware')
      //.expect('Content-Type', /json/)
      .expect(200) //Status code(200);
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      done();
    });//end
    });//it
  });//describe

  describe('GET TopCountriethreats', function() {
    it('should return JSON withing the top threat countries', function(done) {

      request(url)
      .get('/api/topcountriesthreats')
      .expect('Content-Type', /json/)
      .expect(200) //Status code(200);
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      done();
    });//end
    });//it
  });//describe

  describe('GET Total malware', function() {
    it('should return JSON withing the total amount of processed malware', function(done) {

      request(url)
      .get('/api/totalmalware')
      .expect(200) //Status code(200);
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      done();
    });//end
    });//it
  });//describe

  describe('GET Total threats', function() {
    it('should return JSON withing the total amount of processed threats', function(done) {

      request(url)
      .get('/api/totalthreats')
      .expect(200) //Status code(200);
    .end(function(err,res) {
      if (err) {
        throw err;
      }
      done();
    });//end
    });//it
  });//describe
});//Routing Tests
