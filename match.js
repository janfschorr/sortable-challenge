var trimNonWordChar = function (str) {
  return str.replace(/\W/g, "");
};
var spaces2Underscore = function (str) {
  return str.replace(/\ /g, "_");
};
var containsManufacturer = function (product, listing) {
  // FIXME: Assumes same or more compact manufacturer name in products than listings (e.g. Canon VS Canon Canada)
  var pattern = new RegExp(product.manufacturer, "ig");
  return pattern.test(listing.manufacturer);
};

var containsFamily = function (product, listing) {
  if (typeof product.family === typeof undefined) {
    return true; // If no product family is defined continue with other checks
  }
  var pattern = new RegExp(trimNonWordChar(product.family), "ig");
  return pattern.test(trimNonWordChar(spaces2Underscore(listing.title)));
};

var containsModel = function (product, listing) {
  function containsWholeModelName(model, title) {
    var pattern = new RegExp(trimNonWordChar(model), "ig");
    return pattern.test(trimNonWordChar(spaces2Underscore(title)));
  }

  function containsPartialModelName(model, title) {
    var minPartialLength = 2;
    var partials = model.replace(/(\W|_)/g, " ").split(" ");
    var result = (partials.length > 0);
    partials.forEach(function (partial) {
      var pattern = new RegExp(partial, "ig");
      result &= (partial.length > minPartialLength) && pattern.test(title);
    });
    return result;
  }

  return containsWholeModelName(product.model, listing.title)
    || containsPartialModelName(product.model, listing.title);
};

var isMatch = function (product, listing) {
  return containsManufacturer(product, listing)
    && containsFamily(product, listing)
    && containsModel(product, listing);
};

var extract = function (products, listings, callback) {
  var results = [];
  products.forEach(function (product) {
    var resultLine = {"product_name": product.product_name, "listings": []};
    listings.forEach(function (listing, index) {
      if (isMatch(product, listing)) {
        resultLine.listings.push(listing);
        listings.splice(index, 1); // consuming matched listing
      }
    });
    if (resultLine.listings.length > 0) {
      results.push(resultLine);
    }
  });
  callback(results);
};

module.exports = {
  extract
};