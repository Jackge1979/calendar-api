//parse string to array by bit
String.prototype.parseToArray = function(bit, s) {
    var ret = this.split(s || "|");
    return bit ? function(l, n){
        for(; l--;) ret[l] = parseInt(ret[l], bit);
        return ret;
    }(ret.length) : ret;
}

//fastst trim, form: http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.trim || (String.prototype.trim = function() {
    var str = this,
        str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
});

//replace string by object, like "#{name}"
String.replaceTpl || (String.prototype.replaceTpl = function(o) {
    return this.replace(/#\{([^}]*)\}/mg, function(v, k) {
        return v = o[k.trim()]
    });
});