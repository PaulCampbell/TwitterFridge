/*
 * GET home page.
 */

var colors = ['red','yellow', 'green', 'blue'];




exports.index = function(req, res){
  res.render('index', {
    title: 'Home'
  });
  };


exports.fridge = function(req, res){
  res.render('fridge', {
    title: 'Fridge'
  });
};

exports.fridgejson = function(req,res){
  req.app.settings['twitter'].get('/statuses/show/27593302936.json', {include_entities:false}, function(data) {
    // blocking -> push this down a socket
var _und = req.app.settings['underscore'];
      var fridge1 = {};
      fridge1.letters = [];

      var l = data.text.split('');
    var i = 1;
      _und.each(l, function(letter){
        var color = colors[Math.floor(Math.random()*colors.length)];
        fridge1.letters.push({value:letter, x:0, y:0, color:color, id:i })
        i++;
      });

      fridge1.id = data.id_str;
      fridge1.twitter_user = data.user;

      console.log(fridge1);
      res.json(fridge1);
  });


};

