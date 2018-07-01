var express = require('express');
var router = express.Router();
var https = require('https');


function convertCurrency(amount, fromCurrency, toCurrency, cb) {

  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  var query = fromCurrency + '_' + toCurrency;

  var url = 'https://www.currencyconverterapi.com/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra';

  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          try {
            var jsonObj = JSON.parse(body);

            var val = jsonObj[query];
            if (val) {
              var total = val * amount;
              cb(null, Math.round(total * 100) / 100);
            } else {
              var err = new Error("Value not found for " + query);
              console.log(err);
              cb(err);
            }
          } catch(e) {
            console.log("Parse error: ", e);
            cb(e);
          }
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
        cb(e);
  });
}

//uncomment to test

convertCurrency(10, 'USD', 'PHP', function(err, amount) {
  console.log(amount);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



/*GET currencyconverterapi
/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra
/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra&callback=sampleCallback
/api/v5/currencies
/api/v5/countries
/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra&date=[yyyy-mm-dd]
/api/v5/convert?q=USD_PHP,PHP_USD&compact=ultra&date=[yyyy-mm-dd]&endDate=[yyyy-mm-dd]
/others/usage
*/
module.exports = router;

