const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const url = 'http://substack.net/images/';
var index = 0;
csvData = '';

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    var $cells = [];
    var $rows = $("tr");
    $rows.each( function( i, elem ) {
      $cells[i] = $(this).find("td");
    });
    $cells.forEach(function(cell){
      processData(cell);
    });
    writeCSV(csvData);
  }
})

function processData(cell){
  var size = cell[1]["children"][0]["children"][0];
  if (size !== undefined) {
    var permissions = cell[0]["children"][0]["children"][0]["data"];
    size = cell[1]["children"][0]["children"][0]["data"];
    var relativePath = cell[2]["children"][0]["attribs"]["href"];
    var absolutePath = "http://substack.net" + relativePath;
    var innerText = cell.text();
    var twoPieces = innerText.split(")");
    var fileExt   = String(twoPieces[1].match(/[.][a-zA-Z]{3}/));
    var fileType  = "";
    if (fileExt  !== null ){
      fileType = fileExt.replace(".","").toUpperCase();
    }
    csvData += permissions + "," + absolutePath + "," + fileType + "\n";
  }
}


function writeCSV(data){
  fs.writeFile('output.txt', data, function (err) {
    if (err) {
      console.log(err);
    }
  });
}