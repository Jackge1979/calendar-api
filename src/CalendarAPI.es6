// https://github.com/leecade/date/blob/master/src/g.date.js

import { DAYS, FEAST, LUNAR, ISL } from './data.es6'

/**
*  检查是否date对象
*  @method: isDate
*  @param: {Date}
*  @return: {Bool}
*/
function isDate(date) {
	return date instanceof Date && !isNaN(date)
}


/**
*  获取日期
*  @method: getDate
*  @param: {Date} || new Date()
*  @return: {y: 年, m: 月, d: 日}
*/
export function getDate(date) {
	!this.isDate(date) && (date = new Date)
	return {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate()
	}
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
export function format(date = new Date, pattern = 'yyyy-MM-dd hh:mm:ss') {
	if(date === '' && !this.isDate(date)) return ;
	let d = this.getDate(date),
		dateObj = {
			M: d.m,
			d: d.d,
			h: date.getHours(),
			m: date.getMinutes(),
			s: date.getSeconds()
		}
	for(let k in dateObj) {
		pattern = pattern.replace(new RegExp('(' + k + '+)', 'g'), (a,b) => (dateObj[k] < 10 && b.length > 0) ? '0' + dateObj[k] : dateObj[k])
	}

	return pattern.replace(/(y+)/ig, (a,b) => (d.y + '').substr(4 - Math.min(4, b.length)))
}


/**
*  返回农历月份天数
*  @method: getDaysByLunarMonth
*  @param: {Num} year
*  @param: {Num} month
*  @return: {Num}
*/
export function getDaysByLunarMonth(y, m) {
	return LUNAR.leap[y - 1900] && (0x10000 >> m) ? 30 : 29
}


/**
*  返回公历年份的闰月月份
*  @method: getLeapMonth
*  @param: {Num} year
*  @return: {Num} || 0
*/
export function getLeapMonth(y) {
    return LUNAR.leap[y-1900] & 0xf;
}


/**
*  返回公历年份的闰月天数
*  @method: getLeapDays
*  @param: {Num} year
*  @return: {Num} || 0
*/
export function getLeapDays(y) {
	return getLeapMonth(y) ? (LUNAR.leap[y - 1900] & 0x10000) ? 30 : 29 : 0
}

/**
*  返回公历月份天数
*  @method: getDaysByMonth
*  @param: {Num} year
*  @param: {Num} month
*  @return: {Num}
*/
export function getDaysByMonth(y, m) {
	return new Date(y, m, 0).getDate()
}


/**
*  返回公历年份天数
*  @method: getDaysByYear
*  @param: {Num} year
*  @return: {Num}
*/
export function getDaysByYear(y) {
	for(var i = 0x8000, sum = 348; i >>= 1;) {
		sum += (LUNAR.leap[y - 1900] && i) ? 1 : 0
	}
	return sum + getLeapDays(y)
}


/**
*  返回公历年份的第n个节气日期
*  @method: getDateBySolar
*  @param: {Num} year
*  @param: {Num} 0 --> 小寒
*  @return: {m:month, d:year}
*/
export function getDateBySolar(y, n) {
	let d = new Date((31556925974.7 * (y - 1900) + LUNAR.jqmap[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
	return {
		m: d.getUTCMonth() + 1,
		d: d.getUTCDate()
	}
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
export function getFeast(m, d, type, y) {
	let name = (type ? LUNAR.feast : FEAST)[m + '-' + d] || ""
	//fix"除夕"(农历12月最后一天)
	type && y && m == 12 && getDaysByLunarMonth(y, 12) == d && (name = '除夕')
	return name
}

/**
*  返回公历日期对应节气名
*  @method: getSolar
*  @param: {Num} year
*  @param: {Num} month
*  @param: {Num} day
*  @return: {String} || ""
*/
export function getSolar(y, m, d) {
	let solarNames = LUNAR.jqnames,
		l = solarNames.length,
		solarName
	while(l--) {
		solarName = getDateBySolar(y, l)
		if(solarName.m == m && solarName.d == d) return solarNames[l]
	}
	return ''
}

/**
*  根据序号返回干支组合名
*  @method: cyclical
*  @param: {Num} 序号 (0 --> 甲子，以60进制循环)
*  @return: {String}
*/
export function cyclical(n) {
	return LUNAR.tg.charAt(n % 10) + LUNAR.dz.charAt(n % 12)
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
export function fixResult(data, Y, M, D, y, m, d) {
    if(data && data.length) {
        var l = data.length,
        _match = function(y, m, d, str, pre, suf) {
            str = str.split("~");
            str[1] = str[1] || str[0];
            pre = str[0].split("-");
            suf = str[1].split("-");
            return new Date(y, m, d) >= new Date(pre[0], pre[1], pre[2]) && new Date(y, m, d) <= new Date(suf[0], suf[1], suf[2])
        },
        val,
        li;
        while(l--) {
            li = data[l].split("=");
            val = li[1].split("|");
            _match(Y, M, D, li[0]) && (y = y + ~~(val[0]), m = m + ~~(val[1]), d = d + ~~(val[2]));
        }
    }
    return {
        y: ~~y,
        m: ~~m,
        d: ~~d
    }
}