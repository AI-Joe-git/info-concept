/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 Jan 2018
 * 
 * jQuery plugin select to menu button
 ******************************************************************************************************************************************/
(function($) {
	$.fn.modalmenu = function(options) {
		var defaults = {  };
		var id = this.attr('id');
		var element_menu_id = this.attr('href');
		var opts = $.extend(opts, defaults, options);
		var _this = this;
		
		this.init = function() {			
			$(document).on('click', '#' + id, function(e) {
				e.preventDefault();
				_this.show_menu();
			});
		};
		
		this.show_menu = function() {
			$(element_menu_id).removeClass('hide').show();
		};
		
		_this.init();
	};
}(jQuery));