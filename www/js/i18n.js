// Lightweight i18n for Gomoku app.
// Supported langs: zh-CN (简体中文), zh-HK (港繁), zh-TW (台繁), en.
// User preference is stored in localStorage; "system" follows navigator.language.
var i18n = (function(){
    var STORAGE_KEY = 'yyjhao.gomoku.lang';
    var DEFAULT_LANG = 'en';
    var SUPPORTED = ['zh-CN', 'zh-HK', 'zh-TW', 'en'];

    var dicts = {
        'en': {
            'appTitle': 'Gomoku',
            'gameInfo.yourTurn': 'Your turn',
            'gameInfo.thinking': 'Thinking...',
            'gameInfo.turn.black': "Black's turn.",
            'gameInfo.turn.white': "White's turn.",

            'btn.newGame': 'New Game',
            'btn.undo': 'Undo',
            'btn.about': 'About',
            'btn.back': 'Back',
            'btn.start': 'Start',
            'btn.startNewGame': 'Start A New Game',

            'dialog.newGame.title': 'New Game',
            'dialog.newGame.playWith': 'Play with',
            'dialog.newGame.color': 'Your Color',
            'dialog.newGame.level': 'Level Of Difficulty',
            'dialog.newGame.language': 'Language',

            'opt.human': 'Human',
            'opt.computer': 'Computer',
            'opt.black': 'Black',
            'opt.white': 'White',
            'opt.novice': 'Novice',
            'opt.medium': 'Medium',
            'opt.expert': 'Expert',
            'opt.lang.system': 'Follow system',
            'opt.lang.zh-CN': '简体中文',
            'opt.lang.zh-HK': '繁體中文（香港）',
            'opt.lang.zh-TW': '繁體中文（台灣）',
            'opt.lang.en': 'English',

            'about.title': 'About',
            'about.content': "<p>An offline Gomoku app with HTML5 Web Worker AI, adapted from <a href='http://yjyao.com/2012/06/gomoku-in-html5.html' target='_blank'>Yujian Yao's HTML5-Gomoku</a>.</p><p>Made for passing time in completely offline environments — like flights. Have fun beating, or being beaten by, the AI!</p><p>Source code: <a href='https://github.com/starsharp06sharp/Gomoku-APP' target='_blank'>github.com/starsharp06sharp/Gomoku-APP</a></p>",

            'result.youWin.title': 'You Won!',
            'result.youWin.desc': 'You won the game. Play again?',
            'result.youLost.title': 'You Lost.',
            'result.youLost.desc': 'Meh. You lost to the computer. Play again?',
            'result.colorWin.black.title': 'Black Won!',
            'result.colorWin.white.title': 'White Won!',
            'result.colorWin.black.desc': 'Black won the game. Play again?',
            'result.colorWin.white.desc': 'White won the game. Play again?'
        },

        'zh-CN': {
            'appTitle': '五子棋',
            'gameInfo.yourTurn': '轮到你了',
            'gameInfo.thinking': '思考中…',
            'gameInfo.turn.black': '黑棋回合',
            'gameInfo.turn.white': '白棋回合',

            'btn.newGame': '新对局',
            'btn.undo': '悔棋',
            'btn.about': '关于',
            'btn.back': '返回',
            'btn.start': '开始',
            'btn.startNewGame': '开始新对局',

            'dialog.newGame.title': '新对局',
            'dialog.newGame.playWith': '对手',
            'dialog.newGame.color': '你执',
            'dialog.newGame.level': '难度',
            'dialog.newGame.language': '语言',

            'opt.human': '玩家',
            'opt.computer': '电脑',
            'opt.black': '黑棋',
            'opt.white': '白棋',
            'opt.novice': '入门',
            'opt.medium': '中等',
            'opt.expert': '高手',
            'opt.lang.system': '跟随系统',
            'opt.lang.zh-CN': '简体中文',
            'opt.lang.zh-HK': '繁體中文（香港）',
            'opt.lang.zh-TW': '繁體中文（台灣）',
            'opt.lang.en': 'English',

            'about.title': '关于',
            'about.content': "<p>离线五子棋，AI 由 HTML5 Web Worker 在后台计算。基于 <a href='http://yjyao.com/2012/06/gomoku-in-html5.html' target='_blank'>Yujian Yao 的 HTML5-Gomoku</a> 改造。</p><p>专为飞机这种完全离线的场景打造，玩得开心！</p><p>项目源码：<a href='https://github.com/starsharp06sharp/Gomoku-APP' target='_blank'>github.com/starsharp06sharp/Gomoku-APP</a></p>",

            'result.youWin.title': '你赢了！',
            'result.youWin.desc': '你赢得了这局。再来一局？',
            'result.youLost.title': '你输了。',
            'result.youLost.desc': '可惜，被电脑赢了。再来一局？',
            'result.colorWin.black.title': '黑棋胜！',
            'result.colorWin.white.title': '白棋胜！',
            'result.colorWin.black.desc': '黑棋赢得了这局。再来一局？',
            'result.colorWin.white.desc': '白棋赢得了这局。再来一局？'
        },

        'zh-HK': {
            'appTitle': '五子棋',
            'gameInfo.yourTurn': '輪到你',
            'gameInfo.thinking': '思考中…',
            'gameInfo.turn.black': '黑棋回合',
            'gameInfo.turn.white': '白棋回合',

            'btn.newGame': '新對局',
            'btn.undo': '悔棋',
            'btn.about': '關於',
            'btn.back': '返回',
            'btn.start': '開始',
            'btn.startNewGame': '開始新對局',

            'dialog.newGame.title': '新對局',
            'dialog.newGame.playWith': '對手',
            'dialog.newGame.color': '你執',
            'dialog.newGame.level': '難度',
            'dialog.newGame.language': '語言',

            'opt.human': '玩家',
            'opt.computer': '電腦',
            'opt.black': '黑棋',
            'opt.white': '白棋',
            'opt.novice': '入門',
            'opt.medium': '中等',
            'opt.expert': '高手',
            'opt.lang.system': '跟隨系統',
            'opt.lang.zh-CN': '简体中文',
            'opt.lang.zh-HK': '繁體中文（香港）',
            'opt.lang.zh-TW': '繁體中文（台灣）',
            'opt.lang.en': 'English',

            'about.title': '關於',
            'about.content': "<p>離線五子棋，AI 由 HTML5 Web Worker 喺後台計算。基於 <a href='http://yjyao.com/2012/06/gomoku-in-html5.html' target='_blank'>Yujian Yao 嘅 HTML5-Gomoku</a> 改造。</p><p>專為搭飛機呢類完全離線嘅場景而設，玩得開心！</p><p>項目源碼：<a href='https://github.com/starsharp06sharp/Gomoku-APP' target='_blank'>github.com/starsharp06sharp/Gomoku-APP</a></p>",

            'result.youWin.title': '你贏咗！',
            'result.youWin.desc': '你贏咗呢局。再嚟一局？',
            'result.youLost.title': '你輸咗。',
            'result.youLost.desc': '可惜，俾電腦贏咗。再嚟一局？',
            'result.colorWin.black.title': '黑棋勝！',
            'result.colorWin.white.title': '白棋勝！',
            'result.colorWin.black.desc': '黑棋贏咗呢局。再嚟一局？',
            'result.colorWin.white.desc': '白棋贏咗呢局。再嚟一局？'
        },

        'zh-TW': {
            'appTitle': '五子棋',
            'gameInfo.yourTurn': '輪到你了',
            'gameInfo.thinking': '思考中…',
            'gameInfo.turn.black': '黑棋回合',
            'gameInfo.turn.white': '白棋回合',

            'btn.newGame': '新對局',
            'btn.undo': '悔棋',
            'btn.about': '關於',
            'btn.back': '返回',
            'btn.start': '開始',
            'btn.startNewGame': '開始新對局',

            'dialog.newGame.title': '新對局',
            'dialog.newGame.playWith': '對手',
            'dialog.newGame.color': '你執',
            'dialog.newGame.level': '難度',
            'dialog.newGame.language': '語言',

            'opt.human': '玩家',
            'opt.computer': '電腦',
            'opt.black': '黑棋',
            'opt.white': '白棋',
            'opt.novice': '入門',
            'opt.medium': '中等',
            'opt.expert': '高手',
            'opt.lang.system': '跟隨系統',
            'opt.lang.zh-CN': '简体中文',
            'opt.lang.zh-HK': '繁體中文（香港）',
            'opt.lang.zh-TW': '繁體中文（台灣）',
            'opt.lang.en': 'English',

            'about.title': '關於',
            'about.content': "<p>離線五子棋，AI 由 HTML5 Web Worker 在背景計算。基於 <a href='http://yjyao.com/2012/06/gomoku-in-html5.html' target='_blank'>Yujian Yao 的 HTML5-Gomoku</a> 改造。</p><p>專為搭飛機這類完全離線的場景而設，玩得開心！</p><p>專案原始碼：<a href='https://github.com/starsharp06sharp/Gomoku-APP' target='_blank'>github.com/starsharp06sharp/Gomoku-APP</a></p>",

            'result.youWin.title': '你贏了！',
            'result.youWin.desc': '你贏得了這局。再來一局？',
            'result.youLost.title': '你輸了。',
            'result.youLost.desc': '可惜，被電腦贏了。再來一局？',
            'result.colorWin.black.title': '黑棋勝！',
            'result.colorWin.white.title': '白棋勝！',
            'result.colorWin.black.desc': '黑棋贏得了這局。再來一局？',
            'result.colorWin.white.desc': '白棋贏得了這局。再來一局？'
        }
    };

    function detectSystemLang(){
        var nav = (navigator.languages && navigator.languages[0]) ||
                  navigator.language || navigator.userLanguage || '';
        var lower = String(nav).toLowerCase();
        if(lower.indexOf('zh') === 0){
            if(lower.indexOf('hk') >= 0 || lower.indexOf('mo') >= 0) return 'zh-HK';
            if(lower.indexOf('tw') >= 0) return 'zh-TW';
            if(lower.indexOf('hant') >= 0) return 'zh-TW';
            return 'zh-CN';
        }
        if(lower.indexOf('en') === 0) return 'en';
        return DEFAULT_LANG;
    }

    function readPref(){
        try { return localStorage[STORAGE_KEY] || 'system'; }
        catch(e){ return 'system'; }
    }

    function writePref(pref){
        try { localStorage[STORAGE_KEY] = pref; } catch(e){}
    }

    function resolveLang(pref){
        if(pref === 'system' || !pref) return detectSystemLang();
        if(SUPPORTED.indexOf(pref) >= 0) return pref;
        return DEFAULT_LANG;
    }

    var currentPref = readPref();
    var currentLang = resolveLang(currentPref);
    var listeners = [];

    function t(key){
        var dict = dicts[currentLang] || dicts[DEFAULT_LANG];
        if(dict[key] !== undefined) return dict[key];
        var fb = dicts[DEFAULT_LANG];
        return (fb && fb[key] !== undefined) ? fb[key] : key;
    }

    // Refresh all elements that have a `data-i18n="key"` attribute.
    function refreshDom(){
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++){
            nodes[i].innerHTML = t(nodes[i].getAttribute('data-i18n'));
        }
        document.title = t('appTitle');
        document.documentElement.lang = currentLang;
    }

    function onLangChange(fn){ listeners.push(fn); }

    function setPref(pref){
        currentPref = pref;
        writePref(pref);
        currentLang = resolveLang(pref);
        refreshDom();
        for(var i = 0; i < listeners.length; i++){
            try { listeners[i](); } catch(e){ console.log(e); }
        }
    }

    return {
        SUPPORTED: SUPPORTED,
        getPref: function(){ return currentPref; },
        getLang: function(){ return currentLang; },
        setPref: setPref,
        t: t,
        refreshDom: refreshDom,
        onLangChange: onLangChange,
        detectSystemLang: detectSystemLang
    };
})();
