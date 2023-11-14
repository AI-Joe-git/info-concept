var add_cart_checker = null;
var add_cart_queue = [];
var session_expire = null;

$(document).ready(function() {
	CommonUtil.check_for_locale_text( [{ callback: 'init_common_scripts', context: window }] );
	
	$('html').click(function(e) {
		handle_document_clicks(e);
	});
	
	$(document).on('click', '.close-modal', function() {
		BootstrapComponent.close_modal($(this));
	});
	
	$(document).on('click', '.close-modal-panel', function() {
		CommonUtil.modal_panel_close();
	});
	
	$(document).on('click', '.iframed-close-modal', function() {
		CommonUtil.send_post_message('closeModal');
	});

	$(document).on('click', '.modal-image', function(e) {
		e.preventDefault();
		open_modal_image($(this));
	});

	$(document).on('click', '.disabled', function(e) {
		e.preventDefault();
	});
	
	$(document).on('click', '.menu-nopropagate', function(e) {
		e.preventDefault();
		handle_nopropagate_menu($(this));
	});
	
	$(document).on('click', '.dropdown-toggle', function(e) {
		handle_dropdown_toggle($(this), e);
	});
	
	$(document).on('mouseover', '.dropdown-toggle', function(e) {
		handle_dropdown_toggle($(this), e);
	});
	
	$(document).on('click', '.costandard-checkall-cb', function(e) {
		handle_checkall_toggle($(this));
	});

	$(document).on('click', '#doc-back-to-results, .back-to-results', function(e) {
		e.preventDefault();
		back_to_product_search_results();
	});

	$(document).on('change, blur', '.custom-field-currency', function() {
		update_currency_value($(this));
	});

	set_window_onmessage();
	init_session_expire();
	
	$(window).resize(function() {
		set_fluid_widths();
		update_input_group_addons();
	});

	$.ajaxSetup({
		success: function(){
			if(session_expire == null) {
				init_session_expire();
			}

			session_expire.set_expire_check();
		}
	});
});

function set_window_onmessage() {
	var loc = window.location.href;

	for(var i in exclude_window_onmessage_pages) {
		if(loc.indexOf(exclude_window_onmessage_pages[i]) > 0) {
			return;
		}
	}

	if (window.addEventListener) {
		window.addEventListener('onmessage',function(e) {
			handle_postmessage_data(e);
		});
	} else {
		window.attachEvent('onmessage',function(e) {
			handle_postmessage_data(e);
		});
	}

	window.onmessage = function(e) {
		handle_postmessage_data(e);
	}
}

function init_common_scripts() {
	set_select_access_read();
	set_product_filter_tree();
	set_fluid_widths();
	set_data_popovers();
	update_input_group_addons();
	toggle_selected_accordion();
	create_tooltips();
}

function handle_postmessage_data(event) {
	if(typeof event === 'object' && typeof event.data === 'string') {
		if(event.data.lastIndexOf('update_autotask_cf',0) === 0) {
			if(typeof doc === 'object') {
				doc.handle_autotask_event(event);
			}
		} else if (event.data === 'closeAndRefresh') {
			BootstrapComponent.close_modals();
			CommonUtil.refresh_page();
		} else if (event.data === 'refreshPage') {
			CommonUtil.refresh_page();
		} else if (event.data === 'closeModal') {
			BootstrapComponent.close_modals();
		} else if (event.data === 'closeMini') {
			dcrm.hide_mini_organizer();
		} else if (event.data.indexOf('expandMini') == 0) {
			var parts = event.data.split(':');
			var item_id = typeof parts[1] == 'string' ? parts[1] : '';
			var item_fieldtype = typeof parts[2] == 'string' ? parts[2] : '';
			var item_type = typeof parts[3] == 'string' ? parts[3] : '';
			dcrm.show_organizer({id:item_id, fieldType:item_fieldtype, itemType:item_type, place:'expand_mini'});
		} else if (event.data.indexOf('resizeIframeContent') == 0) {
			var parts = event.data.split(':');
			var iframe_id = parts[1];
			var iframe_height = typeof parts[2] === 'string' ? parts[2] : '';
			resize_iframe(iframe_id, iframe_height);
		} else if (event.data == 'shiftMini') {
			dcrm.shift_mini_organizer();
		} else if (event.data.indexOf('setMiniOrganizerId') == 0) {
			var parts = event.data.split(':');
			var notetask_id = parts[1];
			CommonUtil.set_state(storage_organizerminiitemid, notetask_id);
		} else if(event.data.lastIndexOf('update_document_lineitemid',0) === 0) {
			if(typeof doc === 'object') {
				doc.handle_update_document_lineitemid_event(event);
			}
		} else if (event.data == 'refreshMini') {
			dcrm.refresh_mini_organizer();
		} else if (event.data == 'showMiniOrganizer') {
			dcrm.show_mini_organizer();
		} else if (event.data == 'showModalWaitLoader') {
			BootstrapComponent.show_modal_wait_loader();
		} else if (event.data == 'hideModalWaitLoader') {
			BootstrapComponent.hide_modal_wait_loader();
		} else if (event.data == 'removeModalLoader') {
			BootstrapComponent.remove_modal_loader();
		} else if(event.data.indexOf('redirectPage') == 0) {
			var parts = event.data.split(' | ');
			var url = typeof parts[1] == 'string' ? parts[1] : '';
			if(url.length > 0) {
				CommonUtil.redirect(decodeURIComponent(url));
			}
		} else if (event.data == 'disableModalButtons') {
			CommonUtil.disable_modal_buttons();
		} else if (event.data == 'enableModalButtons') {
			CommonUtil.enable_modal_buttons();
		} else if (event.data == 'saveCreateInvoice') {
			createInvoice();
		} else if (event.data == 'cancelCreateInvoice') {
			cancelCreateInvoice();
		} else if (event.data == 'saveCreateSalesOrder') {
			createSalesOrder();
		} else if (event.data == 'cancelCreateSalesOrder') {
			cancelCreateSalesOrder();
		} else if (event.data == 'createCreateRMA') {
			createRma();
		} else if (event.data == 'cancelCreateRMA') {
			cancelCreateRma();
		} else if(event.data == 'saveLinkSo') {
			linkSo();
		} else if (event.data == 'showCreateDashboardModal') {
			show_create_dashboard_modal();
		} else if (event.data.indexOf('cancelSettingsAccordionIframe') == 0) {
			var parts = event.data.split(':');
			var settings_id = typeof parts[1] == 'string' ? parts[1] : '';
			handle_settings_cancel( $('#settings-' + settings_id).find('.settings-cancel:first') );
		} else if (event.data.indexOf('modalAlert') == 0) {
			BootstrapComponent.close_modals();
			var parts = event.data.split(' | ');
			var msg = parts[1];
			msg = CommonUtil.text_to_html(msg);
			BootstrapComponent.quick_modal({ size:'medium', content:msg, title:'Alert' });
		} else if (event.data.indexOf('esignPaymentDone') == 0) {
			if(typeof esign_payment_done === 'function') {
				esign_payment_done();
			}
		} else if(event.data == 'cancelAccessKey') {
			cancelAccessKey();
		} else if(event.data == 'saveAccessKey') {
			saveAccessKey();
		} else if(event.data == 'saveandexitAccessKey') {
			saveandexitAccessKey();
		} else if(event.data == 'nextAccessKey') {
			nextAccessKey();
		} else if(event.data == 'prevAccessKey') {
			prevAccessKey();
		} else if(event.data.indexOf('triggerEvent') == 0) {
			var parts = event.data.split(' | ');
			var obj = {};
			var e = typeof parts[1] == 'string' ? parts[1] : '';
			obj.type = e;

			if(typeof parts[2] == 'string') {
				obj.param = parts[2];
			}
			
			$.event.trigger(obj);
		} else if(event.data == 'loadNextSettingPage') {
			load_next_setting_page();
		} else if(event.data == 'nextAccountSettingsPage') {
			handle_settings_next_prev('next');
		} else if(event.data == 'previousAccountSettingsPage') {
			handle_settings_next_prev('prev');
		} else if(event.data == 'saveSearchRanking') {
			saveSearchRanking();
		} else if(event.data.indexOf('previousCreateAccountPage') == 0) {
			var parts = event.data.split(' | ');
			var current_widget = parts[1];
			var id = parts[2];
			var account_type = parts[3];
			handle_create_account_settings_pager('previous', current_widget, id, account_type);
		} else if(event.data.indexOf('nextCreateAccountPage') == 0) {
			var parts = event.data.split(' | ');
			var current_widget = parts[1];
			var id = parts[2];
			var account_type = parts[3];
			handle_create_account_settings_pager('next', current_widget, id, account_type);
		} else if(event.data == 'setFullModalBody') {
			CommonUtil.set_full_modal_body();
		} else if (event.data === 'uploadingFile') {
			image_picker_uploading();
		} else if (event.data === 'refreshImageList') {
			image_picker_refresh_list();
		} else if (event.data === 'triggerCloseModal') {
			CommonUtil.trigger_close_modal();
		} else if (event.data === 'triggerResize') {
			$(window).trigger('resize');
		} else if (event.data === 'fixRedraw') {
			CommonUtil.fix_redraw();
		} else if (event.data.indexOf('userDownloadedZuoraInvoice') == 0) {
            log_zuora_event('invoiceDownload', event.data);
        } else if (event.data.indexOf('userClickedZuoraTermsAndConditions') == 0) {
            log_zuora_event('termsAndConditionsClick', event.data);
        } else if (event.data.indexOf('userRenewedSubscription') == 0) {
            log_zuora_event('subscriptionRenew', event.data);
        } else if (event.data.indexOf('userDownloadedSubscriptionFile') == 0) {
            log_zuora_event('subscriptionFileDownload', event.data);
        } else if (event.data.indexOf('userDownloadedTermsFile') == 0) {
            log_zuora_event('termsFileDownload', event.data);
        } else if (event.data.indexOf('userAcceptsAmendments') == 0) {
            log_zuora_event('amendmentsAccept', event.data);
        } else if (event.data.indexOf('userPaidInvoices') == 0) {
            log_zuora_event('invoicePay', event.data);
        }
	}
}

/* ACCORDION */
function toggle_selected_accordion() {
	var open_accordion = CommonUtil.get_param('open_accordion');
	
	if(open_accordion != '') {
		if($('#' + open_accordion).length > 0) {
			$('#' + open_accordion).trigger('click');
		}
		
		scroll_to_obj();
	}
}

/* ADD TO CART */
function handle_add_cart_click(url, obj) {
	add_cart_queue.push(url);

	if(obj != null && typeof obj === 'object') {
		obj.addClass('disabled');

		var t = setTimeout(function() {
			obj.removeClass('disabled');
		}, 10000);
	}

	add_cart_checker = setTimeout(function() {
		var add_cart_url = add_cart_queue[0];

		if(typeof add_cart_url === 'string') {
			do_add_cart_action(add_cart_url, obj);
		}

		add_cart_queue = [];
	}, 1000);
}

function do_add_cart_action(url, obj) {
	if( (typeof globals.onStore === 'string' && globals.onStore == 'true') && globals.enableCheckoutRemain ) {
		show_add_cart_modal_message();

		var jqxhr = $.ajax({
			type : 'GET',
			url : url + '&remain=1',
			data : null,
			dataType : 'json'
		})
			.done(function(responseData) {
				add_cart_queue = [];
				var message = '';
				var unaddable_products = [];

				if(typeof responseData.messages === 'object') {
					message += '<div style="margin-bottom: 20px;">';

					for(var i in responseData.messages) {
						message += '<div>' + responseData.messages[i] + '</div>';
					}

					message += '<hr /></div>';
				}

				if(typeof responseData.unaddableProducts === 'string' && responseData.unaddableProducts != '') {
					unaddable_products = responseData.unaddableProducts.split(',');
				}

				if(typeof responseData.products === 'object') {
					message += 'The following item(s) have been added to the cart:';
					message += '<div class="added-products-list text-left">';

					var c = 0;
					for(var i in responseData.products) {
						var qty_display = 'Qty: ' + responseData.products[i].qty;

						if( CommonUtil.in_array(unaddable_products, responseData.products[i].id) ) {
							qty_display = '<span class="red">Qty: 0</span>';
						}

						message += '<div class="row"> \
                    					<div class="col-sm-2"><img alt="Product image" title="' + CommonUtil.clean_attribute(responseData.products[i].title) + '" class="addcart-product-img" src="' + globals.baseUrl + '/Products/image/' + responseData.products[i].id + '" /></div> \
                    					<div class="col-sm-6"><span class="strong">' + responseData.products[i].title + '</span><br />' + responseData.products[i].descriptionTwo + '</div> \
                    					<div class="col-sm-2 nowrap">' + responseData.products[i].partNum + '</div> \
                        				<div class="col-sm-2 text-right">' + qty_display + '</div> \
									</div>';

						if(c < responseData.products.length-1) {
							message += '<hr class="inner" />';
						}

						c++;
					}

					message += '</div>';
					$('#add-cart-modal-modalbody').html(message);
					get_cart_count();
				} else {
					$('#add-cart-modal-modalbody').html("Error adding to cart.");
				}

				if(obj != null && typeof obj === 'object') {
					obj.removeClass('disabled');
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				add_cart_queue = [];
				obj.removeClass('disabled');
			});
	} else {
		add_cart_queue = [];
		CommonUtil.redirect(url);
	}
}

function show_add_cart_modal_message() {
	$('#add-cart-modal').remove();

	var buttons = '<div class="actions-left"><a id="btn-continue-shopping" class="btn btn-primary close-modal continue-shopping">Continue Shopping</a></div> <div class="actions-right"><a class="btn btn-success goto-view-cart" id="btn-goto-view-cart" href="' + globals.baseUrl + '/Docs/cart">View Cart</a></div>';

	BootstrapComponent.modal({
		added_class : 'small',
		buttons : buttons,
		content : '<div class="loading"></div>',
		id : 'add-cart-modal',
		title : CommonUtil.get_locale_text('add_to_cart')
	});

	BootstrapComponent.open_modal($('#add-cart-modal'));
}

function get_cart_count() {
	var jqxhr = $.ajax({
		type : 'GET',
		url : globals.baseUrl + '/storesiteDecor/getCartCount',
		data : null,
		dataType : 'json'
	})
		.done(function(responseData) {
			if(typeof responseData.count === 'number') {
				$('.cart-item-count').text(responseData.count);
				$('.cart-item-count').removeClass('hide');
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {});
}

/* AJAX CONTENT ON PAGELOAD */
function setup_ajax_content(element, url) {
	if($(element).length > 0 && typeof url === 'string' && url.length > 0) {
		load_page_ajax_content(element, url);
	}
}

function load_page_ajax_content(element, url, callback, show_loader) {
	if (typeof show_loader == 'undefined'){
        show_loader = true;
	}
	if (show_loader) {
        $(element + ' div:first').css('visibility', 'hidden');
        CommonUtil.page_wait_loader(element);
    }
	var jqxhr = $.ajax({
		type : 'GET',
		url : url,
		data : null,
		dataType : 'html'
	})
	.done(function(responseData) {
        if (show_loader) {
            $(element + ' div:first').css('visibility', 'visible');
            CommonUtil.page_wait_loader(element, 'remove');
        }
		var body = CommonUtil.get_html_body(responseData);
		$(element).html(body);
		
		if(typeof ajax_onload_callback === 'string' && typeof window[ajax_onload_callback] === 'function') {
			window[ajax_onload_callback].apply(this, []);
		}

		if(typeof callback === 'string' && callback.length > 0) {
			if(typeof window[callback] === 'function') {
				var cb_function = window[callback];
				cb_function.apply(this, []);
			}
		}
		
		if( CommonUtil.is_mobile_site() && typeof mobile_common_respond === 'function' ) {
			mobile_common_respond();
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
        if (show_loader) {
            CommonUtil.page_wait_loader(element, 'remove');
        }
		if(jqXHR.readyState == 4) {
			alert('There was an error attempting to retrieve the content.');
		}
	});
}

/* BACK TO RESULTS */
function back_to_product_search_results() {
	var referrer = document.referrer;

	if(referrer != null && referrer.indexOf('/Favorites/view') > 0) {
		go_back_to_favorites_results();
	} else if(referrer != null && referrer.indexOf('/Selectors') > 0) {
		go_back_to_selector_results();
	} else {
		go_back_to_product_search_results();
	}
}

function go_back_to_favorites_results() {
	var favorites_viewurl = CommonUtil.get_cookie(storage_favoritesviewurl);
	CommonUtil.redirect(favorites_viewurl);
}

function go_back_to_selector_results() {
	var selectors_searchurl = CommonUtil.get_localstorage(storage_selectorssearchurl);
	var selectors_searchresults = CommonUtil.get_localstorage(storage_selectorssearchresults);
	$('#selector-form').remove();
	$('body').append('<form action="' + selectors_searchurl + '" id="selector-form" method="POST"><input id="selectordata" name="selectordata" type="hidden" value="" /></form>');
	$('#selectordata').val(selectors_searchresults);
	$('#selector-form').submit();
}

function go_back_to_product_search_results() {
	var referrer = document.referrer;

	if(referrer.indexOf('/Products/category') > 0) {
		CommonUtil.redirect(referrer);
	} else {
		$('#product-search-form').remove();
		var search_url = typeof $.cookie(storage_productsearchurl) === 'string' && $.cookie(storage_productsearchurl).length > 0
			?  $.cookie(storage_productsearchurl)
			: '';
		var search_params = typeof $.cookie(storage_productsearchurlvars) === 'string' && $.cookie(storage_productsearchurlvars).length > 0
			?  $.cookie(storage_productsearchurlvars)
			: '';

		if(search_url != '') {
			var sp = search_params.split('&');
			var html = '';

			for(var i in sp) {
				var p = sp[i].split('=');
				html += '<input type="hidden" name="' + decodeURIComponent(p[0]) + '" value="' + decodeURIComponent(p[1]) + '" />';
			}

			$('body').append('<form id="product-search-form" method="POST" action="">' + html + '</form>');
			$('#product-search-form').attr('action', search_url);
			$('#product-search-form').submit();
		}
	}
}

/* DOCS */
function set_storage_doclistpage() {
	if(typeof doclist_edit_url === 'string' && doclist_edit_url.indexOf('Proposals') == -1) {
		doclist_edit_url = doclist_edit_url.replace('http://', 'https://');
		CommonUtil.set_state(storage_pagehistorylocation, window.location.href);
		CommonUtil.set_state(storage_doclistpage, doclist_edit_url);
	}
	if(typeof doclist_edit_url === 'string' && doclist_edit_url.indexOf('sortOrder') == -1) {
		doclist_edit_url = doclist_edit_url.replace('http://', 'https://');
		CommonUtil.set_state(storage_allcontactspage, doclist_edit_url);
		}
}

/* DOCUMENT */
function handle_document_clicks(e) {	
	if($(e.target).closest('.crm-controlpane-hovermenu').length < 1) {
		if(!$(e.target).closest('.dropdown').hasClass('.dropdown-inner')) {
			if($(e.target).closest('.dropdown').length > 0) {
				var d = $(e.target).closest('.dropdown');
				$('.dropdown').each(function() {
					if(!$(this).is(d)) {
						$(this).removeClass('open');
						$(this).find('>:first-child').removeClass('open');
						$(this).find('.dropdown-menu').removeClass('hide temp-hide');
					}
				});
			} else {
				$('.dropdown-menu').each(function() {
					$(this).closest('.dropdown').removeClass('open');
					$(this).closest('.dropdown').find('>:first-child').removeClass('open');
					$(this).closest('.dropdown').find('.dropdown-menu').removeClass('hide temp-hide');
				});
			}

			$('.crm-controlpane-hovermenu').remove();
		}

		if($(e.target).closest('.bc_dropdown').length < 1) {
			$('.bc_dropdown').each(function() {
				$(this).removeClass('open');
			});
		}
		
		if($(e.target).closest('.autocomplete-menu').length < 1) {
			$('.autocomplete-menu').remove();
		}
	}

	var close_modalmenus = true;
	if($(e.target).closest('.modalmenu-menu').length > 0) {
		if($(e.target).hasClass('keep-modal-open')) {
			close_modalmenus = false;
		}
	}
	
	if(close_modalmenus) {
		$('.modalmenu-menu').each(function() {
			$(this).hide();
			$(this).closest('.form-group').removeClass('selecttomenu-menu-open');
		});
	}
}

/* FORMS */
function set_select_access_read() {
	$('form select.read').each(function() {
		var selected_text = $(this).val() == '' ? 'N/A' : $(this).find('option:selected').text();
		$(this).before('<div class="readonly-text">' + selected_text + '</div>');
		$(this).remove();
	});
}

function ajaxsubmit_checkboxes(form, boolean_type) {
	var checked_value = boolean_type == 'number' ? 1 : 'true';

	form.find('input[type=checkbox]').each(function() {
		if ($(this).prop('checked') == true && $(this).val() == '') {
			$(this).val(checked_value);
		}
	});
}

function set_fluid_widths() {
	$('.fluid-calcs').each(function() {
		var available_width = 0;
		var container_width = $(this).width();
		var fixed_widths = 0;
		var num_elements = $(this).children().length;
		var num_fixed = $(this).find('[data-minwidth]').length;
		var remaining = num_elements - num_fixed;
		var remaining_width = 0;

		$(this).find('[data-minwidth]').each(function() {
			fixed_widths += parseInt($(this).attr('data-minwidth'));
			$(this).css('width', $(this).attr('data-minwidth'));
			$(this).css('min-width', 0);
		});

		available_width = container_width - fixed_widths;
		remaining_width = available_width;

		$(this).children().each(function() {
			if(!$(this).is('[data-minwidth]')) {
				if(remaining <= 1) {
					$(this).css('width', remaining_width-1 + 'px');
					$(this).css('min-width', 0);
				} else {
					var css = $(this).attr('class');
					var n = 0;
					var parts = css.split(' ');
				
					for(var i in parts) {
						if(parts[i].indexOf('col-sm-') === 0) {
							var n = parseInt(parts[i].replace('col-sm-', ''));
						}
					}
				
					if(n > 0) {
						var w = Math.floor((n*10)/100 * available_width);
						$(this).css('width', w + 'px');
						$(this).css('min-width', 0);
					}
					
					remaining_width = remaining_width - w;
					remaining--;
				}
			}
		});
	});
}

function update_input_group_addons() {
	$('.fluid-controls .controls.input-group').each(function() {
		var group_w = $(this).outerWidth(true);
		var fc_widths = 0;

		if(group_w > 0) {
			$(this).find('.form-control').each(function() {
				if($(this).is('input') || $(this).is('select')) {
					$(this).addClass('autowidth');
					
					if($(this).is('input')) {
						var fc_w = $(this).val().length * 10;
						$(this).css('width', fc_w);
					} else {
						var fc_w = $(this).outerWidth(true);
						$(this).css('min-width', fc_w);
					}
					
					fc_widths += fc_w;
				}
			});

			$(this).children().each(function() {
				if(!$(this).hasClass('form-control')) {
					$(this).addClass('full-width');
					$(this).addClass('normal-wrap');
				}
			});
			
			$(this).children().each(function() {
				if(!$(this).hasClass('form-control')) {
					var mw = $(this).outerWidth(true) > 22 ? $(this).outerWidth(true) : 22;
					$(this)
						.css('max-width', mw)
						.addClass('ellipsed-overflow');
					$(this).attr('title', $(this).text());
				}
			});
			
			$(this).find('.form-control').each(function() {
				if($(this).is('input') || $(this).is('select')) {
					$(this).removeClass('autowidth');
				}
			});
			
			$(this).children().each(function() {
				if(!$(this).hasClass('form-control')) {
					$(this).removeClass('normal-wrap');
				}
			});
		}
	});
}

function handle_checkall_toggle(obj) {
	obj.closest('table').find('.check-multiple').each(function() {
		$(this).prop('checked', obj.prop('checked'));
	});
}

/* IFRAME */
function resize_iframe(iframe_id, iframe_height) {
	if(iframe_height.length > 0) {
		$('#' + iframe_id).css('height', iframe_height);
	} else {
		$('#' + iframe_id).height($('#' + iframe_id).contents().height());
	}
}

/* LIGHTBOX AND MODAL */
function qmodal(opts) {
	if(typeof opts === 'object') {
		BootstrapComponent.quick_modal(opts);
	}
}

function lightbox_close_event_handler()
{
    $('body').removeClass('modal-open');
    if(typeof force_parent_refresh == 'boolean' && force_parent_refresh && typeof submit_page == 'function')
        submit_page('');
}

function on_lightbox_open_handler() {
	add_modal_body_class();
}

function on_lightbox_close_handler() {
	remove_modal_body_class();
}

function add_modal_body_class() {
	$('body').addClass('modal-open');
}

function remove_modal_body_class() {
	$('body').removeClass('modal-open');
}

function popout(url) {
	if ((typeof iframe === 'boolean' && iframe) || (typeof iframe === 'string' && iframe == 'true')) {
		CommonUtil.check_logged_in('do_lbclose', [url]);
	} else {
		CommonUtil.redirect(url);
	}
}

function do_lbclose(url) {
	CommonUtil.redirect(globals.basePerlUrl + "/lbclose.epl?destination=" + encodeURIComponent(url));
}

/* MENUS */
function handle_nopropagate_menu(obj) {
	obj.parent().toggleClass("open");
}

function handle_dropdown_toggle(obj, e) {
	var carat_style = '';
	var carat_width = 14;
	var menu = obj.parent().find('.carat-menu');
	var dd = obj.closest('.dropdown');
	if(dd.length > 0 && !dd.hasClass('open') && e.type == 'click') {
		obj.closest('.dropdown').find('.dropdown-menu').removeClass('hide temp-hide');	
	}

	if(menu.length > 0) {
		if(menu.find('.carat-wrapper').length < 1) {
			if(menu.hasClass('pull-left')) {
				var w = Number(menu.closest('.dropdown').outerWidth());
				carat_style = 'left: ' + Math.ceil(w/2 - carat_width/2) + 'px; margin: 0;';
			}
			if(menu.hasClass('pull-right')) {
				var w = menu.closest('.dropdown').outerWidth();
				carat_style = 'right: ' + Math.ceil(w/2 - carat_width/2) + 'px; margin: 0;';
			}
			menu.prepend('<div class="carat-wrapper"><div class="carat" style="' + carat_style + '"></div></div>');
		}

		if(!menu.hasClass('pull-left')) {
			var p = Number(menu.outerWidth())/2 - Number(obj.outerWidth(true))/2;
			menu.css('left', -p);
		}
	}
}

/* POPOVERS */
function set_data_popovers() {
	$('.data-popover').each(function() {
		BootstrapComponent.popover($(this));
	});
}

/* PRODUCT FILTER TREE */
function set_product_filter_tree() {
	$('ul.att-list').each(function() {
		$(this).find('li').each(function() {
			if($(this).children('ul').length > 0) {
				$(this).prepend('<a class="att-icon att-expand" href="#"></a>');
			}
		});
		
		var counter = 1;
		$(this).children('li').each(function() {
			if(counter > 5) {
				$(this).hide();
			}
			counter++;
		});
	});
	
	$('ul.att-list li:last-child').addClass('last');
}

/* QUICK IMAGE VIEWER */
function open_modal_image(obj) {
	$('#image-viewer-modal').remove();
	var title = obj.is('[title]') && obj.attr('title') != '' ? obj.attr('title') : 'View Image';

	BootstrapComponent.modal({
	    buttons : '',
	    content : '<img src="' + obj.attr('href') + '" />',
	    id : 'image-viewer-modal',
	    show_footer : false,
	    show_header : true,
	    title : title
	});
	BootstrapComponent.open_modal($('#image-viewer-modal'));
}

/* SESSION */
function init_session_expire() {
	if(session_expire == null) {
		session_expire = new SessionExpire();
		session_expire.init();
	}
}

/* TOOLTIPS */
function create_tooltips() {
	$('.show-tooltip').each(function() {
		var opts = { className: '', error: false, hide:true, trigger:'hover' };
		BootstrapComponent.tooltip($(this), opts);
	});
}

/* WINDOW SCROLL */
function scroll_to_obj() {
	var scroll_to = CommonUtil.get_param('scroll_to');
	var obj;

	if(scroll_to != '' && $('#' + scroll_to).length > 0) {
		obj = $('#' + scroll_to);
		
		if ($('#crm-main-pane').length > 0){
			var ot = obj.offset().top - $('#crm-main-pane').position().top;
			$('#crm-main-pane-body').animate({scrollTop: ot}, 1000, function() { 
				if(obj.is('input')) {
					obj.focus();
				}
			});
		} else {
			var ot = obj.offset().top - $('#content-main-container').position().top;
			$('#body-main').animate({scrollTop: ot}, 1000, function() {
				if(obj.is('input')) {
					obj.focus();
				}
			});
		}	
	}
}

function devnull() {
}

function update_currency_value(obj){
	var val = obj.val();
	if (val !== ''){
		val = CommonUtil.format_currency(val,false);
		obj.val(val);
	}
}
