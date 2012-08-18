/*

    CSV Reader
    Version: 2.0
   
    About:  Reads a Comma Separated File (CSV).
    About:  Stores the CSV file in an 2D Array that is returned in the format lines[line][column]
    About:  csv() returns (strings || floats || integers) in a 2D array [[row0],[row1],[row2],...]
    
    Usage:  <script type="text/javascript" src="csv.js"></script>
    Usage:  var lines = CSV("file.csv");
    
    CSV Specification: http://en.wikipedia.org/wiki/Comma-separated_values
    FLOT Spec: http://code.google.com/p/flot/

    TODO:  add support for # comment lines (CSV spec?)
    Bugs:  maybe a bug with """" in one line 
    TODO:  add support for various floating point formats other then 0.0123
    Bugs:  Add code to convert 10.0% to .1 not 10.0 
    Bugs:  Possible bug with str.split(/[\n|\r]/); (depends on win/osx/linux line break)
      
    NOTE: The CSV file must be located in the same directory as this script due to cross site scripting
    NOTE: var seperator = ",;"; // you can add a custom seperator 
    NOTE: var enclosure = "\"";  // you can add a custom enclosure
    
*/

// Usage: [[row0],[row1],[row2],...] = csv("filename.csv");
function CSV (filename) {
  var mycsv = Request (filename);
  var result = Parse (mycsv);
  return result;
}

function Request (url, callback) {
  var xmlhttp;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {// code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } 
  // for async requests / future implementation
  /*
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        callback(xmlhttp.responseText); 
    }
  }
  */
  xmlhttp.open("GET", url, false); // async request = true
  xmlhttp.send();
  return xmlhttp.responseText;
}

function Parse (str) { 
  var lines = str.split(/[\n|\r]/); // TODO: maybe a bug (depends on win/osx/linux line break)
  for(var i=0; i<lines.length; i++) {
    var seperator = ",;"; // seperators used for csv
    var enclosure = "\""; 
    var index = 0; // index of the last element seperated by the csv delimeter
    var enclosures = []; // position of each enclosure in the string
    var line = lines[i]; // one line of the csv file
    var newline = []; // lines[[newline],[newline],[newline]...]
    for (var j = 0; j < line.length; j++) { // index through the string and find all the seperators ... , or ; or "
      if (line.charAt(j) == enclosure) {
        enclosures.push(j);
      }
      if (((enclosures.length % 2 == 0) || enclosures.length == 0) && (check(line.charAt(j),seperator) || j == line.length-1)) {
      // if the number of enclosures is even or zero and you see a seperator such as a , or ; then its a new csv element
        var value = ""; // substring(from, to) where the to index is not included
        if (index != j && j != line.length-1) { // if the element is not at the end of the line
          value = line.substring(index, j); // enclosure with a , or ;
        } else if (index != j && j == line.length-1) { // if the element is at the end of the line
          value = line.substring(index, j+1); // end of line enclosure
        }
        if(value != "") {
          var num = numex(value);
          if(num.valid) {
            value = num.value; // (int||float) else string
          }
        }
        newline.push(value);
        index = j+1;
      }
    }
    lines[i] = newline;
  }
  return lines;
}

// numex() - checkes to see if the string (str) is a number
// returns number.valid (true||false) and number.value = (float||int||string)
var numex = function(str){
  number = {};
  number.valid = false;
  number.value = str;
  // if we see a number then convert it to a floating point or integer
  if((number.value.search(/[^0-9^\.^\$^\%^\-^\"^,^ ]+/) < 0) && str.length > 0) {  
    number.valid = true;
    number.value = str.replace(/[^\-^0-9^\.]+/g, ''); // TODO add % coversion code for example if we see a 10% covert it to .1
    if(number.value.search(/[\.]/) >= 0) {  
       number.value = parseFloat(number.value); // replace floating point
    } else {
       number.value = parseInt(number.value); // replace integers
    }
  }
  return number; // number.valid = true or false;
}

var check = function(c, str) {
  var eq = false;
  for (s in str) {
    if(str[s] === c){
      eq = true;
      break;
    }
  }
  return eq;
} 

// returns XML for a table with the data from csv("filename.csv");
function XMLtable(data) {
  var str = "<table style=\"width:100%;\" border=1>\n"; 
  str += "<tbody>\n"; 
  for ( var i=0; i < data.length; i++){
    str += '<tr class="row" style=\"width:100%;\"><td class="rown">R' + i + '</td>';
    for ( var j=0; j < data[i].length; j++){
        str += '<td class="element">' + data[i][j] + '</td>';
      }
    str += "</tr>\n";
  }  
  str += "</tbody>\n"; 
  str += "</table>\n";
  return str;    
}