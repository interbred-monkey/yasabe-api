# About

A simple Node.JS wrapper around the YaSabe business directory API

## Installation

[yasabe-api](https://npmjs.org/package/yasabe-api) is available through an installation from npm.

```javascript
npm install yasabe-api
```

## Usage

To use this library simply require the file and create a new instance of the module like so:

```javascript
var Yasabe = require('yasabe-api');
var yasabe = new Yasabe(username, password);
```

### Using Debug mode

The debug mode is set to false by default, when switched on the API parameters will be logged out along with the API call that is being called and the response.

```javascript
yasabe.debugMode(true);
```

### Using Test mode

Test mode is set to false by default, when switched on the module will use the YaSabe development environment to stop test data being added to the actual database.

```javascript
yasabe.testMode(true);
```

### Pulling records

The parameters for a search are as follows:

---

`terms` - fielded value to search for  
  `where` - location name (city, state, zipcode, (latitude, longitude))  
  `distance` - distance radius from center location  
  `page` - page number  
  `size` - number of items per page  
  `sort` - relevance, distance, buzz, authenticity, alpha, index, social, random  

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

`source` - *your* content source identifier  
  `externalid` - the id you know this record as  
  `businessMatches` - one or more listing id corresponding to YaSabe record/s to be updated  
  `businessContent` - content to make available in YaSabe  
  `additionalContent` - free text content to make available in YaSabe  

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

yasabe_params.businessContent = {
  language: [2],
  businessname: "Axel Foley",
  tagline: "Ride along with a cop",
  address1: "1154 Summit Dr",
  address2: "",
  city_text: "Beverly Hills",
  province: "Los Angeles",
  state: "CA",
  zipcode: "90210",
  showAddress: true,
  latitude: 34.0731,
  longitude: 118.3994,
  description: "Some text description",
  videoURL: "http://youtu.be/IqG1l4lScsg",
  facebook: "http://www.facebook.com/axel-foley",
  twitter: "http://www.twitter.com/axelf",
  phones: [
    {
      number: 7039554747,
      type: "Primary"
    }
  ],
  emails: [
    "axelfoley@lapd.com"
  ],
  urls: [
    "http://www.axels-super-adventures.com"
  ],
  cat: [
    {
      id: 228000000
    }
  ],
  tags: ["cops","ride along","drugs bust"]
}

yasabe_params.additionalContent = [
  {
    id: "images",
    type: "multimedia",
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
    id: "price-hours",
    type: "content",
    items: [
      {
        type: "price",
        english: "$$$",
        id: "display"
      },
      {
        type: "hours",
        english: "mon-fri 9am to 5pm",
        id: "display"
      },
    ]
  },
  {
    id: "user-generated-1",
    type: "review",
    items: [
      {
        type: "rating",
        english: "4.3",
        id: "display"
      },
      {
        type: "review",
        english: "Very nice place",
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

Updating a record is just the same as `post()` but you must pass in the YaSabe id you wish to update in the businessMatches array. This ID can be attained by a simple search.

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