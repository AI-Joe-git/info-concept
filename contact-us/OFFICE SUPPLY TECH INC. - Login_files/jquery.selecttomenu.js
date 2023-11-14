/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 Jan 2018
 * 
 * jQuery plugin select to menu button
 ******************************************************************************************************************************************/
(function($) {
	$.fn.selecttomenu = function(options) {
		var defaults = {  };
		var has_label = false;
		var id = this.attr('id');
		var is_btngroup = false;
		var select_btn_id = id + '-' + CommonUtil.unique_id() + '-selectbtn';
		var select_link_class = 'selecttomenu-menu-item';
		var select_menu_id = id + '-' + CommonUtil.unique_id() + '-selectmenu';
		var open_menu_targets = '';
		var opts = $.extend(opts, defaults, options);
		var _this = this;
		
		this.init = function() {
			if(_this.is('[data-selecttomenu-setup]')) {
				return;
			}
			
			if(_this.hasClass('no-form-skin')) {
				return;
			}
			
			if(_this.closest('.form-group').hasClass('hidden')) {
				return;
			}
			
			if(_this.is('[type]') && _this.attr('type') == 'hidden') {
				return;
			}
			
			if(_this.css('display') == 'none') {
				return;
			}
			
			if(_this.is('[multiple]')) {
				return;
			}

			is_btngroup = _this.hasClass('btn-group');
			has_label = _this.closest('.form-group').not('.form-type-row').find('label').length > 0 && $.trim(_this.closest('.form-group').find('label').text()) != '';
			_this.setup_button();
			
			$(document).on('click', '#' + select_btn_id, function() {
				_this.show_menu();
			});
			
			$(document).on('click', '#' + select_menu_id + ' .' + select_link_class, function() {
				_this.select_item($(this));
			});
			
			$(window).resize(function() {
				_this.update_btn_text();
			});
		};
		
		this.change_checker = function() {
			var t = setInterval(function() {
				if($('#' + select_btn_id).attr('data-value') != _this.val()) {
					$('#' + select_btn_id).attr('data-value', _this.val());
					$('#' + select_btn_id).find('.selecttomenu-btn-text').text( _this.find('option:selected').text() );
				}
				
				if($('#' + select_menu_id).length > 0 && !_this.hasClass('selecttomenu-change-check-false')) {
					var option_values = [];
					_this.find('option').each(function() {
						var val = $(this).val() != null ? $(this).val() : '';
						option_values.push($(this).val());
					});
					var option_values_str = option_values.join('|');
					
					var menu_values = [];
					$('#' + select_menu_id).find('.selecttomenu-menu-item').each(function() {
						menu_values.push($(this).attr('data-value'));
					});
					var menu_values_str = menu_values.join('|');

					if(option_values_str != menu_values_str) {
						$('#' + select_menu_id).remove();
						_this.create_menu();
					}
				}
				
				var disabled = _this.prop('disabled') || _this.hasClass('disabled');
				
				if(disabled) {
					_this.closest('.selecttomenu-container').addClass('disabled');
				} else {
					_this.closest('.selecttomenu-container').removeClass('disabled');
				}
			}, 1000);
		};
		
		this.create_menu = function() {
			var html = '\
				<div class="modalmenu-menu" id="' + select_menu_id + '" style="display: none;"> \
					<ul class="menu-list">';

						if(is_btngroup) {
							_this.find('.dropdown-menu li').each(function() {
								html += '<li class="anchor-item">' + $(this).html() + '</li>';
							});
						} else {
							_this.find('option').each(function() {
								if($(this).is('[data-href]')) {
									html += '<li class="anchor-item"><a class="" data-value="" href="' + $(this).attr('data-href') + '">' + $.trim($(this).text()) + '</a></li>';
								} else {
									var style=undefined;
									if (typeof $(this).attr('listyle')==="string" && $(this).attr('listyle')!==""){
                                        style = $(this).attr('listyle');
									}
									var li_element = '<li class="anchor-item">';
									if (style!=undefined){
                                        li_element = '<li class="anchor-item" style="'+style+'">';
									}
									html += li_element + '<a class="' + select_link_class + '" data-value="' + $(this).attr('value') + '" href="javascript:;">' + $.trim($(this).text()) + '</a></li>';
								}
							});
						}
					
					html += '</ul> \
				</div>';
			$('#' + select_btn_id).after(html);
			
			var parent = $('#' + select_menu_id).parent();
			var pos = parent.css('position');
			
			if(pos != 'relative' || pos != 'absolute') {
				parent.css('position', 'relative');
			}
		};
		
		this.handle_menu_keyups = function(obj) {
			var pressed = '';
			var menu = $('#' + select_menu_id);
			var menu_list = menu.find('.menu-list');
			menu.find('.focused a').focus();
			var obj = $('#' + select_menu_id + ' li > a');
			var press_timeout = null;

			obj.off('keydown').on('keydown', function(e) {
				if(e.keyCode == 40) {
					var focused = menu.find('.focused');
					
					if(focused.next().length > 0) {
						focused.removeClass('focused');
						var next = focused.next();
						next.addClass('focused');
						next.find('a').focus();
					}
				} else if(e.keyCode == 38) {
					var focused = menu.find('.focused');
					
					if(focused.prev().length > 0) {
						focused.removeClass('focused');
						var prev = focused.prev();
						prev.addClass('focused');
						prev.find('a').focus();
					}
				} else if ( (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode == 32 || (e.keyCode >= 96 && e.keyCode <= 105) ) {
					var a = e.key;
					pressed += a.toLowerCase();

					for(var i in open_menu_targets) {
						if(open_menu_targets[i].indexOf(pressed) == 0) {
							menu.find('a').each(function() {
								$(this).closest('li').removeClass('focused');
							});
			
							var a = menu.find('a[data-text="' + open_menu_targets[i] + '"]:first');
							a.closest('li').addClass('focused');
							a.focus();
							break;
						}
					}
				} else if(e.keyCode == 13) {
					menu.find('.key-checker').parent().remove();
					menu.find('.focused a').trigger('click');
					return false;
				}
			
				clearTimeout(press_timeout);
				press_timeout = setTimeout(function() {
					pressed = '';
				}, 1000);
			});
		};
		
		this.setup_button = function() {
			_this.attr('data-selecttomenu-setup', 'true');
			var autowidth = _this.hasClass('selecttomenu-autowidth') ? 'selecttomenu-autowidth-btn-text' : '';
			
			if(is_btngroup) {
				var w = _this.find('.dropdown-menu').width();
				var txt = $.trim( _this.find('.btn-group-btn-text').text() );
				var btn_txt = _this.find('.dropdown-menu .selected').text();
				var min_width = _this.hasClass('use-min-width') ? (w + 70) + 'px' : '0';
				_this.find('.dropdown-toggle').remove();
				_this.find('.btn[data-toggle="dropdown"]').remove();
				var html = '<button class="selecttomenu-btn" id="' + select_btn_id + '" data-value="' + _this.val() + '" style="min-width: ' + min_width + ';" type="button"><span class="selecttomenu-btn-text ' + autowidth + '">' + btn_txt + '</span></button>';
				_this.prepend(html);
				_this.wrapInner('<span class="form-control no-padding"></span>');
				_this.wrapInner('<div class="controls input-group"></div>');
				
				if(txt != '') {
					_this.find('.controls').prepend('<span class="input-group-addon ">' + txt + '</span>');
				}
				
				_this.addClass('form-group selecttomenu-container selecttomenu-inputgroup');
			} else if(has_label) {
				var w = _this.width();
				var v = _this.val();
				var label_txt = _this.closest('.form-group').find('label').text();
				var txt = $.trim( _this.find('option:selected').text() );
				var min_width = _this.hasClass('use-min-width') ? (w + 70) + 'px' : '0';
				_this.hide();
				_this.closest('.form-group').addClass('selecttomenu-container selecttomenu-inputgroup');
				if(_this.closest('.form-vertical').length > 0) {
					_this.closest('.form-group').addClass('showlabel');
					label_txt = '';
				} else {
					_this.closest('.form-group').find('label').removeClass('control-label').hide();
				}
				_this.closest('.form-group').find('.controls').addClass('input-group');
				_this.closest('.form-group').find('.controls').wrapInner('<span class="form-control no-padding"></span>');
				
				if(label_txt != '') {
					_this.closest('.form-group').find('.controls').prepend('<span class="input-group-addon ">' + label_txt + '</span>');
				}
				
				var html = '<button class="selecttomenu-btn" id="' + select_btn_id + '" data-value="' + _this.val() + '" style="min-width: ' + min_width + ';" type="button"><span class="selecttomenu-btn-text ' + autowidth + '">' + txt + '</span></button>';
				_this.before(html);
			} else {
				var w = _this.width();
				var v = _this.val();
				var txt = $.trim( _this.find('option:selected').text() );
				var min_width = _this.hasClass('use-min-width') ? (w + 70) + 'px' : '0';
				_this.hide();
				_this.closest('.form-group').addClass('selecttomenu-container');
				var html = '<button class="selecttomenu-btn selecttomenu-btn-default" id="' + select_btn_id + '" data-value="' + _this.val() + '" style="min-width: ' + min_width + ';" type="button"><span class="selecttomenu-btn-text ' + autowidth + '">' + txt + '</span></button>';
				_this.before(html);
			}
			
			if(_this.hasClass('keep-modal-open')) {
				$('#' + select_btn_id).addClass('keep-modal-open');
				$('#' + select_btn_id).find('.selecttomenu-btn-text').addClass('keep-modal-open');
			}
			
			_this.update_btn_text();
			_this.change_checker();
			$(window).trigger('resize');
		};
		
		this.select_item = function(obj) {
			var txt = obj.text();
			var value = obj.attr('data-value');

			$('#' + select_btn_id).attr('data-value', value);
			$('#' + select_btn_id).find('.selecttomenu-btn-text').text(txt);
			_this.val(value);
			_this.trigger('change');
			$(window).trigger('resize');

			if(obj.closest('.selecttomenu-container').nextAll().hasClass('tooltip')) {
				BootstrapComponent.tooltip_destroy( obj.closest('.selecttomenu-container') );
			}
		};
		
		this.set_selected_menu_item = function() {
			var menu = $('#' + select_menu_id);
			var val = _this.val();
			var a = menu.find('a[data-value="' + val + '"]:first');
			
			menu.find('a').each(function() {
				$(this).closest('li').removeClass('focused');
			});
			
			a.closest('li').addClass('focused');
		};
		
		this.show_menu = function() {
			if(!_this.closest('.selecttomenu-container').hasClass('disabled')) {
				if($('#' + select_menu_id).length < 1) {
					_this.create_menu();
				}

				$('#' + select_menu_id).show();
				$('#' + select_menu_id).closest('.form-group').addClass('selecttomenu-menu-open');

				if($('#' + select_btn_id).closest('.modalmenu-menu').length > 0) {
					var mm = $('#' + select_btn_id).closest('.modalmenu-menu');
					var mmh = mm.outerHeight();

					var sc = $('#' + select_btn_id).closest('.selecttomenu-container');
					var scp = sc.position().top;

					var mh = $('#' + select_menu_id).outerHeight();

					if( (scp + mh) > mmh) {
						var diff = (scp + mh) - mmh;
						$('#' + select_menu_id).css('margin-top', -(diff + 10));
					}
				}

				open_menu_targets = [];
				
				$('#' + select_menu_id).find('li').each(function() {
					var t = $.trim($(this).text()).toLowerCase();
					open_menu_targets.push(t);
					var a = $(this).find('a');
					a.attr('data-text', t);
				});
				
				_this.set_selected_menu_item();
				_this.handle_menu_keyups();
			}
		};
		
		this.update_btn_text = function() {
			if(_this.closest('.form-group').length > 0) {
				var fg = _this.closest('.form-group');
				var group_width = fg.width();

				if(_this.closest('td').length > 0) {
					fg.find('.selecttomenu-btn-text').addClass('selecttomenu-autowidth-btn-text');
				} else {
					if (group_width > 0) {
						var btn = fg.find('.selecttomenu-btn');

						if (fg.find('.input-group').length > 0) {
							var addon_w = 0;
							var btn_pad = parseInt(btn.css('padding-left')) + parseInt(btn.css('padding-right'));

							fg.find('.input-group-addon').each(function () {
								addon_w += $(this).outerWidth();
							});

							var max_w = group_width - addon_w - btn_pad;
							fg.find('.selecttomenu-btn-text').css('max-width', max_w + 'px');
						} else {
							var btn_pad = parseInt(btn.css('padding-left')) + parseInt(btn.css('padding-right'));
							var max_w = group_width - btn_pad;
						}

						fg.find('.selecttomenu-btn-text')
							.css('width', max_w + 'px')
							.css('max-width', max_w + 'px');
					} else {
						fg.find('.selecttomenu-btn-text').addClass('selecttomenu-autowidth-btn-text');
					}
				}
			}
		};
		
		_this.init();
	};
}(jQuery));