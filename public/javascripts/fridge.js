/**
 * Created by JetBrains WebStorm.
 * User: paulcampbell
 * Date: 19/02/2012
 * Time: 13:58
 * To change this template use File | Settings | File Templates.
 */

var socket = io.connect('http://localhost');
  socket.on('new_user', function (data) {
    console.log(data);
  });

  socket.on('new_user', function (data) {
    console.log(data);
  });

  socket.on('letter_position_update', function(data) {
console.log(    data
);
 var letterDiv = $('div[data-sid="' + data.payload.id + '"]:first');
    var moveToX, moveToY;
    moveToX =  data.payload.x - letterDiv.position().left;
    moveToY =  data.payload.y - letterDiv.position().top;
    $('div[data-sid="' + data.payload.id + '"]')
    .animate({
        left: moveToX ,
        top: moveToY
      }, 1000, function() {
        // Animation complete.
      });;



  });




$(document).ready(function(){
  var fid = window.location.pathname.substring( window.location.pathname.lastIndexOf('/')+1);
  $.ajax({
    url: '/api/fridge/' + fid,
    dataType: 'json',
    success: function(data){
     console.log(data);
      var fridge = data;

      _.each(fridge.letters, function(l){
          PlaceLetter(l);
        AddLetterNoise(l.id);
      });

      $( ".letter" ).draggable({ containment: 'parent'});
      $('body').droppable( {
           drop: LetterDropped
         });
    }
  });



});

function LetterDropped(event, ui) {
          console.log(event);
          var letterID = ui.draggable.attr('data-sid');
          var letter= {tweet_id: 171712426067243009,id: letterID, x: ui.draggable.position().left, y: ui.draggable.position().top};
          UpdateLetter(letter);

        }

function PlaceLetter(letter){
  console.log('placing letter')
  $('#fridge-door').append($('<div data-sid="' + letter.id + '" class="letter ' + letter.color + '">' + letter.value + '</div>'))
  AddLetterNoise(letter.id);
};

function UpdateLetter(letter){
  AddLetterNoise(letter.id);
  console.log('placing letter - sending... ' + letter);
  socket.emit('letter_moved', { payload: letter });

};


function AddLetterNoise(letterId)
{
  var rotateCSS = 'rotate(' + ((Math.random() * (15)) - 7.5) + 'deg)';
  $('[data-sid="' + letterId +  '"]').css({'-moz-transform': rotateCSS,
        '-webkit-transform': rotateCSS});
};