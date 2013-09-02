#DBosta.js

###HTML5 localStorage DB usage alike facilitator with JSON format

>don't forget to check the demo.html file where there's a full example

##Features
- standard Javascript support no need for frameworks
- add/update/delete collections
- add/update/delete records
- find records with $and and $or operators (searches words individually with '%*')
- clear all collections at once
- checks for browser localStorage compatibility before using it
- generates unique id small hash and timestamp per record added
- creates support collection for future info needed or server-side sync control with timestamp
- controls total size of localStorage based in the browser in usage

##Getting Started
Main JSON structure that is used for passing parameters is like 
<code>{"collection":"bands","$and":{"country":"USA"},"fields":{"country":"U.S.A."}}</code>
<br/><i>"collection"</i> means the collection/table you want to work on, then it comes the operators which can be <i>$and</i> or <i>$or</i>, and at last the fields of the collection to work on at <i>"fields"</i>. This is a very basic and easy to follow structure.

In your project you must guarantee that the collection to be used exists, all you have to do is ,
``` js 
  DBosta.collection("bands");
```

afterwards you're able to add records(one or many at once), based in noSQL systems you can add fields on the structure at will, 
``` js 
      var objFields = { "collection":"bands", 
                        "fields":{"name":"Faithfull","years":"2001-2010","country":"Portugal"} 
                      }; 
      var strResult = DBosta.register(objFields); 
```

you can search for records, in this case all bands from the USA,

``` js
      var objParams   = { "collection":"bands",
                          "$and":{"country":"USA"}
                        };
      var objResult   = DBosta.find(objParams);
      for (var key in objResult) {
          console.log("> " + objResult[key]._id + " | " + objResult[key].name + " | " + objResult[key].years);
      }
```

change records which state USA to change it for U.S.A., 

``` js
      var objParams   = { "collection":"bands",
                          "$and":{"country":"USA"},
                          "fields":{"country":"U.S.A."}
                        };
      DBosta.change(objParams);
```

remove all bands from Germany, 

``` js
      var objParams   = { "collection":"bands",
                          "$and":{"country":"Germany"}
                        };
      DBosta.remove(objParams);
```

## Exposed

Here's the main functions available.

`.total()` returns total collections in localStorage

`.size()`  returns total bytes used, and predicted maximum allowed based on the browser brand

`.tst()` returns current timestamp

`.id()` generates unique hash identifier

`.compatibility()` checks if browser is compatible with localStorage usage

`.collection(objValue)` prepares collection usage

`.register(objValue)` inserts records in collection

`.find(objValue)` searches records in collection

`.change(objValue)` updates records in collection

`.remove(objValue)` deletes records in collection

`.clean(objValue)` removes collection

`.puf(objValue)` removes all collections

And the properties.

`.vCollection()` default created collection

`.vArray()` default array for collection

`.vString()` default string for collection

`.vDebug()` to see all those beautiful messages from console.log

`.vTSTCheck()` interval general collections timestamp update in seconds, per example for server-side sync control

`.vMaxsize()` still not being used

##Follow-up
Next main feature will be builtin sorting and major next feature in a few months will be to work as well with IndexedDB.


##Further notes
Created by [joaovieira.com](http://joaovieira.com/) in Planet Earth, at the Universe.





