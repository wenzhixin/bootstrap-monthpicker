# bootstrap monthpicker

bootstrap3 Month picker


## Demos:

[Here](http://wenzhixin.net.cn/p/bootstrap-monthpicker/)

## Options:

* from

Start date time, for example: `2013-05`

* to

To date time, for example: `2013-11`

* onSelect

Fire when select a month.

## Usage:

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
