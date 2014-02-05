# YaSabe API

A simple Node.JS wrapper around the YaSabe business directory API

## Installation

YaSabe API is available through an installation from npm
[yasabe-api](https://npmjs.org/package/yasabe-api)

```javascript
npm install yasabe-api
```

To use this library simply require the file and create a new instance of the module like so:

```javascript
var Yasabe = require('yasabe-api');
var yasabe = new Yasabe(username, password);
```

## Usage

### Using Debug mode

The debug mode is set to false by default

```javascript
yasabe.debugMode(true/false);
```

### Using Test mode

Test mode is set to false by default

```javascript
yasabe.testMode(true/false);
```

### Pulling records

The parameters for a search are as follows:

---

terms: fielded value to search for 

where: location name (city, state, zipcode, (latitude, longitude))

distance: distance radius from center location 

page: page number 

size: number of items per page 

sort: relevance, distance, buzz, authenticity, alpha, index, social, random

---

A basic example of use is:

```javascript
var search_params = {
  terms: {
    phone: "7039554747",
    name: "Da Bizness"
  }
  where: "New York",
  radius: 5
}

yasabe.search(search_params, function(err, search_results) {

  console.log(err, search_results);

})
```

### Adding records

Parameters for adding a record are as follows:

---

source: *your* content source identifier 

externalid: the id you know this record as

businessMatches: one or more listing id corresponding to YaSabe record/s to be updated 

businessContent: content to make available in YaSabe

additionalContent: free text content to make available in YaSabe

---

Additional parameters you should really be aware of:

```
// YaSabe accepted payment types
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

// YaSabe accepted languages
var Languages = {
  2: "English",
  3: "Spanish"
}
```

Basic example:

```javascript
var yasabe_params = {
  externalid: "afoleyridealongs",
  businessMatches: [],
  source: "cops ride along directorate"
}

yasabe_params.business_content = {
  language: [2],
  stdname: "Axel Foley",
  tagline: "Ride along with a cop"
  addressline1: "1154 Summit Dr",
  addressline2: "",
  city_text: "Beverly Hills",
  province: "Los Angeles",
  state: "CA",
  zipcode: "90210",
  showAddress: true,
  latitude: 34.0731,
  longitude: 118.3994,
  description: "Some text description",
  facebook: "http://www.facebook.com/axel-foley",
  twitter: "http://www.twitter.com/axelf",
  phones: [
    {
      phoneNum: 7039554747,
      type: "Primary"
    }
  ],
  email: [
    "axelfoley@lapd.com"
  ],
  url: [
    "http://www.axels-super-adventures.com"
  ],
  cat: [
    {
      id: 228000000
    }
  ]
}

yasabe_params.additional_content = [
  {
    id: "images",
    type: "content",
    items: [
      {
        type: "GALLERY",
        id: "http://imgur.com/GSdzQAx"
      },
      {
        type: "LOGO",
        id: "http://imgur.com/VWJvqVA"
      }
    ]
  },
  {
    id: "common",
    type: "content",
    items: [
      {
        type: "tag",
        english: "drug busts"
      },
      {
        type: "tag",
        english: "ride along"
      },
      {
        type: "hoursText",
        english: "M-F 9am-5pm, Sa-Su Closed",
        id: "display"
      }
    ]
  }
]

yasabe.post(yasabe_params, function(err, data) {

  console.log(err, data);

})
```

### Updating a record

Updating a record is just the same as adding a record but you must pass in the YaSabe id you wish to update in the businessMatches array. This ID can be attained by a simple search.

### Deleting a record

Deleteing a record requires the basic parameters for adding or updating but nothing else. An example of this would be:

```
var yasabe_params = {
  externalid: "afoleyridealongs",
  businessMatches: ["id_of_YaSabe_record"],
  source: "cops ride along directorate"
}

yasabe.delete(yasabe_params, function(err, data) {

  console.log(err, data);

})
```

## Third-party libraries

[request](http://github.com/mikeal/request.git)

[underscore](http://underscorejs.org)