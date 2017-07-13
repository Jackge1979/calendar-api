(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.CalendarAPI = {})));
}(this, (function (exports) { 'use strict';

//parse string to array by bit
String.prototype.parseToArray = function (bit, s) {
    var ret = this.split(s || "|");
    return bit ? function (l, n) {
        for (; l--;) ret[l] = parseInt(ret[l], bit);
        return ret;
    }(ret.length) : ret;
};

//fastst trim, form: http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.trim || (String.prototype.trim = function () {
    var str = this,
        str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
});

//replace string by object, like "#{name}"
String.replaceTpl || (String.prototype.replaceTpl = function (o) {
    return this.replace(/#\{([^}]*)\}/mg, function (v, k) {
        return v = o[k.trim()];
    });
});

// 公历节日
const FEAST = { "1-1": "元旦节", "2-14": "情人节", "3-5": "雷锋日", "3-8": "妇女节", "3-12": "植树节", "3-15": "消费日", "4-1": "愚人节", "5-1": "劳动节", "5-4": "青年节", "6-1": "儿童节", "7-1": "建党节", "8-1": "建军节", "9-10": "教师节", "10-1": "国庆节", "12-24": "平安夜", "12-25": "圣诞节"

    //农历
};const LUNAR = {

    //template
    tpl: '#{y}-#{m}-#{d} 星期#{W} 农历 #{CM}#{CD} #{gy}(#{sx}) #{gm} #{gd} #{so} #{cf} #{gf}',

    //闰月: leap[y-1900] & 0xf，闰月天数: leap[y-1900] & 0x10000
    leap: "ezc|esg|wog|gr9|15k0|16xc|1yl0|h40|ukw|gya|esg|wqe|wk0|15jk|2k45|zsw|16e8|yaq|tkg|1t2v|ei8|wj4|zp1|l00|lkw|2ces|8kg|tio|gdu|ei8|k12|1600|1aa8|lud|hxs|8kg|257n|t0g|2i8n|13rk|1600|2ld2|ztc|h40|2bas|7gw|t00|15ma|xg0|ztj|lgg|ztc|1v11|fc0|wr4|1sab|gcw|xig|1a34|l28|yhy|xu8|ew0|xr8|wog|g9s|1bvn|16xc|i1j|h40|tsg|fdh|es0|wk0|161g|15jk|1654|zsw|zvk|284m|tkg|ek0|xh0|wj4|z96|l00|lkw|yme|xuo|tio|et1|ei8|jw0|n1f|1aa8|l7c|gxs|xuo|tsl|t0g|13s0|16xg|1600|174g|n6a|h40|xx3|7gw|t00|141h|xg0|zog|10v8|y8g|gyh|exs|wq8|1unq|gc0|xf4|nys|l28|y8g|i1e|ew0|wyu|wkg|15k0|1aat|1640|hwg|nfn|tsg|ezb|es0|wk0|2jsm|15jk|163k|17ph|zvk|h5c|gxe|ek0|won|wj4|xn4|2dsl|lk0|yao".parseToArray(36),

    //节气
    jqmap: "0|gd4|wrn|1d98|1tuh|2akm|2rfn|38g9|3plp|46vz|4o9k|55px|5n73|64o5|6m37|73fd|7kna|81qe|8io7|8zgq|9g4b|9wnk|ad3g|ath2|".parseToArray(36),
    jqnames: "小寒|大寒|立春|雨水|惊蛰|春分|清明|谷雨|立夏|小满|芒种|夏至|小暑|大暑|立秋|处暑|白露|秋分|寒露|霜降|立冬|小雪|大雪|冬至".parseToArray(),

    //中文数字
    c1: "|一|二|三|四|五|六|七|八|九|十".parseToArray(),
    c2: "初|十|廿|卅|".parseToArray(),

    //中文星期
    wk: "日一二三四五六",

    //天干
    tg: "甲乙丙丁戊己庚辛壬癸",

    //地支
    dz: "子丑寅卯辰巳午未申酉戌亥",

    //生肖
    sx: "鼠牛虎兔龙蛇马羊猴鸡狗猪",

    //农历节日
    feast: { "1-1": "春节", "1-15": "元宵节", "5-5": "端午节", "8-15": "中秋节", "9-9": "重阳节", "12-8": "腊八节" },

    // 日期修正数组
    // ~表示日期范围
    // = 前面是日期, 后面对应的分别是年月日的修正值
    // 例: fixDate: ["2013-1-1=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
    fixDate: ["2013-1-1~2013-1-11=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]

    //伊历
};

// https://github.com/leecade/date/blob/master/src/g.date.js

/**
*  检查是否date对象
*  @method: isDate
*  @param: {Date}
*  @return: {Bool}
*/
function isDate(date) {
    return date instanceof Date && !isNaN(date);
}

/**
*  获取日期
*  @method: getDate
*  @param: {Date} || new Date()
*  @return: {y: 年, m: 月, d: 日}
*/
function getDate(date) {
    !isDate(date) && (date = new Date());
    return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate()
    };
}

/**
*  格式化日期对象(from youa)
*  @method: format
*  @param: {Date} || new Date()
*  @param: {String} || 'yyyy-MM-dd', 如："yyyy年M月d日", "yyyy-MM-dd", "MM-dd-yy", "yyyy-MM-dd hh:mm:ss"
*  @return: {Bool}
*  @notice: 为区分minute, month对应大写M
*  @notice: 位数不全: 1. 年份 "yyyy" --> 2011, "yyy" --> 011, "y" --> 1; 2. 其他均为 single --> 不补0, double --> 补0
*/
function format(date = new Date(), pattern = 'yyyy-MM-dd hh:mm:ss') {
    if (date === '' && !isDate(date)) return;
    let d = getDate(date),
        dateObj = {
        M: d.m,
        d: d.d,
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    for (let k in dateObj) {
        pattern = pattern.replace(new RegExp('(' + k + '+)', 'g'), (a, b) => dateObj[k] < 10 && b.length > 0 ? '0' + dateObj[k] : dateObj[k]);
    }

    return pattern.replace(/(y+)/ig, (a, b) => (d.y + '').substr(4 - Math.min(4, b.length)));
}

/**
*  返回农历月份天数
*  @method: getDaysByLunarMonth
*  @param: {Num} year
*  @param: {Num} month
*  @return: {Num}
*/
function getDaysByLunarMonth(y, m) {
    return LUNAR.leap[y - 1900] && 0x10000 >> m ? 30 : 29;
}

/**
*  返回公历年份的闰月月份
*  @method: getLeapMonth
*  @param: {Num} year
*  @return: {Num} || 0
*/
function getLeapMonth(y) {
    return LUNAR.leap[y - 1900] & 0xf;
}

/**
*  返回公历年份的闰月天数
*  @method: getLeapDays
*  @param: {Num} year
*  @return: {Num} || 0
*/
function getLeapDays(y) {
    return getLeapMonth(y) ? LUNAR.leap[y - 1900] & 0x10000 ? 30 : 29 : 0;
}

/**
*  返回公历月份天数
*  @method: getDaysByMonth
*  @param: {Num} year
*  @param: {Num} month
*  @return: {Num}
*/
function getDaysByMonth(y, m) {
    return new Date(y, m, 0).getDate();
}

/**
*  返回公历年份天数
*  @method: getDaysByYear
*  @param: {Num} year
*  @return: {Num}
*/
function getDaysByYear(y) {
    for (var i = 0x8000, sum = 348; i >>= 1;) {
        sum += LUNAR.leap[y - 1900] && i ? 1 : 0;
    }
    return sum + getLeapDays(y);
}

/**
*  返回公历年份的第n个节气日期
*  @method: getDateBySolar
*  @param: {Num} year
*  @param: {Num} 0 --> 小寒
*  @return: {m:month, d:year}
*/
function getDateBySolar(y, n) {
    let d = new Date(31556925974.7 * (y - 1900) + LUNAR.jqmap[n] * 60000 + Date.UTC(1900, 0, 6, 2, 5));
    return {
        m: d.getUTCMonth() + 1,
        d: d.getUTCDate()
    };
}

/**
*  返回日期（公历/农历）对应节日名
*  @method: getFeast
*  @param: {Num} month
*  @param: {Num} day
*  @param: {Bool}(0 and 1) || 1 节日map(0 || null --> 公历，1 --> 农历，为空则默认为公历)
*  @param: {Num} year
*  @return: {String} || ""
*  @notice: 年、月、日须与type保持一致，当且仅当需要匹配“除夕”，才需传y(年份)
*/
function getFeast(m, d, type, y) {
    let name = (type ? LUNAR.feast : FEAST)[m + '-' + d] || "";
    //fix"除夕"(农历12月最后一天)
    type && y && m == 12 && getDaysByLunarMonth(y, 12) == d && (name = '除夕');
    return name;
}

/**
*  返回公历日期对应节气名
*  @method: getSolar
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {String} || ""
*/
function getSolar(y, m, d) {
    let solarNames = LUNAR.jqnames,
        l = solarNames.length,
        solarName;
    while (l--) {
        solarName = getDateBySolar(y, l);
        if (solarName.m == m && solarName.d == d) return solarNames[l];
    }
    return '';
}

/**
*  根据序号返回干支组合名
*  @method: cyclical
*  @param: {Num} 序号 (0 --> 甲子，以60进制循环)
*  @return: {String}
*/
function cyclical(n) {
    return LUNAR.tg.charAt(n % 10) + LUNAR.dz.charAt(n % 12);
}

/**
*  对异常日期结果进行修正
*  @param  {Array} data 配置修复数据
*  @param  {Number} y    年
*  @param  {Number} m    月
*  @param  {Number} d    日
*  @return {Object}      {y, m, d}
*  fixDate: ["2013-1-11=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
*/
function fixResult(data, Y, M, D, y, m, d) {
    if (data && data.length) {
        var l = data.length,
            _match = function (y, m, d, str, pre, suf) {
            str = str.split("~");
            str[1] = str[1] || str[0];
            pre = str[0].split("-");
            suf = str[1].split("-");
            return new Date(y, m, d) >= new Date(pre[0], pre[1], pre[2]) && new Date(y, m, d) <= new Date(suf[0], suf[1], suf[2]);
        },
            val,
            li;
        while (l--) {
            li = data[l].split("=");
            val = li[1].split("|");
            _match(Y, M, D, li[0]) && (y = y + ~~val[0], m = m + ~~val[1], d = d + ~~val[2]);
        }
    }
    return {
        y: ~~y,
        m: ~~m,
        d: ~~d
    };
}

/**
*  根据公历日期返回农历日期
*  @method: toLunar
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {cy: 农历年, cm: 农历月, cd: 农历日, CM: 农历月（中文）, CD: 农历日（中文）, isleap: 是否闰月}
*  @notice: 遵从农历习惯表达方式，如一月 --> 正月，十二月 --> 腊月，闰月等
*/
function toLunar(Y, M, D) {
    var m = 1900,
        //起始年份
    n = 0,
        d = (new Date(Y, M - 1, D) - new Date(1900, 0, 31)) / 86400000,
        //起始date
    leap = getLeapMonth(Y),
        //当年闰月
    isleap = false,
        //标记闰月
    _y;

    for (; m < 2050 && d > 0; m++) {
        n = getDaysByYear(m);
        d -= n;
    }

    if (d < 0) {
        d += n;
        m--;
    }

    _y = m;

    for (m = 1; m < 13 && d > 0; m++) {

        if (leap > 0 && m == leap + 1 && isleap === false) {
            --m;
            isleap = true;
            n = getLeapDays(_y);
        } else {
            n = getDaysByLunarMonth(_y, m);
        }

        if (isleap == true && m == leap + 1) isleap = false;

        d -= n;
    }

    if (d == 0 && leap > 0 && m == leap + 1 && !isleap) --m;

    if (d < 0) {
        d += n;
        --m;
    }

    //修正闰月下一月第一天为非闰月
    if (d == 0) isleap = m == leap;

    //转换日期格式为1开始
    d = d + 1;

    var _fixDate = fixResult(LUNAR.fixDate, Y, M, D,
    // BUG?
    Y - (M < m ? 1 : 0), //如果公历月份小于农历就是跨年期，农历年份比公历-1
    m, d);

    return {
        cy: _fixDate.y,
        cm: _fixDate.m,
        cd: _fixDate.d,
        CM: (isleap ? "闰" : "") + ((_fixDate.m > 9 ? '十' : '') + LUNAR.c1[_fixDate.m % 10]).replace('十二', '腊').replace(/^一/, '正') + '月',
        CD: { '10': '初十', '20': '二十', '30': '三十' }[_fixDate.d] || LUNAR.c2[Math.floor(_fixDate.d / 10)] + LUNAR.c1[~~_fixDate.d % 10],
        isleap: isleap
    };
}

/**
*  公历转干支
*  @method: toGz
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {gy:干支年, gm:干支月, gd:干支日}
*/
function toGz(y, m, d) {
    let M = m - 1;
    return {
        gy: M >= 2 || M == 1 && d >= getDateBySolar(y, 2).d ? cyclical(y - 1864) : cyclical(y - 1865),
        gm: d >= getDateBySolar(y, m * 2).d ? cyclical((y - 1900) * 12 + M + 13) : cyclical((y - 1900) * 12 + M + 12),
        gd: cyclical(Date.UTC(y, M, 1, 0, 0, 0, 0) / 86400000 + 25576 + d)
    };
}

/**
*  公历转生肖
*  @method: toSx
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {String}
*/
function toSx(y, m, d) {
    return LUNAR.sx.charAt((toLunar(y, m, d).cy - 4) % 12);
}

/**
*  公历转中文格式化农历
*  @method: formatLunar
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {y: 年,m: 月,d: 日,w: 星期（数字）,W: 星期（中文）,cm: 农历月（数字）,cd: 农历日（数字）,CM: 农历月（中文）,CD: 农历日（中文）,gy: 干支年,gm: 干支月,gd: 干支日,so: 节气,cf: 农历节日,gf: 公历节日,sx: 生肖,isleap: 是否闰月}
*/
function formatLunar(y, m, d) {
    let gz = toGz(y, m, d),
        //干支
    lunar = toLunar(y, m, d),
        //农历
    w = new Date(y, m - 1, d).getDay(); //星期
    const { cm, cd, cy, isleap, CM, CD } = lunar;
    const { wk, sx } = LUNAR;
    return {
        y, //年
        m, //月
        d, //日
        w, //星期（数字）
        W: wk.charAt(w), //星期（中文）
        cm, //农历月（数字）
        cd, //农历日（数字）
        CM, //农历月（中文）
        CD, //农历日（中文）

        gy: gz.gy + '年', //干支纪年
        gm: gz.gm + '月', //干支纪月
        gd: gz.gd + '日', //干支纪日

        so: getSolar(y, m, d), //节气
        cf: getFeast(cm, cd, 1, cy), //农历节日
        gf: getFeast(m, d), //公历节日
        sx: sx.charAt((cy - 4) % 12), //生肖
        isleap //是否闰月
    };
}

/**
*  公历日期按模板返回农历
*  @method: lunarTpl
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @param: {String} null --> 默认内置模板
*  @return: {String} || {}
*  @notice: 参数允许为{Date}/{y, m, d}
*  @example:
        lunarTpl() --> 今日+内置模板
        lunarTpl(tpl) --> 今日+tpl
        lunarTpl(y, m, d) --> y, d, m+内置模板
        lunarTpl(date) --> date+内置模板
        lunarTpl(date, tpl) --> date+tpl
*/
function lunarTpl(y, m, d, tpl) {
    if (arguments.length < 4 && typeof d !== 'number') {
        var isdate = isDate(y),
            today = isdate ? getDate(y) : getDate(),
            template = tpl;
        isdate && (template = m);
        typeof y === 'string' && (template = y);
        y = today.y;
        m = today.m;
        d = today.d;
    }
    return (template || LUNAR.tpl).replaceTpl(formatLunar(y, m, d));
}

// debug
function debug(y, m) {
    let l = getDaysByMonth(y, m);
    for (let i = 0; i < l; i++) {
        console.log(lunarTpl(y, m, i + 1));
    }
}

exports.isDate = isDate;
exports.getDate = getDate;
exports.format = format;
exports.getDaysByLunarMonth = getDaysByLunarMonth;
exports.getLeapMonth = getLeapMonth;
exports.getLeapDays = getLeapDays;
exports.getDaysByMonth = getDaysByMonth;
exports.getDaysByYear = getDaysByYear;
exports.getDateBySolar = getDateBySolar;
exports.getFeast = getFeast;
exports.getSolar = getSolar;
exports.cyclical = cyclical;
exports.fixResult = fixResult;
exports.toLunar = toLunar;
exports.toGz = toGz;
exports.toSx = toSx;
exports.formatLunar = formatLunar;
exports.lunarTpl = lunarTpl;
exports.debug = debug;

Object.defineProperty(exports, '__esModule', { value: true });

})));
