/**
 * DataBind
 * a simple jQuery MVVM plugin
 * 
 * Author: Zero [https://github.com/zerosyn/jQuery.DataBind]
 * Last Modified: 2013-01-07
 * 
 * 
 * Usage:
 * <anytag data-bind="toggleBy: a_condition, text: a_method, attr@value: an_attr"></anytag>
 * 
 * $.fn.toggleBy = function(cond){ var func = cond ? 'show' : 'hide'; return this.each(function(){ $(this)[func](); }); };
 * 
 * $.initBind('bind');
 * $.setWrapper(function(obj){ return { a_condition:function(){ return obj.an_attr > 0; } } });
 * $.applyBind({ an_attr: -1, a_method: function(){ return 'foo'; } });
 * $.applyBind({ an_attr: 1, a_method: function(){ return 'bar'; } });
 */
(function($){
  "use strict";

  // currently keep only one instance
  var bind_map = {};
  var _wrapper = function(){ return {}; };

  /**
   * Initialize binding map of Attr and DOM Method
   * (affect DOMs inside this DOM only)
   *
   * @param string bind_mark   the property name suffix of binding settings, "bind" (means "data-bind" property) as default
   */
  var initBind = function(bind_mark){
    var that = ( this == $ ) ? $(document) : this;
    bind_map = {};
    bind_mark = bind_mark || 'bind';
    that.find('[data-' + bind_mark + ']').each(function(){
      // use "," to split several binding pair
      var binds = $(this).data( bind_mark ).split(',');
      var func_arr = [], func = [], func_name = '', attr = '', bind = [], i;
      for( i in binds ){
        // use ":" to split function name and attribute name
        bind = binds[i].split(':');
        if( bind.length == 2 ){
          // user "@" to split function name and static args
          func_arr = bind[0].split('@');
          func_name = $.trim( func_arr.shift() );
          // support DEFINED jQuery DOM method only
          if( typeof $(this)[func_name] == 'function' ){
            func = [$(this), func_name];
            if( func_arr.length > 0 ){
              $.merge( func, func_arr );
            }
            attr = $.trim( bind[1] );
            if( !bind_map.hasOwnProperty( attr ) ){
              bind_map[attr] = [];
            }
            bind_map[attr].push(func);
          }
        }
      }
    });
    return this;
  };

  /**
   * Set common wrapper to extend individual data
   * 
   * @param function wrapper     a closure with common functions/properties, like:  function(obj){ return { foo:function(){ return obj.a > obj.b; }, bar:'bar' } }
   */
  var setWrapper = function( wrapper ){
    _wrapper = wrapper;
    return this;
  };

  /**
   * Update DOMs with assigned data
   * 
   * @param object obj      data object
   */
  var applyBind = function(obj){
    var attr, value, i, func_arr, dom, func_name, params;
    if( typeof obj != 'object' ){
      return this;
    }
    var extra = _wrapper(obj);
    for( attr in bind_map ){
      // object has high priority
      switch( typeof obj[attr] ){
        case 'function':
          value = obj[attr](); break;
        case 'undefined':
          value = null; break;  // use null for operations
        default:
          value = obj[attr];
      }
      if( value === null && typeof extra[attr] != 'undefined' ){
        if( typeof extra[attr] == 'function' ){
          value = extra[attr]();
        } else {
          value = extra[attr];
        }
      }
      for( i in bind_map[attr] ){
        func_arr = bind_map[attr][i];
        dom = func_arr[0];
        func_name = func_arr[1];
        // static args in the front, object property in the end
        if( func_arr.length > 2 ){ 
          params = func_arr.slice(2);
          $.merge( params, [value] );
        } else {
          params = [value];
        }
        dom[func_name].apply( dom, params );
      }
    }
    return this;
  };

  var ext = {
    initBind: initBind,
    setWrapper: setWrapper,
    applyBind: applyBind
  };
  $.fn.extend(ext);
  $.extend(ext);
}(jQuery));