var TwitterPackage = require('twitter');
var schedule = require('node-schedule');

var secret = {
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
}
var Twitter = new TwitterPackage(secret);

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
function sendTweets() {
    Twitter.get('statuses/user_timeline',{'screen_name':'paradigmate'},function(error, tweets, response) {
        if (!error) {
            var idsDates = [];
            for(var i = 0; i < tweets.length;i++){
                var twe = tweets[i];
                var d = new Date(twe.created_at);
                var d2 = new Date();
                if(formatDate(d) === formatDate(d2)){
                    idsDates.push(twe.id_str);
                }
            }
            for(var i = 0; i< idsDates.length; i++){
                var interval = 10 * 1000; // 10 seconds;

                setTimeout( function (i) {
                    var ids = idsDates[i];
                    console.log(ids)
                    Twitter.post('statuses/update', {status: '@paradigmate https://twitter.com/paradigmate/status/'+ids},  function(error, tweet, response){
                        if(error){
                            console.log(error);
                        }
                    });
                }, interval * i, i);
            }
        }
    });
}
var j = schedule.scheduleJob('*/20 * * * *', sendTweets);