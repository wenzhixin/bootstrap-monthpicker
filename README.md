# bootstrap monthpicker

bootstrap3 月份选择器。


## 演示：

[这里](http://wenzhixin.net.cn/p/bootstrap-monthpicker/)


## 使用：

```html
<input type="text" value="2013-10" />
<span id="month">2013-11</span>
```

```javascript
$('input').bootstrapMonthpicker();

$('#month').bootstrapMonthpicker({
	from: '2013-05',
	to: '2013-11',
	onSelect: function(value) {
		console.log(value);
	}
});
```
