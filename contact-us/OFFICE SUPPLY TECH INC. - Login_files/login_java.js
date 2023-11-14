//part1

var hh = 0;
var sh = 0;
var mh = 0;

$(document).ready(function() {
	$('#credential_0').focus();
	hh = $('#header').outerHeight();
	sh = $('#sidemenu').outerHeight();
	mh = sh + hh;
	
	$(document).on('click', '#login-btn', function() {
		check_login();
	});
	
	$(document).on('click', '#login-tab-bar a', function() {
		handle_login_tabbar_click($(this));
	});
	
	$(document).on('click', '#login-support-link', function() {
		show_login_support_info();
	});
	
	$(document).on('click', '.close-modal', function() {
		BootstrapComponent.close_modals();
	});

	$(document).on('click', '#verify_button', function(e) {
		e.preventDefault();
		submit_mfa_verification();
	});
	
	$(document).on('click', '#reset-pw-btn', function(e) {
		e.preventDefault();
		validate_new_password();
	});
	
	$(document).on('click', '#forgot-password-link', function(e) {
		e.preventDefault();
		show_forgot_password();
	});
	
	$(document).on('click', '.new-cust-create-account', function(e) {
		e.preventDefault();
		select_create_account_tab();
	});
	
	$(document).on('click', '#forgotpw-btn', function(e) {
		e.preventDefault();
		forgot_password();
	});
	
	$(document).on('click', '#cancel-login-link', function(e) {
		e.preventDefault();
		show_login();
	});

    $(document).on('click', '#reset-pw-cancel-btn', function(e){
		if (parent.history.length > 1){
			parent.history.back();  return false;
		} else {
			e.preventDefault();
			CommonUtil.redirect(globals.baseUrl + "/return");
		}
    });
	
	$(document).on('click', '#accounting-btn', function(e) {
		e.preventDefault();
		check_acc_login();
	});
	
	$(document).on('click', '#signup-btn', function(e) {
		e.preventDefault();
		register();
	});
	
	$('.tab-content input[type="text"], .tab-content input[type="password"]').keydown(function(e) {
		if (e.keyCode == 13) {
			submit_login_form($(this));
		}
	});

	check_if_iframe();
	check_multifactor();
	update_login_styles();

	CommonUtil.check_for_locale_text( [{ callback: 'country_submit', context: window }] );
});

function check_if_iframe() {
	if(top !== self) {
		var wp = window.parent;
		if (wp && wp.postMessage) {
			try {
				wp.postMessage('refreshPage', "*");
			} catch(e) {
				var url = typeof perl_host_prefix === 'string' ? perl_host_prefix : window.location.href;
				top.location.replace(url);
			}
		}
	}
}

function handle_login_tabbar_click(obj) {
	if(!obj.hasClass('dropdown-toggle')) {
		setTimeout(function() {
			obj.removeClass('tabOn');
			$('#login-tab-bar li').removeClass('active');
			$('#login-tab-bar li a').removeClass('tabs');
			$('#login-tab-bar li .tabOn-l').remove();
			$('#login-tab-bar li .tabOn-r').remove();
			obj.closest('li').addClass('active');
		}, 100);
	}
}

function handle_forgot_password_link() {
	setTimeout(function() {
		$('#login-tab-bar li').removeClass('active');
		$('#login-tab-bar li a').removeClass('tabs');
		$('#login-tab-bar li .tabOn-l').remove();
		$('#login-tab-bar li .tabOn-r').remove();
		$('#tab-forgotpassword').closest('li').addClass('active');
	}, 100);
}

function show_login_support_info() {
	$('#emergency-contact-info-modal').remove();
	var modal_content = ' \
		<p> \
			' + CommonUtil.get_locale_text('experiencing_login_difficulties') + ' \
		</p> \
		<p> \
			' + CommonUtil.get_locale_text('phone') + ': +1.866.367.2638 \
		</p> \
		<p> \
			' + CommonUtil.get_locale_text('submit_support_request') + ': <br /><a href="http://channelonline.com/contact-support" target="_blank">http://channelonline.com/contact-support</a> \
		</p> \
		<p style="font-style: italic;"> \
			' + CommonUtil.get_locale_text('after_hours_service_for_emergencies') + ' \
		</p>';

	BootstrapComponent.modal({
		buttons : '<button class="btn btn-primary close-modal">' + CommonUtil.get_locale_text('ok') + '</button>',
		content : modal_content,
		id : 'emergency-contact-info-modal',
		title : CommonUtil.get_locale_text('support')
	});

	BootstrapComponent.open_modal($('#emergency-contact-info-modal'));
}

//MULTIFACTOR
function check_multifactor() {
	var multifactor = $('#multifactor').val();
	
	if(multifactor == 'true') {
		var newUser = $('#new_user').val();
	
		if(newUser == '1') {
			enroll_multifactor();
		} else {
			authenticate_multifactor();
		}
	}
}

function submit_mfa_verification() {
	var backenduserCOL = $('#backenduserCOL').val();
	var javaurl = $('#mfa_javaUrl').val();
	var mfa_userId = $('#mfa_userId').val();
	var mfa_factorId = $('#mfa_factorId').val();
	var mfa_passcode = $('#mfa_passcode').val();
	var destination = $('#destination').val();
	var destination_key = $('#destination_key').val();

	var destination_string = '';
	if(destination.length > 0) {
		destination_string = '&' + destination_key + '=' + destination;
	}
	
	$('#passcode_message').html("");

	var newUser = $('#new_user').val();
	if(newUser == '1') {
		javaurl = javaurl + "/mfaActivate";
	} else {
		javaurl = javaurl + "/mfaVerify";
	}

        var jqxhr = $.ajax({
            type : 'POST',
            url : javaurl,
            data : { backenduserCOL : backenduserCOL,
			mfa_userId : mfa_userId,
			mfa_factorId : mfa_factorId,
			mfa_passcode : mfa_passcode },
            dataType : 'jsonp'
        })  
        .done(function(responseData) {
			if (responseData.success == 1) {
				CommonUtil.redirect(responseData.authorizedUrl + destination_string);
			} else {
				$('#passcode_message').html("<span class='text-info'>" + responseData.message + "</span>");
			}   
        })  
        .fail(function(jqXHR, textStatus, errorThrown) {
		$('#passcode_message').html("<span class='text-info'>" + CommonUtil.get_locale_text('problem_verifying_multifactor_auth') + "</span>");
        }); 
}

function enroll_multifactor() {	
	var email = $('#mfa_username').val();
	var javaurl = $('#mfa_javaUrl').val() + "/enrollMfa";
	var baseUrl = $('#base_url').val();
	var backenduserCOL = $('#backenduserCOL').val();
	var mobilePhone = '';
	var destination = $('#destination').val();
	var destination_key = $('#destination_key').val();

	var destination_string = ''; 
	if(destination.length > 0) {
		destination_string = '&' + destination_key + '=' + destination;
	}

	mobilePhone = prompt( CommonUtil.get_locale_text('enter_mobile_phone') + " \n(XXX-XXX-XXXX)" );


	if(mobilePhone != null) {
        	var jqxhr = $.ajax({
                	type : 'POST',
                	url : javaurl,
                	data : { backenduserCOL : backenduserCOL , 
                        	 mfa_username : email,
				 mobile_phone : mobilePhone },
                	dataType : 'jsonp'
        	}) 
 			.done(function(responseData) {
            	if(responseData.success == 0) {
                	CommonUtil.redirect(baseUrl);
                } else if(responseData.success == 1) {
                	$('#mfa_userId').val(responseData.userId);
                	$('#mfa_factorId').val(responseData.factorId);
					if(typeof responseData.authorizedUrl != "undefined") {
						// autoenrolled multifactor (known mobile phone number)
						CommonUtil.redirect(responseData.authorizedUrl + destination_string);
					}
                }
        	})
        	.fail(function(jqXHR, textStatus, errorThrown) {
            	alert( CommonUtil.get_locale_text('error_sending_multifactor_auth') );
        	});
	} else {
		// redirect back to the login page
		CommonUtil.redirect(baseUrl);
	}
}

function authenticate_multifactor() {
	var email = $('#mfa_username').val();
	var javaurl = $('#mfa_javaUrl').val() + "/twostepauth";
	var backenduserCOL = $('#backenduserCOL').val();
	var destination = $('#destination').val();
	var destination_key = $('#destination_key').val();

	var destination_string = '';
	if(destination.length > 0) {
		destination_string = '&' + destination_key + '=' + destination;
	}

	var jqxhr = $.ajax({
		type : 'POST',
		url : javaurl,
		data : { backenduserCOL : backenduserCOL , 
			 mfa_username : email },
		dataType : 'jsonp'
	})
	.done(function(responseData) {
		if(responseData.success == 0) {
			// no mfa required
			CommonUtil.redirect(responseData.authorizedUrl + destination_string);
		} else if(responseData.success == 1) {
			$('#mfa_userId').val(responseData.userId);
			$('#mfa_factorId').val(responseData.factorId);
		} else {
			// success == -1
			alert( CommonUtil.get_locale_text('error_sending_multifactor_auth') );
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		alert( CommonUtil.get_locale_text('error_sending_multifactor_auth') );
	});
}
//MULTIFACTOR



//part2
function check_email(){
    var username = document.copage.credential_0;
    var pass = document.copage.credential_1;

    if (username && pass){
	if (username.value == ''){
	    username.focus();
	    return false;
	} else if (pass.value == ''){
	    pass.focus();
	    return false;
	} else {
	    check_login();
	}
    }
}

function check_login(){
    var username = document.copage.credential_0;
    var pass = document.copage.credential_1;

    if (username && pass){
        if (username.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_email') );
            username.focus();
            return false;
        } else if (pass.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_password') );
            pass.focus();
            return false;
        } else {
            document.copage.submit();
        }
    }
}

function check_acc_login(){
    var username = document.acctab.accounting_username;
    var pass = document.acctab.accounting_password;

    if (username && pass){
        if (username.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_username') );
            username.focus();
            return false;
        } else if (pass.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_password') );
            pass.focus();
            return false;
        } else {
            document.acctab.submit();
        }
    }
}

function country_submit(){
    if($('#state') && $("#country")){
        var stateEl = $('#state').find('option').remove().end();
        var countryId = $("#country").val();
        if(countryId){
            for(var i = 0; i < countriesStates.length; i++){
                var countryStates = countriesStates[i];
                if(countryStates["key"] == countryId){
                    var states = countryStates["states"];
                    for(var index in states) {
                        if (states.hasOwnProperty(index)) {
                            stateEl.append('<option value="'+index+'">' + states[index] + '</option>')
                        }
                    }
					var options = $("#state option");
					options.detach().sort(function(a,b) {
						if (a.text > b.text) return 1;
						else if (a.text < b.text) return -1;
						else return 0;
					});
					$('#state').empty();
					$('#state').append('<option value="">' + CommonUtil.get_locale_text('select_state') + '</option>');
					$('#state').append(options);
					$('#state').val('');
                }
            }
        }
    }
}

function check_accounting_login(){
    var username = document.copage.accounting_username;
    var pass = document.copage.accounting_password;

    if (username && pass){
        if (username.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_username') );
            username.focus();
            return false;
        } else if (pass.value == ''){
            alert ( CommonUtil.get_locale_text('must_enter_password') );
            pass.focus();
            return false;
        } else {
            document.copage.accounting.value = 1;
            document.copage.submit();
        }
    }
}




function forgot_password()
{
    var username = document.fpasstab.forgotpw_email;
    if (username.value == ''){
        alert ( CommonUtil.get_locale_text('must_enter_email') );
        username.focus();
        return false;
    } else {
        if( $('#forgot_password_message').val() != '' ) {
        	if(confirm( $('#forgot_password_message').val() )) {
        		document.fpasstab.submit();
        	}
        } else {
        	document.fpasstab.submit();
        }
    }
}

function key_press(e){
    if (e.keyCode == 13){
       	check_email();
    }     
}

function nosupport_browser(){
    var msg = CommonUtil.get_locale_text('unsupported_browser');
    
    if( confirm( msg ) ){
	    location = 'http://www.firefox.com/';
    } else {
		alert( CommonUtil.get_locale_text('older_browser_warning') );
    }
}


function email_in_use () {
    alert ( CommonUtil.get_locale_text('email_in_use') );
}

function email_not_valid () {
    alert ( CommonUtil.get_locale_text('validation_email') );
}


function passwords_dont_match () {
    alert ( CommonUtil.get_locale_text('nonmatching_passwords') );
}

function missing_field () {
    alert ( CommonUtil.get_locale_text('complete_required_fields') );
}

function unknown_error() {
    alert ( CommonUtil.get_locale_text('error_occurred') );
}

function register() {
	InputValidation.validate('#satab');
	
	if (InputValidation.valid($("#satab"))) {
		document.satab.submit();
	}
}

function login_focus() {
	var remember_me = document.getElementById('remember_me');
	if (remember_me){
	    if (remember_me.checked == true){
		var pw = document.getElementById('credential_1');
		pw.focus();
	    }
	}
}

function show_login()
{
	$('a[href="#login-tab-content"]').tab('show');
}

function show_signup()
{
    $('li.tab-bar a').removeClass('tabOn').addClass('tabs');
    $('.tabOn-l').remove();
	$('.tabOn-r').remove();
    hide_element(document.getElementById("login_info"));
    show_element(document.getElementById("signup"));
    hide_element(document.getElementById("forgot_password"));
    deselect_tab(document.getElementById("tab-login"));
    select_tab(document.getElementById("tab-signupt"));
    deselect_tab(document.getElementById("tab-forgotpassword"));
    
    $('#tab-signupt').before('<span class="tabOn-l"></span>').after('<span class="tabOn-r"></span>');
	
    $('li.tab-bar a:contains("Login")').removeClass('login');
    $('li.tab-bar a:contains("Forgot")').removeClass('login');
    $('li.tab-bar a:contains("Create")').addClass('login');
}

function show_forgot_password(e)
{
	$('a[href="#forgotpassword-tab-content"]').tab('show');	
}

function select_tab(elem)
{
    if(elem) elem.className = "tabOn";
}

function deselect_tab(elem)
{
    if(elem) elem.className = "tabs";
}

function reset_password() {
    // do nothing, by design
}

function show_accounting()
{
    hide_element(document.getElementById("login_info"));
    hide_element(document.getElementById("forgot_password"));
    show_element(document.getElementById("accounting"));
}

function validate_new_password() {
    if($('#passwordOld').length == 1) {
        if ($('#passwordOld').val() == '' && $('#passwordOld').val() == '') {
            alert(CommonUtil.get_locale_text('please_enter_your_current_password'));
            return false;
        }
    }

	if($('#password1').val() == '' && $('#password2').val() == '') {
		alert( CommonUtil.get_locale_text('password_cannot_be_empty') );
		return false;
	}
	
	if($('#password1').val() != $('#password2').val()) {
		alert( CommonUtil.get_locale_text('nonmatching_passwords') );
		return false;
	}
	
	var mincharRegex = new RegExp('(.{8,})');
	if(!mincharRegex.test( $('#password1').val() )) {
		var msg = CommonUtil.get_locale_text('minimum_characters_required');
		msg = CommonUtil.sprintf(msg, [ '8' ]);
		alert(msg);
		return false;
	}
	
	var uppercaseRegex = new RegExp('([A-Z]{1,})');
	if(!uppercaseRegex.test( $('#password1').val() )) {
		alert( CommonUtil.get_locale_text('uppercase_character_required') );
		return false;
	}
	
	var lowercaseRegex = new RegExp('([a-z]{1,})');
	if(!lowercaseRegex.test( $('#password1').val() )) {
		alert( CommonUtil.get_locale_text('lowercase_character_required') );
		return false;
	}
	
	var numberRegex = new RegExp('([0-9]{1,})');
	if(!numberRegex.test( $('#password1').val() )) {
		alert( CommonUtil.get_locale_text('number_required') );
		return false;
	}
	
	$('#reset-password-form').submit();
}

function select_create_account_tab() {
	$('a[data-toggle="tab"][href="#signup-tab-content"]').trigger('click');
}

function submit_login_form(obj) {
	obj.closest('form').find('.btn-primary').trigger('click');
}

function update_login_styles() {
	
}
