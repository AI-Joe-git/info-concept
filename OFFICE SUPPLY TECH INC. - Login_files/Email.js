function Email(options) {
	var _this = this;
	var send_email_form = '#send-email-form';
	var send_message_html = '#editor_message';
	var send_message_text = '#editor_text_message';
	var show_email_preview = '#send_item_modal';
	var opts = {};

	var defaults = {
		always_use_tpl_addresses : false,
		attach_format_class : '.attach-format',
		content_url : '',
		email_key : '',
		get_email_tpl_done_cb : '',
		get_email_tpl_done_cb_context : '',
		get_email_tpl_params_cb : '',
		get_email_tpl_params_cb_context : '',
		loader_container : '.modal-content',
		loaderdiv : '.ajax-content',
		modal_title : '',
		preview_loaded_cb : '',
		preview_loaded_cb_context : '',
		rte_marginbtm : 40,
		send_confirm : '#send-item-btn',
		send_mail_type : 'mailType',
		send_mail_type_class : '.mail_type',
		send_params_cb : '',
		send_params_cb_context : '',
	};
	opts = $.extend(opts, defaults, options);

	this.init = function() {
		_this.update_vars();
		
		$(document).on('change', show_email_preview + ' ' + opts.send_mail_type_class, function() {
			_this.toggle_send_message(true);
		});	

		$(document).on('click', show_email_preview + ' ' + opts.send_confirm, function() {
			if(InputValidation.valid(send_email_form)) {
				CommonUtil.check_logged_in('send', [], _this);
			}
		});

		$(document).on('click', '#include-attachment', function() {
			var t = setTimeout(function() {
				_this.handle_include_attachment_change();
			}, 500);
		});

		$(document).on('CKEditorInstanceComplete', _this.done_editor_handler);
	}
	
	this.update_vars = function() {
		send_email_form = send_email_form + '_' + opts.email_key;
		send_message_html = send_message_html + '_' + opts.email_key;
		send_message_text = send_message_text + '_' + opts.email_key;
		show_email_preview = show_email_preview + '_' + opts.email_key;
	};
	
	
	/* GETTERS and SETTERS and CALLBACKS */
	this.get_email_template = function() {		
		$.ajax({
			type : 'GET',
			url : globals.baseUrl + '/Email/getEmailTemplate',
			dataType : 'json',
			data : _this.get_email_template_params(),
			success : function(response) {				
				CommonUtil.page_wait_loader(opts.loader_container, 'remove');

				var to = response.to;
				var replyTo = response.replyTo;
				var cc = response.cc;
				var bcc = response.bcc;

				if(!opts.always_use_tpl_addresses) {
					if(!globals.useMailToButtonComplete) {
						to = globals.userEmail;
						replyTo = globals.userEmail;
						cc = "";
						bcc = "";
					}
				}

				$(send_email_form + ' #mailTo').val(to);
				$(send_email_form + ' #from').val(response.from);
				$(send_email_form + ' #replyTo').val(replyTo);
				$(send_email_form + ' #subject').val(response.subject);
				$(send_email_form + ' #cc').val(cc);
				$(send_email_form + ' #bcc').val(bcc);
				$(send_email_form + ' ' + send_message_html).val(response.body);
				$(send_email_form + ' ' + send_message_text).val(CommonUtil.br2nl(response.body));
				rte.update_editor_content(send_message_html.replace('#', ''), response.body);
				
				if(typeof opts.get_email_tpl_done_cb === 'string' && opts.get_email_tpl_done_cb.length > 0) {
					var cb_args = [];
					var cb_context = typeof opts.get_email_tpl_done_cb_context === 'object' ? opts.get_email_tpl_done_cb_context : window;
					var cb_function = cb_context[opts.get_email_tpl_done_cb];

					if(typeof cb_function === 'function') {
						cb_function.apply(cb_context, cb_args);
					}
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				CommonUtil.page_wait_loader(opts.loader_container, 'remove');
			}
		});
	};
	
	this.get_email_template_params = function() {
		var attach_type = $('input[name="attachType"]:checked').val() != '' ? $('input[name="attachType"]:checked').val() : 'pdf';

		if($('#include-attachment').length > 0) {
			if(!$('#include-attachment').prop('checked')) {
				attach_type = $('input[name="noAttachmentType"]').val();
			}
		}

		if (attach_type == undefined && $('#attachmentNeeded').length > 0){
			var attachmentNeededChecked = $('#attachmentNeeded').prop("checked");
			if (attachmentNeededChecked){
				attach_type = "pdf";
			}
		}

		var data = 'attachType=' + attach_type + '&emailKey=' + opts.email_key;
		
		if(typeof opts.get_email_tpl_params_cb === 'string' && opts.get_email_tpl_params_cb.length > 0) {
			var cb_args = [];
			var cb_context = typeof opts.get_email_tpl_params_cb_context === 'object' ? opts.get_email_tpl_params_cb_context : window;
			var cb_function = cb_context[opts.get_email_tpl_params_cb];

			if(typeof cb_function === 'function') {
				data += cb_function.apply(cb_context, cb_args);
			}
		}
		
		return data;
	};
	
	this.get_preview_content = function() {
		return opts.content_url != '' ? opts.content_url : globals.baseUrl + '/Email/showPreview?&emailKey=' + opts.email_key;
	};
	
	this.get_send_url = function() {
		var url = globals.baseUrl + '/Email/send?email_key=' + opts.email_key;
		
		if(typeof opts.send_params_cb === 'string' && opts.send_params_cb.length > 0) {
			var cb_args = [];
			var cb_context = typeof opts.send_params_cb_context === 'object' ? opts.send_params_cb_context : window;
			var cb_function = cb_context[opts.send_params_cb];

			if(typeof cb_function === 'function') {
				url += cb_function.apply(cb_context, cb_args);
			}
		}
		
		return url;
	};
	
	this.get_title = function() {
		if(opts.modal_title != '') {
			return opts.modal_title;
		} else {
			return 'Email';
		}
	};

	this.preview_loaded_callback = function() {
		if(typeof opts.preview_loaded_cb === 'string' && opts.preview_loaded_cb.length > 0) {
			var cb_args = [];
			var cb_context = typeof opts.preview_loaded_cb_context === 'object' ? opts.preview_loaded_cb_context : window;
			var cb_function = cb_context[opts.preview_loaded_cb];

			if(typeof cb_function === 'function') {
				cb_function.apply(cb_context, cb_args);
			}
		}
	};
	
	
	/* SHOW EMAILER */
	this.fill_template = function() {			
		_this.toggle_send_message(false);
		CommonUtil.page_wait_loader(opts.loader_container);
		CommonUtil.get_script('texteditor', function() {
			rte = new RichTextEditor();
			rte.init();
			rte.replace_text_area({textarea_id:send_message_html.replace('#', ''), config:{toolbar:'Basic',resize_enabled:false,removePlugins:'elementspath'}});
			CommonUtil.check_logged_in('get_email_template', [], _this);
		});		
		_this.validate_send();
		_this.preview_loaded_callback();
	};
	
	this.show_preview = function() {	
		$('.modal[id^="send_item_modal_"]').each(function() {
			$(this).remove();
		});

		BootstrapComponent.modal({
			added_class : 'large',
			ajax_content : _this.get_preview_content(),
			buttons : '<div class="actions-left"><button class="btn btn-primary" id="' + opts.send_confirm.replace('#', '') + '" type="button">' + CommonUtil.get_locale_text('activity_event_action_send') + '</button></div> <div class="actions-right"><button class="btn btn-danger close-modal">' + CommonUtil.get_locale_text('cancel') + '</button></div>',
			content : '<p class="loading"></p>',
			id : show_email_preview.replace('#', ''),
			title : _this.get_title()
		});
		BootstrapComponent.open_modal($(show_email_preview), { ajax_callback: 'fill_template', ajax_context: _this });	
	};
	
	/* TYPE and ATTACHMENT FORMAT */
	this.handle_include_attachment_change = function() {
		if(confirm( CommonUtil.get_locale_text('confirm_choose_different_format') )) {
			_this.handle_format_change();
		} else {
			if($('#include-attachment').prop('checked')) {
				$('#include-attachment').prop('checked', false);
			} else {
				$('#include-attachment').prop('checked', true);
			}
		}
	};

	this.handle_format_change = function(){
		CommonUtil.page_wait_loader(opts.loader_container);
		CommonUtil.check_logged_in('get_email_template', [], _this);
	}
	
	this.toggle_send_message = function(convert) {
		var mail_type = $(send_email_form).find('input[name="' + opts.send_mail_type + '"]:checked').val();

		if(mail_type == 'text') {
			if(convert === true) {
				var editortext = rte.get_editor_content(send_message_html.replace('#', ''));
				editortext = CommonUtil.html_to_text(editortext);
				$(send_message_text).val(editortext);
			}
			$(send_message_text).closest('.form-group').show();
			$(send_message_html).closest('.form-group').hide();
		} else {
			if(convert === true) {
				var editortext = $(send_message_text).val();
				editortext = CommonUtil.text_to_html(editortext);
				rte.update_editor_content(send_message_html.replace('#', ''), editortext);
			}
			$(send_message_text).closest('.form-group').hide();
			$(send_message_html).closest('.form-group').show();
		}
	};
	
	
	/* SEND */
	this.send = function() {			
		var ok = _this.validate_body_not_empty();
		if (ok!=1) return;
		
		CommonUtil.page_wait_loader(opts.loader_container);

		$(send_email_form).ajaxSubmit({			
			url : _this.get_send_url(),
			dataType : 'json',
			success : function(response) {				
				CommonUtil.page_wait_loader(opts.loader_container, 'remove');
				if(response.success == 1) {					
					BootstrapComponent.close_modal($(show_email_preview));	
					alert ( CommonUtil.get_locale_text('email_sent') );
					return location.reload(true);
				} else {
					alert( CommonUtil.get_locale_text('error_sending_email') );
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				CommonUtil.page_wait_loader(opts.loader_container, 'remove');
				alert( CommonUtil.get_locale_text('error_sending_email') );
			}
		});
	};
	
	this.validate_body_not_empty = function(){
		var mail_type = $(send_email_form).find('input[name="' + opts.send_mail_type + '"]:checked').val();
		var text = '';
		if(mail_type == 'text') {
			text = $(send_message_text).val();
		} else {
			text = $(send_message_html).val();			
		}

		if (text.trim().length < 1){
			alert ( CommonUtil.get_locale_text('empty_body_not_allowed') );
			return 0;
		}
		return 1;
	};
	
	
	/* TEXT EDITOR */
	this.validate_send = function() {		
		InputValidation.validate(send_email_form);	
	};
	
	this.done_editor_handler = function() {		
		var t = setTimeout(function() {
			_this.adjust_rte();
		}, 1000);
	};
	
	this.adjust_rte = function() {
		var modal_content_height = $(show_email_preview).find('.modal-body').outerHeight();
		var total_height = 0;
		$(send_email_form).find('.calc-row').each(function() {
			total_height += Number( $(this).outerHeight(true) );
		});
		var message_cke_top = Number( $(send_email_form).find('.cke_top').outerHeight(true) );
		var message_editor_height = modal_content_height - total_height - message_cke_top - opts.rte_marginbtm;
		var message_text_editor_height = modal_content_height - total_height - opts.rte_marginbtm;
		$(send_email_form).find('.cke_contents').css('height', message_editor_height);
		$(send_email_form).find(send_message_text).css('height', message_text_editor_height);
	};
}
