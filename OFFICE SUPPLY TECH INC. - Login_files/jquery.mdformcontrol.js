/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 Jan 2019
 * 
 * jQuery plugin to skin form controls
 ******************************************************************************************************************************************/
(function($) {
	$.fn.mdformcontrol = function(options) {
		var cb_icon = '<i class="material-icons md-icon-check_box_outline_blank">&#xe835;</i>';
		var cb_icon_class = '.md-icon-check_box_outline_blank';
		var cb_checked_icon = '<i class="material-icons md-icon-check_box">&#xe834;</i>';
		var cb_checked_icon_class = '.md-icon-check_box';
		var defaults = {  };
		var form_type = this.attr('type');
		var id = this.attr('id');
		var label_id = '';
		var opts = $.extend(opts, defaults, options);
		var radio_icon = '<i class="material-icons md-icon-radio_button_unchecked">&#xe836;</i>';
		var radio_icon_class = '.md-icon-radio_button_unchecked';
		var radio_checked_icon = '<i class="material-icons md-icon-radio_button_checked">&#xe837;</i>';
		var radio_checked_icon_class = '.md-icon-radio_button_checked';
		var _this = this;
		
		this.init = function() {			
			if(_this.is('[data-skinned]')) {
				return;
			}
			
			if(_this.hasClass('no-form-skin')) {
				return;
			}
			
			if(_this.closest('.form-group').hasClass('hidden')) {
				return;
			}
			
			if(_this.css('display') == 'none') {
				return;
			}
			
			_this.setup();
		};
		
		this.setup = function() {
			switch(form_type) {
				case 'checkbox':
					_this.setup_checkbox();
					break;
				
				case 'radio':
					_this.setup_radio();
					break;
			}
		};
		
		/* MISC */
		this.change_checker = function() {
			var t = setInterval(function() {
				switch(form_type) {
					case 'checkbox':
						_this.check_checkbox_state();
						break;
				
					case 'radio':
						_this.check_radio_state();
						break;
				}
				
			}, 750);
		};
		
		/* CHECKBOX */
		this.setup_checkbox = function() {
			if(_this.closest('label').length > 0) {				
				if(_this.closest('label').is('[id]')) {
					label_id = _this.closest('label').attr('id');
				} else {
					label_id = 'md-label-' + id;
					_this.closest('label').attr('id', label_id);
				}
			} else {
				label_id = 'md-label-' + id;
				_this.wrap('<label id="' + label_id + '"></label>');
			}

			_this.closest('label').addClass('md-skin');
			_this.closest('label').prepend(cb_icon);
			_this.set_checkbox_state();
			_this.change_checker();
			_this.attr('data-skinned', true);
			
			$(document).on('click', '#' + label_id, function(e) {
				var t = setTimeout(function() {
					_this.set_checkbox_state();
				}, 500);
			});	
		};
		
		this.set_checkbox_state = function() {
			_this.closest('label').find('.material-icons').remove();

			if(_this.prop('checked')) {
				_this.closest('label').prepend(cb_checked_icon);
			} else {
				_this.closest('label').prepend(cb_icon);
			}
			
			if(_this.prop('disabled') || _this.hasClass('disabled')) {
				_this.closest('label').addClass('disabled');
			} else {
				_this.closest('label').removeClass('disabled');
			}
		};
		
		this.check_checkbox_state = function() {
			var do_update = false;
			var icon_class = _this.prop('checked') ? cb_checked_icon_class : cb_icon_class;
			icon_class = icon_class.replace('.', '');
			
			var disabled = _this.prop('disabled') || _this.hasClass('disabled');
			
			if( (disabled && !_this.closest('label').hasClass('disabled')) || (!disabled && _this.closest('label').hasClass('disabled')) ) {
				do_update = true;
			}
			
			if(!_this.closest('label').find('.material-icons').hasClass(icon_class)) {
				do_update = true;
			}
			
			if(do_update) {
				_this.set_checkbox_state();
			}
		};
		
		/* RADIO BUTTONS */
		this.setup_radio = function() {
			if(_this.closest('label').length > 0) {				
				if(_this.closest('label').is('[id]')) {
					label_id = _this.closest('label').attr('id');
				} else {
					label_id = 'md-label-' + id;
					_this.closest('label').attr('id', label_id);
				}
			} else {
				label_id = 'md-label-' + id;
				_this.wrap('<label id="' + label_id + '"></label>');
			}
			
			_this.closest('label').addClass('md-skin');
			_this.closest('label').prepend(cb_icon);
			_this.set_radio_state();
			_this.change_checker();
			_this.attr('data-skinned', true);
			
			$(document).on('click', '#' + label_id, function(e) {
				var t = setTimeout(function() {
					_this.set_radio_state();
				}, 500);
			});
		};
		
		this.set_radio_state = function() {
			_this.closest('label').find('.material-icons').remove();

			if(_this.prop('checked')) {
				_this.closest('label').prepend(radio_checked_icon);
			} else {
				_this.closest('label').prepend(radio_icon);
			}
			
			if(_this.prop('disabled') || _this.hasClass('disabled')) {
				_this.closest('label').addClass('disabled');
			} else {
				_this.closest('label').removeClass('disabled');
			}
		};
		
		this.check_radio_state = function() {
			var do_update = false;
			var icon_class = _this.prop('checked') ? radio_checked_icon_class : radio_icon_class;
			icon_class = icon_class.replace('.', '');
			
			var disabled = _this.prop('disabled') || _this.hasClass('disabled');
			
			if( (disabled && !_this.closest('label').hasClass('disabled')) || (!disabled && _this.closest('label').hasClass('disabled')) ) {
				do_update = true;
			}
			
			if(!_this.closest('label').find('.material-icons').hasClass(icon_class)) {
				do_update = true;
			}
			
			if(do_update) {
				_this.set_radio_state();
			}
		};
		
		_this.init();
	};
}(jQuery));