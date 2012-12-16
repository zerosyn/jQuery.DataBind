/**
 * DataBind
 * a simple jQuery MVVM plugin
 * 
 * Author: Zero [https://github.com/zerosyn/jQuery.DataBind]
 * Last Modified: 2012-12-16
 * 
 * 
 * Usage:
 * <anytag data-bind="toggleBy: an_attr, text: a_method"></anytag>
 * 
 * $.fn.toggleBy = function(cond){ var func = cond ? 'show' : 'hide'; return this.each(function(){ $J(this)[func](); }); };
 * 
 * $.initBind('bind');
 * $.applyBind('an_attr', false);
 * $.applyBind({ an_attr: true, a_method: function(){ return 'foo'; } });
 */
(function($){
  var bind_map = {};

  $.fn.extend({
    /**
     * Initialize binding map of Attr and DOM Method
     * (affect DOMs inside this DOM only)
     *
     * @param bind_mark   the property name suffix of binding settings, "bind" (means "data-bind" property) as default
     */
    initBind: function(bind_mark){
      var that = ( this.length > 0 ) ? this : $(document);
      bind_map = {};
      bind_mark = bind_mark || 'bind';
      that.find('[data-' + bind_mark + ']').each(function(){
        // use "," to split several binding pair
        var binds = $(this).data( bind_mark ).split(',');
        var func = [], attr = '', bind = [], i;
        for( i in binds ){
          // use ":" to split function name and attribute name
          bind = binds[i].split(':');
          if( bind.length == 2 ){
            func_name = $.trim( bind[0] );
            // support DEFINED jQuery DOM method only
            if( typeof $(this)[func_name] == 'function' ){
              func = [$(this), func_name];
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
    },

    /**
     * Update DOMs with assigned data
     * 
     * @param attr    attribute name OR an object
     * @param value   attribute value (uses only when attr is an attribute name)
     */
    applyBind: function(attr, value){
      var attr_name, attr_value, i, func;
      if( typeof attr != 'object' ){
        obj = {};
        obj[attr] = value;
      } else {
        obj = attr;
      }
      for( attr_name in bind_map ){
        if( obj.hasOwnProperty( attr_name ) ){
          if( typeof obj[attr_name] == 'function' ){
            attr_value = obj[attr_name]();
          } else {
            attr_value = obj[attr_name];
          }
          for( i in bind_map[attr_name] ){
            func = bind_map[attr_name][i];
            func[0][func[1]]( attr_value );
          }
        }
      }
      return this;
    }
  });
}(jQuery));