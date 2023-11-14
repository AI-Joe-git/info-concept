/*******************************************************************************************************************************************
 * CNET Content Solutions ChannelOnline Version 1.0 December 2019
 ******************************************************************************************************************************************/
function StateCountryMenus(options) {
	var countries = null;
	var country_select = null;
	var defaults = {};
	var first_load = true;
	var form = null;
	var opts = {};
	var state_select = null;
	var _this = this;

	this.init = function() {
		defaults = {
			country_select : '#select-country',
			form : null,
			initial_country : 1,
			initial_state : 5,
			state_select : '#select-state'
		};

		opts = $.extend(opts, defaults, options);
		
		if(opts.form != null) {
			form = $(opts.form);
			country_select = form.find(opts.country_select);
			state_select = form.find(opts.state_select);
			_this.populate_countries();
		
			$(document).on('change', opts.form + ' ' + opts.country_select, function() {
				_this.populate_states();
			});
		}
	};
	
	this.populate_countries = function() {
		country_select.empty();
		
		var jqxhr = $.ajax({
			type : 'GET',
			url : globals.baseUrl + '/api/countries',
			dataType : "json",
		})
		.done(function(responseData) {
			countries = responseData;

			if(typeof countries === 'object' && countries.length > 0) {
				countries = countries.sort(_this.sort_by_name);

				$.each(countries, function() {
					country_select.append($("<OPTION />").val(this.id).text(this.name));
				});
				
				country_select.val(opts.initial_country);
				country_select.trigger('change');
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.readyState == 4) {
				
			}
		});
	};
	
	this.populate_states = function() {
		state_select.empty();
		
		if(typeof countries === 'object' && countries.length > 0) {
			var country_id = country_select.val();
			var country = $.grep(countries, function(country){
				return country.id == country_id;
			})[0];

			if(typeof country.states === 'object') {
				country.states.sort(_this.sort_by_abbrv);
				$.each(country.states, function() {
					state_select.append($("<option />").val(this.id).text(this.abbrv));
				});
			}
			
			if(first_load) {
				state_select.val(opts.initial_state);
				first_load = false;
			}
		}
	};
	
	this.sort_by_abbrv = function(a, b) {
		var aText = a.abbrv.toLowerCase();
		var bText = b.abbrv.toLowerCase();
		return ((aText < bText) ? -1 : ((bText < aText) ? 1 : 0));
	};
	
	this.sort_by_name = function(a, b) {
		var aText = a.name.toLowerCase();
		var bText = b.name.toLowerCase();
		return ((aText < bText) ? -1 : ((bText < aText) ? 1 : 0));
	};
};
