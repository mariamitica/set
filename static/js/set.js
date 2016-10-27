var Set = (function(){

  set = [];

  score = 0;

  timeSlot = 300; //seconds

  tm = setInterval(countDown, 1000);

  function init() {

    initCards();
    initCheckNoSet();  
    initHint();  
    initRestart();
    colorScore();
  }

  function initRestart(){
    
    $('.restart').on('click', function(ev){

      ev.preventDefault();

      location.reload('true');

    });
  }

  function countDown(){

    this.timeSlot--;

    if(this.timeSlot == 0){

      clearInterval(this.tm);

      $('#game-over').modal({backdrop: 'static', keyboard: false});

      $('.w2p_flash').slideUp();

      this.set = [];

      score = 0;

    }   

    $('#timer').val(this.timeSlot);
  }

  function initCards(){

    var game=this;
  
    $('.card').each(function(){

      $(this).hover(function(){

        $(this).addClass('active');

    }.bind(this), function(){

        $(this).removeClass('active');

    }.bind(this));

      $(this).click(function(){

        var elementId = this.id;
      
        if ($(this).hasClass('selected')){

          $(this).removeClass('selected');

          game.set.splice($.inArray(elementId, game.set), 1);

        } else {

        $(this).addClass('selected');

        if (game.set.length < 3 && $(this).hasClass('selected')){

          game.set.push(this.id);
        }

        if (game.set.length == 3){

          checkSet();

        }

        }

      }.bind(this));

    });

  }

  function initCheckNoSet(){

    var game=this;

    $('#no-set').on('click', function(ev){

      ev.preventDefault();

      $.ajax({

      url: "/set/cards/check_no_set",

      dataType: 'json'

    }).done(function( data ) {

      if (data.length > 0){

        decreaseScore('There is a set!');

      } else {

        increaseScore(false);

        generateAdditionalCardsNoSet();

      }
    });

    });

  } 

  function colorScore(){

    switch (true){

      case (this.score < 0):
        $('#final-score').css('color', 'red');
        break;
      case (this.score > 0 && this.score < 10):
        $('#final-score').css('color', 'yellow');
        break;
      case (this.score >= 10 && this.score < 20):
        $('#final-score').css('color', 'orange');
        break;
      case (this.score >= 20 && this.score < 30):
        $('#final-score').css('color', 'green');
        break;
      case (this.score >= 30 && this.score < 40):
        $('#final-score').css('color', 'blue');
        break;
      case (this.score >= 40 && this.score < 50):
        $('#final-score').css('color', 'brown');
        break;
      case (this.score >= 50):
        $('#final-score').css('color', 'black');
        break;
    }

  }

  function initHint(){

    var game=this;

    $('#hint').on('click', function(ev){

      ev.preventDefault();

      $.ajax({

      url: "/set/cards/check_no_set",

      dataType: 'json'

    }).done(function( data ) {

      if (data.length > 0){

        $('#' + data[0]).css('animation-duration', '5s');

        $('#' + data[0]).css('animation-name', 'showHint');

        decreaseScore('Penalty 1p!');

      } else {

        generateAdditionalCardsNoSet();

        $('.w2p_flash').html('There is no set!').slideDown();

      }

    });

    });

  }

  function checkSet(){

    var sets = [], k=0, game=this;

    for (var i = 0; i < game.set.length; i++){

      sets[k] = game.set[i].split('-');

      k+=1;

    }

    if ((((sets[0][0] == sets[1][0]) && (sets[1][0] == sets[2][0])) || ((sets[0][0] != sets[1][0]) && (sets[1][0] != sets[2][0]) && (sets[0][0] != sets[2][0]))) &&
      (((sets[0][1] == sets[1][1]) && (sets[1][1] == sets[2][1])) || ((sets[0][1] != sets[1][1]) && (sets[1][1] != sets[2][1]) && (sets[0][1] != sets[2][1]))) && 
      (((sets[0][2] == sets[1][2]) && (sets[1][2] == sets[2][2])) || ((sets[0][2] != sets[1][2]) && (sets[1][2] != sets[2][2]) && (sets[0][2] != sets[2][2])))){     

      increaseScore(true);      

    } else {    

      decreaseScore('That is not a set!');

    }

  }

  function increaseScore(bool){

    console.log('You found a set!! => ', this.set);

    this.score += 1;

    $('#final-score').html(this.score);

    colorScore();

    $('.w2p_flash').slideUp();

    if (bool == true) {

      replaceCards();

    }

  }

  function decreaseScore(message){

    console.log('No set! => ', this.set);

    $('.w2p_flash').html(message).slideDown(); 

    this.score -= 1;

    $('#final-score').html(this.score);

    colorScore();

    $('.card').removeClass('selected');

    this.set = [];

  }

  function replaceCards(){

    var game=this;

    $(game.set).each(function(){

      var parent = $('#' + this).parent();

      parent.empty();

    });  

    if ($('.card-container.extra.hidden').length < 3){

      $('.card-container.extra').each(function(){

        $(this).find('svg').css('border', 'none');

        $($('.card-container.normal:empty')[0]).html($(this).html());

        $(this).empty();

        $(this).addClass('hidden');     

        $('.card').off();    

        initCards();

      });
    
    }    

    generateAdditionalCardsSet();    

  }

  function generateAdditionalCardsSet(){

    var game=this;

    $.ajax({

      type: "POST",

      url: "/set/cards/get_additional_cards_set",

      data: {set : game.set},

      dataType: 'json'

    }).done(function( data ) {

      if ($('.card-container.normal:empty').length > 0) {

      $('.card-container.normal:empty').each(function(idx, item){

        $(this).html(data[idx]);

      });

      }

      game.set = [];

      $('.card').off();   

      initCards();      

    });

  }

  function generateAdditionalCardsNoSet(){

    var game=this;

    $.ajax({

      type: "GET",

      url: "/set/cards/get_additional_cards_no_set",

      dataType: 'json'

    }).done(function( data ) {

      $('.card-container.extra').each(function(idx, item){

        $(this).html(data[idx]);

        $(this).find('svg').css('border', '2px solid red');

        $(this).removeClass('hidden');

      });

      game.set = [];

      $('.card').off();   

      initCards();      

    });

  }

  return {
    init: init
      
  }

}());

Set.init();