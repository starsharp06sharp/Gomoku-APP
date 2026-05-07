document.addEventListener('DOMContentLoaded', function(){
    var game = new Game(document.querySelector('.go-board'), document.querySelector('.board tbody'));

    var adjustSize = adjustSizeGen();

    window.addEventListener('resize', adjustSize);

    adjustSize();

    function onChange(selector, fn){
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++){
            nodes[i].addEventListener('change', fn);
        }
    }

    function onClick(selector, fn){
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++){
            nodes[i].addEventListener('click', fn);
        }
    }

    onChange('#mode-select input[type="radio"]', function(){
        gameData.mode = this.value;
    });

    onChange('#color-select input[type="radio"]', function(){
        gameData.color = this.value;
    });

    onChange('#level-select input[type="radio"]', function(){
        gameData.level = this.value;
    });

    onChange('#lang-select input[type="radio"]', function(){
        i18n.setPref(this.value);
    });

    onClick('.back-to-game', function(){
        nav.closeAll();
        nav.show('game-page');
    });

    onClick('.open-new-game', function(){
        nav.openDialog('new-game');
    });

    onClick('.open-help', function(){
        nav.openDialog('help-page');
    });

    document.getElementById('start-game').addEventListener('click', function(){
        try {
            game.white.worker.terminate();
            game.black.worker.terminate();
        } catch (e) {}
        if (gameData.mode === 'vshuman'){
            game.mode = 'hvh';
            game.init(new HumanPlayer('black'), new HumanPlayer('white'));
        } else {
            var color, other;
            if (gameData.color === 'black'){
                color = 'black';
                other = 'white';
            } else {
                color = 'white';
                other = 'black';
            }
            game.mode = gameData.level;
            game.init(new HumanPlayer(color), new AIPlayer(game.mode, other));
        }
        nav.closeAll();
        nav.show('game-page');
        game.start();
        setTimeout(function(){
            var nodes = document.querySelectorAll('.back-to-game');
            for (var i = 0; i < nodes.length; i++) nodes[i].disabled = false;
        }, 100);
    });

    document.getElementById('undo-button').addEventListener('click', function(){
        game.undo();
    });

    var faceWrappers = document.querySelectorAll('.fullscreen-wrapper');
    for (var i = 0; i < faceWrappers.length; i++){
        faceWrappers[i].addEventListener('click', function(e){
            hideFace(e.currentTarget);
            nav.openDialog('game-won');
        });
    }

    gameData.load();
    var langInput = document.querySelector('#lang-select input[value="' + i18n.getPref() + '"]');
    if (langInput) langInput.checked = true;

    var backButtons = document.querySelectorAll('.back-to-game');
    for (var j = 0; j < backButtons.length; j++) backButtons[j].disabled = true;

    i18n.refreshDom();
    nav.show('game-page');
    nav.openDialog('new-game');

    window.gameInfo = (function(){
        var blinking = false,
            currentKey = '',
            color = '';

        var self = {};

        self.getBlinking = function(){
            return blinking;
        };

        var mainObj = document.getElementById('game-info');
        self.setBlinking = function(val){
            if (val !== blinking){
                blinking = val;
                if (val) mainObj.classList.add('blinking');
                else mainObj.classList.remove('blinking');
            }
        };

        self.getText = function(){
            return currentKey ? i18n.t(currentKey) : '';
        };

        var textObj = document.querySelector('#game-info > .cont');
        self.setText = function(key){
            currentKey = key;
            textObj.setAttribute('data-i18n', key);
            textObj.innerHTML = i18n.t(key);
        };

        self.getColor = function(){
            return color;
        };

        var colorObj = document.querySelector('#game-info > .go');
        self.setColor = function(c){
            color = c;
            colorObj.classList.remove('white');
            colorObj.classList.remove('black');
            if (c) colorObj.classList.add(c);
        };

        return self;
    })();
});

// Show a fullscreen face overlay with a CSS opacity transition.
function showFace(el){
    el.style.display = 'block';
    // Force a reflow so the next class change triggers a transition.
    void el.offsetWidth;
    el.classList.add('show');
}

function hideFace(el){
    el.classList.remove('show');
    el.style.display = 'none';
}

function showWinDialog(game){
    gameInfo.setBlinking(false);
    var titleKey, descKey;
    if (game.mode === 'hvh'){
        var color = game.getCurrentPlayer().color;
        titleKey = 'result.colorWin.' + color + '.title';
        descKey = 'result.colorWin.' + color + '.desc';
        showFace(document.getElementById('happy-outer'));
    } else {
        if (game.getCurrentPlayer() instanceof HumanPlayer){
            titleKey = 'result.youWin.title';
            descKey = 'result.youWin.desc';
            showFace(document.getElementById('sad-outer'));
        } else {
            titleKey = 'result.youLost.title';
            descKey = 'result.youLost.desc';
            showFace(document.getElementById('happy-outer'));
        }
    }
    var titleEl = document.querySelector('#game-won h4');
    titleEl.setAttribute('data-i18n', titleKey);
    titleEl.innerHTML = i18n.t(titleKey);
    var descEl = document.getElementById('win-content');
    descEl.setAttribute('data-i18n', descKey);
    descEl.innerHTML = i18n.t(descKey);
}
