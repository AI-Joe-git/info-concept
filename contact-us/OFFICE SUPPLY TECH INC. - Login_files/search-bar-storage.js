(function($) {
	$(document).ready(function() {
		if (globals.isPublicUser === "true") {
            $(document).on('change', '#decor-search-type', function () {
                saveSearchBar();
            });

            $(document).on('change', '#decor-search-field', function () {
                saveSearchBar();
            });

            $(document).on('change', 'input[name="decor_search_style"]', function () {
                saveSearchBar();
            });

            $(document).on('keyup', '#decor-search-string', function () {
                saveSearchBar();
            });

            if ($('#decor-search-field').length > 0) {
                var c = 0;
                var t = setInterval(function () {
                    c++;

                    if (c > 20) {
                        clearInterval(t);
                    }

                    if (typeof ssDecor === 'object') {
                        clearInterval(t);
                        loadSearchBar();
                    }
                }, 100);
            }
        }
	});

	function saveSearchBar() {
		var ss = CommonUtil.xss_clean( $('#decor-search-string').val() );
		CommonUtil.set_state(storage_storesite_search_type, $('#decor-search-type').val());
		CommonUtil.set_state(storage_storesite_search_string, ss);
		CommonUtil.set_state(storage_storesite_search_field, $('#decor-search-field').val());
		CommonUtil.set_state(storage_storesite_search_style, $('input[name="decor_search_style"]:checked').val());
	}

	function loadSearchBar() {
		var on_faq_page = location.href.indexOf('Faqs/search')!= -1 || location.href.indexOf('Faqs/view') != -1;
		var search_type = CommonUtil.get_cookie(storage_storesite_search_type);
		search_type = CommonUtil.is_null_or_empty(search_type) ? $('#decor-search-type').find('option:first').val() : search_type;
		var search_type_faq = search_type.indexOf('Faqs/search')!= -1;
		var search_string = CommonUtil.get_cookie(storage_storesite_search_string);
		search_string = CommonUtil.xss_clean(search_string);
		var search_field = CommonUtil.get_cookie(storage_storesite_search_field);
		var search_style = CommonUtil.get_cookie(storage_storesite_search_style);

		if (search_type_faq && !on_faq_page ){
			search_type = $('#decor-search-type').find('option:first').val();
			search_string = '';
			$('#decor-search-string').val('');
			search_field = '';
		}

		var available_search_options = $('#decor-search-type').find('option').map(function(){
			return this.value;
		}).get();

		if(!CommonUtil.in_array(available_search_options, search_type)) {
			search_type = $('#decor-search-type').find('option:first').attr('value');
		}

		$('#decor-search-type').val(search_type);
		$('#decor-search-type').trigger('change');

		var c = 0;
		var t = setInterval(function() {
			c++;
			var u = ssDecor.get_search_options_updated();

			if(u == true || c > 100) {
				clearInterval(t);

				if( !CommonUtil.is_null_or_empty(search_string) ) {
					$('#decor-search-string').val(search_string);
				}

				if( !CommonUtil.is_null_or_empty(search_field) ) {
					if( $('#decor-search-field').find('option[value="' + search_field + '"]').length > 0 ) {
						$('#decor-search-field').val(search_field);
					}
				}

				if( !CommonUtil.is_null_or_empty(search_style) ) {
					$('input[name="decor_search_style"][value="' + search_style + '"]').prop('checked', true);
				}

				saveSearchBar();
			}
		}, 1000);
	}
})(jQuery);