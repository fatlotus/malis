if (!window.JSON)
   JSON = {
      parse : function (e) { return eval('('+e+')'); }
   }

if (!Array.prototype.unique)
   Array.prototype.unique = function() {
      var a = this.concat();
      for(var i=0; i<a.length; ++i) {
         for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
               a.splice(j, 1);
         }
      }

      return a;
   };
   // see http://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript/1584377#1584377


ClientSideSearch = {
   _resultsDiv : null,
   
   load : function(word, callback) {
      var xhr = new XMLHttpRequest;
      xhr.onreadystatechange = function() {
         if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
               /* handle successful response */
               callback(JSON.parse(xhr.responseText));
            } else {
               /* handle failed response */
               
               /* 404's are expected, so mask them from being logged */
               if (xhr.status != 404)
                  console.log("HTTP Error: " + xhr.status);
               
               callback ([ ]);
            }
         }
      }
      xhr.open('GET', 'db/' + word + '.json');
      xhr.send(null);
   },
   
   search : function(query) {
      var results = { }; // a poor-man's set.
      var totalLoaded = 0;
      var queries = query.split(' ');
      
      for (var i = 0; i < queries.length; i++) {
         var query = queries[i];
         
         ClientSideSearch.load(query, function (list) {
            totalLoaded += 1;
            
            for (var j = 0; j < list.length; j++) {
               var result = list[j];
               results[result[0]] = result;
            }
            
            if (totalLoaded == queries.length) {
               while (ClientSideSearch._resultsDiv.hasChildNodes())
                  ClientSideSearch._resultsDiv.removeChild(
                     ClientSideSearch._resultsDiv.firstChild);
               
               for (var key in results) {
                  var data = results[key];
                  
                  var dt = document.createElement('dt');
                  var dd = document.createElement('dd');
                  dt.appendChild(document.createTextNode(data[0]));
                  
                  var highlighted = ' ' + data[1] + ' ';
                  
                  for (var j = 0; j < queries.length; j++) {
                     highlighted = highlighted.replace(' ' + queries[j] + ' ', ' <strong>' + queries[j] + '</strong> ')
                  }
                  
                  dd.innerHTML = highlighted;
                  
                  ClientSideSearch._resultsDiv.appendChild(dt);
                  ClientSideSearch._resultsDiv.appendChild(dd);
               }
            }
         });
      }
   },
   
   initialize : function() {
      ClientSideSearch._resultsDiv = document.getElementById('results');
      
      var queryBox = document.getElementById('query');
      
      queryBox.onchange = function() {
         ClientSideSearch.search(queryBox.value);
      }
   }
}

window.onload = function() { ClientSideSearch.initialize(); }