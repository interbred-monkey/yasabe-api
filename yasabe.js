// include the request library
var request = require('request');

// include the underscore library
var _ = require('underscore');

// constructor
var YaSabe = function(_username, _password, _key) {
  
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

  // add in the params needed for api calls
  this._username = _username;
  this._password = _password;
  this._key = _key;

}

// do we want to operate in test mode?
YaSabe.prototype._test_mode = false;

// do we want to put out some debug?
YaSabe.prototype._debug = false;

// username
YaSabe.prototype._username = null;

// password
YaSabe.prototype._password = null;

// key
YaSabe.prototype._key = null;

// Find records
YaSabe.prototype.search = function(params, callback) {

  // if we have nothing to search for then don't go any further
  if (!_.isObject(params) || (_.isUndefined(params.terms) && _.isUndefined(params.where))) {

    return callback("No supplied parameters to match records", null);

  }

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
  this.doRequest(request_params, function(err, data) {

    return callback(err, data);

  })

}

// Add a record
YaSabe.prototype.post = function(params, callback) {

  if (!_.isObject(params)|| _.isUndefined(params.businessContent)) {

    return callback("Params should be an object with the data to add");

  }

  // the params for our api call
  var request_params = {
    url: "/enhance-business",
    method: "POST",
    body: params
  }

  // do the api call
  this.doRequest(request_params, function(err, data) {

    return callback(err, data);

  })

}

// Delete a record
YaSabe.prototype.delete = function(params, callback) {

  // do we have what we need?
  if (!_.isObject(params) || _.isUndefined(params.businessMatches)) {

    return callback("Params should be an object with the businessMatches to delete");

  }

  // is businessMatches an array?
  if (!_.isArray(params.businessMatches)) {

    params.businessMatches = [params.businessMatches];

  }

  // add in the business content to make this a delete
  params.businessContent = {
    indexable: false
  }

  // the params for our api call
  var request_params = {
    url: "/enhance-business",
    method: "POST",
    body: params
  }

  // do the api call
  this.doRequest(request_params, function(err, data) {

    return callback(err, data);

  })

}

// make the http request
YaSabe.prototype.doRequest = function(params, callback) {

  // do we have a url to go to?
  if (_.isUndefined(params.url)) {

    return callback("URL is a required parameter", null);

  }

  // add in the stub for the api
  params.url = "http://api."+(this._test_mode?"dev.":"")+"yasabe.com/search"+params.url;

  // add in the api key for a post
  if (params.method === "POST" || params.method === "PUT") {

    params.url += "?key="+this._key
    params.body.key = this._key;

  }

  // add the params to the querystring and add in the key
  else if(params.method === "GET") {

    params.qs.json.key = this._key;
    params.qs.json = JSON.stringify(params.qs.json);

  }

  // set a return type
  params.json = true;

  // add in the auth
  params.auth = {
    user: this._username,
    pass: this._password,
    sendImmediately: false
  }

  // debug mode
  var _debug_mode = this._debug;

  // do the request
  request(params, function(e, r, b) {

    // output some debug
    if (_debug_mode === true) {

      console.log("****************************************************");
      console.log("** Parameters **");
      console.log(JSON.stringify(params, undefined, 2));
      console.log("****************************************************");
      console.log("** Result **");
      console.log("Error: "+e);
      console.log("Status: "+r.statusCode);
      console.log("Body: "+JSON.stringify(b, undefined, 2));
      console.log("****************************************************");

    }

    // Error
    if (e) {

      return callback(e, null);

    }

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
YaSabe.prototype.setDebugMode = function(bool) {

  return this._debug = Boolean(bool);

}

// turn on/off test mode
YaSabe.prototype.setTestMode = function(bool) {

  return this._test_mode = Boolean(bool);
  
}

module.exports = YaSabe;