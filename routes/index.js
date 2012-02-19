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
  res.render('index', {
      title: 'Home'
    });
};

exports.fridgejson = function(req,res){
  var fridge;
  console.log(req.params.id);

  /*
  req.app.settings['fridgeProvider'].findById(1, function(f){
    fridge = f;
  })
  */

  if(!fridge)
  {
    req.app.settings['twitter'].get('/statuses/show/' + req.params.id + '.json', {include_entities:false}, function(data) {
      // blocking -> push this down a socket
        var _und = req.app.settings['underscore'];
        fridge = {};
      fridge.letters = [];

        var l = data.text.split('');
        var i = 1;
        _und.each(l, function(letter){
          var color = colors[Math.floor(Math.random()*colors.length)];
          fridge.letters.push({value:letter, x:0, y:0, color:color, _id:i })
          i++;
        });

      fridge.id = data.id_str;
      fridge.twitter_user = data.user;

      req.app.settings['fridgeProvider'].save(fridge, function(f){
          console.log(fridge);
          res.json(fridge);
        })


    });
  }


};

