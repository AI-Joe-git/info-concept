/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 January 2013
 ******************************************************************************************************************************************/
function CommonUtil() {
};

/* __MISC__ */
CommonUtil.get_hostname = function() {
	if (globals.isCustomDomain){
		return globals.cookieHost;
	} else {	
		var hostname = location.hostname;
		var hostname_parts = hostname.split('.');
		var host = '.' + hostname_parts[hostname_parts.length-2] + '.' + hostname_parts[hostname_parts.length-1];
		return host; 
	}
};

CommonUtil.unique_id = function() {
	var len = 6;
	var str = '';
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	for (var i = 0; i < len; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	str += new Date().getTime() + Math.floor(Math.random() * 100000 + 1);
	return str;
};

CommonUtil.random_string = function(str_len) {
	var len = typeof str_len === 'number' ? str_len : 15;
	var str = '';
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	for (var i = 0; i < len; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return str;
};

CommonUtil.is_ie = function() {
	var browser = navigator.userAgent;
	var is_ie = false;

	if (browser.indexOf('Trident') > 0) {
		is_ie = true;
	}

	return is_ie;
};

CommonUtil.is_ie_11 = function() {
	var is_ie = false;

	if (!!window.MSInputMethodContext && !!document.documentMode) {
		is_ie = true;
	}

	return is_ie;
};

CommonUtil.is_iframe = function() {
	if(top !== self) {
		return true;
	}
	
	return false;
};

CommonUtil.is_mobile = function() {
	if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)) {
		return true;
	} else {
		return false;
	}
};

CommonUtil.is_mobile_site = function() {
	if($('body').hasClass('responsive-true')) {
		return true;
	}
	
	return false;
};

CommonUtil.show_loader = function(options, modal_options) {
	var loader_defaults = {
	    added_class : 'wait-loader',
	    loading_text : 'Please wait...',
	    message_text : '',
	    modal_id : 'wait-action-modal',
	    transition : ''
	};
	var loader_opts = {};
	loader_opts = $.extend(loader_opts, loader_defaults, options);
	$('#' + loader_opts.modal_id).remove();

	var modal_content = '\
		<p class="modal-loading-message">' + loader_opts.loading_text
	        + '</p> \
		<div class="loading"></div> \
		<div id="loadingmodal-message" class="modal-loading-message message-small">'
	        + loader_opts.message_text + '</div>';
	
	BootstrapComponent.modal({
		added_class : loader_opts.added_class,
		content : modal_content,
		id : loader_opts.modal_id,
		show_close_btn : false,
		show_footer : false,
		show_header : false,
		transition : loader_opts.transition
	});

	var modal_defaults = {
		backdrop : 'static'
	};
	var modal_opts = {};
	modal_opts = $.extend(modal_opts, modal_defaults, modal_options);

	BootstrapComponent.open_modal($('#' + loader_opts.modal_id), modal_opts);
};

CommonUtil.hide_loader = function() {
	BootstrapComponent.close_modal($('.wait-loader'));
};

CommonUtil.show_modal_loader = function() {
	BootstrapComponent.show_modal_wait_loader();
};

CommonUtil.hide_modal_loader = function() {
	BootstrapComponent.hide_modal_wait_loader();
};

CommonUtil.page_wait_loader = function(elem, action, contain, message) {
	var mb_css = typeof elem === 'string' || typeof elem === 'object' ? 'modal-absolute' : '';
	var targ = $('body');
	
	if(typeof elem === 'object') {
		targ = elem;
	} else if(typeof elem === 'string') {
		targ = $(elem);
	}
	
	if(targ.hasClass('modal')) {
		if(targ.find('.modal-dialog').length > 0) {
			targ = targ.find('.modal-dialog');
		}
	}
	
	if(targ.length > 0) {
		if(typeof action === 'string' && action == 'remove') {
			targ.removeClass('modal-backdrop-white modal-center');
			targ.find('.modal-backdrop').remove();
		} else {
			var loading_class = typeof contain === 'boolean' && contain == true ? 'loading-contain loading-tiny' : 'loading-tiny';
			var loading_message = typeof message === 'string' && message != '' ? '<div class="loading-tiny-message">' + message + '</div>' : '';

			if(!targ.hasClass('modal-backdrop-white')) {			
				targ.addClass('modal-backdrop-white modal-center').append('<div class="modal-backdrop ' + mb_css + '"><div class="' + loading_class + '"></div>' + loading_message + '</div>');
		
				if(typeof contain === 'boolean' && contain == true) {
					targ.css('position', 'relative');
				}
			}
		}
	}
};

CommonUtil.get_min_ext = function() {
	if(typeof globals === 'object' && typeof globals.minExt === 'string') {
		return globals.minExt;
	} else {
		return '';
	}
};

CommonUtil.set_full_modal_body = function() {
	$('.modal:visible .modal-body').addClass('full');
};

CommonUtil.disable_double_click = function(obj) {
	obj.addClass('disabled');

	var t = setTimeout(function() {
		obj.removeClass('disabled');
	}, 2000);
};


/* ARRAY */
CommonUtil.array_diff = function(a1, a2) {
	var diff = $(a1).not(a2).get();
	return diff;
};

CommonUtil.array_trim = function(arr) {
	var u = [];

	for (var i = 0; i < arr.length; i++) {
		if(arr[i] != '' && arr[i] != 'undefined' && arr[i] != undefined) {
			u.push(arr[i]);
		}
	}

	return u;
};

CommonUtil.array_unique = function(arr) {
	var u = [];
	for (var i = 0; i < arr.length; i++) {
		if ($.inArray(arr[i], u) < 0) {
			u.push(arr[i]);
		}
	}

	return u;
};

CommonUtil.array_duplicates = function(arr) {
	var u = [];
	var d = [];

	for (var i = 0; i < arr.length; i++) {
		if ($.inArray(arr[i], u) < 0) {
			u.push(arr[i]);
		} else {
			d.push(arr[i]);
		}
	}

	return d;
};

CommonUtil.in_array = function(arr, str) {
	var has = 0;
	for ( var i in arr) {
		if (arr[i] == str) {
			has++;
			break;
		}
	}

	if (has > 0) {
		return true;
	}
	return false;
};

CommonUtil.size = function(obj) {
    var size = 0;
    
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
        	size++;
        }
    }
    
    return size;
};


/* AUTH */
CommonUtil.check_logged_in = function(callback, args, context) {
	var function_args = typeof args == 'object' ? args : [];
	var cb_function = typeof context == 'object' ? context[callback] : window[callback];
	var cb_context = typeof context == 'object' ? context : this;
	var mcc = $('input[name="mcc"]').val();
	var mcc_param = typeof mcc === 'string' && mcc.length > 0 ? 'mcc=' + mcc : '';

	if(globals.userId != '-1') {
		$.ajax({
			type : "GET",
			url : globals.check_cookie_url,
			data : mcc_param,
			dataType : "jsonp",
			success : function(responseData) {
				if (typeof cb_function == 'function') {
					cb_function.apply(cb_context, function_args);
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				CommonUtil.logged_out_redirect();
			}
		});
	} else {
		if (typeof cb_function == 'function') {
			cb_function.apply(cb_context, function_args);
		}
	}
};

CommonUtil.logged_out_redirect = function() {
	alert("Your session has expired");
	var url = typeof referrer_url == 'string' && referrer_url.length > 0 ? referrer_url : document.referrer.length > 0 ? document.referrer
	        : window.location;

	if(window.opener) {
		CommonUtil.send_post_message_popup('refreshPage');
		window.self.close();
	} else if (top.location) {
		top.location.replace(url);
	} else if (parent.location) {
		parent.location.replace(url);
	} else {
		window.location.reload();
	}
};

CommonUtil.is_login_page = function() {
	if($('body').hasClass('page-login')) {
		return true;
	}
	
	return false;
};

CommonUtil.reset_cookies = function() {
	CommonUtil.set_state(storage_organizerminiitemid, '');
	CommonUtil.set_state(storage_organizerminifieldtype, '');
	CommonUtil.set_state(storage_organizerminiitemtype, '');
	CommonUtil.set_state(storage_organizershowcomplete, '');
	CommonUtil.set_state(storage_organizerminiposition, '');
	CommonUtil.set_state(storage_organizerministate, '');
	CommonUtil.set_localstorage(storage_organizerminidata, '');
};


/* BROWSER */
CommonUtil.fix_redraw = function() {
	$(window).trigger('resize');
	$('body').hide().show();
}

CommonUtil.fix_redraw_iframe = function(iframe_id) {
	try {
		$(window).trigger('resize');
		$('#' + iframe_id).trigger('resize');
		CommonUtil.send_post_message_iframe(iframe_id, 'fixRedraw');
		$('#' + iframe_id).css('height', 1);
		$('#' + iframe_id).css('width', 1);

		var t = setTimeout(function() {
			$('#' + iframe_id).css('height', '');
			$('#' + iframe_id).css('width', '');
		}, 1000);
	} catch(e) {

	}
}


/* COOKIES AND LOCAL STORAGE */
CommonUtil.set_cookie = function(key, val, cookie_path, host) {
	if(typeof $.cookie === 'function') {
		$.cookie(key, val, { path : cookie_path, domain : host, samesite: 'None', secure: true });
	}
};

CommonUtil.get_cookie = function(key, default_value) {
	var cookie = '';
	
	if(typeof $.cookie === 'function') {
		var dv = typeof default_value === 'string' ? default_value : '';
		cookie = typeof $.cookie(key) === 'string' ? $.cookie(key) : dv;
	}
	
	return cookie;
};

CommonUtil.set_state = function(key, val) {
	CommonUtil.set_cookie(key, val, globals.cookiePath, globals.cookieHost);
};

CommonUtil.check_localstorage = function() {
	try {
		if (localStorage.getItem) {
			return true;
		}
	} catch(e) {
		return false;
	}
}

CommonUtil.set_localstorage = function(name, val) {
	try {
		localStorage.setItem(name, val);
	} catch(e) {}
};

CommonUtil.get_localstorage = function(name) {
	var val = '';
	try {
		val = localStorage.getItem(name);
	} catch(e) {}
	return val;
};

CommonUtil.delete_localstorage = function(name) {
	try {
		localStorage.removeItem(name);
	} catch(e) {}
};


/* DATE */
CommonUtil.get_date_obj = function(str) {
	var date_parts = str.split('/');
	var year = date_parts[2];
	var month =  date_parts[0] - 1;
	var day =  date_parts[1];
	return new Date(year, month, day);
};


/* DOCS */
CommonUtil.check_unique_quote_number = function() {
	var valid = false;
	var rma_data = {
	    docNumber : $("#quoteNumber").val(),
	    documentType : documentType
	};
	BootstrapComponent.tooltip_destroy($("#quoteNumber"));
	
	$.ajax({
	    type : 'POST',
	    url : globals.baseUrl + '/Docs/isDocNumberUnique',
	    dataType : 'json',
	    data : rma_data,
	    success : function(response) {
		    $('#quoteNumberCheckmark').remove();

		    if (response.success != 1) {
		    	BootstrapComponent.tooltip($("#quoteNumber"), { title:response.message });
		    } else {
			    if (response.success == 1 && response.available) {
			    	BootstrapComponent.tooltip_destroy($("#quoteNumber"));
			    	$("#quoteNumber").removeClass (function (index, className) {
						return (className.match (/(^|\s)span\S+/g) || []).join(' ');
					});
			    	$("#quoteNumber").removeClass('error').addClass('col-sm-10').after('<span id="quoteNumberCheckmark" class="icon-checkmark"></span>');
				    valid = true;
			    } else if (!response.available) {
			    	BootstrapComponent.tooltip($("#quoteNumber"), { title: CommonUtil.get_locale_text('number_in_use') });
			    }
		    }

		    $.event.trigger({
		        type : 'doneQuoteNumberCheck',
		        success : response.success,
		        valid : valid
		    });
	    },
	    error : function(jqXHR, textStatus, errorThrown) {

	    }
	});
};


/* FORMS */
CommonUtil.form_serialize = function(form_id ,options) {
	var opts = {};
	var defaults = {
		checkbox_multiple_delim : 'comma',
		select_multiple_delim : 'comma',
		replace_commas : 0,
		comma_replacement : ' '
	};
	opts = $.extend(opts, defaults, options);
	var cb_delim = opts.checkbox_multiple_delim == 'tab' ? "\t" : ",";
	var sm_delim = opts.select_multiple_delim == 'tab' ? "\t" : ",";
	
	$(form_id).find('input[type="text"], input[type="password"], input[type="hidden"], textarea').each(function() {
		var val = CommonUtil.xss_clean( $(this).val() );
		$(this).val(val);
	});
	
	var data = '';
	var inputData = $(form_id).find(":input:not(:button)");
	var dsf = inputData.filter('[data-serialize="false"]');
	
	dsf.each(function() {
		data += $(this).attr('name') + '=' + CommonUtil.xss_clean( $(this).val() ) + '&';
	});
	
	var cb_counts = {};
	var checkboxes_single = [];
	var checkboxes_multiple = [];
	var checkboxes = inputData.filter(":checkbox");
	
	checkboxes.each(function() {
		var cb_name = $(this).attr('name');
		cb_counts[cb_name] = cb_counts[cb_name] >= 1 ? cb_counts[cb_name] + 1 : 1;
	});

	for(var i in cb_counts) {
		if(cb_counts[i] > 1) {
			checkboxes_multiple.push(i);
		} else {
			checkboxes_single.push(i);
		}
	}

	for ( var i in checkboxes_single) {
		var cs = checkboxes.filter('[name="' + checkboxes_single[i] + '"]');
		var val = cs.is('[data-empty-unchecked]') && cs.attr('data-empty-unchecked') == 1 ? '' : 'false';
		
		if (cs.prop('checked') == true) {
			val = cs.val() != "" ? cs.val() : 'true';
		}
		
		data += checkboxes_single[i] + '=' + val + '&';
	}

	checkboxes_multiple = CommonUtil.array_unique(checkboxes_multiple);

	for( var i in checkboxes_multiple) {
		var cb_vals = [];
		var cm = checkboxes.filter('[name="' + checkboxes_multiple[i] + '"]:checked');

		cm.each(function() {
			cb_vals.push($(this).val());
		});

		data += checkboxes_multiple[i] + '=' + cb_vals.join(cb_delim) + '&';
	}

	var select_multiples = inputData.filter("select[multiple='multiple'], select[multiple='']");
	select_multiples.each(function() {
		if($(this).hasClass('submit-all')) {
			$(this).find('option').each(function() {
				$(this).prop('selected', true);
			});

		}
		
		var v = $(this).val();
		var j = '';

		if(typeof v === 'object' && v !== null) {
			v = $.grep(v,function(n){ return n != '' || n });
			if (opts.replace_commas === 1){
				for (var i=0; i<v.length; i++){
					v[i] = v[i].replace(',',opts.comma_replacement);
				}
			}
			j = v.join(sm_delim);
		}
		
		data += $(this).attr('name') + '=' + j + '&';
	});

	data += inputData.filter(":not(:checkbox)").not('[data-serialize="false"]').not('select[multiple="multiple"]').not('select[multiple=""]').serialize();
	
	return data;
};

CommonUtil.get_checked_items = function(min, max, selector) {
	var cbs = [];
	
	if($('.retain-selections').length > 0) {
		var selected_items = typeof $.cookie(storage_productsearchresultselections) === 'string' && $.cookie(storage_productsearchresultselections).length > 0 ?  $.cookie(storage_productsearchresultselections) : '';
		var items = selected_items.split(retained_selections_delim);

		for(var i in items) {
			var info = items[i].split(retained_selections_data_delim);
			cbs.push(info[0]);
		}
	} else {
		$(selector).each(function() {
			if($(this).prop('checked') === true) {
				cbs.push($(this).val());
			}
		});
	}
	
	cbs = CommonUtil.array_trim(cbs);

	if(typeof min === 'number') {
		if(cbs.length < min && min > 0) {
			alert('Please select at least ' + min + ' item(s)');
			return [];
		}
	}
	
	if(typeof max === 'number') {
		if(cbs.length > max && max > 0) {
			alert('Please select no more than ' + max + ' item(s)');
			return [];
		}
	}
	
	return cbs;
};

CommonUtil.get_selected_items = function(required_count, action) {
	var items = [];
	var message_exception = true;
	var unbundle_action = false;
	var copy_line_exception = false;
	var add_catalog_exception = false;
	var add_catalog_exception_manual_item = false;
	
	if(action == 'compare') {
		var len = $('.quoted-items').find('.checkable:checked').length;
		
		if(len > 10) {
			alert('Please select no more than 10 item(s)');
			return '';
		}
	}
	
	$('.quoted-items').find('.checkable:checked').each(function() {
		if(action == 'compare') {
			var productId = $(this).closest('.main-row').data("productid");
			if(productId.indexOf('M') == 0) {
                		var item = $(this).closest('.main-row').data("id");
				item = $.trim(item);
                		items.push(item);
			}
		} else if(action == 'add to catalog') {
			var productId = $(this).closest('.main-row').data("productid");
			if(productId.indexOf('M') == 0 || productId.indexOf('V') == 0) {
				productId = $.trim(productId);
				items.push(productId);
			} else {
				// check data-id in case this is a manual line item
				var dataId = $(this).closest('.main-row').data('id');
				dataId = $.trim(dataId);
				if(dataId.length > 0) {
					// manual product; cannot add to catalog
					add_catalog_exception_manual_item = true;
				}
			}
			if(items.length > 1)
				add_catalog_exception = true;
		} else if(action == 'view price history') {
			var itemType = $(this).closest('.main-row').data("itemtype");
			if(itemType == 'product' || itemType == "service"  || itemType == "labor") {
                var item = $(this).closest('.main-row').data("id");
                item = $.trim(item);
                items.push(item);
			}
		} else if(action == 'unbundle') {
			unbundle_action = true;
			var itemType = $(this).closest('.main-row').data("itemtype");
			if(itemType == 'bundle' || itemType == 'bsubtotal') {
					var item = $(this).closest('.main-row').data("id");
					item = $.trim(item);
					items.push(item);
			} 
		} else if(action == 'copy line') {
			var item = $(this).closest('.main-row').data("id");
			item = $.trim(item);
			items.push(item);
			
			var itemType = $(this).closest('.main-row').data("itemtype");
			if(itemType == 'subtotal' || itemType == 'sheader' || itemType == 'hline' || itemType == 'bline' || itemType == 'bsubtotal') {
				copy_line_exception = true;
			}
		}
		else if(action == 'view cost history') {
			var item = $(this).closest('.main-row').data("id");
			item = $.trim(item);
			items.push(item);
		} else {
			message_exception = false;
                	var item = $(this).closest('.main-row').data("id");
                	item = $.trim(item);
                	items.push(item);
		}
    });
	
	var itemList = '';
	if((items.length < required_count) || copy_line_exception || add_catalog_exception) {
		var itemType = 'item(s)';
		if(message_exception)
			itemType = 'product(s)';
		if(unbundle_action)
                        itemType = 'bundle header(s) and/or bundle subtotal(s)';
		if(copy_line_exception) 
			alert('The following line types cannot be copied: \n' + 
				'* Bundle Subtotals \n' +
				'* Subtotals \n' + 
				'* Subtotal Headers \n' + 
				'* Blank Lines \n' + 
				'* Horizontal Lines \n' + 
				'Please deselect these items.');
		else if(add_catalog_exception) 
			alert('Please select only one line item to perform this action.');
		else if(add_catalog_exception_manual_item)
			alert('The product you selected is not in the database. Please add the product to your custom items through Items Admin.');
		else
			alert('Please select at least ' + required_count + ' ' + itemType + ' to ' + action + '.');
	} else {
		itemList = items.join(',');
	} 
	
	return itemList 
	
};

CommonUtil.validEmail = function(value) {
	var p = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
	return p.test(value);
}

CommonUtil.validEmailMultiple = function(values) {
	var errors = false;
	
	if(typeof values === 'string' && values.length > 0) {
		var parts = values.split(/[,;]+/);
		for(var i in parts) {
			var email = $.trim(parts[i]);
			var valid = CommonUtil.validEmail(email);

			if(valid === false) {
				errors = true;
			}
		}
	} else {
		errors = true;
	}

	return errors === false ? true : false;
}

CommonUtil.is_form_changed = function(original_data, new_data) {
	var changed = false;

	var odata = {};
	var oparts = original_data.split('&');
	for(var i in oparts) {
		var parts = oparts[i].split('=');
		odata[parts[0]] = parts[1];
	}

	var fdata = {};
	var fparts = new_data.split('&');
	for(var i in fparts) {
		var parts = fparts[i].split('=');
		fdata[parts[0]] = parts[1];
	}

	for(var i in fdata) {
		if(typeof odata[i] == 'string') {
			if($.trim(odata[i]) !== $.trim(fdata[i])) {
				changed = true;
			}
		} else {
			changed = true;
		}
	}

	return changed;
};

CommonUtil.get_display_value = function(elem, get_html) {
	var val = '';
	var obj = typeof elem === 'object' ? elem : $(elem);
	
	if(obj.is('input') || obj.is('textarea') || obj.is('select')) {
		val = obj.val();
	} else {
		val = typeof get_html === 'boolean' && get_html == true ? obj.html() : obj.text();
		val = $.trim(val);
	}
	
	return val;
};

CommonUtil.set_display_value = function(elem, value) {
	var obj = typeof elem === 'object' ? elem : $(elem);
	
	if(obj.is('input') || obj.is('textarea') || obj.is('select')) {
		obj.val(value);
	} else {
		obj.html(value);
	}
};


/* IMAGE */
CommonUtil.image_picker = function(table_id, url, options) {
	if(typeof $.jgrid !== 'object') {
		var jqgrid_loaded = false;
		var jqgrid_lang_loaded = false;
		
		CommonUtil.get_script('jqgrid', function() {
			jqgrid_loaded = true;
		});
		
		CommonUtil.get_script('jqgridlang', function() {
			jqgrid_lang_loaded = true;
		});
		
		var t = setInterval(function() {
			if(jqgrid_loaded && jqgrid_lang_loaded) {
				clearInterval(t);
				CommonUtil.image_picker_render(table_id, url, options);
			}
		}, 500);
	} else {
		CommonUtil.image_picker_render(table_id, url, options);
	}

	var dht = null;
	
	if(!CommonUtil.in_array(imagepicker_loaded, table_id)) {
		$(window).resize(function() {
			if($('#' + table_id).is(':visible')) {
				clearTimeout(dht);
				dht = setTimeout(function() {
					try {
						$.jgrid.gridUnload('#' + table_id);
					} catch(e) {
			
					}

					CommonUtil.image_picker_render(table_id, url, options);
				}, 1000);
			}
		});
	}
	
	imagepicker_loaded.push(table_id);
};

CommonUtil.image_picker_render = function(table_id, url, options) {
	$('#' + table_id).addClass('imagepicker-tbl');
	$('#' + table_id).after('<div id="' + table_id + 'gridpager"></div>');
	var container_width = Number($('#' + table_id).closest('.ui-jqgrid').parent().width()) - 5;
	var cell_0_width = 0.15;
	var cell_1_width = 0.60;
	var cell_2_width = 0.20;
	var cell_3_width = 0.05;

	var defaults = {
	    grid_height : 330,
	    show_categories : false
	};
	var opts = $.extend(opts, defaults, options);
	var config = {
	    url : url,
	    datatype : "json",
	    mtype : 'GET',
	    height : opts.grid_height,
	    colNames : [
	            'Image', 'Name', 'Type', ' '
	    ],
	    colModel : [
	            {
	                name : 'url',
	                index : 'url',
	                width : container_width * cell_0_width,
	                sorttype : "string",
	                formatter : function(cellvalue, options, rowObject) {
		                return '<img src="' + cellvalue + '" />';
	                },
	                unformat : function(cellvalue, options, cell) {
		                return $('img', cell).attr('src');
	                }
	            },
	            {
	                name : 'name',
	                index : 'name',
	                width : container_width * cell_1_width,
	                sorttype : "string"
	            },
	            {
	                name : 'type',
	                index : 'type',
	                width : container_width * cell_2_width,
	                sorttype : "string",
	                formatter : function(cellvalue, options, rowObject) {
		                return rowObject[3];
	                }
	            },
	            {
	                name : 'selected',
	                width : container_width * cell_3_width,
	                formatter : function(cellvalue, options, rowObject) {
		                var imageid = rowObject[2];
		                if(typeof rowObject._id_ == 'string' || typeof rowObject._id_ == 'number') {
		                	imageid = rowObject._id_;
		                }
		                return '<input type="radio" id="imagePicked' + imageid + '" name="imagePicked" value="' + imageid
		                        + '" style="height: 1px; visibility: hidden; width: 1px;" />';
	                }
	            },
	    ],
	    rowNum : 10,
	    autowidth : true,
	    multiselect : false,
	    beforeSelectRow : function(rowid, e) {
		    $('#' + table_id).jqGrid('resetSelection');
		    return true;
	    },
	    onSelectRow : function(id) {
		    $('#' + table_id).find('#imagePicked' + id).attr("checked", true);
		    var ret = $('#' + table_id).jqGrid('getRowData', id);
		    $('#' + table_id).closest('.controls').find('.imagelist-hidden').val(ret.url);
		    $('#' + table_id).find('.checkmark').remove();
		    $('#' + table_id).find('#imagePicked' + id).after('<span class="checkmark icon-checkmark-dark"></span>');
	    },
	    caption : "Available Images",
	    loadComplete : function() {
		    $('#cb_' + table_id).hide();
			
			var t = setTimeout(function() {
				CommonUtil.image_picker_resize($('#' + table_id));
				$.event.trigger({ type : 'imagePickerLoadComplete' });
			}, 1000);
	    },
	    pager : '#' + table_id + 'gridpager',
	    rowTotal : 10,
	    shrinkToFit : true
	};

	try {
		$('#' + table_id).jqGrid(config);
	} catch(e) {
		
	}

	if(opts.show_categories && $('#imagepicker_type_' + table_id).length < 1) {
		var html = '\
			<div class="imagepicker-filter text-right" style="margin-bottom: 10px;"> \
				Image type: <select id="imagepicker_type_' + table_id + '" name="imagepicker_type"> \
					<option value="">All</option> \
					<option value="general">General</option> \
					<option value="product">Product</option> \
					<option value="marketing">Marketing</option> \
					<option value="logo">Logo</option> \
					<option value="account image">Account image</option> \
				</select> \
			</div>';
		$('#gbox_' + table_id).before(html);
		
		$(document).on('change', '#imagepicker_type_' + table_id, function() {
			var url = globals.baseUrl + '/customimages/getImages?type=' + $(this).val();

			try {
				//$('#' + table_id).jqGrid('GridUnload');
				$.jgrid.gridUnload('#' + table_id);
			} catch(e) {
			
			}
			
			CommonUtil.image_picker_render(table_id, url, options);
		});
	}
};

CommonUtil.image_picker_resize = function(obj) {
	var tbl_id = obj.attr('id');
	var cell_0_width = 0.15;
	var cell_1_width = 0.60;
	var cell_2_width = 0.20;
	var cell_3_width = 0.05;
	
	if(obj.closest('.cke').length > 0) {
		var modal = obj.closest('.cke-uploaded-image-browser');
		var mh = modal.outerHeight();
		var modal_padding = parseInt(modal.css('padding-top'));
		modal_padding = modal_padding > 0 ? modal_padding : '10';
		var container_width = Number(obj.closest('.cke-uploaded-image-browser').width());
		obj.jqGrid('setGridWidth', container_width, true);
		
		var grid = $('#gview_' + tbl_id);
		var grid_box = $('#gbox_' + tbl_id);
		
		$('th#' + tbl_id + '_url').css('width', container_width * cell_0_width);
		$('th#' + tbl_id + '_name').css('width', container_width * cell_1_width);
		$('th#' + tbl_id + '_type').css('width', container_width * cell_2_width);
		$('th#' + tbl_id + '_selected').css('width', container_width * cell_3_width);

		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(0)').css('width', container_width * cell_0_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(1)').css('width', container_width * cell_1_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(2)').css('width', container_width * cell_2_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(3)').css('width', container_width * cell_3_width);
		
		var gh = mh;
		gh -= (2*modal_padding);
		
		if(modal.find('.imagepicker-filter:visible').length > 0) {
			gh -= modal.find('.imagepicker-filter').outerHeight(true);
		}
		
		if(grid.find('.ui-jqgrid-titlebar:visible').length > 0) {
			gh -= grid.find('.ui-jqgrid-titlebar').outerHeight(true);
		}
		
		if(grid.find('.ui-jqgrid-hdiv:visible').length > 0) {
			gh -= grid.find('.ui-jqgrid-hdiv').outerHeight(true);
		}
		
		if(modal.find('.ui-jqgrid-pager:visible').length > 0) {
			gh -= modal.find('.ui-jqgrid-pager').outerHeight(true);
		}
		
		if(modal.find('.cke-uploaded-image-browser-toolbar').length > 0) {
			gh -= modal.find('.cke-uploaded-image-browser-toolbar').outerHeight(true);
		}
	
		if(gh > 60) {
			grid.find('.ui-jqgrid-bdiv').css('height', gh);
		}
		
		var imgtable = grid.find('.imagepicker-tbl');
		imgtable.css('width', imgtable.width() - 2);
		var gridtable = grid.find('.ui-jqgrid-bdiv');
		gridtable.css('width', gridtable.width() - 2);
	} else {
		var modal = obj.closest('.modal-body');
		var mh = modal.height();
		var modal_padding = 5;
		var panel_padding = 10;
		var container_width = Number(obj.closest('.ui-jqgrid').parent().width()) - 2;
		var container_width_inner = container_width - 2;
		obj.jqGrid('setGridWidth', container_width, true);

		var grid = $('#gview_' + tbl_id);
		var grid_box = $('#gbox_' + tbl_id);

		$('#gview_' + tbl_id).css('width', container_width_inner);
		$('#gview_' + tbl_id + ' .ui-jqgrid-hdiv').css('width', container_width_inner);
		$('#gbox_' + tbl_id + ' .ui-jqgrid-pager').css('width', container_width_inner);
	
		$('th#' + tbl_id + '_url').css('width', container_width_inner * cell_0_width);
		$('th#' + tbl_id + '_name').css('width', container_width_inner * cell_1_width);
		$('th#' + tbl_id + '_type').css('width', container_width_inner * cell_2_width);
		$('th#' + tbl_id + '_selected').css('width', container_width_inner * cell_3_width);

		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(0)').css('width', container_width_inner * cell_0_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(1)').css('width', container_width_inner * cell_1_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(2)').css('width', container_width_inner * cell_2_width);
		$('#' + tbl_id).find('.jqgfirstrow').find('td:eq(3)').css('width', container_width_inner * cell_3_width);
		
		var gh = mh;
		gh -= modal_padding;
		
		if(obj.closest('.form-group').length > 0) {
			var fgroup = obj.closest('.form-group');
			var fgroup_margin = parseInt(fgroup.css('margin-bottom'));
			gh -= fgroup_margin;
		}
		
		if(modal.find('.imagepicker-filter:visible').length > 0) {
			gh -= modal.find('.imagepicker-filter').outerHeight(true);
		}
		
		if(grid.find('.ui-jqgrid-titlebar:visible').length > 0) {
			gh -= grid.find('.ui-jqgrid-titlebar').outerHeight(true);
		}
		
		if(grid.find('.ui-jqgrid-hdiv:visible').length > 0) {
			gh -= grid.find('.ui-jqgrid-hdiv').outerHeight(true);
		}
		
		if(modal.find('.ui-jqgrid-pager:visible').length > 0) {
			gh -= modal.find('.ui-jqgrid-pager').outerHeight(true);
		}
		
		if($('#' + tbl_id).closest('.tab-pane').length > 0) {
			var tab = $('#' + tbl_id).closest('.tab-pane');
			var tab_pane = obj.closest('.tab-pane');
			var tab_pane_padding = parseInt(tab_pane.css('padding-top'));
			tab_pane.addClass('has-imagepicker');
			gh -= modal.find('.nav-tabs').outerHeight(true);
			gh -= (1.5 * tab_pane_padding);

			var imagepicker_formgroup = obj.closest('.form-group');
			imagepicker_formgroup.nextAll().each(function() {
				gh -= $(this).outerHeight(true);
			});
		}
		
		if(modal.find('.accordion-heading').length > 0) {
			var panel = $('#' + tbl_id).closest('.panel');
			gh -= parseInt(panel.css('margin-top'));
			gh -= parseInt(panel.css('margin-bottom'));
			gh -= panel_padding;
			
			modal.find('.accordion-heading').each(function() {
				gh -= $(this).outerHeight(true);
			});
			
			modal.find('.panel').each(function() {
				gh -= parseInt($(this).css('margin-bottom'));
			});
			
			var imagepicker_formgroup = $('#' + tbl_id).closest('.row');
			imagepicker_formgroup.nextAll().each(function() {
				gh -= $(this).outerHeight(true);
			});
		}

		if(gh > 60) {
			grid.find('.ui-jqgrid-bdiv').css('height', gh);
		}
		
		var imgtable = grid.find('.imagepicker-tbl');
		imgtable.css('width', imgtable.width() - 2);
		var gridtable = grid.find('.ui-jqgrid-bdiv');
		gridtable.css('width', gridtable.width() - 2);
	}
};

CommonUtil.editor_resize = function(obj) {
	if(obj.closest('.tab-pane').length > 0 && obj.closest('.modal-body').length > 0) {
		var modal = obj.closest('.modal-body');
		var mh = modal.height();
		var modal_padding = parseInt(modal.css('padding-top'));
		modal_padding = modal_padding > 0 ? modal_padding : '10';
		
		if(obj.closest('.tab-pane').children().length == 1 && obj.closest('.tab-pane').find('.panel').length < 1) {
			var gh = mh;
			gh -= modal_padding;
			gh -= modal.find('.nav-tabs').outerHeight(true);
			gh -= modal.find('.cke_top').outerHeight(true);
			gh -= modal.find('.cke_bottom').outerHeight(true);
			
			if(modal.find('.control-label').length > 0) {
				gh -= modal.find('.control-label').outerHeight(true);
			}
			
			modal.find('.cke_contents').css('height', gh);
		}
	}
};


/* LOCALE */
CommonUtil.check_for_locale_text = function(callbacks) {
	if(typeof locale_text === 'object') {
		do_callbacks(callbacks);
	} else {
		var i = 0;
		var t = setInterval(function() {
			if(typeof locale_text === 'object' || i > 100) {
				clearInterval(t);
				do_callbacks(callbacks);
			}
		
			i++;
		}, 100);
	}
	
	function do_callbacks(callbacks) {
		if(typeof callbacks === 'object') {
			for(var i in callbacks) {
				var cb_context = typeof callbacks[i].context == 'object' ? callbacks[i].context : window;
				var cb_function = cb_context[callbacks[i].callback];
			
				if (typeof cb_function == 'function') {
					cb_function.apply(cb_context, []);
				}
			}
		}	
	}
};

CommonUtil.get_locale_obj = function(key) {
	if(typeof locale_text !== 'object') {
		var jqxhr = $.ajax({
			type : 'GET',
			url : globals.baseUrl + '/jshandler/messages',
			data : 'lang=' + globals.locale.replace('-', '_'),
			dataType : 'jsonp',
			success : function(responseData) {
				locale_text = responseData;
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			
		});
	}
};

CommonUtil.get_locale_text = function(key, callback, context, args) {
	if(typeof locale_text === 'object') {
		var original_string = key;
		var k = key.toLowerCase();
		k = k.replace(' ', '_');
		return CommonUtil.load_locale_text(k, callback, context, args, original_string);
	} else {
		return key.replace(/\_/ig, ' ');
	}
};

CommonUtil.load_locale_text = function(key, callback, context, args, original_string) {
	var function_args = typeof args == 'object' ? args : [];
	var cb_context = typeof context == 'object' ? context : window;
	var cb_function = cb_context[callback];
	var text = '';

	if(key == '' || key == null || key == 'null') {
		return;
	}

	if(typeof locale_text === 'object' && typeof locale_text[key] === 'string') {
		text = locale_text[key];
	} else {
		text = original_string;
	}

	if (typeof cb_function == 'function') {
		function_args.unshift(text);
		cb_function.apply(cb_context, function_args);
	} else {
		return text;
	}
};

CommonUtil.get_currency_locale = function() {
	return globals.currencyLocale == 'fr-CA' ? 'en-US' : globals.currencyLocale;
}



/* MODAL */
CommonUtil.disable_modal_buttons = function() {
	$('.modal:visible .modal-footer').find('.btn').addClass('disabled');
};

CommonUtil.enable_modal_buttons = function() {
	$('.modal:visible .modal-footer').find('.btn').removeClass('disabled');
	
	var mbody = $('.modal:visible').find('.modal-body').attr('id');

	if(typeof mbody === 'string') {
		CommonUtil.page_wait_loader('#' + mbody, 'remove');
	}
};

CommonUtil.modal_loader_hide = function() {
	CommonUtil.send_post_message('hideModalWaitLoader');
};

CommonUtil.modal_loader_show = function() {
	CommonUtil.send_post_message('showModalWaitLoader');
};

CommonUtil.modal_panel_close = function() {
	$('.modal:visible').find('.modal-panel-container').remove();
};

CommonUtil.modal_panel_open = function(opts) {
	$('.modal:visible').find('.modal-content').append('<div class="modal-panel-container"><div class="modal-panel loading-tiny"></div></div>');
	
	if($('.modal:visible').find('.modal-header').length > 0) {
		var mh = $('.modal:visible').find('.modal-header').outerHeight();
		$('.modal:visible').find('.modal-panel-container').css('top', mh);
	}
	
	if(typeof opts === 'object' && typeof opts.ajax_content === 'string') {
		var jqxhr = $.ajax({
			type : 'GET',
			url : opts.ajax_content,
			data : null,
			dataType : 'html',
			success : function(responseData) {
				$('.modal:visible').find('.modal-panel').removeClass('loading-tiny');
				$('.modal:visible').find('.modal-panel').html(responseData);
				
				if(typeof opts.buttons === 'string') {
					var buttons = '<div class="clearfix modal-panel-footer-buttons">' + opts.buttons + '</div>';
					$('.modal:visible').find('.modal-panel').append(buttons);
				}
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			alert("unknown error");
		});
	} else {
		$('.modal:visible').find('.modal-panel').removeClass('loading-tiny');

		if(typeof opts.buttons === 'string') {
			var buttons = '<div class="clearfix modal-panel-footer-buttons">' + opts.buttons + '</div>';
			$('.modal:visible').find('.modal-panel').append(buttons);
		}
	}
};

CommonUtil.remove_modalbody_class = function(class_name) {
	$('.modal:visible .modal-body').removeClass(class_name);
};

CommonUtil.set_modalbody_class = function(class_name) {
	$('.modal:visible .modal-body').addClass(class_name);
};

CommonUtil.set_modal_title = function(title) {
	$('.modal:visible .modal-header h3').text(title);
};

CommonUtil.trigger_close_modal = function() {
	$('.modal:visible').find('.close:first').trigger('click');
};

CommonUtil.update_modal_ajax_content = function(url, buttons, hide_footer, callback, calllback_params) {
	if(typeof buttons === 'string' && buttons.length > 0) {
		if($('.modal:visible .modal-footer').length < 1) {
			$('.modal:visible .modal-body').after('<div class="modal-footer"></div>');
		}

		$('.modal:visible .modal-footer').removeClass('nocontent').show();
		$('.modal:visible .modal-footer').html(buttons);
	}
	
	if(typeof hide_footer === 'boolean' && hide_footer) {
		$('.modal:visible .modal-footer').addClass('nocontent').empty();
	}

	var domain1 = CommonUtil.get_domain_from_string(url);
	var domain2 = CommonUtil.get_domain_from_string(document.location.href);
	var modal = $('.modal:visible').find('.modal-body');

	if(domain1 != domain2) {
		var iframe_id = 'iframe-' + CommonUtil.unique_id();
		var iframe = '<iframe class="modal-iframe" id="' + iframe_id + '" src="' + url + '"></iframe>';
		$('.modal:visible').find('.modal-body').html(iframe);
		$('.modal:visible').find('.modal-body').addClass('no-overflow').addClass('full');
		
		if(typeof hide_footer !== 'boolean') {
			$('.modal:visible .modal-footer').addClass('nocontent').hide();
		}
		
		CommonUtil.page_wait_loader($('.modal-content:visible'));
		$('#' + iframe_id).on('load', function() {
			CommonUtil.page_wait_loader($('.modal-content:visible'), 'remove');
			CommonUtil.fix_redraw_iframe(iframe_id);
		});
	} else {
		CommonUtil.page_wait_loader($('.modal-content:visible'));
		
		if(typeof hide_footer !== 'boolean') {
			$('.modal:visible .modal-footer').removeClass('nocontent').show();
		}
		
		$('.modal:visible').find('.modal-body').removeClass('no-overflow').removeClass('full');
		
		var jqxhr = $.ajax({
			type : 'GET',
			url : url,
			data : null,
			dataType : 'html',
			success : function(responseData) {
				$('.modal:visible').find('.modal-body').html(responseData);
				
				if(typeof callback === 'string' && callback.length > 0) {
					if(typeof window[callback] === 'function') {
						var cb_function = window[callback];
						var cb_params = typeof calllback_params === 'object' && calllback_params != null ? calllback_params : [];
						cb_function.apply(this, cb_params);
					}
				}
				
				CommonUtil.page_wait_loader($('.modal-content:visible'), 'remove');
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			alert("Unable to load content");
		});
	}
	
	BootstrapComponent.set_modal_heights( $('.modal:visible') );
};


/* NUMBERS AND CURRENCY */
CommonUtil.uses_intl = function(func) {
	if(typeof Intl === 'object' && typeof Intl.NumberFormat === 'function') {
        if (typeof func === "string"){
			if (!Intl.NumberFormat.prototype.hasOwnProperty(func)){
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
};

CommonUtil.get_currency_symbol = function() {
	if(CommonUtil.uses_intl("formatToParts")) {
		var locale = CommonUtil.get_currency_locale();
		var parts = Intl.NumberFormat(locale, { currency: globals.currency, maximumFractionDigits: 2, minimumFractionDigits: 2, style: 'currency' }).formatToParts(1.1);
		
		var csym = $.grep(parts, function(csym){
			return csym.type == 'currency';
		})[0];

		var s = csym.value;
		
		return s;
	} else {
		return '$';
	}
};

CommonUtil.get_decimal_separator = function() {
	if(CommonUtil.uses_intl("formatToParts")) {
		var locale = CommonUtil.get_currency_locale();
		var parts = Intl.NumberFormat(locale).formatToParts(1.1)
		
		var dec = $.grep(parts, function(dec){
			return dec.type == 'decimal';
		})[0];

		var d = dec.value;
		
		return d;
	} else {
		return '.';
	}
};

CommonUtil.get_decimal_places = function(decimals) {
	var dec = typeof decimals === 'number' ? decimals : globals.currency_decimals;
	return dec;
};

CommonUtil.clean_float = function(str, empty_value) {
	var num = str.toString().replace(/[^0-9\-\.]/g, '');
	var non = (typeof empty_value == 'number' || typeof empty_value == 'string') ? empty_value : 0;
	num = num != '' ? num : non;
	num = parseFloat(num);
	return num;
};

CommonUtil.clean_float_string = function(str) {
	var num = str.toString().replace(/[^0-9\-\.]/g, '');
	return num;
};

CommonUtil.clean_number = function(str, empty_value) {
	var num = str.toString().replace(/[^0-9\-]/g, '');
	var non = (typeof empty_value == 'number' || typeof empty_value == 'string') ? empty_value : 0;
	num = num != '' ? num : non;
	num = parseInt(num);
	return num;
};

CommonUtil.clean_currency = function(str, allow_negative, return_number) {
    var number = CommonUtil.parse_number(str);
    number = number.toString();
	number = allow_negative == false ? number.replace(/\-/g, '') : number;

    if(CommonUtil.uses_intl()) {
    	number = CommonUtil.number_decimal(number);
    } else {
		number = parseFloat(number).toFixed(globals.currency_decimals);
	}

	if(return_number) {
		if(typeof number !== 'number') {
			number = Number(number);
		}
	} else {
		if(typeof number !== 'string') {
			number = number.toString();
		}
	}

	return number;
};

CommonUtil.clean_price_input = function(obj, allow_negative, show_csym) {
	var sym = typeof show_csym === 'boolean' ? show_csym : false;
	var neg = typeof allow_negative === 'boolean' ? allow_negative : true;
	var val = obj.val();
	
	val = CommonUtil.clean_currency(val, neg);
	val = CommonUtil.format_currency(val, sym);
	obj.val(val);
};

CommonUtil.format_currency = function(str, show_symbol) {
	if(CommonUtil.uses_intl()) {
		var dec = CommonUtil.get_decimal_places();
		var number = CommonUtil.number_decimal(str, dec);
		var locale = CommonUtil.get_currency_locale();
		if(show_symbol) {
			number = new Intl.NumberFormat(locale, { currency: globals.currency, currencyDisplay: 'code', maximumFractionDigits: dec, minimumFractionDigits: dec, style: 'currency' }).format(number).replace(globals.currency, globals.currencySym).trim();
			var replace = globals.currencySym.replace('\$', '\\$\\s');
			var rep = new RegExp(replace,"g");
			number = number.replace(rep, globals.currencySym);
		} else {
			number = new Intl.NumberFormat(locale, { currency: globals.currency, maximumFractionDigits: dec, minimumFractionDigits: dec, style: 'decimal' }).format(number);
		}
		//replace euro and pound symbols
		if (globals.currencySym.indexOf("&euro;")!==-1 || globals.currencySym.indexOf("&pound;")!==-1){
			var nbsp = '\u00A0';
			var rep = CommonUtil.get_currency_unicode(globals.currencySym);
			number = number.replace(globals.currencySym + nbsp, rep);
			number = number.replace(globals.currencySym, rep);
		}
		return number;
	} else {
		var csym = typeof globals.currencySym == 'string' ? globals.currencySym : '$';
		var sym = show_symbol != false ? csym : '';
		var thousands_sym = ',';
		var decimal_sym = '.';

		var cstr = typeof str === 'string' || typeof str === 'number' ? str.toString().replace(/,/g, '') : str;
		var p = parseFloat(cstr).toFixed(globals.currency_decimals);
		var neg = p.indexOf('-') == 0 ? '-' : '';
		p = p.replace('-', '');
		var parts = p.toString().split(decimal_sym);
		var intpart = parts[0];
		var dec = parseInt(parts[1]);
		dec = dec < 10 ? '0' + dec : dec;
		var price = intpart.toString().split(/(?=(?:\d{3})+(?:\.|$))/g).join(thousands_sym) + decimal_sym + dec;
		return neg + sym + price;
	}
};

CommonUtil.get_currency_unicode = function(str){
	if (str==='&euro;'){
		return '\u20AC';
	} else if (str==='&pound;'){
		return '\u00a3';
	}
	return str;
}

CommonUtil.format_decimal = function(str, decimals) {
	var dec = CommonUtil.get_decimal_places(decimals);
	var number = CommonUtil.number_decimal(str, dec);
	var locale = CommonUtil.get_currency_locale();

	if(CommonUtil.uses_intl()) {
		number = new Intl.NumberFormat(locale, { currency: globals.currency, maximumFractionDigits: dec, minimumFractionDigits: dec, style: 'decimal' }).format(number);
	} else {
		number = parseFloat(number).toFixed(decimals);
	}
	
	return number;
};

CommonUtil.number_decimal = function(str, decimals) {
	var number;
	
	if(str instanceof Number) {
		str = Number(str);
	}
	
	var dec = CommonUtil.get_decimal_places(decimals);
	number = CommonUtil.parse_number(str);
	number = number.toString();
	
	if(number.indexOf('.') > 0) {
		var parts = number.split('.');
		var parts_decimal = parts[1].substring(0, dec);
		parts_decimal = CommonUtil.pad_right(parts_decimal, dec);
		number = parts[0] + '.' + parts_decimal;
	} else {
		number = number + '.' + CommonUtil.pad_right('0', dec);
	}

	return Number(number);
};

CommonUtil.parse_number = function(str) {
	var number;
	
	if(str instanceof Number) {
		str = Number(str);
	}

	if(typeof str === 'number') {
		number = str;
	} else {
		var decimal = CommonUtil.get_decimal_separator();
		number = str.length > 0 ? str : '0';

		if(decimal == ',') {
			number = number.replace(/[^0-9\-,]/g, '');
			number = number.replace(',', '.');
		} else {
			number = number.replace(/[^0-9\-\.]/g, '');
		}
		
		number = Number(number);
	}

	return number;
};

CommonUtil.pad_right = function(str, amt, character, return_number) {
	var new_str = str.toString();
	var len = new_str.length;
	var pad = typeof character === 'string' ? character : '0';
	
	if(len < amt) {
		var diff = Number(amt) - Number(len);
		
		for(var i=0; i<diff; i++) {
			new_str += pad;
		}
	}
	
	if(return_number) {
		new_str = Number(new_str);
	}
	
	return new_str;
};

CommonUtil.number = function(str, decimals) {
	var number;
	
	if(str instanceof Number) {
		str = Number(str);
	}
	
	if(typeof str === 'number') {
		number = str;
	} else {
		number = typeof str === 'object' && str != null ? str.val() : str;
		number = (typeof number === 'string' && number.length > 0) ? number : 0;
		number = CommonUtil.parse_number(number);
	}

	if(typeof decimals === 'number') {
		number = CommonUtil.number_decimal(number, decimals);
	}

	return number;
};

CommonUtil.format_integer = function (str){	
    var number = CommonUtil.number(str, 0);
	var locale = CommonUtil.get_currency_locale();
    
    if(CommonUtil.uses_intl()) {
    	return new Intl.NumberFormat(locale, { maximumFractionDigits: 0, minimumFractionDigits: 0, style: 'decimal' }).format(number);
    } else {
    	return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

CommonUtil.get_number_object = function(val) {
	var v = typeof val === 'object' ? new String(val) : val;
	var num = CommonUtil.clean_float(v);
	num = new Number(num);

	return num;
};

CommonUtil.is_integer = function(str) {
	if (globals.numberFormat === 'dotcomma'){
		str = str.replace(".","");
		str = str.replace(",",".");
	}
	var regex = /[^0-9\.\-]/;
	if(regex.test(str)) {
		return false;
	} else {
		var r = (str % 1);
	
		if(r === 0) {
			return true;
		} else if(isNaN(r)) {
			return false;
		} else {
			return false;
		}
	}
};

CommonUtil.is_number = function(str) {
	var regex = /[^0-9\.\-\,]/;
	
	if(regex.test(str)) {
		return false;
	}
	
	return true;
};

CommonUtil.is_alpha = function(str) {
	var regex = /[A-Za-z]/;
	
	if(regex.test(str)) {
		return true;
	}
	
	return false;
};

CommonUtil.contains_alphanumeric = function(str) {
    var regex = /([a-zA-Z0-9]+)/;
    if(regex.test(str)) {
        return true;
    }

    return false;
};

CommonUtil.round = function(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};

CommonUtil.round_with_decimal_places = function(value, decimals) {
	var dec = CommonUtil.get_decimal_places(decimals);
	return CommonUtil.round(value, dec).toFixed(dec);
};

CommonUtil.dec_to_hex = function(num) {
	var val = new Number(num);
	val = val.toString(16);
	
	if(val.length < 2) {
		val = '0' + val.toString();
	}
	
	return val;
};

CommonUtil.hex_to_dec = function(num) {
	return parseInt(num, 16);
};

CommonUtil.add_two_numbers = function(num1, num2, decimals) {
	var dec = typeof decimals === 'number' ? decimals : CommonUtil.get_decimal_places(decimals);
	return parseFloat( (num1+num2).toFixed(dec) );
}

CommonUtil.subtract_two_numbers = function(num1, num2, decimals) {
	var dec = typeof decimals === 'number' ? decimals : CommonUtil.get_decimal_places(decimals);
	return parseFloat( (num1-num2).toFixed(dec) );
}


/* POSTMESSAGE */
CommonUtil.send_post_message = function(msg) {
	var wp = window.parent;
	if (wp && wp.postMessage) {
		try {
			wp.postMessage(msg, "*");
		} catch(e) {
			//alert(e);
		}
	}
};

CommonUtil.send_post_message_popup = function(msg) {
	var wp = window.opener;
	if (wp && wp.postMessage) {
		try {
			wp.postMessage(msg, "*");
		} catch(e) {
			//alert(e);
		}
	}
};

CommonUtil.send_post_message_iframe = function(iframe_id, msg) {
	var iframe = document.getElementById(iframe_id.replace('#', ''));

	if(iframe && iframe.contentWindow.postMessage) {
		try {
			iframe.contentWindow.postMessage(msg, "*");
		} catch(e) {
			//alert(e);
		}
	}
};


/* SCRIPTS AND TAGS */
CommonUtil.build_css_link = function(file, id, media) {
	var id_str = typeof id == 'string' ? 'id="' + id + '"' : '';
	var media_str = typeof media == 'string' ? 'media="' + media + '"' : 'media="all"';
	var link = file.indexOf('http') == 0 ? file : globals.staticResourceBaseUrl + '/css/' + file;
	return '<link ' + id_str + ' href="' + link + '" ' + media_str + ' type="text/css" rel="stylesheet" />';
};

CommonUtil.build_js_link = function(file, id) {
	var id_str = typeof id == 'string' ? 'id="' + id + '"' : '';
	var link = CommonUtil.get_js_link(file);
	return '<script ' + id_str + ' src="' + link + '" type="text/javascript"></script>';
};

CommonUtil.get_js_link = function(file) {
	return globals.staticResourceBaseUrl + '/js/' + file;
};

CommonUtil.get_script = function(type, callback) {
	var file = '';
	var css = '';
	var cb = callback;
	
	for ( var i in autoload_scripts) {
		if (autoload_scripts[i]['type'] == type) {
			file = autoload_scripts[i]['files']['js'];
			css = autoload_scripts[i]['files']['css'];
		}
	}

	if (file == '') {
		return;
	}

	autoload['queue'].push({
	    'file' : file,
	    'cb' : callback,
	    'executed' : false
	});

	if (!CommonUtil.in_array(autoload['scripts'], file)) {
		autoload['scripts'].push(file);
		load_css(css);
		load_js(file);
	} else {
		check_queue();
	}

	function load_js(file) {
		var url = CommonUtil.get_js_link(file);
		var script = document.createElement('script')
		script.type = 'text/javascript';
		var qs = url.indexOf('?') > 0 ? '&' : '?';
		script.src = url + qs;
		document.body.appendChild(script);

		if (script.readyState) {
			script.onreadystatechange = function() {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					load_js_done(file);
				}
			};
		} else {
			script.onload = function() {
				load_js_done(file);
			};
		}
	}

	function load_css(css) {
		for ( var i in css) {
			var url = CommonUtil.build_css_link(css[i]);
			$('head').append(url);
		}
	}

	function load_js_done() {
		autoload['loaded'].push(file);
		check_queue();
	}

	function check_queue() {
		var t = setInterval(function() {
			if (CommonUtil.in_array(autoload['loaded'], file)) {
				clearInterval(t);
				apply_callback();
			}
		}, 500);
	}

	function apply_callback() {
		if(typeof cb == 'function') {
			if (typeof cb == 'function') {
				cb();
			} else if (typeof cb == 'string') {
				var cb_function = window[cb];
				cb_function.apply(this, []);
			}
		}
	}
};

/* SINGLE PAGE CHECKOUT */
CommonUtil.is_single_page_checkout = function() {
	if(typeof single_page_checkout === 'boolean') {
		if(single_page_checkout === true) {
			return true;
		}
	}
	
	return false;
};

/* STRINGS */
CommonUtil.remove_line_breaks = function(str) {
	if(typeof str === 'string' && str.length > 0) {
		return str.replace(/(\r\n|\n|\r)/gm, "");
	}
	
	return '';
};

CommonUtil.get_html_head = function(html) {
	var head = html;
	var regex = /<head.*?>([\s\S]*)<\/head>/;
		
	if(head.indexOf('<head') > 0) {
		head = regex.exec(html)[1];
	}
	
	return head;
};

CommonUtil.get_html_body = function(html) {
	var body = html;
	var regex = /<body.*?>([\s\S]*)<\/body>/;
		
	if(body.indexOf('<body') > 0) {
		body = regex.exec(html)[1];
	}
	
	return body;
};

CommonUtil.get_html_body_main = function(html) {
	var main = html;
	var regex = /<main.*?>([\s\S]*)<\/main>/;
		
	if(main.indexOf('<main') > 0) {
		main = regex.exec(html)[1];
	}
	
	return main;
};

CommonUtil.strip_header = function(str) {
	str = str.replace(/<header.*?>([\s\S]*)<\/header>/ig, '');
	return str;
};

CommonUtil.strip_footer = function(str) {
	str = str.replace(/<footer.*?>([\s\S]*)<\/footer>/ig, '');
	return str;
};

CommonUtil.uppercase_first = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		return str[0].toUpperCase() + str.slice(1);
	} else {
		return str;
	}
};

CommonUtil.clean_attribute = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/["']/g, "");
	}
	return str;
};

CommonUtil.strip_tags = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/(<([^>]+)>)/ig, '');
	}
	return str;
};

CommonUtil.strip_tabs = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/\t/g, '');
	}
	return str;
};

CommonUtil.nl2br = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/\n/g, '<br />').replace(/\r/g, '<br />').replace(/\r\n/g, '<br />');
	}
	return str;
};

CommonUtil.br2nl = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/<br[^>]*>/gi, "\n");
	}
	return str;
};

CommonUtil.strip_linebreaks = function(str) {
	if(typeof str == 'string' && str.length > 0) {
		str = str.replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
	}
	return str;
};

CommonUtil.html_to_text = function(str) {
	str = $('<div />').html(str).text();
	return str;
}

CommonUtil.text_to_html = function(str) {
	str = CommonUtil.nl2br(str);
	return str;
}

CommonUtil.string_to_boolean = function(str) {
	var b = str;
	if(typeof str === 'string') {
		if(str == 'true') {
			b = true;
		} else {
			b = false;
		}
	}
	
	return b;
}

CommonUtil.strip_non_alphanumeric = function(str, allow_spaces) {
	var res = '';
	
	if(str.length > 0) {
		if(allow_spaces) {
			res = str.replace(/[^a-z0-9\s]/gi, '');
		} else {
			res = str.replace(/[^a-z0-9]/gi, '');
		}
	}
	
	return res;
};

CommonUtil.strip_quotes = function(str) {
	var res = '';

	if(str.length > 0) {
		res = str.replace(/[\'\"]/gi, '');
	}

	return res;
};

CommonUtil.strip_localization = function(str) {
	var res = '';

	if(str.length > 0) {
		res = str.replace(/\[[a-z]{2}\]/g, '');
	}

	return res;
};

CommonUtil.get_non_localized_alphanumeric = function(str) {
	return CommonUtil.strip_non_alphanumeric(CommonUtil.strip_localization(str), false).toLowerCase();
};

CommonUtil.hasHTML = function(str) {
	var regex = /<\/?[^>]*>/;
	return regex.test(str);
};

CommonUtil.replace_quotes = function(str) {
	var res = '';
	
	if(str.length > 0) {
		res = str.replace(/&apos;/g, "'");
		res = res.replace(/&quot;/g, '"');
	}
	
	return res;
};

CommonUtil.decode_quotes = function(str) {
	var res = '';
	
	if(str.length > 0) {
		res = str.replace(/%22/g, '"');
	}
	
	return res;
};

CommonUtil.encode_quotes = function(str) {
	var res = '';
	
	if(str.length > 0) {
		res = str.replace(/"/g, "%22");
	}
	
	return res;
};

CommonUtil.split_camel_case = function(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

CommonUtil.get_domain_from_string = function(str) {
	var domain = '';
	
	if(str.length > 0) {
		var parts = str.split('/');
		domain = parts[2];
	}
	
	return domain;
};

CommonUtil.xss_clean = function(str) {
	if(str != null && str.length > 0) {
		str = str.replace(/<script[^>]*>.*?<\/script>/gi, '');
		str = str.replace(/%3Cscript[^>]*%3E.*?%3C%2Fscript%3E/gi, '');
		str = str.replace(/<script[^>]*>/ig, '');
		str = str.replace(/%3Cscript[^>]*%3E/ig, '');
		str = str.replace(/<\/script>/ig, '');
		str = str.replace(/%3C%2Fscript%3E/ig, '');
		str = str.replace(/<script/ig, '');
		str = str.replace(/<\/(scr?i?p?t?)/ig, '');
	}
	
	return str;
};

CommonUtil.xss_clean_multiline = function(str) {
	if(str != null && str.length > 0) {
		str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
		str = str.replace(/%3Cscript[^>]*%3E[\s\S]*?%3C%2Fscript%3E/gi, '');
		str = str.replace(/<script[^>]*>/ig, '');
		str = str.replace(/%3Cscript[^>]*%3E/ig, '');
		str = str.replace(/<\/script>/ig, '');
		str = str.replace(/%3C%2Fscript%3E/ig, '');
		str = str.replace(/<script/ig, '');
		str = str.replace(/<\/(scr?i?p?t?)/ig, '');
	}

	return str;
};

CommonUtil.is_null_or_empty = function(str) {
	if( str == null || str == 'null' || str == '' ) {
		return true;
	}

	return false;
};

CommonUtil.convert_utf8_to_html = function(text, preserve_linebreaks) {
	var input_text = text;
	var encoded_text = "";

	for (var i = 0; i < input_text.length; i++) {
		var code_point = input_text.codePointAt(i);

		if ((code_point < 32) || (code_point > 127)) {
			if(preserve_linebreaks == true && (code_point == 10 || code_point == 13)) {
				encoded_text += input_text.charAt(i);
			} else {
				encoded_text += "&#" + code_point + ";";
			}

			if (code_point > 65535) {
				i++;
			}
		} else {
			encoded_text += input_text.charAt(i);
		}
	}

	if (encoded_text === "") {
		encoded_text = "";
	}

	return encoded_text;
};

CommonUtil.capitalize_first = function(str) {
	var cap = str;

	if(cap != '') {
		cap = cap.charAt(0).toUpperCase() + cap.slice(1);
	}

	return cap;
}


/* VARS */
CommonUtil.get_param = function(varname, str) {
	varname = varname.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + varname + "=([^&#]*)";
	var regex = new RegExp(regexS);
	if(typeof str === 'string' && str.length > 0) {
		var results = regex.exec(str);
	} else {
		var results = regex.exec(window.location.href);
	}
	if (results == null) {
		return "";
	} else {
		return results[1];
	}
};

CommonUtil.removeParam = function(key, url) {
	var str = (typeof url === 'string' && url.length > 0) ? url : window.location.href;
	var rtn = str.split("?")[0],
		param,
		params_arr = [],
		queryString = (str.indexOf("?") !== -1) ? str.split("?")[1] : "";
	if (queryString !== "") {
		params_arr = queryString.split("&");
		for (var i = params_arr.length - 1; i >= 0; i -= 1) {
			param = params_arr[i].split("=")[0];
			if (param === key) {
				params_arr.splice(i, 1);
        	}
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
	return rtn;
}

CommonUtil.changeParam = function(key, url, newValue) {
	var str = (typeof url === 'string' && url.length > 0) ? url : window.location.href;
	var rtn = str.split("?")[0],
		param,
		params_arr = [],
		queryString = (str.indexOf("?") !== -1) ? str.split("?")[1] : "";
	if (queryString !== "") {
		params_arr = queryString.split("&");
		for (var i = params_arr.length - 1; i >= 0; i -= 1) {
			param = params_arr[i].split("=")[0];
			if (param === key) {
				params_arr[i] = key + "=" + newValue;
        	}
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
	return rtn;
}

CommonUtil.remove_doc_params = function(url) {
	var hrefString = typeof url === 'string' && url.length > 0 ? url : window.location.href;
	hrefString = CommonUtil.removeParam('scrolltolast',hrefString);
	hrefString = CommonUtil.removeParam('scrollToNew',hrefString);
	hrefString = CommonUtil.removeParam('message',hrefString);
	hrefString = CommonUtil.removeParam('showlastpage',hrefString);
	hrefString = CommonUtil.removeParam('docAction',hrefString);
	hrefString = CommonUtil.removeParam('liveCost',hrefString);
	hrefString = CommonUtil.removeParam('duplicateProducts',hrefString);
	hrefString = CommonUtil.removeParam('hasSubsidiaries',hrefString);
	hrefString = CommonUtil.removeParam('selectItems',hrefString);
	hrefString = CommonUtil.removeParam('open_new',hrefString);
	hrefString = CommonUtil.removeParam('open',hrefString);
	hrefString = CommonUtil.removeParam('from',hrefString);

	if(hrefString.indexOf('#') > 0) {
		var parts = hrefString.split('#');
		hrefString = parts[0];
	}

	if (hrefString.indexOf('action=continuecheckout') >= 0){
	   hrefString = CommonUtil.removeParam('action',hrefString);
	}

	return hrefString;
};

CommonUtil.remove_all_params = function(url) {
	var new_url = url;

	if(new_url != '') {
		new_url = new_url.split('?');
		new_url = new_url[0];
	}

	return new_url;
};

CommonUtil.replace_var = function(str, srch, rep) {
	var new_str = str;
	var regex = /\$\{([\w]*?)\}/g;
	var matches = str.match(regex);

	for(var m in matches) {
		if(matches[m] == srch) {
			new_str = new_str.replace(matches[m], rep);
		}
	}
	
	return new_str;
};

CommonUtil.sprintf = function(str, vars) {
	var new_str = str;
	
	if(typeof str === 'string' && typeof vars === 'object') {
		if(str.indexOf('%1s') >= 0) {
			new_str = new_str.replace(/%1s/g, function() {
				return vars.shift();
			});
		} else {
			new_str = new_str.replace(/%s/g, function() {
				return vars.shift();
			});
		}
	}
	
	return new_str;
};


/* WINDOWS */
CommonUtil.popup_generic = function(url, name, height, width, ev) {
	if(typeof ev === 'object' && ev != null && typeof ev.preventDefault === 'function') {
		ev.preventDefault();
	}

	if(typeof height === 'string') {
		if(height.indexOf('%') > 0) {
			height = parseInt(height);
			height = screen.height * (height/100);
		}
	}
	
	if(typeof width === 'string') {
		if(width.indexOf('%') > 0) {
			width = parseInt(width);
			width = screen.width * (width/100);
		}
	}

	var left = screen.width / 2 - width / 2;
	var top = screen.height / 2 - height / 2;
	var params = "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top=" + top + ",left=" + left
	        + ",height=" + height + ",width=" + width;
	return window.open(url, name, params);
};

CommonUtil.refresh_page = function(show_loader, show_page_wait_loader) {
	var hrefString = CommonUtil.remove_doc_params();
	
	if(show_loader) {
		CommonUtil.show_loader({ loading_text:'' });
	} else if(show_page_wait_loader) {
		CommonUtil.page_wait_loader();
	}
	
	window.location.href = hrefString;
};

CommonUtil.redirect = function(url, show_loader, show_page_wait_loader, break_iframe) {
	if(show_loader) {
		CommonUtil.show_loader({ loading_text:'' });
	} else if(show_page_wait_loader) {
		CommonUtil.page_wait_loader();
	}

	if(break_iframe) {
		window.top.location.href = url;
	} else {
		window.location.href = url;
	}
};

CommonUtil.colJson = function (url,data,callback) {
	var jqxhr = $.ajax({
		type : 'GET',
		url : globals.baseUrl + url,
		data : data,
		dataType : 'json',
		success : function(responseData) {
			//console.log(responseData);
			callback(responseData);
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		alert("unknown error");
	});
};

CommonUtil.modal_alert = function(msg) {
	BootstrapComponent.quick_modal({ backdrop:false, content:msg, size:'medium', title:'Alert' });
};

CommonUtil.scroll_to_obj = function(scroll_to) {
	var obj = typeof scroll_to === 'object' ? scroll_to : $(scroll_to);
	
	if(obj.length > 0) {		
		if($('body.storesite').length > 0) {
			var ot = obj.offset().top;
			$('html, body').animate({scrollTop: ot}, 1000, function() {
				if(obj.is('input')) {
					obj.focus();
				}
			});
		} else if ($('#crm-main-pane').length > 0){
			var st = $('#crm-main-pane-body').scrollTop();
			var ot = obj.offset().top - $('#crm-main-pane').position().top + st;

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
};

CommonUtil.is_valid_price = function(str){ 
	var regex = /[^0-9\.]/;	
	if(regex.test(str)) {
		return false;
	}	
	return true;
};

CommonUtil.save_new_user_email_body_in_local_storage = function(userType, userId, emailBody) {
	var storage_enabled = CommonUtil.check_localstorage();
	if(storage_enabled == true) {
		var separator = '|||';
		var saveValue = userId.toString() + separator + emailBody;
		var storageName = userType == 'contact' ? 'activate_contact_email_body' : 'activate_salesperson_email_body';
		CommonUtil.set_localstorage(storageName, saveValue);
	}
};

CommonUtil.get_new_user_email_body_from_local_storage = function(userType, userId) {
	var storage_enabled = CommonUtil.check_localstorage();
	if (storage_enabled == true) {
		var storageName = userType == 'contact' ? 'activate_contact_email_body' : 'activate_salesperson_email_body';
		var value = CommonUtil.get_localstorage(storageName);
		if (value != null && typeof value != 'undefined' && value != "") {
            var separator = '|||';
			var parts = value.toString().split(separator);
			if (parts[0] == userId.toString()) {
				var actualTemplate = value.toString().substr(userId.toString().length + separator.length);
				return actualTemplate;
			}
		}
	}
	return '';
};


CommonUtil.check_unique_key = function (){
	var valid = false;
	var tab_data = {
		key : $("#tab_key").val(),
		id : $("#tab_id").val(),
	};
	BootstrapComponent.tooltip_destroy($("#tab_key"));

	$.ajax({
		type : 'POST',
		url : globals.baseUrl + '/CustomTabs/isKeyUnique',
		dataType : 'json',
		data : tab_data,
		success : function(response) {
			$('#quoteNumberCheckmark').remove();

			if (response.success != 1) {
				BootstrapComponent.tooltip($("#tab_key"), { title:response.message });
				CommonUtil.changeSaveButton(true);
			} else {
				if (response.success == 1 && response.available) {
					BootstrapComponent.tooltip_destroy($("#tab_key"));
					$("#tab_key").removeClass (function (index, className) {
						return (className.match (/(^|\s)span\S+/g) || []).join(' ');
					});
					$("#tab_key").removeClass('error').addClass('col-sm-10').after('<span id="quoteNumberCheckmark" class="icon-checkmark"></span>');
					valid = true;
					CommonUtil.changeSaveButton(false);
				} else if (!response.available) {
					BootstrapComponent.tooltip($("#tab_key"), { title: CommonUtil.get_locale_text('key_in_use') });
					CommonUtil.changeSaveButton(true);
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});
};

CommonUtil.changeSaveButton = function (val){
	if(val) {
		$("#save-item-btn").attr("disabled",true);
		$("#save-component-btn-dropdown").attr("disabled",true);
	} else {
		$("#save-item-btn").removeAttr("disabled");
		$("#save-component-btn-dropdown").removeAttr("disabled");
	}
}

CommonUtil.convert_to_dotcomma = function (str){
	str = str.replace(",","");
	str = str.replace(".",",");
	return str;
}
