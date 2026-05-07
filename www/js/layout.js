function setStyles(el, obj){
    if (!el) return;
    for (var k in obj){
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        var v = obj[k];
        if (typeof v === 'number') v = v + 'px';
        var prop = k.replace(/-([a-z])/g, function(_, c){ return c.toUpperCase(); });
        el.style[prop] = v;
    }
}

function setStylesAll(nodes, obj){
    if (!nodes) return;
    for (var i = 0; i < nodes.length; i++) setStyles(nodes[i], obj);
}

function adjustSizeGen(){
    var smallScreen = navigator.userAgent.toLowerCase().match(/(iphone|ipod)/);

    var gameRegion = document.getElementById('game-region'),
        tds = document.querySelectorAll('.board td'),
        board = document.querySelector('.go-board'),
        gameHeader = document.querySelector('header.game-ult'),
        gameInfoEl = document.getElementById('game-info'),
        mainButs = document.getElementById('main-but-group'),
        otherButs = document.getElementById('other-but-group');

    return function(){
        var avaih = window.innerHeight,
            avaiw = window.innerWidth,
            h = Math.max(avaih - 7, avaih * 0.98),
            w = Math.max(avaiw - 7, avaih * 0.98),
            vspace = Math.min(h - 150, w),
            hspace = Math.min(w - 320, h - 40),
            hsize;

        if(smallScreen){
            if(avaih > avaiw){
                vspace = avaiw;
                hspace = 0;
            }else{
                hspace = avaih - 40;
                vspace = 0;
            }
        }

        if(vspace > hspace){
            hsize = Math.min(~~((vspace - 15) / 15 / 2), ~~((avaiw - 22) / 15 / 2));
            setStyles(gameRegion, {
                'padding': hsize + 6,
                'margin-left': -((2*hsize+1)*15+12)/2,
                'padding-top': 100 + hsize,
                'padding-bottom': 50 + hsize,
                'margin-top': -(15 * hsize + 82)
            });
            setStylesAll(tds, { 'padding': hsize });
            setStyles(board, {
                'top': 100,
                'bottom': 50,
                'left': 6,
                'right': 6
            });
            setStyles(gameHeader, { 'line-height': '80px' });
            setStyles(gameInfoEl, {
                'top': 20,
                'width': ((2*hsize+1)*15+12)/2 - 150
            });
            setStyles(mainButs, {
                'top': 6,
                'right': 6,
                'width': 160
            });
            setStyles(otherButs, {
                'bottom': 6,
                'right': 6,
                'width': 160
            });
        }else{
            hsize = ~~((hspace - 15) / 15 / 2);
            setStyles(gameRegion, {
                'padding': hsize + 6,
                'margin-left': -((2*hsize+1)*15+320)/2,
                'padding-left': 160 + hsize,
                'padding-right': 160 + hsize,
                'padding-top': 36 + hsize,
                'margin-top': -(hsize * 15 + 28)
            });
            setStylesAll(tds, { 'padding': hsize });
            setStyles(board, {
                'top': 36,
                'bottom': 6,
                'left': 160,
                'right': 160
            });
            setStyles(gameHeader, { 'line-height': (36 + hsize) + 'px' });
            setStyles(gameInfoEl, {
                'left': 15,
                'top': 36 + hsize,
                'width': 160 + 6 - 45 - hsize/2
            });
            setStyles(mainButs, {
                'top': 36 + hsize,
                'right': 6,
                'width': 160
            });
            setStyles(otherButs, {
                'bottom': 6 + hsize,
                'right': 6,
                'width': 160
            });
        }

    };
}
