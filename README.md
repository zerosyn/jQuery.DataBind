# jQuery.DataBind

a simple jQuery MVVM plugin that you can control your doms without jQuery selector everywhere.

## Documentation

* __Set binding of function-name/attribute-name pairs to element:__

		<anytag data-bind="toggleBy: a_condition, text: a_method, attr@value: an_attr"></anytag>


* __(Optional) Extend jQuery the functions that used in your settings:__

		$.fn.toggleBy = function(cond){
			var func = cond ? 'show' : 'hide';
			return this.each(function(){ $(this)[func](); });
		};


* __Initialize plugin with property name you setted, in this case it's "data-bind"__

		$.initBind('bind');

	_If you call this function with a specific jQuery DOM, it'll bind the DOMs inside that DOM only._

	_If you call this function twice, the former one would be ineffective._


* __(Optional) Initialize the wrapper for process the data:__

		$.setWrapper(function(obj){
			return { a_condition:function(){ return obj.an_attr > 0; } }
		});

	_If there are same name functions/properties in wrapper and object, the value in object will be used prior._


* __Apply an Object of attribute/value pairs:__

		$.applyBind({ an_attr: -1, a_method: function(){ return 'foo'; } });

	_In this case it equals:_ `$('anytag').toggleBy(-1 > 0).text('foo').attr('value', -1);`

## More usage

You can see detailed usage in test page.