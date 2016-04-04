var io = require('./io.js');
var match = require('./match.js');

var readInput = function (callback) {
  io.read2list('./input/products.txt', function (products) {
    io.read2list('./input/listings.txt', function (listings) {
      callback(products, listings);
    });
  });
};

var app = function () {
  console.log("Reading in products and listings...");
  readInput(function (products, listings) {
    console.log(">> Input read.");
    console.log("Matching...");
    match.extract(products, listings, function (results) {
      console.log(">> Matching complete.");
      console.log("Writing results...");
      io.list2file('./output/result1.txt', results, function () {
        console.log(">> Done. Please check the ./output/result.txt file for any updates.");
      })
    })
  });
};
app();