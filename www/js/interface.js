$(document).ready(function(){
    var game = new Game($(".go-board"), $(".board tbody"));

    var adjustSize = adjustSizeGen();

    $(window).resize(adjustSize);

    adjustSize();
    $.mobile.defaultDialogTransition = 'flip';
    $.mobile.defaultPageTransition = 'flip';
    
    $('#mode-select input[type="radio"]').on('change', function(){
        gameData.mode=$(this).val();
    });
    
    $('#color-select input[type="radio"]').on('change', function(){
        gameData.color=$(this).val();
    });
    
    $('#level-select input[type="radio"]').on('change', function(){
        gameData.level=$(this).val();
    });

    $('#lang-select input[type="radio"]').on('change', function(){
        i18n.setPref($(this).val());
    });

    $('.back-to-game').on('tap',function(){
        $.mobile.changePage('#game-page');
    });
    
    $("#start-game").on('click',function(){
        try{
            game.white.worker.terminate();
            game.black.worker.terminate();
        }catch(e){}
        if(gameData.mode==='vshuman'){
            game.mode='hvh';
            game.init(new HumanPlayer("black"), new HumanPlayer("white"));
        }else{
            var color, other;
            if(gameData.color==='black'){
                color='black';
                other='white';
            }else{
                color='white';
                other='black';
            }
            game.mode=gameData.level;
            game.init(new HumanPlayer(color), new AIPlayer(game.mode, other));
        }
        $.mobile.changePage('#game-page');
        game.start();
        setTimeout(function(){$('.back-to-game').button('enable');},100);
    });

    $("#undo-button").on('tap', function(){
        game.undo();
    });
    
    $('.fullscreen-wrapper').on('tap', function(){
        $(this).hide();
        $.mobile.changePage('#game-won');
    });
    
    $('#new-game').page();
    $('#game-won').page();
    $('#help-page').page();
    gameData.load();
    $('#lang-select input[value="'+i18n.getPref()+'"]').attr('checked', true);
    $('#lang-select input[type="radio"]').checkboxradio('refresh');
    $('.back-to-game').button('disable');
    i18n.refreshDom();
    $.mobile.changePage('#new-game',{changeHash: false});

    window.gameInfo = (function(){
        var blinking = false,
            currentKey = "",
            color = "";

        var self = {};

        self.getBlinking = function(){
            return blinking;
        };

        var mainObj = $("#game-info");
        self.setBlinking = function(val){
            if(val !== blinking){
                blinking = val;
                if(val){
                    mainObj.addClass("blinking");
                }else{
                    mainObj.removeClass("blinking");
                }
            }
        };

        self.getText = function(){
            return currentKey ? i18n.t(currentKey) : "";
        };

        var textObj = $("#game-info>.cont");
        self.setText = function(key){
            currentKey = key;
            textObj.attr('data-i18n', key).html(i18n.t(key));
        };

        self.getColor = function(){
            return color;
        };

        var colorObj = $("#game-info>.go");
        self.setColor = function(color){
            colorObj.removeClass("white").removeClass("black");
            if(color){
                colorObj.addClass(color);
            }
        };

        return self;
    })();
});

function showWinDialog(game){
    gameInfo.setBlinking(false);
    var titleKey, descKey;
    if(game.mode === 'hvh'){
        var color = game.getCurrentPlayer().color;
        titleKey = 'result.colorWin.' + color + '.title';
        descKey = 'result.colorWin.' + color + '.desc';
        $('#happy-outer').fadeIn(500);
    }else{
        if(game.getCurrentPlayer() instanceof HumanPlayer){
            titleKey = 'result.youWin.title';
            descKey = 'result.youWin.desc';
            $('#sad-outer').fadeIn(500);
        }else{
            titleKey = 'result.youLost.title';
            descKey = 'result.youLost.desc';
            $('#happy-outer').fadeIn(500);
        }
    }
    $("#game-won h4").attr('data-i18n', titleKey).html(i18n.t(titleKey));
    $("#win-content").attr('data-i18n', descKey).html(i18n.t(descKey));
}