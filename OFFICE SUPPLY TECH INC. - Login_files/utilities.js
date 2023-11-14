function zeropad(num, decimals)
{
  if (num > 0)
      var digits = Math.ceil(Math.LOG10E * Math.log(num) + 0.000000001);
  else
      var digits = 1;
  var padding = decimals - digits;
  var return_string = "";
  for (ii = 0; ii < padding; ii++)
      return_string += "0";

  return_string += num.toString();
  return return_string;
}

function to_string_w_decimal(num, decimals)
{
  if (num > 1000000000000000000000)
    return 'Infinity';
  if (num == 'N/A')
    return 'N/A';

  var sign = 1;
  number = num;
  if (number < 0)
  {
    sign = -1;
    number = -number;
  }

  var power = Math.pow(10, decimals);
  var nearest = Math.round(number*power);
  var ordinate = Math.floor(nearest / power);
  var fraction = nearest % power;

  var billions = Math.floor(ordinate / 1000000000);
  ordinate = ordinate - billions*1000000000;
  var millions = Math.floor(ordinate / 1000000);
  ordinate = ordinate - millions*1000000;
  var thousands = Math.floor(ordinate / 1000);
  ordinate = ordinate - thousands*1000;
  var ones = ordinate;

  var ordinate_string = "";
  if (sign == -1)
    ordinate_string = "-";

  if (billions > 0)
    ordinate_string += billions.toString() + "," + zeropad(millions, 3) + "," +
	zeropad(thousands, 3) + "," + zeropad(ones, 3);
  else if (millions > 0)
    ordinate_string += millions.toString() + "," +
	zeropad(thousands, 3) + "," + zeropad(ones, 3);
  else if (thousands > 0)
    ordinate_string += thousands.toString() + "," + zeropad(ones, 3);
  else
    ordinate_string += ones.toString();

  var fractional_digits = "";
  if (decimals > 0)
      fractional_digits = "." + zeropad(fraction, decimals);

  return ordinate_string + fractional_digits;
}

function format_price(num)
{
  var price = to_string_w_decimal(strip_to_number_na(num), 2);
  if (price == 'Infinity' || price == 'N/A')
    return price;
  return market_currency_prefix + price;
}

function strip_to_number(val, decimals)
{
  var value = new String(val);
  var tmpval = value.replace(/[^0-9\.\-]/g, "");
  var sign = "";
  if (tmpval.charAt(0) == "-")
      sign = "-";

  tmpval = tmpval.replace(/\-/g, "");
  if (tmpval.length == 0)
      return 0;
  var dot = tmpval.indexOf(".");
  if (dot >= 0)
  {
    var ordinate = tmpval.substring(0, dot);
    var fraction = tmpval.substring(dot+1, tmpval.length);
    fraction = fraction.replace(/[^0-9]/g, "");
    if (decimals != null && decimals >= 0)
	fraction = fraction.substr(0, decimals);
    var retval = ordinate;
    if (fraction.length > 0)
	retval = ordinate + "." + fraction;
    if (retval.length == 0)
	return 0;
  }
  else
      var retval = tmpval;

  return new Number(sign + retval);
}

function strip_to_positive_number(val)
{
  if (typeof val == 'number' && val > 0)
      return val;
  if (typeof val == 'object' && getObjectClass(val) == 'Number' && val > 0)
      return val;
  
  var value = new String(val);
  var tmpval = value.replace(/[^0-9\.]/g, "");
  if (tmpval.length == 0)
      return 0;

  var dot = tmpval.indexOf(".");
  if (dot >= 0)
  {
    var ordinate = tmpval.substring(0, dot);
    var fraction = tmpval.substring(dot+1, tmpval.length);
    var fraction = fraction.replace(/[^0-9]/g, "");
    var retval = ordinate;
    if (fraction.length > 0)
	retval = ordinate + "." + fraction;
  }
  else
      var retval = tmpval;

  if (retval.length == 0)
      return 0;
  return new Number(retval);
}

function strip_to_integer(val)
{
  var value = new String(val);
  //strip everything after the .
  var retval = value.replace(/\..*/g, "");
  retval = retval.replace(/[^0-9\-]/g, "");
  var sign = "";
  if (retval.charAt(0) == "-")
      sign = "-";
  retval = retval.replace(/\-/g, "");
  if (retval.length == 0)
      return 0;
  return new Number(sign + retval);
}

function strip_to_positive_integer(val)
{
  var value = new String(val);
  var retval = value.replace(/[^0-9]/g, "");
  if (retval.length == 0)
      return 0;
  return new Number(retval);
}

function strip_to_number_na(value, decimals)
{
  if (value == 'N/A' || value == 'n/a' || value == 'NA' || value == 'na')
      return 'N/A';
  return strip_to_number(value, decimals);
}

function strip_to_positive_number_na(value)
{
  if (value == 'N/A' || value == 'n/a' || value == 'NA' || value == 'na')
      return 'N/A';
  return strip_to_positive_number(value);
}

function strip_to_integer_na(value)
{
  if (value == 'N/A' || value == 'n/a' || value == 'NA' || value == 'na')
      return 'N/A';
  return strip_to_integer(value);
}

function strip_to_positive_integer_na(value)
{
  if (value == 'N/A' || value == 'n/a' || value == 'NA' || value == 'na')
      return 'N/A';
  return strip_to_positive_integer(value);
}

function strip_to_alphanum(val)
{
  var value = new String(val);
  var retval = value.replace(/[^0-9A-Za-z]/g, "");
  return retval;
}

function force_onchange(e){
	var key = e.keyCode;
	var widget;

	if (key == 13){
	    widget = getEventTarget(e);
	    widget.onchange();
	}
}

function inspect(elm){
  var str = "";
  var count = 0;
  for (var i in elm){
    count++;
    str += i + ": " + elm.getAttribute(i) + "\n";
    if ((count % 30) == 0)
    {
      alert(str);
      str = "";
    }
  }
  alert(str);
}


function strip_item_to_number(elem){
    if (elem.value == "")
	return;
    elem.value = to_string_w_decimal(strip_to_number(elem.value), 2);
} 

// this is frpm a javascript event handler 
function strip_elem_to_number(e){
    var elem = getEventTarget(e);
    strip_item_to_number(elem);
}

function strip_elem_to_percent(e){
    var elem = getEventTarget(e);
    strip_item_to_number(elem);
    var elemval = elem.value;
    if(elemval > 100) {
      elem.value = "100.00";
    }
}

// this is frpm a javascript event handler 
function strip_elem_to_integer(e){
    var elem = getEventTarget(e);
    strip_item_to_integer(elem);
}

function strip_elem_to_positive_integer_including_blanks(e)
{
  var elem = getEventTarget(e);
  elem.value = strip_to_positive_integer(elem.value);
}



function strip_item_to_integer(elem){
    if (elem.value != "")
	elem.value = strip_to_integer(elem.value);
} 

function default_to_zero(elem){
    if(elem.value == "")
	elem.value = '0';
}

function def_to_zero(e){
  elem = getEventTarget(e);
    if(elem.value == "" || elem.value == 0)
        elem.value = '0.00';
}


function strip_non_numeric(elem){
    elem.value = elem.value.replace(/[^0-9\.\-]/g, "");
    return elem.value;
}

function check_non_blank(elem){
  if(is_nonblank_value(elem.value)) {
	return 1;
  } else {
	return 0;
    }  
}

function is_nonblank_value(val) {
  if(val.match(/\w/)) {
	return true;
  } else {
	return false;
    }  
}

// This is a quick hack, should be optimized...
function is_integer(val)
{
  var strip = strip_to_integer(val);
  if (val != strip)
    return 0;
  return 1;
}

function is_number(val)
{
  var strip = strip_to_number(val);
  if (val != strip)
    return 0;
  return 1;
}

function is_positive_integer(val)
{
  var strip = strip_to_positive_integer(val);
  if (val != strip)
    return 0;
  return 1;
}

function is_positive_number(val)
{
  var strip = strip_to_positive_number(val);
  if (val != strip)
    return 0;
  return 1;
}

function price_add(val1, val2)
{
  var strip1 = strip_to_number_na(val1);
  var strip2 = strip_to_number_na(val2);
  if (strip1 == 'N/A' || strip2 == 'N/A')
      return 'N/A';
  var result = new Number(strip1);
  result += new Number(strip2);
  return result;
}

function price_mult(val1, val2)
{
  var strip1 = strip_to_number_na(val1);
  var strip2 = strip_to_number_na(val2);
  if (strip1 == 'N/A' || strip2 == 'N/A')
      return 'N/A';
  return strip1 * strip2;
}

function price_div(val1, val2)
{
  var strip1 = strip_to_number_na(val1);
  var strip2 = strip_to_number_na(val2);
  if (strip1 == 'N/A' || strip2 == 'N/A')
      return 'N/A';
  return strip1 / strip2;
}

function textarea_escape(text)
{
  var tmpval1 = text.replace(/</g, "&lt;");
  var tmpval2 = tmpval1.replace(/>/g, "&gt;");
  return tmpval2;
}

function notes_escape(text)
{
  var tmpval1 = textarea_escape(text);
  tmpval1 = tmpval1.replace(/\n/g, "<br/>");
  return tmpval1;
}

function strip_to_one_word(e)
{
  var elem = getEventTarget(e);
  var reg = /[^a-zA-Z0-9_]/g;
  var word = elem.value;
  word = word.replace(reg,"");
  elem.value = word;
}


function dropdown_group_reorder(widget)
{
  var avail; // this is the first available index
  var takenValue = widget.selectedIndex;
  if(takenValue == 0)
    avail = 1;
  else
    avail = 0;
  var max_available = 1;
                                                                                                    
  var matches = widget.id.match(/(\D+)(\d+)$/);
  var elem_prefix = matches[1];
  for (var j=0;j<widget.options.length;j++)
  {
    if(widget.options[j].disabled == true)
      break;
    else
      max_available = widget.options[j].value;
  }
                                                                                                    
  //alert(max_available);
  var visited_list = new Array();
  for (var i=1;i<=max_available;i++)
  {
      visited_list[i] = false;
  }
  for (var i=1;i<=max_available;i++)
  {
    for (var j=1;j<=max_available;j++)
    {
        var elem = document.getElementById(elem_prefix + j);
        // if the elem is what was changed .. then dont need to do anythig
	if(visited_list[j] == true) continue;
	if(elem.options[elem.selectedIndex].value != i && elem.id != widget.id) continue;
        //alert("elem id ->" + elem.id);
        //alert("avail ->" + avail);
        visited_list[j] = true;
        if(elem.id != widget.id) {
            elem.selectedIndex = avail;
           avail++;
          if(avail == takenValue)
            avail++;
        }
	break;
    }
  }
}

//submit the page when enter is typed in a text field
function enter_redirect(e)
{
  var keypressed = e.keyCode;
  if(keypressed == 13)
    redirect();
}

// This function does not handle all cases, but it good enough for now.
// Sometime someone can fix it up if they need it to handle more cases...
function html_escape(str)
{
  return textarea_escape(str);
}

//this function takes 2 ranges and determines if the ranges overlap
//this assumes that f1 < t1 and f2 < t2 ..
//the result will be nasty if the ranges are screwed up
//its up to the caller to determine the ranges passed in are valid
function do_ranges_conflict(f1,t1,f2,t2)
{
  //alert(f1);
  //alert(t1);
  //alert(f2);
  //alert(t2);
  if(f1 >= f2 && f1 <= t2)
    return true;
  if(t1 >= f2 && t1 <= t2)
    return true;
  if(f1 <= f2 && t1 >= t2)
    return true;
  return false;
}

function strip_to_number_00(e)
{
  var elem = getEventTarget(e);
  strip_item_to_integer(elem);
  elem.value = to_string_w_decimal(new Number(elem.value) + 0.00,2);
}

function strip_to_number_01(e)
{
  var elem = getEventTarget(e);
  strip_item_to_integer(elem);
  elem.value = to_string_w_decimal(new Number(elem.value) + 0.01,2);
}

function validate(widget, type, minlength, maxlength)
{
  var value = widget.value;
  if (type == 'Text' && value.length > 0 &&
      (value.length < minlength || value.length > maxlength))
  {
    alert('Invalid data entry.  Please enter text between ' + minlength +
	  ' and ' + maxlength + ' characters.');
    return 0;
  }
  else if (type == 'Number')
  {
    if (value.length < minlength || value.length > maxlength)
    {
      alert('Invalid data entry.  Please enter a number between ' + minlength +
	    ' and ' + maxlength + ' digits.');
      return 0;
    }
    var stripvalue = strip_to_number(value);
    if (stripvalue != value) {
      alert('Invalid number entry.  Non-numeric charaters have been stripped.');
      widget.value = stripvalue;
      value = String(stripvalue);
    }
  }
  else if (type == 'Date' && value.length > 0 && !validate_datestring(value))
  {
   alert('Invalid data entry. Please enter a valid date in MM/DD/YYYY format.');
   return 0;
  }
  return 1;
}

function strip_leading_and_trailing_space(e)
{
	var elem = getEventTarget(e);	
	var text_string = elem.value;
	var match_string=/^\s*(.*?)\s*$/;
	var matches = text_string.match(match_string);
	elem.value = matches[1];
}

function is_valid_email(email)
{
  var pat = /^[\w'\-\.]+@[\w\-\.]+\.[\w\-\.]+$/g;
  if(email.match(pat))
  {
	  return true;
  } else {
    	return false;
		}
}

function get_browser_type()
{
	if(window.event) return "ie";
	return "nonie";
}

//pass in they keyCode from event object to this function
function is_key_numeric(key,hex)
{
    if((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
      return true;
    }
    if(hex) {
        if((key >= 65 && key <= 70)) {
	    return true;
	}
    }
    return false;
}

function strip_character(string,char_to_remove)
{
        var reg = new RegExp(char_to_remove,"ig");
        string = string.replace(reg,"");
        return string;
}

function deselect_first_n_options(dropdown,n,current_option)
{
    //this function deselects the first n options if any of the options below n are chosen 
    //this is specially used on all the reports page where "all" is the first option
    //and choosing any other option will make the 
    if(current_option.index >= n) {
        deselect_0_to_n_options(n);
    } else {
         dropdown.selectedIndex = 0;
      }
}

function deselect_0_to_n_options(dropdown,n)
{
    //this function deselects the first n options if any of the options below n are chosen
    //this is specially used on all the reports page where "all" is the first option
    //and choosing any other option will make the
    for(var i=0;i<n;i++) {
        dropdown.options[i].selected = false;
    }
}


function toggle_high_res_image()
  {
      var image_elem = document.getElementById("chosen_angle");
      if(!image_elem) return;
      var current_class = image_elem.className;
      var new_class = current_class == "high_res_full" ? "high_res_medium" : "high_res_full";
      var title = new_class == "high_res_full" ? "Click for Smaller Image" : "Click for Full Image";
      image_elem.className = new_class;
      image_elem.title = title;
  }

function show_element(elem)
{
    if(elem) elem.className = "";
}

function hide_element(elem)
{
    if(elem) elem.className = "hiddenWidget";
}

function strip_space_characters(e)
{
    var elem = getEventTarget(e);
    elem.value=strip_character(elem.value,"\\s");
}

function strip_item_to_numeric_value(elem)
{
  if (elem.value == "") return;
  var value = strip_non_numeric(elem);
  elem.value = value;
  return elem.value;
}

function check_fields_and_submit()
{
  if(check_required_fields()) {
    if(check_page_specific_fields()) 
      document.copage.submit();
  }
}

/* AJAX FUNCTIONS */
/*
	For loading ajax GET content, not for POST requests
	type : "replace" or "append" target div
*/
function get_content(url, target_div, type)
{
	if(type == 'append') { $('#' + target_div).append('<div id="temp-ajax-content" class="div-loading clearfix"></div>'); }
	else { $('#' + target_div).addClass('div-loading'); }
	
	$.ajax({
		type: "GET",
		url: url,
		success: function(content)
		{
			if(type == 'append') { $('#temp-ajax-content').remove(); $('#' + target_div).append(content); }
			else { $('#' + target_div).removeClass('div-loading'); $('#' + target_div).html(content); }
		}
	});
	
	return false;
}

function strip_element_value_to_number(element,decimals)
{
  element.value = strip_to_number(element.value,decimals);
}

function strip_to_number_fixed(val,decimal_places) {
  var valNumber = get_number_object(val);
  return valNumber.toFixed(decimal_places);
}

function get_number_object(val) {
  var valNumber = strip_to_number(val);
  if(!(valNumber instanceof Number)) {
    valNumber = new Number(0);
  }
  //console.log(valNumber.valueOf());
  return valNumber;
}


function get_random_string(length,elem)
{
  if(!length) length = 15;
  var link = url_base.value + 'ajax/util.epl';
  $.getJSON(link, {
    errand: "random_string",
    length: length
  },
  function(obj) {
      elem.val(obj.code);
  });
}

function check_logged_in(callback, args)
{
	var function_args = (typeof(args) == 'object')?args:[];
	
	$.ajax({
		type: "GET",
		url: default_destination + '/api/check_auth.epl',
		data: null,
		dataType: 'json',
		success:
			function(responseData)
			{
				if(typeof(window[callback]) == 'function')
				{
					var cb_function = window[callback];
					cb_function.apply(this, function_args);
				}
			},
		error:
			function(jqXHR, textStatus, errorThrown)
			{
				logged_out_redirect();
			}
	});
};

function logged_out_redirect()
{
	alert("Your session has expired");
	window.location.reload();
};

function get_url_domain(url)
{
	var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	var domain = matches && matches[1];
	return domain;
}
