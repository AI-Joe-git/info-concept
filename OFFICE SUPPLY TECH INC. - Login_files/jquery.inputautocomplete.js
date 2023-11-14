/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 June 2015
 * 
 * jQuery plugin autocomplete
 ******************************************************************************************************************************************/
(function($) {
	$.fn.inputautocomplete = function(options) {
		var defaults = { 
			delay : 500,
			enable_show_all : false,
			id_key : 'id',
			link_class : '',
			min_keyword_length : 2,
	        name_key : 'name',
	        on_blur_cb : null,
	        on_blur_cb_context : null,
            on_blur_cb_param : ''
		};
		var opts = $.extend(opts, defaults, options);
		
		var ac = true;
		var data_type = typeof opts.data_type === 'string' ? opts.data_type : 'json';
		var id = this.attr('id');
		var link_class = opts.link_class.length > 0 
			? opts.link_class 
			: '.autocompletelink-' + this.attr('id');
		var menu_class = '.autocomplete-menu';
		var show_all_btn = '#show-all-options-' + CommonUtil.unique_id();
		var t;
		var url = typeof opts.url === 'string' ? opts.url : '';
		var _this = this;
		
		_this.attr('autocomplete', 'off');
		
		_this.on('keyup', function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
			} else {
				if (e.keyCode < 37 || e.keyCode > 40) {
					clearTimeout(t);

					if(opts.always_show_loader && ac) {
						_this.show_loader();
					}

					if(ac) {
						if(url != '' && _this.val().length > opts.min_keyword_length) {
							t = setTimeout(function() {
								_this.get_data();
							}, opts.delay);
                        } else {
                            t = setTimeout(function() {
                                if(opts.link_class === '.parentcompany-ac' && _this.val().length == 0){
                                    _this.clear_parent();
								}
                               _this.hide_loader();
                            }, opts.delay);
						};

					}
				}
			}
		});

		_this.on('keydown', function(e) {
			if (e.keyCode == 38 || e.keyCode == 40) {
				_this.handle_target_arrow_keys(e);
			} else if(e.keyCode == 13) {
				e.preventDefault();
				_this.handle_target_enter_key();
			}
		});
		
		if(typeof opts.on_blur_cb === 'string' && opts.on_blur_cb != '') {
			_this.on('blur', function(e) {
				var cb_function = typeof opts.on_blur_cb_context == 'object' ? opts.on_blur_cb_context[opts.on_blur_cb] : window[opts.on_blur_cb];
				var cb_context = typeof opts.on_blur_cb_context == 'object' ? opts.on_blur_cb_context : this;
				var cb_function_args = [];
				if (typeof opts.on_blur_cb_param == 'string' && opts.on_blur_cb_param!=''){
                    cb_function_args.push(opts.on_blur_cb_param);
				}
				if (typeof cb_function === 'function') {
					cb_function.apply(cb_context, cb_function_args);
				}
			});
		}

        this.clear_parent = function(e){
			$('#parent_company_id').val('');
            $('#copy_parent_company').val(false);
            $('#copy_parent_company').prop('checked', false);
        };

        this.handle_target_arrow_keys = function(e) {
			var menu = _this.closest('.dropdown').find('.dropdown-menu');
		
			if(menu.length > 0) {
				var menu_ht = $(menu).height();

				if(menu.find('.autocomplete-row').length > 0) {
					var row = $(menu).find('.autocomplete-row.focused');

					if(e.keyCode == 38) {
						if(row.prev('.autocomplete-row').length > 0) {
							row.removeClass('focused');
							row = row.prev('.autocomplete-row');
							row.addClass('focused');
			
							var top = row.position().top;
							if(top < $(menu).scrollTop()) {
								$(menu).scrollTop( $(menu).scrollTop() - menu_ht );
							}
						} else {
							row.removeClass('focused');
						}
					} else {
						if($(menu).find('.autocomplete-row.focused').length < 1) {
							$(menu).find('.autocomplete-row:first').addClass('focused');
							$(menu).scrollTop(0);
						} else {
							if(row.next('.autocomplete-row').length > 0) {
								row.removeClass('focused');
								row = row.next('.autocomplete-row');
								row.addClass('focused');
			
								var top = row.position().top;
								if(top >= (menu_ht + $(menu).scrollTop())) {
									$(menu).scrollTop( menu_ht + $(menu).scrollTop() );
								}
							}
						}
					}
				}
			}
		};
		
		this.handle_target_enter_key = function() {
			var focused = _this.closest('.dropdown').find('.autocomplete-row.focused a');
			focused.trigger('click');

			var href = focused.is('[href]') ? focused.attr('href') : '';

			if(href.length > 1 && href.indexOf('http') == 0) {
				CommonUtil.redirect(href);
			}
		};
		
		this.update_opts = function(options) {
			opts = $.extend(opts, opts, options);
			url = typeof opts.url === 'string' ? opts.url : url;
		};
		
		this.get_data = function(get_all) {
			_this.remove_menu();
			_this.show_loader();
			params = _this.get_params(get_all);

			var jqxhr = $.ajax({
				type : 'GET',
				url : url,
				dataType : data_type,
				data : params
			})
			.done(function(response) {
				_this.show_menu(response);
				_this.hide_loader();
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if(jqXHR.readyState == 4) {

				}
			});
		};
		
		this.setup_click = function() {
			$(link_class).on('click', function(e) {
				if(typeof opts.on_click_event === 'string') {
					e.preventDefault();
					$.event.trigger({
						type : opts.on_click_event,
						obj : $(this)
					});
				}
				
				_this.remove_menu();
			});
		};
		
		this.get_params = function(get_all) {
			var params = '';
			if(typeof opts.url_params === 'object') {
				var param_list = [];
				for(var i in opts.url_params) {
					var v;

					if(typeof get_all === 'boolean' && get_all == true) {
						v = '';
					} else {
						v = opts.url_params[i];

						if(v.indexOf('#') === 0 && $(v).length > 0) {
							v = $(v).val();
						}

						if(typeof opts.url_params_filter === 'object') {
							for(var u in opts.url_params_filter) {
								if(u == i) {
									param_list.push(i + '_raw' + '=' + encodeURIComponent(v));

									if(typeof opts.url_params_filter[u] === 'function') {
										v = opts.url_params_filter[u]();
									}
								}
							}
						}
					}
					
					param_list.push(i + '=' + encodeURIComponent(v));
				}
				params = param_list.join('&');
			}
			
			return params;
		};
		
		this.show_menu = function(data) {
			_this.remove_menu();
			_this.closest('.dropdown').find('.dropdown-menu').addClass('hide temp-hide');

			var html = '<div class="dropdown-menu inputautocomplete-menu ' + menu_class.replace('.', '') + '" style="width: ' + Number(_this.outerWidth()) + 'px;">';
			if(data.length > 0) {
				for(var i in data) {
					var data_attr = '';
					var id = data[i][opts.id_key];
					var name = data[i][opts.name_key];

					if(typeof opts.result_link === 'object' && typeof opts.result_link.pattern === 'string') {
						html += '<div class="row autocomplete-row">';
						
						var p = opts.result_link.pattern;
						var regex = /\$\{([\w]*?)\}/g;
						var matches = p.match(regex);
						
						for(var m in matches) {
							var k = matches[m].replace(/[\$\{\}]/g, '');
							p = p.replace(matches[m], data[i][k]);
						}
						
						html += p;
						html += '</div>';
					} else if(typeof opts.result_link === 'object' && typeof opts.result_link.data_attr === 'object') {
						for(var d in opts.result_link.data_attr) {
							data_attr += 'data-' + d + '="' + data[i][opts.result_link.data_attr[d]] + '" ';
						}
						html += ' \
							<div class="row autocomplete-row"> \
								<a class="' + link_class.replace('.', '') + '" ' + data_attr + ' href="#">' + name + '</a> \
							</div>';
					}
				}
			}
			else {
				html += ' \
					<div class="row"> \
						<span style="padding-left: 10px;">No results found.</span> \
					</div>';
			}
			html += '</div>';
			
			_this.after(html);
			_this.setup_click();
			_this.closest('.dropdown').addClass('open');
		};
		
		this.remove_menu = function() {
			_this.closest('.dropdown').find(menu_class).remove();
			_this.closest('.dropdown').removeClass('open');
			_this.closest('.inputautocomplete').removeClass('open');
			_this.closest('.dropdown').find('.dropdown-menu').removeClass('hide temp-hide');
		};
		
		this.show_loader = function() {
			if(_this.closest('.dropdown').find('.autocomplete-loader').length < 1) {
				_this.closest('.dropdown').append('<div class="autocomplete-loader icon-loading-small"></div>');
			}
		};
		
		this.hide_loader = function() {
			_this.closest('.dropdown').find('.autocomplete-loader').remove();
		};
		
		this.set_ac = function(val) {
			ac = val;
		};
		
		this.setup = function() {
			_this.closest('.controls').addClass('inputautocomplete dropdown');

			if(opts.enable_show_all) {
				this.setup_show_all();
			}

			$(document).on('click', show_all_btn, function() {
				if(_this.closest('.dropdown').hasClass('open')) {
					_this.remove_menu();
				} else {
					_this.get_data(true);
				}
			});
		};

		this.setup_show_all = function() {
			if(_this.is('input:text')) {
				var btn = '<a class="btn btn-default show-all-options" href="javascript:;" id="' + show_all_btn.replace('#', '') + '"><span class="caret"></span></a>';
				_this.closest('.controls').append(btn);
				_this.css('paddingRight', '30px');
			}
		};
		
		this.setup();
		
		return _this;
	};
}(jQuery));
