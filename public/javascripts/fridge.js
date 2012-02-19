/**
 * Created by JetBrains WebStorm.
 * User: paulcampbell
 * Date: 19/02/2012
 * Time: 13:58
 * To change this template use File | Settings | File Templates.
 */


$(document).ready(function(){
  $.ajax({
    url: 'http://localhost:3000/fridge/1.json',
    dataType: 'json',
    success: function(data){
     console.log(data);
      var fridge = data;

      _.each(fridge.letters, function(l){
          PlaceLetter(l);
      });

      $( ".letter" ).draggable({ containment: 'parent',
        stop: function(event, ui) {
          console.log(event);
          var letterID = $(this).attr('data-sid');
          var letter= {id: letterID, x: event.clientX, y:event.clientY};
          UpdateLetter(letter);

        }
      });
    }
  });



});


function PlaceLetter(letter){
  console.log('placing letter')
  $('#fridge-door').append($('<div class="letter ' + letter.color + '">' + letter.value + '</div>'))
};

function UpdateLetter(letter){
  console.log('placing letter - sending... ' + letter);

};