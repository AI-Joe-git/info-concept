/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 June 2014
 ******************************************************************************************************************************************/
function BootstrapComponent() {};

BootstrapComponent.quick_modal = function(opts) {
	var id = typeof opts['id'] === 'string' && opts['id'].length > 0 ? opts['id'] : 'quick-modal';
	var ajax = typeof opts['ajax_content'] === 'string' && opts['ajax_content'].length > 0 ? opts['ajax_content'] : '';
	var bd = typeof opts['backdrop'] === 'boolean' ? opts['backdrop'] : true;
	var class_name = typeof opts['size'] === 'string' && opts['size'].length > 0 ? opts['size'] : '';
	var iframe = typeof opts['iframe_content'] === 'string' && opts['iframe_content'].length > 0 ? opts['iframe_content'] : '';
	var iframe_ht = typeof opts['iframe_height'] === 'string' && opts['iframe_height'].length > 0 ? opts['iframe_height'] : '';
	var obj_content = (typeof opts['content'] === 'string' && opts['content'].length > 0) || (typeof opts['content'] === 'object' && opts['content'].length > 0) ? opts['content'] : '';
	var modal_title = typeof opts['title'] === 'string' && opts['title'].length > 0 ? opts['title'] : '';
	
	var options = {
		added_class : class_name,
		ajax_content : ajax,
		content : obj_content,
		id : id,
		iframe_content : iframe,
		iframe_height : iframe_ht,
		show_footer : false,
		title : modal_title
	};
	
	var options_open = {
		backdrop : bd
	};

	$('#' + options.id).remove();
	BootstrapComponent.modal(options);
	BootstrapComponent.open_modal($('#' + options.id), options_open);
};

BootstrapComponent.modal = function(options) {
	var defaults = {
	    added_class : '',
	    ajax_callback : '',
	    ajax_content : '',
	    append_to : 'body',
	    attributes : '',
	    body_class : '',
	    buttons : '',
	    callback : '',
	    content : '&nbsp;',
	    header_buttons : '',
	    id : 'modal',
	    iframe_content : '',
	    iframe_height : '100%',
	    iframe_id : '',
	    lead : '',
	    show_close_btn : true,
	    show_footer : true,
	    show_header : true,
	    title : '&nbsp;',
	    transition : 'fade',
	    use_modalfooter_class : true
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);

	var data_ajax = '';
	if (opts.ajax_content != '') {
		data_ajax = 'data-ajaxcontent="' + opts.ajax_content + '"';
		if (opts.ajax_callback != '') {
			data_ajax += ' data-ajaxcallback="' + opts.ajax_callback + '"';
		}
	}

	if (opts.callback != '') {
		opts.attributes += ' data-callback="' + opts.callback + '"';
	}

	var noscroll_class = '';
	if (opts.iframe_content != '') {
		var iframe_id_render = opts.iframe_id.length > 0 ? 'id="' + opts.iframe_id + '"' : '';
		opts.content = '<iframe ' + iframe_id_render + ' src="' + opts.iframe_content + '" class="modal-iframe" style="height: ' + opts.iframe_height + '" title="Iframe"></iframe>';
		noscroll_class = 'no-overflow';
	}

	var footer_class = '';
	if (opts.buttons == '' || opts.show_footer == false) {
		footer_class = 'nocontent';
		opts.buttons = '';
	}

	var header_class = '';
	if (opts.show_header == false) {
		header_class = 'nocontent';
		opts.header_buttons = '';
	}
	if (opts.show_close_btn == false) {
		header_class += ' nobuttons';
	}
	
	var content = opts.content;
	if (typeof opts.content == 'object') {
		content = opts.content.html();
		opts.content.remove();
	}

	html = '\
		<div id="' + opts.id + '" class="modal hide ' + opts.transition + ' ' + opts.added_class + '" ' + opts.attributes
			+ data_ajax + ' role="dialog"> \
			<div class="modal-dialog" role="document"> \
				<div class="modal-content"> \
					<div class="modal-header ' + header_class + '">';
						html += opts.header_buttons;
						html += '<h3>' + opts.title + '</h3>';
						if (opts.show_close_btn) {
							html += '<a class="close close-modal" href="javascript:;" title="Close"><span class="icon-close-dark"></span><span class="sr-only">Close</span></a>';
						}
						if(opts.lead.length > 0) {
							html += '<p class="lead">' + opts.lead + '</p>';
						}
						html +=	'</div> \
								<div class="modal-body ' + noscroll_class + ' ' + opts.body_class + '" id="' + opts.id + '-modalbody">' + content
								+ '</div> \
								<div class="modal-footer ' + footer_class + '">';
						if (opts.buttons != '') {
							var footer_class = opts.use_modalfooter_class ? 'modal-footer-buttons' : '';
							html += '<div class="' + footer_class + '">' + opts.buttons + '</div>';
						}
					html += '</div> \
				</div> \
			</div> \
		</div>';
	$(opts.append_to).append(html);
};

BootstrapComponent.open_modal = function(obj, options) {
	var defaults = {
		ajax_content_body_only : false,
	    backdrop : 'static',
	    keyboard : false,
	    show : true,
	    remote : false
	};
	var is_ajax = false;
	var shown_event_triggered = false;
	var opts = {};
	opts = $.extend(opts, defaults, options);

	var id = obj.attr('id');

	if(typeof opts.ajax_callback === 'string' && opts.ajax_callback.length > 0) {
		var ajax_callback = typeof opts.ajax_callback === 'string' ? opts.ajax_callback : '';
		var ajax_callback_args = typeof opts.ajax_args === 'object' ? opts.ajax_args : [];
		var ajax_callback_function = typeof opts.ajax_context === 'object' ? opts.ajax_context[ajax_callback] : window[ajax_callback];
		var ajax_callback_context = typeof opts.ajax_context === 'object' ? opts.ajax_context : this;	
	}
	
	if(typeof opts.callback === 'string' && opts.callback.length > 0) {
		var callback = typeof opts.callback === 'string' ? opts.callback : '';
		var callback_args = typeof opts.args === 'object' ? opts.args : [];
		var callback_function = typeof opts.context === 'object' ? opts.context[callback] : window[callback];
		var callback_context = typeof opts.context === 'object' ? opts.context : this;	
	}

	BootstrapComponent.add_modal_body_class();
	
	$('[data-toggle="tooltip"]').each(function() {
		$(this).blur();
	});
	
	$('#' + id).modal(opts);
	$('#' + id).removeClass('hide');
	
	if (obj.is('[data-ajaxcontent]') || typeof ajax_callback_function === 'function') {
		is_ajax = true;
		obj.find('.modal-body').html('<p class="loading"></p>');
		$.ajax({
		    type : 'GET',
		    url : obj.attr('data-ajaxcontent'),
		    dataType : 'html',
		    success : function(html) {
		    	if(opts.ajax_content_body_only === true) {
					html = CommonUtil.get_html_body(html);
				}

		    	var html_content = obj.find('.modal-body').html();
			    obj.find('.modal-body').html(html);

			    if(obj.is('[data-ajaxcallback]')) {
				    var cb_function = window[obj.attr('data-ajaxcallback')];
				    if (typeof cb_function == 'function') {
					    cb_function.apply(this, []);
				    }
			    }
    
			    if(typeof ajax_callback_function === 'function') {
			    	ajax_callback_function.apply(ajax_callback_context, ajax_callback_args);
			    }
			    
			    if(!shown_event_triggered) {
					if(html_content.indexOf('class="loading"') > 0) {
						var t = setInterval(function() {
							var check_content = obj.find('.modal-body').html();

							if(check_content.indexOf('class="loading"') < 0) {
								clearInterval(t);
								$.event.trigger({ type : 'BCModalShown' });
							}
						}, 1000);
					} else {
						$.event.trigger({ type : 'BCModalShown' });
					}
			    }

				BootstrapComponent.add_modal_anchor();
		    }
		});
	}

	if (obj.is('[data-callback]')) {
		var cb_function = window[obj.attr('data-callback')];
		if (typeof cb_function == 'function') {
			cb_function.apply(this, []);
		}
	}

	if(typeof callback_function === 'function') {
		callback_function.apply(callback_context, callback_args);
	}

	var t = setInterval(function() {
		if(obj.is(':visible')) {
			clearInterval(t);
			BootstrapComponent.set_modal_heights(obj);
			
			if(!is_ajax) {
				$.event.trigger({ type : 'BCModalShown' });
			}

			BootstrapComponent.add_modal_anchor();
		}
	}, 250);

	if(obj.find('.modal-body').children(':first').is('iframe')) {
		BootstrapComponent.iframe_loader(obj);
	}
};

BootstrapComponent.add_modal_anchor = function() {
	if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant) {
		if($('.modal:visible .modal-main-anchor').length < 1) {
			var html = '<a id="modal-main-anchor" href="" class="modal-main-anchor">Popup content</a>';
			$('.modal:visible .modal-body').prepend(html);
		}

		$('.modal:visible .modal-main-anchor').focus();
	}
};

BootstrapComponent.set_modal_heights = function(obj) {
	var margin = 20;
	var mh = obj.find('.modal-header').outerHeight(true);
	var mf = obj.find('.modal-footer').outerHeight(true);
	var wh = $(window).height();
	var padding = obj.find('.modal-body').css('padding-top');
	var height = wh - mh - mf - (2*margin) - (2*parseInt(padding));
	obj.find('.modal-body').css('max-height', height);
	
	if (obj.hasClass('large')) {
		obj.find('.modal-body').css('height', height);
	}
	
	setTimeout(function() {
		var modal_height = obj.outerHeight();
		var top = (wh - modal_height) / 2;
		obj.css('top', top);
	}, 1000);
};

BootstrapComponent.iframe_loader = function(obj) {
	var iframeid = obj.find('.modal-body').children(':first').is('[id]') ? obj.find('.modal-body').children(':first').attr('id') : '';

	if(iframeid != '') {
		BootstrapComponent.show_modal_loader(obj);
		
		$('#' + iframeid).on('load', function() {
			BootstrapComponent.remove_modal_loader(obj);
			CommonUtil.fix_redraw_iframe(iframeid);
		});

		var t = setTimeout(function() {
			BootstrapComponent.remove_modal_loader(obj);
		}, 1000);
	}

	function remove_iframe_loader(obj) {
		var t = setTimeout(function() {
			BootstrapComponent.remove_modal_loader(obj);
		}, 1000);
	};
};

BootstrapComponent.remove_modal_loader = function(obj) {
	if(typeof obj === 'object') {
		obj.find('.modal-loader').remove();
	} else {
		$('.modal').find('.modal-loader').remove();
	}
};

BootstrapComponent.show_modal_loader = function(obj) {
	if(obj.find('.modal-loader').length < 1) {
		obj.find('.modal-body').append('<div class="modal-loader loading"></div>');
	}
};

BootstrapComponent.show_modal_wait_loader = function(obj) {
	CommonUtil.page_wait_loader( $('.modal-content:visible:first') );
};

BootstrapComponent.hide_modal_wait_loader = function(obj) {
	CommonUtil.page_wait_loader( $('.modal-content:visible:first'), 'remove' );
};

BootstrapComponent.close_modal = function(obj) {
	if($('.modal.in').length < 2) {
		BootstrapComponent.remove_modal_body_class();
	}

	if(obj.closest('.modal').length > 0) {
		obj.closest('.modal').modal('hide');
	} else {
		CommonUtil.send_post_message('closeModal');
	}
	
	$.event.trigger({ type : 'BCModalHidden' });
};

BootstrapComponent.close_modals = function() {
	BootstrapComponent.remove_modal_body_class();

	$('.modal:visible').each(function() {
		try {
			$(this).modal('hide');
		} catch(e) {

		}
	});
};

BootstrapComponent.add_modal_body_class = function() {
	$('body').addClass('modal-open');
};

BootstrapComponent.remove_modal_body_class = function() {
	$('body').removeClass('modal-open');
};

BootstrapComponent.data_attribute = function(obj, attr, val) {
	obj.attr(attr, val);
};

BootstrapComponent.tooltip = function(obj, options) {
	var tooltip_show = $.fn.tooltip.Constructor.prototype.show;
	$.fn.tooltip.Constructor.prototype.show = function() {
		tooltip_show.call(this);
		if (this.options.callback) {
			this.options.callback();
		}
	}

	var defaults = {
	    className : 'error-tooltip',
	    focus : true,
	    error : true,
	    title : CommonUtil.get_locale_text('correct_error'),
	    trigger : 'manual'
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);

	BootstrapComponent.tooltip_destroy(obj);
	
	obj.tooltip({
	    callback : function() {
		    obj.siblings('.tooltip').addClass(opts.className)
	    },
	    title : opts.title,
	    trigger : opts.trigger
	});
	
	if(opts.hide) {
		obj.tooltip('hide');
	} else {
		obj.tooltip('show');
	}

	if (opts.focus) {
		obj.focus();
	}

	if (opts.error) {
		obj.addClass('error');
	}
};

BootstrapComponent.tooltip_destroy = function(obj) {
	try {
		if(obj != null) {
			if(obj.next('.tooltip').length > 0) {
				obj.tooltip('destroy');
			}
		}
	} catch(e) {
		
	}
};

BootstrapComponent.tooltip_remove = function(obj) {
	try {
		if(obj != null) {
			if(obj.next('.tooltip').length > 0) {
				obj.next('.tooltip').remove();
			}
		}
	} catch(e) {

	}
};

BootstrapComponent.popover = function(obj, options) {
	var defaults = {
	    animation : true,
	    content : '...',
	    dynamic : true,
	    html : false,
	    placement : 'top',
	    title : '...',
	    trigger : 'manual'
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);

	if(opts.dynamic && opts.trigger == 'manual') {
		obj.popover('destroy');
	}
	
	obj.popover({
	    animation : opts.animation,
	    content : opts.content,
	    html : opts.html,
	    placement : opts.placement,
	    title : opts.title,
	    trigger : opts.trigger
	});
	
	if(opts.dynamic && opts.trigger == 'manual') {
		obj.popover('show');
	}
};

BootstrapComponent.popover_destroy = function(obj) {
	obj.popover('destroy');
};

BootstrapComponent.popover_hide = function(obj) {
	obj.popover('hide');
};

BootstrapComponent.popover_show = function(obj) {
	obj.popover('show');
};

BootstrapComponent.text_input = function(obj) {
	var data_attributes = '';
	if(typeof obj.data_attr == 'object') {
		for(var i in obj.data_attr) {
			data_attributes += 'data-' + obj.data_attr[i]['k'] + '="' + obj.data_attr[i]['v'] + '" ';
		}
	}
	
	var append_class = typeof obj.append_class == 'string' ? obj.append_class : '';
	var append_string = typeof obj.append_string == 'string' ? obj.append_string : '';
	var append_string_css = append_string != '' ? 'input-group' : '';
	var classname = typeof obj.classname == 'string' ? 'class="form-control ' + obj.classname + '"' : '';
	var element_only = typeof obj.element_only == 'boolean' ? obj.element_only : false;
	var id = typeof obj.id == 'string' ? obj.id : '';
	var label = typeof obj.label == 'string' ? '<label class="control-label" for="' + id + '">' + obj.label + '</label>' : '';
	var maxlength = typeof obj.maxlength == 'number' ? 'maxlength="' + obj.maxlength + '"' : '';
	var name = typeof obj.name == 'string' ? obj.name : '';
	var prepend_class = typeof obj.prepend_class == 'string' ? obj.prepend_class : '';
	var prepend_string = typeof obj.prepend_string == 'string' ? obj.prepend_string : '';
	var prepend_string_css = prepend_string != '' ? 'input-group' : '';
	var value = typeof obj.value == 'string' ? obj.value : '';
	
	var html = '';
		if(element_only !== true) {
			html += '<div class="form-group">' + label +
				'<div class="controls ' + append_string_css + ' ' + prepend_string_css + '">';
				if(prepend_string != '') {
					html += '<span class="input-group-addon ' + prepend_class + '">' + prepend_string + '</span>';
				}
		}
		if(element_only === true && label.length > 0) {
			html += label;
		}
		html += '<input ' + classname + ' ' + data_attributes + ' id="' + id + '" name="' + name + '" ' + maxlength + ' type="text" value="' + value + '" />';
		if(element_only !== true) {
			if(append_string != '') {
					html += '<span class="input-group-addon ' + append_class + '">' + append_string + '</span>';
				}
			html += '</div> \
			</div>'	
		}
	return html;
};

BootstrapComponent.radio_input = function(obj) {
	var data_attributes = '';
	if(typeof obj.data_attr == 'object') {
		for(var i in obj.data_attr) {
			data_attributes += 'data-' + obj.data_attr[i]['k'] + '="' + obj.data_attr[i]['v'] + '" ';
		}
	}
	
	var classname = typeof obj.classname == 'string' ? 'class="' + obj.classname + '"' : '';
	var element_only = typeof obj.element_only == 'boolean' ? obj.element_only : false;
	var id = typeof obj.id == 'string' ? obj.id : '';
	var label = typeof obj.label == 'string' ? obj.label : '';
	var label_classname = typeof obj.label_classname == 'string' ? obj.label_classname : '';
	var name = typeof obj.name == 'string' ? obj.name : '';
	var value = typeof obj.value == 'string' ? obj.value : '';
	
	var html = '';
		if(element_only !== true) {
			html += '<div class="form-group"> \
				<div class="controls">';
		}
		html += '<label class="radio ' + label_classname + '" for="' + id + '"> \
				<input ' + classname + ' ' + data_attributes + ' id="' + id + '" name="' + name + '" type="radio" value="' + value + '" />' + label + ' \
			</label>';
		if(element_only !== true) {
			html += '</div> \
				</div>';
		}
	return html;
};

BootstrapComponent.checkbox_input = function(obj) {
	var data_attributes = '';
	if(typeof obj.data_attr == 'object') {
		for(var i in obj.data_attr) {
			data_attributes += 'data-' + obj.data_attr[i]['k'] + '="' + obj.data_attr[i]['v'] + '" ';
		}
	}
	
	var checked = typeof obj.checked == 'boolean' && obj.checked === true ? 'checked="checked"' : '';
	var classname = typeof obj.classname == 'string' ? 'class="' + obj.classname + '"' : '';
	var element_only = typeof obj.element_only == 'boolean' ? obj.element_only : false;
	var id = typeof obj.id == 'string' ? obj.id : '';
	var label = typeof obj.label == 'string' ? obj.label : '';
	var label_classname = typeof obj.label_classname == 'string' ? obj.label_classname : '';
	var name = typeof obj.name == 'string' ? obj.name : '';
	var value = typeof obj.value == 'string' ? obj.value : '';
	var disabled = typeof obj.disabled == 'boolean' && obj.disabled === true ? 'disabled="disabled"' : '';

	var html = '';
		if(element_only !== true) {
			html += '<div class="form-group"> \
				<div class="controls">';
		}
		html += '<label class="checkbox ' + label_classname + '" for="' + id + '"> \
				<input ' + checked + ' ' + disabled + ' ' + classname + ' ' + data_attributes + ' id="' + id + '" name="' + name + '" type="checkbox" value="' + value + '" />' + label + ' \
			</label>';
		if(element_only !== true) {
			html += '</div> \
				</div>';
		}
	return html;
};

BootstrapComponent.close_dropmenu = function(obj) {
	obj.closest('.dropdown').removeClass('open');
};

BootstrapComponent.carousel = function(options) {
	var defaults = {
	    id : CommonUtil.unique_id(),
	    images : '',
	    location : ''
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);
	
	if(typeof $(opts.location) === 'object' && $(opts.location).length > 0) {
		var html = '\
			<div id="' + opts.id + '" class="carousel slide" data-ride="carousel"> \
				<ol class="carousel-indicators">';
					
					for(var i = 0; i < opts.images.length; i++) {
						var active = i == 0 ? 'active' : '';
						html += '<li data-target="#' + opts.id + '" data-slide-to="' + i + '" class="' + active + '"></li>';
					}

				html += '</ol> \
				<div class="carousel-inner" role="listbox">';
					
					for(var i = 0; i < opts.images.length; i++) {
						var active = i == 0 ? 'active' : '';
						html += '<div class="item ' + active + '"> \
							<img src="' + opts.images[i].image + '" alt="...">  \
							<div class="carousel-caption">' + opts.images[i].caption + '</div> \
						</div>';
					}
				
				html += '</div> \
				<a class="left carousel-control" href="#' + opts.id + '" role="button" data-slide="prev"> \
					<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> <span class="sr-only">' + CommonUtil.get_locale_text('previous') + '</span> \
				</a> \
				<a class="right carousel-control" href="#' + opts.id + '" role="button" data-slide="next"> \
					<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">' + CommonUtil.get_locale_text('next') + '</span> \
				</a> \
			</div>';
		$(opts.location).html(html);
	}
};

BootstrapComponent.modal_overlay = function(options) {
	var defaults = {
		ajax_content : '',
		buttons : '',
		content : '',
		id : CommonUtil.unique_id() + '-overlay',
		title : ''
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);

	if(typeof opts.ajax_callback === 'string' && opts.ajax_callback.length > 0) {
		var callback = typeof opts.ajax_callback === 'string' ? opts.ajax_callback : '';
		var callback_args = typeof opts.ajax_args === 'object' ? opts.ajax_args : [];
		var callback_function = typeof opts.ajax_context === 'object' ? opts.ajax_context[callback] : window[callback];
		var callback_context = typeof opts.ajax_context === 'object' ? opts.ajax_context : this;
	}

	var html = '<div class="modal-overlay" id="' + opts.id + '">';
		if (opts.title != '') {
			html += '<div class="clearfix modal-overlay-header"><h3>' + opts.title + '</h3></div>';
		}
		html += '<div class="modal-overlay-content"></div>';
		if (opts.buttons != '') {
			html += '<div class="clearfix modal-overlay-footer">' + opts.buttons + '</div>';
		}
		html += '</div>';
	$('.modal:visible:last').find('.modal-content').append(html);

	var mh = $('.modal:visible').find('.modal-content').outerHeight(true);
	var moh = $('#' + opts.id).find('.modal-overlay-header').outerHeight(true);
	var mof = $('#' + opts.id).find('.modal-overlay-footer').outerHeight(true);
	var moc = mh - moh - mof;
	$('#' + opts.id).find('.modal-overlay-content').css('height', moc).css('max-height', moc);

	if(opts.ajax_content != '') {
		var jqxhr = $.ajax({
			type : 'GET',
			url : opts.ajax_content,
			dataType : 'html'
		})
			.done(function(result) {
				$('#' + opts.id).find('.modal-overlay-content').html(result);

				if(typeof callback_function === 'function') {
					callback_function.apply(callback_context, callback_args);
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {

			});
	}
};

BootstrapComponent.modal_overlay_close = function(obj) {
	if(typeof obj === 'object' && obj.length > 0) {
		var modal_overlay = obj.closest('.modal-overlay');

		if(modal_overlay.length > 0) {
			modal_overlay.remove();
		}
	} else {
		$('.modal:visible').find('.modal-overlay').remove();
	}
};