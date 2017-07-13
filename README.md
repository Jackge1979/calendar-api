# 万年历API接口
[![](https://img.shields.io/github/downloads/atom/atom/total.svg)](https://github.com/huangguangjie/calendar-api/archive/master.zip)

### 安装使用
```html
<script src="<url>/calendar-api.js"></script>
```
或者
setup package
```bash
npm install calendar-api --save
```
use
```es6
import { isDate, ...API } from 'calendar-api'
```

### API Methods
isDate：检查是否date对象

getDate：获取日期

format：格式化日期对象

getDaysByLunarMonth：返回农历月份天数

getLeapMonth：返回公历年份的闰月月份

getLeapDays：返回公历年份的闰月天数

getDaysByMonth：返回公历月份天数

getDaysByYear：返回公历月份天数

getDateBySolar：返回公历年份的第n个节气日期

getFeast：返回日期（公历/农历）对应节日名

getSolar：返回公历日期对应节气名

cyclical：根据序号返回干支组合名

fixResult：对异常日期结果进行修正

toLunar：根据公历日期返回农历日期

toGz：公历转干支

toSx：公历转生肖

formatLunar：公历转中文格式化农历

lunarTpl：公历日期按模板返回农历
