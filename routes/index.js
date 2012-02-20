/*
 * GET home page.
 */
var  twitter = require('twitter');
var colors = ['red','yellow', 'green', 'blue'];
var tweet = new twitter();
var _und = require("underscore");





exports.index = function(req, res){
  res.render('index', {
    title: 'Home'
  });
  };


exports.fridge = function(req, res){
  res.render('index', {
      title: 'Home'
    });
};





exports.fridgejson = function(req,res){
  var fridgeProvider = req.app.settings['fridgeProvider'];
  var fridge;
  console.log(req.params.id);

  fridgeProvider.find({tweet_id: req.params.id.toString()}, function(error, f){
    console.log('fridge found: ' + f);
    fridge = f;
    if(!fridge)
    {
      tweet.get('/statuses/show/' + req.params.id + '.json', {include_entities:false}, function(data) {
          // blocking -> push this down a socket
        console.log(data);
          if(data.text)
          {

          fridge = {};
          fridge.letters = [];
          var l = data.text.split('');
          var i = 1;
          _und.each(l, function(letter){
            var color = colors[Math.floor(Math.random()*colors.length)];
            fridge.letters.push({value:letter, x:0, y:0, color:color, id:i })
            i++;
          });

          fridge.tweet_id =data.id_str;
          fridge.twitter_user = data.user;

            fridgeProvider.save([fridge],function(error, fridges){
              res.json(fridge);
          })

          }

      });
    }
    else
    {
      res.json(fridge);
    }

    })


};

