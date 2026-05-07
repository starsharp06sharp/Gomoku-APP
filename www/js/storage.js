gameData = {
    prefix: 'yyjhao.gomoku.',
    records: {},
    addRecord: function(name, defaultVal, applyFunc){
        this.records[name] = defaultVal;
        var func = applyFunc || function(){};
        Object.defineProperty(this, name, {
            get: function(){
                return localStorage[this.prefix + name];
            },
            set: function(val){
                func(val);
                localStorage[this.prefix + name] = val;
            }
        });
    },
    ini: function(){
        for (var i in this.records){
            this[i] = this.records[i];
        }
    },
    apply: function(){
        for (var i in this.records){
            this[i] = this[i];
        }
    }
};

function selectRadio(groupId, val){
    var el = document.querySelector('#' + groupId + ' input[value="' + val + '"]');
    if (el) el.checked = true;
}

gameData.addRecord('firstTime', 'firstTime');

gameData.addRecord('mode', 'vscomputer', function(val){
    selectRadio('mode-select', val);
    var nodes = document.querySelectorAll('.vs-computer');
    for (var i = 0; i < nodes.length; i++){
        nodes[i].style.display = (val === 'vshuman') ? 'none' : '';
    }
});

gameData.addRecord('color', 'black', function(val){
    selectRadio('color-select', val);
});

gameData.addRecord('level', 'medium', function(val){
    selectRadio('level-select', val);
});

gameData.load = function(){
    if (!this.firstTime){
        this.ini();
    }
    this.apply();
};
