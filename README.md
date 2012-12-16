# jQuery.DataBind

a simple jQuery MVVM plugin that you can control your doms without jQuery selector everywhere.

## Documentation

* __Set binding of function-name/attribute-name pairs to element:__

		<anytag data-bind="toggleBy: an_attr, text: a_method"></anytag>


* __Extend jQuery the functions that used in your settings:__

		$.fn.toggleBy = function(cond){
			var func = cond ? 'show' : 'hide';
			return this.each(function(){ $J(this)[func](); });
		};


* __Initialize plugin with property name you setted, in this case it's "data-bind"__

		$.initBind('bind');

	_If you call this function with a specific jQuery DOM, it'll bind the DOMs inside that DOM only._

	_If you call this function twice, the former one would be ineffective._


* __Apply an attribute/value pair you want to use in the binding functions:__

		$.applyBind('an_attr', false);

	_In this case it equals:_ `$('anytag').toggleBy(false);`


* __Apply an Object of attribute/value pairs:__

		$.applyBind({ an_attr: true, a_method: function(){ return 'foo'; } });

	_In this case it equals:_ `$('anytag').toggleBy(true).text('foo');`
