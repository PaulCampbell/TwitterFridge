
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes'),
    sys = require('sys'),
    io = require('socket.io'),
    MemoryStore = express.session.MemoryStore,
    app = express.createServer(),
    sessionStore = new MemoryStore();



var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
      app.use(express.session({store: sessionStore
          , secret: 'secret'
          , key: 'express.sid'}));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/fridge/:id', routes.fridge);
app.get('/api/fridge/:id', routes.fridgejson);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);





//-------- SOCKETS ------------//

var sio = io.listen(app);

sio.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    console.log('A socket with sessionID ' + hs.sessionID
        + ' connected!');
    // setup an inteval that will keep our session fresh
    var intervalID = setInterval(function () {
        hs.session.reload( function () {
            hs.session.touch().save();
        });
    }, 60 * 1000);


    socket.on('disconnect', function () {
        console.log('A socket with sessionID ' + hs.sessionID
            + ' disconnected!');
        // clear the socket interval to stop refreshing the session
        clearInterval(intervalID);
    });

    socket.on('letter_moved', function (data) {
      console.log(data);
      // update database - send to clients
      socket.broadcast.emit('letter_position_update', data);
    });

});

var parseCookie = require('connect').utils.parseCookie;

var Session = require('connect').middleware.session.Session;
sio.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        // save the session store to the data object
        // (as required by the Session constructor)
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                data.session = new Session(data, session);
                accept(null, true);

                sio.sockets.emit('new_user',{message: 'user connected'})
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});