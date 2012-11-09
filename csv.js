/*

    CSV Reader
    Version: 3.0
    
    Example: 
            [[row0],[row1],[row2],...] = csv("filename.csv");
            [[row0],[row1],[row2],...] = Parse(text);
   
    About:  Reads a Comma Separated File (CSV).
    About:  Stores the CSV file in an 2D Array that is returned in the format lines[line][column]
    About:  csv() returns (strings || floats || integers) in a 2D array [[row0],[row1],[row2],...]
    
    Usage:  <script type="text/javascript" src="csv.js"></script>
            var table = new CSV(text);
    
    CSV Specification: http://en.wikipedia.org/wiki/Comma-separated_values

    TODO:  add support for # comment lines (CSV spec?)
    TODO:  add support for various floating point formats other then 0.0123
    TODO:  Add code to convert 10.0% to .1 not 10.0 
      
    Tested with various Microsoft CSV Files with wierd "A""" and ","""
    
*/

function CSV(text){

  this.csv = [];
  
  var comma = ",;";
  var quote = "\"";
  var newline = "\n\r";

  var line = [];
  var element = "";
  var quoted = false;

  // BUG/TODO: add code to convert %
  var num = function(str){
    var value = str.replace(/^\$/, '');
    if(isNaN(value) || value == ""){ // is it not a number?
      return str;
    }
    else { // its a number... 
      if(value.indexOf(".") >= 0) { // TODO/BUG: check for %   
         return parseFloat(value); // replace floating point
      } 
      else {
         return parseInt(value); // replace integers
      }
    } 
  };
  
  for (var i = 0; i < text.length; i++){
    if(text[i] == quote){
      if(!quoted) { // first quotation mark?
        quoted = true;
        element = ""; // just to be safe clear the element
      } 
      else if (comma.indexOf(text[i+1]) >= 0) { // last quotation mark with a , or ; next?
        line.push(num(element));
        i = i + 1; // dont add a , to the CSV skip it
        element = "";
        quoted = false;
      }
      else if (text[i+1] === quote){
        element += text[i+1]; // add a quote
        i = i + 1; // skip one " because in the CSV Standard "" = "
      }
      else if (newline.indexOf(text[i+1]) >= 0){
        line.push(num(element));
        element = ""; 
        quoted = false; // reset the quote becuse it was the last quote
      }
      else { // Error Case
        element += text[i]; 
        quoted = false; // else do nothing ... element = element;
      }
    }
    else if(comma.indexOf(text[i]) >= 0){
      if(quoted) { // is the , inside a "" block?
        element += text[i];
      }
      else {
        line.push(num(element));
        element = "";    
      }
    } 
    else if(newline.indexOf(text[i]) >= 0){
      if(quoted){ // if its inside a "" block always add the element
        element += text[i];
      } 
      else {
        line.push(num(element));
        element = ""; // clear the element
        this.csv.push(line);
        line = []; // clear the line and go to the next one
        if(newline.indexOf(text[i+1]) >= 0){
          i = i + 1; // skip one element because there are two carrage returns
        }
      }
    }
    else {
      element += text[i];
    }
  }
  return this.csv;
}