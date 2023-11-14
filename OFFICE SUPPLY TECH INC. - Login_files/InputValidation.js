function InputValidation() {
};

InputValidation.validate = function(selector, options) {
	var defaults = {
	    errorClass : 'error noshow',
	    focusCleanup : true,
	    ignore : '.novalidate',
	    invalidHandler : function(event, validator) {
		    var errors = validator.numberOfInvalids();
		    if (errors) {
		    	CommonUtil.get_locale_text('complete_required_fields', 'alert');
		    }

			$('.selecttomenu-container.error').each(function() {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip_remove($(this));
				}

			    $(this).removeClass('error');
			});
			
			$('.md-skin.error').each(function() {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip_remove($(this));
				}

				$(this).removeClass('error');
			});

		    var error_list = validator.errorList;
		    if (error_list.length > 0) {

			    for ( var i in error_list) {
					var label = '';

					if($(error_list[i].element).closest('.form-group').length > 0) {
						label = $(error_list[i].element).closest('.form-group').find('label:first').not('.error').text();

						if(label == null || label == '') {
							if($(error_list[i].element).is('[data-label]')) {
								label = $(error_list[i].element).attr('data-label');
							}
						}

						label = InputValidation.get_label(label);
					}

			    	if( !$(error_list[i].element).is(':visible') ) {
						if($(error_list[i].element).closest('.selecttomenu-container').length > 0) {
							var select_container = $(error_list[i].element).closest('.selecttomenu-container');
							select_container.addClass('error');
							InputValidation.selecttomenu_tooltip(select_container, error_list[i].message);
						} else if($(error_list[i].element).closest('.md-skin').length > 0) {
							var md_container = $(error_list[i].element).closest('.md-skin');
							md_container.addClass('error');
							InputValidation.mdform_tooltip(md_container, error_list[i].message);
						} else {
							var elem = $(error_list[i].element).closest('.form-group').next('.form-group').find('.controls');
							if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
								BootstrapComponent.tooltip(elem, {
									title: label + error_list[i].message
								});
							}
				    	}
					} else {
						if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
							BootstrapComponent.tooltip($(error_list[i].element), {
								title: label + error_list[i].message
							});
						}
					}

				    $(error_list[i].element).closest('.collapse, .modal-body').addClass('errors');
			    }

			    var t = setTimeout(function() {
					$('.error:visible:first').focus();
					$('input.error[type="checkbox"]').each(function() {
						$(this).closest('label.control-label').css('overflow', 'visible');
					});
					
					if($('.error:visible:first').hasClass('selecttomenu-container')) {
						CommonUtil.scroll_to_obj($('.error:visible:first'));
					} else if($('.error:visible:first').hasClass('md-skin')) {
						CommonUtil.scroll_to_obj($('.error:visible:first'));
					}
			    }, 500);
		    } else {
				$('.collapse, .modal-body').removeClass('errors');
			}
	    },
	    onfocusout : function(element, e) {
		    if($(element).attr('type') == 'text' && $(element).is('[required]')) {
		    	$(element).val( $.trim($(element).val()) );
			}

			if(!$(element).is('[readonly]')) {
				if (InputValidation.valid($(element))) {
					InputValidation.remove_error(element, e);
					$('.collapse, .modal-body').removeClass('errors');
				} else {
					$(element).closest('.collapse, .modal-body').addClass('errors');
				}
			}
	    },
	    onkeyup : function(element, e) {
		    InputValidation.remove_error(element, e);

			if(!$(element).is('[readonly]')) {
				if (InputValidation.valid($(element))) {
					$('.collapse, .modal-body').removeClass('errors');
				} else {
					$(element).closest('.collapse, .modal-body').addClass('errors');
				}
			}
	    },
	    onclick : function(element, e) {
	    	InputValidation.remove_error(element, e);
	    }
	};
	var opts = {};
	opts = $.extend(opts, defaults, options);

	var form = typeof selector == 'object' ? selector : $(selector);
	var fv = form.validate(opts);
	InputValidation.setup(form);
	return fv;
};

InputValidation.remove_error = function(element, e) {
	if($(element).nextAll('label.error').length > 0) {
		$(element).nextAll('label.error').remove();
	}
	
	if($(element).parent().nextAll('label.error').length > 0) {
		$(element).nextAll('label.error').remove();
	}

	if($(element).nextAll('.tooltip').length > 0) {
		if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
			BootstrapComponent.tooltip_remove($(element));
		}
	}

	if($(element).parent().nextAll('.tooltip').length > 0) {
		if($(element).parent().is('select')) {
			$(element).parent().trigger('click');
		} else {
			if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
				BootstrapComponent.tooltip_remove($(element).parent());
			}
		}
	}
};

InputValidation.selecttomenu_tooltip = function(obj, msg) {
	var ts = setInterval(function() {
		if(obj.next('.tooltip').length < 1) {
			clearInterval(ts);
			var label = obj.find('label').length > 0 ? obj.find('label').text() : '';
			label = InputValidation.get_label(label);

			if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip(obj, {
						title: label + msg
					});
				}
			}
		}
	}, 1000);
};

InputValidation.mdform_tooltip = function(obj, msg) {
	var tm = setInterval(function() {
		if(obj.next('.tooltip').length < 1) {
			clearInterval(tm);
			var label = obj.find('label').length > 0 ? obj.find('label').text() : '';
			label = InputValidation.get_label(label);

			if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
				BootstrapComponent.tooltip(obj, {
					title: label + msg
				});
			}
		}
	}, 1000);
};

InputValidation.valid = function(selector) {
	var form = typeof selector == 'object' ? selector : $(selector);
	var is_formcontrol = false;

	if(form.is('input') || form.is('textarea') || form.is('select')) {
		is_formcontrol = true;
	}

	if (form.is('form')) {
		form.find('.tooltip').each(function() {
			$(this).remove();
		});

		form.find('input[type="text"], input[type="password"], input[type="hidden"], textarea').each(function() {
			var val = CommonUtil.xss_clean( $(this).val() );
			$(this).val(val);
		});

		form.find('input, textarea, select').each(function() {
			if($(this).parent().find('.tooltip').length > 0) {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip_remove($(this));
				}
			}
		});
		
		form.find('.controls').each(function() {
			if($(this).next().hasClass('tooltip')) {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip_remove($(this));
				}
			}
		});
		
		return form.valid();
	} else if(is_formcontrol) {
		return form.valid();
	} else {
		var v = form.validate();
		var is_valid = true;

		form.find('.tooltip').each(function() {
			$(this).remove();
		});

		form.find('input, textarea, select').each(function() {
			$(this).removeClass('invalid-input');
			
			if($(this).parent().find('.tooltip').length > 0) {
				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip_remove($(this));
				}
			}

			try {
				var iv = v.element('#' + $(this).attr('id'));
	
				if(iv == false) {
					is_valid = false;
					var msg = $(this).closest('.controls').find('label.error').text();

					if($(this).closest('.modal').length > 0) {
						$(this).addClass('invalid-input');

					}

					$(this).closest('.controls').find('label.error').remove();

					if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
						BootstrapComponent.tooltip($(this), {
							title: msg
						});
					}
				}
			} catch(e) {
				
			}
		});

		return is_valid;
	}
}

InputValidation.element_valid = function(validator, id) {
	if($(id).parent().find('.tooltip').length > 0) {
		if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
			BootstrapComponent.tooltip_remove($(id));
		}
		$(id).nextAll('label.error').remove();
	}
	
	if(!$(id).hasClass('novalidate')) {
		if(typeof validator != null) {
			if(!validator.element(id)) {
				var error = $(id).next('label').text();

				if(typeof globals.is508Compliant === 'boolean' && globals.is508Compliant == false) {
					BootstrapComponent.tooltip($(id), {
						title: error
					});
				}
				
				return false;
			}
		}
	}
	
	return true;
}

InputValidation.setup = function(form) {
	var f = typeof form == 'object' ? form : $(form);

	f.find('input, textarea').each(function() {
		var text_type = $(this).is('[data-texttype]') ? $(this).attr('data-texttype').toLowerCase() : 'string';
		if (text_type==='currency'){
			text_type='number';
		}

		switch (text_type) {
			case 'date':
				InputValidation.add_date($(this));
				break;

			case 'email':
				InputValidation.add_email($(this));
				break;

			case 'multiemail':
				InputValidation.add_multiemail($(this));
				break;

			case 'number':
				InputValidation.add_number($(this));
				break;

			case 'digits':
				InputValidation.add_digits($(this));
				break;

			case 'regexp':
				InputValidation.add_regex($(this));
				break;

			case 'string':
				InputValidation.add_string($(this));
				break;

			case 'time':
				InputValidation.add_time($(this));
				break;
		}
	});

	$.validator.addMethod("pattern", function(value, element, param) {
		if (this.optional(element)) {
			return true;
		}
		
		try {
			if (typeof param === "string") {
				if(!(param.startsWith('/') && param.endsWith('/'))) {
					param = '/' + param + '/';
				}
				
				param = new RegExp(eval(param));
			}
			return param.test(value);
		} catch(e) {
			
		}
	}, 'Please enter a valid format.');
	
	$.validator.addMethod("customDate", function(value, element) {
		if (this.optional(element)) {
			return true;
		}

		var regex = globals.dateFormat == "mm/dd/yy" ? /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ : /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
		var format_valid = regex.test(value);

		if(format_valid) {
			var max_date = $(element).is('[data-maxdate]') ? $(element).attr('data-maxdate') : '';
			var min_date = $(element).is('[data-mindate]') ? $(element).attr('data-mindate') : '';
			var date_value = CommonUtil.get_date_obj(value);

			if(max_date != '') {
				var maxdate_value = CommonUtil.get_date_obj(max_date);
				
				if(date_value.getTime() > maxdate_value.getTime()) {
					return false;
				}
			}
			
			if(min_date != '') {
				var mindate_value = CommonUtil.get_date_obj(min_date);
				if( Number(date_value.getTime()) < Number(mindate_value.getTime()) ) {
					return false;
				}
			}
			
			return true;
		} else {
			return false;
		}
	}, 'Please enter a valid date.');
};

InputValidation.add_date = function(obj) {
	obj.rules('add', {
	    customDate : true,
	    messages : {
		    date : InputValidation.get_message('date', obj)
	    }
	});

	var opts = { 
		format: globals.dateFormat,
		onSelect: function() {
			var t = setTimeout(function() {
				obj.trigger('focusout');
				obj.trigger('change');
				$.event.trigger({type : 'datepickerDateSelected'});
			}, 500);
		}
	};
	var max_date = $(obj).is('[data-maxdate]') ? $(obj).attr('data-maxdate') : '';
	var min_date = $(obj).is('[data-mindate]') ? $(obj).attr('data-mindate') : '';

	if(max_date != '') {
		opts.maxDate = CommonUtil.get_date_obj(max_date);
	}
	
	if(min_date != '') {
		opts.minDate = CommonUtil.get_date_obj(min_date);
	}

	obj.datepicker(opts);
	obj.attr('autocomplete', 'off');
};

InputValidation.add_email = function(obj) {
	obj.rules('add', {
	    email : true,
	    messages : {
		    email : InputValidation.get_message('email', obj)
	    }
	});

	InputValidation.add_minmax(obj);
};

InputValidation.add_multiemail = function(obj) {
	obj.rules('add', {
	    multiemail : true,
	    messages : {
		    multiemail : InputValidation.get_message('email', obj)
	    }
	});

	InputValidation.add_minmax(obj);
};

InputValidation.add_minmax = function(obj) {
	if (obj.is('[data-maxlength]')) {
		obj.rules('add', {
		    maxlength : obj.attr('data-maxlength'),
		    messages : {
			    maxlength : InputValidation.get_message('maxlength', obj)
		    }
		});
	}

	if (obj.is('[data-minlength]')) {
		obj.rules('add', {
		    minlength : obj.attr('data-minlength'),
		    messages : {
			    minlength : InputValidation.get_message('minlength', obj)
		    }
		});
	}

	if (obj.is('[max]')) {
		obj.rules('add', {
			required: true,
			messages : {
				max : 'Invalid Number'
			}
		});
	}

	if (obj.is('[min]')) {
		obj.rules('add', {
			messages : {
				min : 'Invalid Number'
			}
		});
	}
};

InputValidation.add_number = function(obj) {
	obj.rules('add', {
	    number : true,
	    messages : {
		    number : InputValidation.get_message('number', obj)
	    }
	});

	InputValidation.add_minmax(obj);
};

InputValidation.add_regex = function(obj) {
	if (obj.is('[data-expression]')) {
		var regex = decodeURIComponent(obj.attr('data-expression'));
		regex = regex.replace(/&quot;/g, '"').replace(/&apos;/g, "'");

		obj.rules('add', {
		    pattern : regex,
		    messages : {
			    pattern : InputValidation.get_message('pattern', obj)
		    }
		});
	}
};

InputValidation.add_string = function(obj) {
	InputValidation.add_minmax(obj);
};

InputValidation.add_time = function(obj) {
	obj.rules('add', {
	    docTime : true,
	    messages : {
		    docTime : InputValidation.get_message('time', obj)
	    }
	});
};

InputValidation.add_digits = function(obj) {
	obj.rules('add', {
	    digits : true,
	    messages : {
		    digits : InputValidation.get_message('digits', obj)
	    }
	});

	InputValidation.add_minmax(obj);
};

InputValidation.get_message = function(type, obj) {
	var msg = '';

	switch (type) {
		case 'date':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_date'] === 'string' ? locale_text['validation_date'] : 'Date format invalid';
			break;

		case 'email':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_email'] === 'string' ? locale_text['validation_email'] : 'Email format invalid';
			break;

		case 'maxlength':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_maxlength'] === 'string' && typeof locale_text['characters'] === 'string' ? locale_text['validation_maxlength'] + ' ' + obj.attr('data-maxlength') + ' ' + locale_text['characters'] : 'Maximum length ' + obj.attr('data-maxlength') + ' characters';
			break;

		case 'minlength':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_minlength'] === 'string' && typeof locale_text['characters'] === 'string' ? locale_text['validation_minlength'] + ' ' + obj.attr('data-minlength') + ' ' + locale_text['characters'] : 'Minimum length ' + obj.attr('data-minlength') + ' characters';
			break;

		case 'number':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_number'] === 'string' ? locale_text['validation_number'] : 'Number invalid';
			break;

		case 'digits':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_digits'] === 'string' ? locale_text['validation_digits'] : 'Number invalid, fractions are not allowed';
			break;

		case 'pattern':
			msg = typeof locale_text === 'object' && typeof locale_text['validation_pattern'] === 'string' ? locale_text['validation_pattern'] : 'Input invalid';
			break;

		case 'time':
			if (globals.is24HourClock === "true"){
				msg = typeof locale_text === 'object' && typeof locale_text['validation_time_twenty_four'] === 'string' ? locale_text['validation_time_twenty_four'] : 'Time format is HH:mm';
			} else {
				msg = typeof locale_text === 'object' && typeof locale_text['validation_time'] === 'string' ? locale_text['validation_time'] : 'Time format is hh:mm AM|PM';
			}

			break;

		default:
			msg = typeof locale_text === 'object' && typeof locale_text['validation_input_invalid'] === 'string' ? locale_text['validation_input_invalid'] : 'Input invalid';
			break;
	}

	msg = obj.is('[data-errormessage]') ? obj.attr('data-errormessage') : msg;

	return msg;
};

InputValidation.get_label = function(text) {
	var label = '';

	if(text != null && text != undefined && text != '') {
		label = text;
		label = CommonUtil.strip_tabs(label);
		label = CommonUtil.remove_line_breaks(label);
		label = label.replace(/  +/g, ' ');
		label = $.trim(label);
		label = label != '' ? label + ': ' : '';
	}

	return label;
};
