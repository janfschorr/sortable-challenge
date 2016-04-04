var fs = require('fs');

var read2list =  function (path, callback) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) throw err;
    if (typeof data !== typeof undefined
        && typeof data === "string") {
      var dataAry = data.split("\n");
      var outputAry = [];
      dataAry.forEach(function (line) {
        if (line !== "") {
          outputAry.push(JSON.parse(line));
        }
      });
      callback(outputAry);
    }
  });
};

var list2file =  function (path, data, callback) {
  var file = fs.createWriteStream(path);
  file.on('error', function(err) { console.log(err) });
  data.forEach(function(item) {
    file.write(JSON.stringify(item).replace("\n", "") + '\n');
  });
  file.end();
  callback();
};

module.exports = {
  read2list,
  list2file
};