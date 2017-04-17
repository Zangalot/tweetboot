var TwitterPackage = require('twitter');
var schedule = require('node-schedule');

var secret = {
  consumer_key: 'fo1Kba98RLGRDWRalZZ7f0xIk',
  consumer_secret: 'W6bS9ycQyG4aPaSfmYocELlpFMzaqH6DhfaSYmeHyyXl52CT5s',
  access_token_key: '2577416416-XGXhR6yAFHJh3Dakp8ji826Y95IKuLq56OSn5FU',
  access_token_secret: 'VQIeDcJCRX2qJGEHIR38acbiGsVaAnud8stFZuveH3GKN'
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