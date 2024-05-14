function refreshCSS() {
    var sheets = [].slice.call(document.getElementsByTagName("link"));
    var head = document.getElementsByTagName("head")[0];
    for (var i = 0; i < sheets.length; ++i) {
        var elem = sheets[i];
        var parent = elem.parentElement || head;
        parent.removeChild(elem);
        var rel = elem.rel;
        if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
            var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
            elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
        }
        parent.appendChild(elem);
    }
}
console.log(`%cDesigned and implemented by Martin OCHO. 
For more information, please visit my GitHub profile: https://github.com/OchoKOM/. 
All rights reserved, 2024.`, 'color: dodgerblue; font-size: 20px;');
console.log('%cConçu et réalisé par Martin OCHO. Pour plus d\'informations, veuillez visiter mon profil GitHub : https://github.com/OchoKOM/. Tous droits réservés, 2024.', 'color: dodgerblue; font-size: 20px;');

// refreshCSS();