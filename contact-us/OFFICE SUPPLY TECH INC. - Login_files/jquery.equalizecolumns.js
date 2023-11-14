/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 Feb 2017
 * 
 * jQuery plugin to equalize column heights
 ******************************************************************************************************************************************/
(function($) {
	$.fn.equalizecolumns = function() {
		var height = 0;
		var heights = [];
		var _this = this;

		this.init = function() {
			_this.equalize();
		};
		
		this.equalize = function() {
			_this.find('.row:first').children().each(function() {
				heights.push($(this).outerHeight());
			});
			
			heights.sort(function(a, b){return b-a});
			height = heights[0];
			
			_this.find('.row:first').children().each(function() {
				$(this).outerHeight(height);
			});
		};

		_this.init();
	};
}(jQuery));