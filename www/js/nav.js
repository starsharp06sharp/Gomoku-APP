// Tiny page/dialog navigation helper.
// Replaces $.mobile.changePage and $.mobile.dialog. Pages are mutually
// exclusive (only one .active at a time); dialogs stack on top of the
// current page with a backdrop. Visual transitions are pure CSS fades
// driven by the .active / .open / .visible classes.
var nav = (function(){
    var dialogStack = [];

    function getMask(){
        return document.getElementById('dialog-mask');
    }

    function syncMask(){
        var mask = getMask();
        if (!mask) return;
        if (dialogStack.length > 0) mask.classList.add('visible');
        else mask.classList.remove('visible');
    }

    function show(pageId){
        var pages = document.querySelectorAll('.page');
        for (var i = 0; i < pages.length; i++){
            if (pages[i].id === pageId) pages[i].classList.add('active');
            else pages[i].classList.remove('active');
        }
        // Showing a page closes any open dialogs.
        closeAll();
    }

    function openDialog(id){
        var el = document.getElementById(id);
        if (!el) return;
        // Avoid duplicate entries if reopened.
        var existing = dialogStack.indexOf(id);
        if (existing >= 0) dialogStack.splice(existing, 1);
        dialogStack.push(id);
        el.classList.add('open');
        syncMask();
    }

    function close(id){
        var targetId = id || dialogStack[dialogStack.length - 1];
        if (!targetId) return;
        var el = document.getElementById(targetId);
        if (el) el.classList.remove('open');
        var idx = dialogStack.indexOf(targetId);
        if (idx >= 0) dialogStack.splice(idx, 1);
        syncMask();
    }

    function closeAll(){
        while (dialogStack.length > 0){
            var id = dialogStack.pop();
            var el = document.getElementById(id);
            if (el) el.classList.remove('open');
        }
        syncMask();
    }

    function isOpen(id){
        return dialogStack.indexOf(id) >= 0;
    }

    return {
        show: show,
        openDialog: openDialog,
        close: close,
        closeAll: closeAll,
        isOpen: isOpen
    };
})();
