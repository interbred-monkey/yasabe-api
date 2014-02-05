// include the request library
var request = require('request');

// include the underscore library
var _ = require('underscore');

// constructor
var Yasabe = function(_username, _password, _key) {

  // do we want to operate in test mode?
  var test_mode = false;

  // do we want to put out some debug?
  var debug = false;
  
  // Yasabe accepted payment types
  var payment_types = {
    1: "Cash",
    2: "Check",
    3: "Visa",
    4: "Master Card",
    5: "Discover",
    6: "American Express",
    7: "Diners",
    8: "Debit",
    9: "Paypal"
  }
  
  // Yasabe accepted languages
  var Languages = {
    2: "English",
    3: "Spanish"
  }

  // Find records
  this.search = function(params, callback) {

    // if we have nothing to search for then don't go any further
    if (!_.isObject(params) || (_.isUndefined(params.terms) && _.isUndefined(params.where))) {

      return callback("No supplied parameters to match records", null);

    }

    var terms_json = JSON.stringify({
      terms: params
    })

    // the params for our api call
    var request_params = {
      url: "/business-search-v2",
      method: "GET",
      qs: {
        mode: "basic",
        json: params
      }
    }

    // do the api call
    doRequest(request_params, function(err, data) {

      return callback(err, data);

    })

  }

  // Add a record
  this.post = function(params, callback) {

    // the params for our api call
    var request_params = {
      url: "/enhance-business",
      method: "POST",
      form: params
    }

    // do the api call
    doRequest(request_params, function(err, data) {

      return callback(err, data);

    })

  }

  // Delete a record
  this.delete = function(params, callback) {

    // add in the business content to make this a delete
    params.businessContent = {
      indexable: false
    }

    // the params for our api call
    var request_params = {
      url: "/enhance-business",
      method: "POST",
      form: params
    }

    // do the api call
    doRequest(request_params, function(err, data) {

      return callback(err, data);

    })

  }

  // make the http request
  doRequest = function(params, callback) {

    // do we have a url to go to?
    if (_.isUndefined(params.url)) {

      return callback("URL is a required parameter", null);

    }

    // add in the stub for the api
    params.url = "http://api."+(test_mode?"dev.":"")+"yasabe.com/search"+params.url;

    // add in the api key for a post
    if (params.method === "POST" || params.method === "PUT") {

      params.form.key = _key;

    }

    // add the params to the querystring and add in the key
    else if(params.method === "GET") {

      params.qs.json.key = _key;
      params.qs.json = JSON.stringify(params.qs.json);

    }

    // add in the auth
    params.auth = {
      user: _username,
      pass: _password,
      sendImmediately: false
    }

    // do the request
    request(params, function(e, r, b) {

      // output some debug
      if (debug === true) {

        console.log("****************************************************");
        console.log("** Parameters **");
        console.log(JSON.stringify(params, undefined, 2));
        console.log("****************************************************");
        console.log("** Result **");
        console.log("Error: "+e);
        console.log("Status: "+r.statusCode);
        console.log("Body: "+b);
        console.log("****************************************************");

      }

      // Error
      if (e) {

        return callback(e, null);

      }

      // decode the body
      b = JSON.parse(b);

      // Not a status 200
      if (r.statusCode !== 200) {

        return callback("API call responded with a status "+r.statusCode, b);

      }

      // Wooooooooo Bacon
      else {

        return callback(null, b);

      }

    })
  
  }

  // turn on/off debug
  this.setDebugMode = function(bool) {

    return debug = Boolean(bool);

  }

  // turn on/off test mode
  this.setTestMode = function(bool) {

    return test_mode = Boolean(bool);

  }

}

module.exports = Yasabe;