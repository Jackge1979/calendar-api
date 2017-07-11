(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CalendarAPI = factory());
}(this, (function () { 'use strict';

// https://github.com/leecade/date/blob/master/src/g.date.js

/**
* 检查是否date对象
* @method: isDate
* @param: {Date}
* @return: {Bool}
*/
function isDate(date) {
	return date instanceof Date && !isNaN(date);
}

/**
* 获取日期
* @method: getDate
* @param: {Date} || new Date()
* @return: {y: 年, m: 月, d: 日}
*/
function getDate(date) {
	!this.isDate(date) && (date = new Date());
	return {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate()
	};
}

/**
* 格式化日期对象(from youa)
* @method: format
* @param: {Date} || new Date()
* @param: {String} || 'yyyy-MM-dd', 如："yyyy年M月d日", "yyyy-MM-dd", "MM-dd-yy", "yyyy-MM-dd hh:mm:ss"
* @return: {Bool}
* @notice: 为区分minute, month对应大写M
* @notice: 位数不全: 1. 年份 "yyyy" --> 2011, "yyy" --> 011, "y" --> 1; 2. 其他均为 single --> 不补0, double --> 补0
*/
function format(date = new Date(), pattern = 'yyyy-MM-dd hh:mm:ss') {
	if (date === '' && !this.isDate(date)) return;
	let d = this.getDate(date),
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

var CalendarAPI = {
	isDate,
	getDate,
	format
};

return CalendarAPI;

})));
