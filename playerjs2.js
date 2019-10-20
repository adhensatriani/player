function checkReferrer(ref) {
    var url = (window.location == window.parent.location) ? document.referrer : '';
    if (url.indexOf(ref) > -1) return true;
    return false;
}
function loadJs(json) {
    var data = JSON.parse(json);
    var exists = false;
    if(/Mobi/i.test(navigator.userAgent)){
        data.clients.forEach(function (e) {
            if (-1 != e.slug.indexOf('_mobile') && checkReferrer([e.slug.replace('_mobile','')])) {
                appendJs(selectJs(e.js, data.js));
                exists = true;
            }
        });
        if(exists){
            return;
        }
        var client = data.clients.filter(function (obj) {
            return obj.slug == "wildcard_mobile";
        });
        if(client.length > 0) {
            appendJs(selectJs(client[0].js, data.js));
            return;
        }
    }
    data.clients.forEach(function (e) {
        if (checkReferrer([e.slug])) {
            appendJs(selectJs(e.js, data.js));
            exists = true;
        }
    });
    if(exists){
        return;
    }
    var client = data.clients.filter(function (obj) {
        return obj.slug == "wildcard";
    });
    if(client.length > 0) {
        appendJs(selectJs(client[0].js, data.js));
    }
}
function selectJs(client, scripts) {
    var result = [];
    client.forEach(function (e) {
        scripts.forEach(function (el) {
            if(el.id == e)
                result.push(el);
        });
    });
    return result;
}
function appendJs(ads) {
    var script, str;
    ads.forEach(function (e) {
        if(1 == e.type){
            script = $('<script/>');
            str = '(function() {';
            str += '    var i = 0;';
            str += '    var $div = $("<div/>");';
            str += '    $div.css({width:"100%", height:"100%", position:"absolute", top:0, left:0, "z-index":9999});';
            if(1 != e.click_number){
                str += '$div.hide();';
            }
            str += '    $div.appendTo("body");';
            str += '    $(document).on("mouseup touchend", function(e) {';
            str += '        i++;';
            str += '        switch (i) {';
            str += '            case ' + (e.click_number - 1) + ':';
            str += '                $div.show();';
            str += '            break;';
            str += '            case ' + e.click_number + ':';
            str += '                var link = "' + e.url + '";';
            str += '            break;';
            str += '        }';
            str += '        if(link == undefined){';
            str += '            $.get("https://stat.livesportbar.net/?' + e.click_number + '");'
            str += '            var w = window.open(link, "_blank", "toolbar=0,location=0,menubar=0");';
            str += '            if(w){';
            str += '                w.blur();';
            str += '                var url = (window.location == window.parent.location) ? document.referrer : window.location.href;';
            str += '                $.get("https://sandbox.sportbar.pm/?wl=" + url);';
            str += '            } else {';
            str += '                var url = (window.location == window.parent.location) ? document.referrer : window.location.href;';
            str += '                $.get("https://sandbox.sportbar.pm/?bl=" + url);';
            str += '            }';
            str += '            window.focus();';
            str += '            var w1 = window.open();';
            str += '            if(w1){';
            str += '                w1.close();';
            str += '            }';
            str += '            return false;';
            str += '        }';
            str += '        if (i >= ' + e.click_number + ') {';
            str += '            $div.hide();';
            str += '        }';
            str += '    });';
            str += '})();';
            script.html(str);
            script.appendTo('body');
        }
        if(2 == e.type){
            script = $('<script/>');
            str = '(function() {';
            str += '    var i = 0;';
            str += '    $(document).on("mouseup touchend", function(e) {';
            str += '        i++;';
            str += '        switch (i) {';
            str += '            case ' + e.click_number + ':';
            str += '                player.api("play");';
            str += '                return false;';
            str += '            break;';
            str += '        }';
            str += '    });';
            str += '})();';
            script.html(str);
            script.appendTo('body');
        }
        if(4 == e.type){
            script = $('<script/>');
            str = 'setTimeout(function(){';
            str += '    player.api("pause");';
            str += '}, ' + (parseInt(e.url)*1000) + ');';
            script.html(str);
            script.appendTo('body');
        }
        if(6 == e.type){
            script = $('<script/>');
            str = e.url;
            script.html(str);
            script.appendTo('body');
        }
    });
    startPlayer();
}
