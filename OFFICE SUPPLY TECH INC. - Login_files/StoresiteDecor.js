function StoresiteDecor() {
	var _this = this;
	var active_tab = '';
	var all_favorite_products = [];
	var autosave_on_away_check_class = '.check-autosave-on-away';
	var autosave_on_away_class = '.autosave-on-away';
	var categories_loaded = false;
	var favorites_products_len = 0;
	var is_loaded = false;
	var products_base_url = globals.baseUrl + '/Products/overview/';
	var search_btn_class = '.decor-searchbutton';
	var search_field_select = '#decor-search-field';
	var search_options_updated = false;
	var search_string_input = '#decor-search-string';
	var search_style_select = '#decor-search-style';
	var search_type_select = '#decor-search-type';
	var showmore_products_class = '.products-showmore';
	var togglehover_hovered = false;
	var toggleonhover_class = '.toggle-on-hover';
	var toggleonhovermenu_class = '.toggle-on-hover-menu';
	var windowresize_t = null;
	var asksales_cc;
	var asksales_bcc;
	var asksales_emailer;
	
	this.init = function() {
		CommonUtil.check_for_locale_text( [{ callback: 'init_setup', context: _this }] );

        $('[data-toggle="tooltip"]').tooltip();

        $(document).on('click', '.ask-sales', function(e) {
			e.preventDefault();
			_this.show_asksales_email();
		});

		$('#requestQuote').on('click', function(e) {
			e.preventDefault();
			_this.show_asksales_email();
		});		

		$('.ask-sales-alert').on('click', function(e) {
			e.preventDefault();
			_this.show_asksales_email_alert();
		});
	
		$('.pricing-disclaimer').on('click', function(e) {
			e.preventDefault();
			_this.show_pricing_disclaimer();
		});
	
		$('.privacy-policy').on('click', function(e) {
			e.preventDefault();
			_this.show_privacy_policy();
		});
	
		$('.terms-conditions').on('click', function(e) {
			e.preventDefault();
			_this.show_terms_and_conditions();
		});
		
		$(document).on('change', '#decor_subsidiaries', function() {
			_this.change_subsidiaries();
		});

		$(document).on('change', '.catalog-change', function() {
			_this.change_catalog($(this));
		});
		
		$(document).on('click', '.contactus', function(e) {
			e.preventDefault();
			_this.show_contactus();
		});
		
		$(document).on('click', '.submit-contactus', function(e) {
			e.preventDefault();
			_this.submit_contactus();
		});
		
		/* FAVORITE PRODUCTS */
		$(document).on('click', showmore_products_class, function(e) {
			e.preventDefault();
			_this.show_all_favorite_products();
		});
		
		/* LOCALES */
		$(document).on('change', '#language', function() {
			_this.change_language();
		});
		
		/* LOGIN MESSAGE */
		$(document).on('click', '#btn-intro-read-later', function() {
			_this.intro_read_later();
		});
		
		$(document).on('click', '#btn-intro-dont-show', function() {
			_this.intro_never_show();
		});
		
		/* SEARCH */
		$(search_btn_class).on('click', function(e) {
			_this.set_search_redirect(e);
		});
		
		$(search_type_select).on('change', function() {
			_this.update_search_options();
		});
		
		$(search_string_input).keydown(function(e) {
			if (e.keyCode == 13) {
				_this.set_search_redirect(e);
			}
		});		

		/* SITEBAR */
		$(document).on('click', '.crm-help', function(e) {
			e.preventDefault();
			_this.show_help($(this).attr('data-url'), e, $(this));
		});
		
		/* TAB BAR */
		$(document).on('mouseover', toggleonhover_class, function(e) {
			togglehover_hovered = true;
			_this.show_togglehover_menu($(this), e);
		});
	
		$(document).on('mouseout', toggleonhover_class, function(e) {
			togglehover_hovered = false;
			_this.hide_togglehover_menu(500, e);
		});
		
		$(document).on('mouseover', toggleonhovermenu_class, function(e) {
			togglehover_hovered = true;
		});
	
		$(document).on('mouseout', toggleonhovermenu_class, function(e) {
			togglehover_hovered = false;
			_this.hide_togglehover_menu(500, e);
		});
		
		$(search_string_input).focus(function() {
			_this.handle_autocomplete_display();
		});
		
		$(search_string_input).on('click', function(e) {
			_this.handle_autocomplete_display();
		});

		windowresize_t = null;
		$(window).resize(function() {
			clearTimeout(windowresize_t);
			windowresize_t = setTimeout(function() {
				_this.update_main_nav();
				_this.update_main_body();
			}, 1000);
		});
	};
	
	this.init_setup = function() {
		_this.setup_autosave_on_away();
		_this.update_search_options();
		_this.set_active_tabs();
		_this.check_onload_params();
		_this.set_catalog_styles();
		_this.update_main_nav();
		_this.update_main_body();
		_this.favorite_products_setup();
		_this.get_module_categories();
		_this.check_login_popup();
		$.event.trigger({ type : 'storesiteDecorLoaded' });
		is_loaded = true;
	};

	/* ASK SALES */
	this.show_asksales_email = function() {
		if($('#mobile-help-modal').length > 0) {
			BootstrapComponent.close_modal($('#mobile-help-modal'));
		}
	
		if(typeof asksales_emailer !== 'object') {
			var opts = {
				always_use_tpl_addresses : true,
				email_key : 'ask_sales',
				modal_title : CommonUtil.get_locale_text('ask_sales_request_store'),
				get_email_tpl_params_cb : 'get_asksales_tpl_params',
				preview_loaded_cb : 'set_email_vars',
				preview_loaded_cb_context : _this,
				send_params_cb : 'get_asksales_send_params',
                get_email_tpl_done_cb : 'fill_asksales_autocomplete_buttons',
                get_email_tpl_done_cb_context : _this
			}
			asksales_emailer = new Email(opts);
			asksales_emailer.init();
		}
	
		asksales_emailer.show_preview();
	};
	
	this.set_email_vars = function() {
		_this.setup_email_autocomplete();
	};
	
	this.setup_email_autocomplete = function() {
		CommonUtil.get_script('buttoncompletemenu', function() {
			var ac_url = globals.baseUrl + '/Customers/emailSearch?email=';
	
			var bc_options = {
				ajax_url : ac_url,
				append_to_menu_label : { pre:'&lt;', post:'&gt;', data_key:'email' },
				buttonize_on_enter : true,
				buttonize_on_enter_cb : 'handle_email_enter',
				buttonize_on_enter_validation : 'CommonUtil.validEmailMultiple',
				buttonize_on_enter_delimiters : ',;',
				cache_ajax : false,
				css_prepend : 'col-sm-2',
				css_input : 'col-sm-10',
				delay : 1000,
				display_key_id : 'email',
				empty_value_display : '( ' + CommonUtil.get_locale_text('none') + ' )',
				invalid_input_message : CommonUtil.get_locale_text('one_or_more_emails_invalid'),
				min_length : 2,
				no_results_message : CommonUtil.get_locale_text('enter_key_to_add_email'),
				on_init : 'buttonize_unknown|get_static_results',
				placeholder : CommonUtil.get_locale_text('type_to_add_email') + '...',
				show_actual_values : true,
				show_list_subtext : false,
				static_results_url : globals.baseUrl + '/JSON/employees',
				use_static_results : true
			}
	
            asksales_cc = $('#cc').buttoncompletemenu(bc_options);
            asksales_bcc = $('#bcc').buttoncompletemenu(bc_options);
		});
	};

	this.show_asksales_email_alert = function() {
		alert( CommonUtil.get_locale_text('login_to_ask_sales_request') );
	};

	this.get_asksales_tpl_params = function() {
		var data = '';
	
		if (typeof doc != 'undefined' ){
			data += '&quote_id=' + doc.get_id();	
		}

		return data;
	};

	this.get_asksales_send_params = function() {
		var data = '';
	
		if (typeof doc != 'undefined' ){
			data += '&quote_id=' + doc.get_id();	
		}

		return data;
	};

    this.fill_asksales_autocomplete_buttons = function() {
        var inputs = ['cc', 'bcc'];
        var buttons = [asksales_cc, asksales_bcc];

        for(var i in inputs) {
            var item = inputs[i];
            var v = $('#' + item).val();

            $('#bcselectedlist-' + item + ' .btn').each(function() {
                $(this).trigger('click');
            });

            $('#' + item).val(v);

            if(v != '') {
                buttons[i].buttonize_unknown_list();
            }
        }
    };

	/* AUTOSAVE */
	this.setup_autosave_on_away = function() {

		if($(autosave_on_away_class).length > 0) {
			autosave_page = true;

			$(document).on('click', '#top-nav a, #header-main-container a, #nav-main-navbar a, #main-search-bar a, #main-search-bar .search-main-btn button, #side-left a, #side-right a, #footer-main a, .nav-links a, ' + autosave_on_away_check_class, function(e) {
				if(typeof doc === 'object' && typeof doc.is_cart === 'function') {
					if(doc.is_cart()) {
						$('.documentCustomField, .global-custom-field, .custom-field').each(function() {
							$(this).addClass('novalidate');
						});
					}
				}
				
				if($(this).is('[target]')) {
					if($(this).attr('target').indexOf('self') > 0 || $(this).attr('target') == '') {
						_this.autosave_redirect(e, $(this));
					}
				} else {
					_this.autosave_redirect(e, $(this));
				}
			});
			
			CommonUtil.get_locale_text('work_autosaved', 'set_autosave_message', _this, []);
		}
	};
	
	this.set_autosave_message = function(text) {
		var html = '<div class="alert alert-info" id="autosave-alert" style="margin-top: 20px;">' + text + '</div>';
		$(autosave_on_away_class).after(html);
	};

	this.autosave_redirect = function(e, obj) {
		e.preventDefault();
		var form_id = $(autosave_on_away_class).attr('id');
		var changed = false;
		var url = '';

		if(autosave_original_form_data == '') {
			changed = true;
		} else {
			var formdata = CommonUtil.form_serialize('#' + form_id);
			changed = CommonUtil.is_form_changed(autosave_original_form_data, formdata);
		}

		if(typeof obj === 'object' && obj.is('[href]')) {
			url = obj.attr('href');
		} else {
			url = typeof autosave_redirect_url_override === 'string' && autosave_redirect_url_override.length > 0 ? autosave_redirect_url_override : url;
		}

		if(url.indexOf('#') !== 0) {
			if(changed) {
				var function_args = [];
				var cb_function = window['form_autosave'];
				var cb_context = this;

				if(typeof cb_function === 'function') {
					autosave_event = e;
					autosave_redirect_url = url;
					cb_function.apply(cb_context, function_args);
				} else {
					CommonUtil.redirect(url);
				}
			} else {
				CommonUtil.redirect(url);
			}
		}
	};
	
	/* CATALOG */
	this.set_catalog_styles = function() {
		if(typeof default_catalog_id === 'string') {
			$('#decor_catalog option').each(function() {
				if($(this).val() == default_catalog_id) {
					var text = $(this).text() + ' *';
					$(this).text(text);
				}
			});
		}
	};
	
	/* CONTACT US */
	this.show_contactus = function() {
		$('#storesite-contactus').remove();
		var url = globals.baseUrl +  '/storesiteDecor/contactUs';

		BootstrapComponent.modal({
			added_class : 'medium',
			ajax_content: url,
			buttons : '<div class="actions-left"> <a class="btn btn-primary submit-contactus" href="#">Submit</a> </div> <div class="actions-right"> <a class="btn btn-danger close-modal" href="javascript:;">Cancel</a> </div>',
			content : '',
			id:'storesite-contactus',
			title: 'Contact Us'
		});

		BootstrapComponent.open_modal($('#storesite-contactus'));
	};
	
	this.submit_contactus = function() {
		$('#contactFormState').val( $('#contact_form_select_state option:selected').text() );
		$('#contactFormCountry').val( $('#contact_form_select_country option:selected').text() );
		
		InputValidation.validate('#contactus-form');
		
		var valid = InputValidation.valid('#contactus-form');
		var form_data = CommonUtil.form_serialize('#contactus-form');
		
		if(valid) {
			$.ajax({
				type : 'POST',
				url : globals.baseUrl + '/storesiteDecor/sendContactUs',
				dataType : 'json',
				data : form_data,
				success : function(response) {				
					if(response.success == 1) {
						var html = '';

						if(typeof response.confirmation === 'string') {
							html = response.confirmation;
						} else {
							html = CommonUtil.get_locale_text('contactus_confirmation_html');
						}

						$('#storesite-contactus-modalbody .ajax-content').html(html);
						$('.submit-contactus').hide();
					} else {
						alert( CommonUtil.get_locale_text('error_sending_email') );
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					
				}
			});
		}
	};
	
	/* FAVORITE PRODUCTS */
	this.favorite_products_setup = function() {
		if(typeof all_favorite_products_count === 'string' || typeof all_favorite_products_count === 'number') {
			var products_cnt = parseInt(all_favorite_products_count);
			favorites_products_len = $('#favorite-products-list-container').find('li').length;

			if (products_cnt > 0 && favorites_products_len < products_cnt) {
				_this.favorite_products_show_more();
			}
		}
	};

	this.favorite_products_show_more = function() {
		var jqxhr = $.ajax({
			type : 'GET',
			url : globals.baseUrl + '/JSON/allUserFavorites',
			data : null,
			dataType : 'jsonp'
		})
		.done(function(responseData) {
			$('#favorite-products-list-container').after('<ul class="no-border show-more"><li><a class="toggle-text ' + showmore_products_class.replace('.', '') + '" href="#">' + CommonUtil.get_locale_text('show_more') + ' &raquo;</a></li></ul>');
		
			for(var i in responseData) {
				if(i >= favorites_products_len) {
					all_favorite_products.push(responseData[i]);
				}
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {});
	};
	
	this.show_all_favorite_products = function() {
		$(showmore_products_class).each(function() {
			var ul = $(this).closest('ul');
			var main_ul = $('#favorite-products-list-container');
			ul.remove();

			for(var i in all_favorite_products) {
				var html = '<li><a href="' + products_base_url + all_favorite_products[i].productId + '">' + all_favorite_products[i].displayName + '</a></li>';
				main_ul.append(html);
			}
		});
	};
	
	/* FOOTER LINKS */
	this.show_pricing_disclaimer = function() {
		var url = globals.baseUrl +  '/storesiteDecor/displayPage/pricingDisclaimer';

		$('#storesite-info-modal').remove();
		BootstrapComponent.modal({
			added_class : 'large',
			ajax_content: url,
			content : '',
			id:'storesite-info-modal',
			show_header: true,
			show_footer: false,
			title: CommonUtil.get_locale_text('pricing_disclaimer')
		});

		BootstrapComponent.open_modal($('#storesite-info-modal'));
	};

	this.show_privacy_policy = function() {
		var url = globals.baseUrl +  '/storesiteDecor/displayPage/privacyPolicy';
		
		$('#storesite-info-modal').remove();
		BootstrapComponent.modal({
			added_class : 'large',
			ajax_content: url,
			content : '',
			id:'storesite-info-modal',
			show_header: true,
			show_footer: false,
			title: CommonUtil.get_locale_text('privacy_policy')
		});

		BootstrapComponent.open_modal($('#storesite-info-modal'));
	};

	this.show_terms_and_conditions = function() {
		var url = globals.baseUrl +  '/storesiteDecor/displayPage/termsAndConditions';
		
		$('#storesite-info-modal').remove();
		BootstrapComponent.modal({
			added_class : 'large',
			ajax_content: url,
			content : '',
			id:'storesite-info-modal',
			show_header: true,
			show_footer: false,
			title: CommonUtil.get_locale_text('terms_and_conditions')
		});

		BootstrapComponent.open_modal($('#storesite-info-modal'));
	};
	
	/* HELP */
	this.show_help = function(url, event, obj) {
		var is_link = false;
		
		if(typeof obj === 'object') {
			var href = obj.attr('href');
			
			if(href != '#') {
				url = obj.attr('href');
				is_link = true;
			}
		}

		if(is_link) {
			CommonUtil.redirect(url);
		} else {
			if(url != '#') {
				CommonUtil.popup_generic(url, 'Help', 750, 950, event);
			}
		}
	};
	
	/* LOGIN MESSAGE */
	this.check_login_popup = function() {
		var login_cookie = CommonUtil.get_cookie(storage_initial_login);
		var loc = document.location.href;

		if( (login_cookie === 'true' || login_cookie === true) && loc.indexOf('/Login') < 0 ) {
			var jqxhr = $.ajax({
				type : 'GET',
				url : globals.baseUrl + '/storesiteDecor/checkIntroductionMessage',
				dataType : 'json'
			})
			.done(function(result) {
				if(result.showMessage == true) {
					_this.show_intro_message();
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {

			});
		}
	};
	
	this.intro_never_show = function() {
		var jqxhr = $.ajax({
			type : 'GET',
			url : globals.baseUrl + '/storesiteDecor/hideIntroductionMessage',
			dataType : 'json'
		})
		.done(function(result) {
			BootstrapComponent.close_modal($('#storesite-intro-message'));
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			
		});
	};
	
	this.intro_read_later = function() {
		BootstrapComponent.close_modal($('#storesite-intro-message'));
	};
	
	this.show_intro_message = function() {
		var url = globals.baseUrl +  '/storesiteDecor/introductionMessage';
		var buttons = '<div class="actions-left"><a id="btn-intro-read-later" class="btn btn-primary" href="javascript:;">' + CommonUtil.get_locale_text('read_later') + '</a></div> <div class="actions-right"><a class="btn btn-danger" href="javascript:;" id="btn-intro-dont-show">' + CommonUtil.get_locale_text('dont_show_again') + '</a></div>';
		
		$('#storesite-intro-message').remove();
		BootstrapComponent.modal({
			added_class : 'medium',
			ajax_content: url,
			buttons : buttons,
			content : '',
			id:'storesite-intro-message',
			show_close_btn : false,
			title: ''
		});

		var opts = { ajax_callback : 'update_into_modal_title', ajax_context : _this };
		BootstrapComponent.open_modal($('#storesite-intro-message'), opts);
		CommonUtil.set_state(storage_initial_login, '');
	};
	
	this.update_into_modal_title = function() {
		var title = $('#intro_message_title').val();
		$('.modal:visible').find('.modal-header h3').text(title);
	};
	
	/* MAIN BODY */
	this.update_main_body = function() {
		if($('.carousel.storesite-home-module').length > 0 || $('.storesite-spotlite').length > 0 || $('.storesite-featuredproducts').length > 0) {
			if($('.carousel.storesite-home-module').length > 0) {
				$('.carousel.storesite-home-module').hide();
			}
			
			if($('.storesite-spotlite').length > 0) {
				$('.storesite-spotlite').hide();
			}
			
			if($('.storesite-featuredproducts').length > 0) {
				$('.storesite-featuredproducts').hide();
			}
			
			var main_width = $('.main-body').width();
			$('.main-body').attr('data-width', main_width);
			
			if($('.carousel.storesite-home-module').length > 0) {
				$('.carousel.storesite-home-module').css('max-width', main_width);
				$('.carousel.storesite-home-module').show();
			}
			
			if($('.storesite-spotlite').length > 0) {
				$('.storesite-spotlite').css('max-width', main_width);
				$('.storesite-spotlite').show();
			}
			
			if($('.storesite-featuredproducts').length > 0) {
				$('.storesite-featuredproducts').css('max-width', main_width);
				$('.storesite-featuredproducts').show();
			}
		}
	};
	
	/* MODULES */
	this.get_categories_loaded = function() {
		return categories_loaded;
	};
	
	this.get_module_categories = function() {
		if($('[data-component="browseByCategory"]').length > 0) {
			var category_container = $('[data-component="browseByCategory"]').find('.body:first');
			_this.load_module_categories(category_container);
		}
	};

	this.load_module_categories = function(category_container) {
		CommonUtil.page_wait_loader(category_container);

		var jqxhr = $.ajax({
			type : 'GET',
			url : globals.baseUrl + '/storesiteDecor/moduleCategories',
			data : null,
			dataType : 'html',
			success : function(responseData) {
				CommonUtil.page_wait_loader(category_container, 'remove');
				category_container.html(responseData);
				$.event.trigger({ type : 'moduleCategoriesLoaded' });
				categories_loaded = true;
			}
		})
			.fail(function(jqXHR, textStatus, errorThrown) {
				CommonUtil.page_wait_loader(category_container, 'remove');
			});
	};
	
	/* ON LOAD */
	this.check_onload_params = function() {
		var has_subsidiaries = CommonUtil.get_param('hasSubsidiaries');

		if(typeof has_subsidiaries === 'string' && has_subsidiaries == '1' ) {
			if ($("#module-subsidiaries").size()>0){
				_this.show_subsidiaries_alert_for_settings_menu();
			} else {
				_this.show_subsidiaries_alert();
			}
			
			
		}
	};

	this.get_is_loaded = function() {
		return is_loaded;
	};
	
	this.show_subsidiaries_alert_for_settings_menu = function() {
		var html = '\
			<div class="alert alert-info alert-dismissible"> \
				<button type="button" class="close" data-dismiss="alert" aria-label="' + CommonUtil.get_locale_text('close') + '"> \
					<span aria-hidden="true">&times;</span> \
				</button> \
				' + CommonUtil.get_locale_text('access_to_multiple_subsidiaries_or_stores') + '<br /> \
				' + CommonUtil.get_locale_text('select_location_under_my_account') + ' \
			</div>';
		$('#body-main').prepend(html);
	};
	
	this.show_subsidiaries_alert = function() {
		var html = '\
			<div class="alert alert-info alert-dismissible"> \
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"> \
					<span aria-hidden="true">&times;</span> \
				</button> \
				' + CommonUtil.get_locale_text('access_to_multiple_subsidiaries_or_stores') + '<br /> \
				' + CommonUtil.get_locale_text('select_location_from_company_store') + ' \
			</div>';
		$('#body-main').prepend(html);
	};
	
	/* SEARCH */
	this.get_search_options_updated = function() {
		return search_options_updated;
	};

	this.set_search_options_updated = function(val) {
		search_options_updated = val;
	};

	this.set_search_redirect = function(e) {
		var url = $(search_type_select).val();
		var search_string = $(search_string_input).val();
		search_string = CommonUtil.xss_clean(search_string);
		search_string = encodeURIComponent(search_string);
		
		var q = url.slice(-1);
		var qm = q != '?' ? '?' : '';
		url = url + qm + 'search_string=' + search_string;
		var search_type = $(search_type_select).find('option:selected').attr('id');
		url = url + '&search_type=' + escape(search_type);

		var search_field = $(search_field_select).val();
		url = url + '&search_field=' + escape(search_field);
		var search_style = $('input[name=decor_search_style]:checked').val();

		if (typeof search_style != 'undefined') {
			search_style = escape(search_style);
		} else {
			search_style = '';
		}

		url = url + '&decor_search_string_change=yes&search_style=' + search_style;
		if (url.indexOf('Docs/list')!=-1){
            if ($('#time_limit').length == 1){
                url = url + '&time_limit=' + encodeURIComponent($('#time_limit').val());
            }
            if ($('#status').length == 1){
                url = url + '&status=' + encodeURIComponent($('#status').val());
            }
		}
		CommonUtil.set_state(storage_productsearchresultselections, '');

		if(autosave_page === true) {
			autosave_redirect_url_override = url;
			_this.autosave_redirect(e, '');		
		} else {
			CommonUtil.redirect(url);
		}
	};
	
	this.update_search_options = function() {
		_this.set_search_options_updated(false);
		CommonUtil.check_for_locale_text( [{ callback: 'do_update_search_options', context: _this }] );
	};

	this.do_update_search_options = function() {
		$(search_field_select + ' option').remove();
		var search_type_val = $(search_type_select).val();
		var search_type = $(search_type_select).find('option[value="' + search_type_val + '"]').attr('id');
		search_type = CommonUtil.is_null_or_empty(search_type) ? $(search_type_select).find('option:first').attr('id') : search_type;

		var t = setInterval(function() {
			if(typeof storesite_search_options === 'object') {
				clearInterval(t);
				var options = storesite_search_options[search_type];
				var html = '';

				if (typeof options == 'object' && options.length > 0) {
					$(search_field_select).show();
					for ( var i in options) {
						var optname = typeof options[i].locale_key === 'string' ? CommonUtil.get_locale_text( options[i].locale_key ) : options[i].name;
						html += '<option value="' + options[i].value + '">' + optname + '</option>';
					}
				} else {
					$(search_field_select).hide();
				}

				$(search_field_select).html(html);

				if(search_type == 'ds_order') {
					$(search_style_select).show();
				} else {
					$(search_style_select).hide();
				}

                if(typeof keyword_details == 'object' && typeof keyword_details[search_type] == 'object') {
                    $(search_string_input).val(keyword_details[search_type].keyword);
                    var search_field_select_val = keyword_details[search_type].keywordField;
                    if($(search_field_select).find('option[value=' + search_field_select_val + ']').length > 0) {
                        $(search_field_select).val(search_field_select_val);
                    }
                }
				_this.set_search_options_updated(true);
			}
		}, 500);
	};
	
	this.setup_search_autocomplete = function() {
		CommonUtil.get_script('inputautocomplete', function() {
	        var ac_options = {
	            always_show_loader : true,
	            data_type : 'jsonp',
	            delay : 300,
	            url : '',
	            url_params : {
	            	keyword : search_string_input
	            }
	        };
			
			search_ac = $(search_string_input).inputautocomplete(ac_options);

			$(document).on('focus', search_string_input, function() {
				var sts = $(search_type_select + ' option:selected').attr('id');
				search_ac.set_ac(false);
				
				if(sts == 'ds_order') {
					search_ac.update_opts({
						result_link : { pattern : '<a href="${link}">${quoteNumber} / ${c}</a>' },
						url : globals.baseUrl + '/autocomplete/doc'
					});
					search_ac.set_ac(true);
				}               
			});
        });
	};

	this.search_redirect_id = function(e) {
		var item_id = e.obj.attr('data-id');		
		var url = globals.baseUrl + '/Docs/standard?id=' + item_id ;
		CommonUtil.redirect(url);			
	};
	
	this.handle_autocomplete_display = function() {
		if($('#main-search-bar').find('.inputautocomplete-menu').length > 0) {
			$('#main-search-bar').removeClass('open');
			$('#main-search-bar').find('.inputautocomplete').removeClass('open');
			$('#main-search-bar').find('.inputautocomplete-menu').remove();
		}
	};

	/* SUBSIDIARIES */
	this.change_subsidiaries = function() {
	 	var url = globals.baseUrl + '/Contact/changeSubsidiary/' + $('#decor_subsidiaries').val();
		CommonUtil.redirect(url);
	};
 
	this.change_language = function() {
		var jqxhr = $.ajax({
			type : 'POST',
			url : globals.baseUrl + '/prefs/updateUserLanguage?language=' + $('#language').val(),
			dataType : ''
		})
		.done(function(responseData) {
			CommonUtil.refresh_page();
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			alert('There was an error attempting to save.');
		});
	};

	this.change_catalog = function(obj) {
	 	var url = globals.baseUrl + '/Products/changeCatalog/' + obj.val();
		CommonUtil.redirect(url);
	};
	
	/* TAB BAR */
	this.show_togglehover_menu = function(obj, e) {
		$('.dropdown').removeClass('open');
		$('.dropdown .btn-group').removeClass('open');
		obj.parent().addClass("open");
		
		if(typeof handle_dropdown_toggle === 'function') {
			handle_dropdown_toggle(obj, e);
		}
	};
	
	this.handle_togglehover_menu = function(e) {
		if(typeof e === 'object') {
			if($(e.target).is('select') && $(e.target).closest(toggleonhover_class).length > 0) {
				togglehover_hovered = true;
				$(e.target).closest('.dropdown').addClass('open');
				$(e.target).closest('.dropdown-menu').addClass('display-block');
			}
		}
	};
	
	this.hide_togglehover_menu = function(sec, e) {
		_this.handle_togglehover_menu(e);
		var time = typeof sec == 'number' ? sec : 1000;
		var t = setTimeout(function() {
			if(togglehover_hovered == false) {
				$(toggleonhover_class).each(function() {
					$(this).closest('.dropdown').removeClass('open');
					$(this).closest('.dropdown-menu').removeClass('display-block');
				});
				
				$(toggleonhovermenu_class).each(function() {
					$(this).closest('.dropdown').removeClass('open');
					$(this).closest('.dropdown-menu').removeClass('display-block');
				});
			}
		}, time);
	};
	
	/* TABS */
	this.set_nav_on_styles = function() {
		/* MAIN TOP BAR TABS */
		$('li.crm-tab-bar').removeClass('active');
		if (typeof active_tab == 'string' && active_tab.length > 0) {
			$('#' + active_tab).closest('li').addClass('active');
		}
	};
	
	this.set_active_tabs = function() {
		var loc = window.location.href;
		var rank = -1;
		
		var selected_tab = [];
		for(var i in main_tabs_storesite) {
			//do not select cart tab if we open non-active document
			if (main_tabs_storesite[i] == main_tabs_storesite['tab-cart'] && !isOnActiveCart){
				continue;
			}					
			for(var j in main_tabs_storesite[i]) {

				if(typeof main_tabs_storesite[i][j].exact == 'boolean' && main_tabs_storesite[i][j].exact == true) {
					if(loc == main_tabs_storesite[i][j].path) {
						var mt = main_tabs_storesite[i][j];
						mt.opt = i;
						selected_tab.push(mt);
					}
				} else if(loc.indexOf(main_tabs_storesite[i][j].path) > 0) {
					var mt = main_tabs_storesite[i][j];
					mt.opt = i;
					selected_tab.push(mt);
				}
			}
		}

		if(selected_tab.length > 0) {
			for(var i in selected_tab) {
				if(selected_tab[i].rank > rank) {
					active_tab = selected_tab[i].opt;
				}
				rank = selected_tab[i].rank;
			}
		}
		
		if(loc.indexOf('/customTab/') > 0) {
			var parts = loc.split('/');
			var page = parts[ parts.length-1 ];
			
			if(page != '') {
				$('.mainnav-item[id^="custom-tab-"]').each(function() {
					var id = $(this).attr('id');
					var navparts = id.split('-');
					var navid = navparts[ navparts.length-1 ];

					if(navid == page) {
						active_tab = 'custom-tab-' + page;
					}
				});
			}
		}

		_this.set_nav_on_styles();
	};
	
	this.update_main_nav = function() {
		if($('#nav-main-navbar').closest('#header-main-container').length < 1) {
			var hidden_tabs = [];
			var push_to_hidden = false;
		
			if($('#main-nav-tabmenu-list').length > 0) {
				var html = $('#main-nav-tabmenu-list').html();
				$('#main-nav-tabmenu-container').remove();
				$('#nav-main-navbar ul').append(html);
			}
		
			if($('#nav-main-container .navbar-header .navbar-toggle').is(':visible')) {
				$('#nav-main-navbar .nav .crm-tab-bar').each(function() {
					$(this).css('width', 'auto');
				});
			} else {
				var nav_w = $('#nav-main-navbar').width();
				var nav_w_items = $('#nav-main-navbar .navbar-nav').width() + 25;
	
				if(parseInt(nav_w_items) > parseInt(nav_w)) {
					var visible_tabs = $('#nav-main-navbar ul').children();
					var len = visible_tabs.length;
					$('#nav-main-navbar ul').empty();
				
					for(i=0; i<len; i++) {
						$('#nav-main-navbar ul').append(visible_tabs[i]);
						var navbar_w = $('#nav-main-navbar .navbar-nav').width();
			
						if(push_to_hidden) {
							hidden_tabs.push(visible_tabs[i]);
						} else {
							if(navbar_w > nav_w) {
								$('#nav-main-navbar ul li:last').remove();
								hidden_tabs.push(visible_tabs[i]);
								push_to_hidden = true;
							}
						}
					}
				
					if(hidden_tabs.length > 0) {
						var html = ' \
							<li class="crm-tab-bar" id="main-nav-tabmenu-container"> \
								<a href="#" data-toggle="dropdown" id="main-nav-tabmenu" aria-expanded="false" class="mainnav-item dropdown-toggle"><span class="mainnav-item-text">...</span></a> \
								<div class="dropdown-menu pull-right" id="main-nav-tabmenu-menu"> \
									<div class="dropdown-menu-content"> \
										<ul id="main-nav-tabmenu-list"></ul> \
									</div> \
								</div> \
							</li>';
						$('#nav-main-navbar ul').append(html);
					
						for(i=0; i<hidden_tabs.length; i++) {
							$('#main-nav-tabmenu-list').append(hidden_tabs[i]);
						}
					}
				}

			}
		}
	};
}
